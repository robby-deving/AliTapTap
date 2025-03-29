const Order = require("../Models/order.model.js");
const User = require("../Models/user.model.js");
const Product = require("../Models/product.model.js");
const Transaction = require("../Models/transaction.model.js");
const CardDesign = require("../Models/carddesign.model.js");

// Create a new order
const createOrder = async (req, res) => {
  try {
    const { 
      customer_id, 
      design_id, 
      front_image, 
      back_image, 
      details, 
      quantity, 
      order_status, 
      address_id,
      shipping_cost // Add this parameter
    } = req.body;

    if (!customer_id || !design_id || !front_image || !back_image || !details || !quantity || address_id === undefined) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Check if customer exists
    const customerExists = await User.findById(customer_id);
    if (!customerExists) {
      return res.status(400).json({ message: "Invalid customer ID, user not found." });
    }

    // Check if design exists
    const designExists = await CardDesign.findById(design_id);
    if (!designExists) {
      return res.status(400).json({ message: "Invalid design ID, card design not found." });
    }

    // Get the price per unit for the selected material
    const price_per_unit = designExists.materials[details.material]?.price_per_unit;
    if (!price_per_unit) {
      return res.status(400).json({ message: "Invalid material selected." });
    }

    // Get the address from the user based on the address_id
    const selectedAddress = customerExists.address[address_id];
    if (!selectedAddress) {
      return res.status(400).json({ message: "Invalid address ID." });
    }

    // Calculate total price including shipping
    const base_price = price_per_unit * quantity;
    const total_price = base_price + (shipping_cost || 0); // Add shipping cost to total

    const newOrder = new Order({
      customer_id,
      design_id,
      front_image,
      back_image,
      details: {
        material: details.material,
        price_per_unit: price_per_unit,
        shipping_cost: shipping_cost // Store shipping cost in details
      },
      quantity,
      total_price, // This will now include shipping
      order_status: order_status || "Pending",
      address_id,  
      address_details: selectedAddress,  
    });

    const savedOrder = await newOrder.save();
    res.status(201).json({
      message: "Order created successfully",
      data: savedOrder,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Order creation failed",
      error: err.message,
    });
  }
};

// Get an order by ID
const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("customer_id design_id");
    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }
    res.status(200).json({
      message: "Order retrieved successfully",
      data: order,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Order retrieval failed",
      error: err.message,
    });
  }
};

// Get all orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("customer_id design_id");
    res.status(200).json({
      message: "Orders retrieved successfully",
      data: orders,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Failed to retrieve orders",
      error: err.message,
    });
  }
};

// Update an order by ID
const updateOrder = async (req, res) => {
  try {
    const { details } = req.body;

    const existingOrder = await Order.findById(req.params.id);
    if (!existingOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Merge existing details while updating only specified fields
    const updatedDetails = {
      ...existingOrder.details,
      ...details,
    };

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { $set: { details: updatedDetails } },
      { new: true }
    );

    res.status(200).json({
      message: "Order updated successfully",
      data: updatedOrder,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Order update failed",
      error: err.message,
    });
  }
};

// Soft delete an order
const deleteOrder = async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { deleted_at: new Date() },
      { new: true }
    );

    if (!deletedOrder) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    res.status(200).json({
      message: "Order marked as deleted",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Order soft delete failed",
      error: err.message,
    });
  }
};

// Get orders for a specific customer
const getOrdersByCustomer = async (req, res) => {
  try {
    const orders = await Order.find({ customer_id: req.params.customer_id }).populate("design_id");
    if (!orders.length) {
      return res.status(404).json({
        message: "No orders found for this customer",
      });
    }
    res.status(200).json({
      message: "Orders for customer retrieved successfully",
      data: orders,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Failed to retrieve orders for customer",
      error: err.message,
    });
  }
};

const getUserOrders = async (req, res) => {
  try {
      // Fetch orders with populated customer and design details
      const orders = await Order.find()
          .populate({
              path: "customer_id",
              select: "username email first_name last_name phone_number",
          })
          .populate({
              path: "design_id",
              select: "name",
          })
          .select("customer_id design_id front_image back_image quantity total_price details.material order_status created_at");

      // Extract order IDs to fetch related transactions
      const orderIds = orders.map(order => order._id);

      // Fetch transactions where order_id matches any of the fetched orders
      const transactions = await Transaction.find({ order_id: { $in: orderIds } })
          .select("order_id payment_method");

      // Convert transactions array into a map for efficient lookup
      const transactionMap = new Map();
      transactions.forEach(transaction => {
          transactionMap.set(transaction.order_id.toString(), transaction.payment_method);
      });

      // Format orders and include payment method from the transactionMap
      const formattedOrders = orders.map((order) => {
          return {
              orderId: order._id,
              userId: order.customer_id?._id || null,
              username: order.customer_id?.username || "Unknown User",
              fullName: `${order.customer_id?.first_name || ""} ${order.customer_id?.last_name || ""}`.trim(),
              email: order.customer_id?.email || "No Email",
              phone: order.customer_id?.phone_number || "No Phone Number",
              paymentMethod: transactionMap.get(order._id.toString()) || "No Payment Method",
              designName: order.design_id?.name || "No Design",
              front_image: order.front_image || "",
              back_image: order.back_image || "",
              amount: order.total_price,
              material: order.details?.material || "No Material Info",
              quantity: order.quantity || 0,
              status: order.order_status,
              date: order.created_at,
          };
      });

      res.status(200).json(formattedOrders);
  } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ error: "Failed to fetch orders", details: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    console.log("Request body:", req.body); // Debugging line

    const { orderId } = req.params;
    const { order_status } = req.body;

    if (!order_status) {
      return res.status(400).json({ message: "Order status is required" });
    }

    const validStatuses = ["Pending", "Shipped", "Delivered"];
    if (!validStatuses.includes(order_status)) {
      return res.status(400).json({ message: "Invalid order status" });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { order_status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({
      message: "Order status updated successfully",
      updatedOrder,
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createOrder,
  getOrder,
  getAllOrders,
  updateOrder,
  deleteOrder,
  getOrdersByCustomer,
  getUserOrders,
  updateOrderStatus,
};