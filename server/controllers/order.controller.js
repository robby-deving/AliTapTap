const Order = require("../Models/order.model.js");
const User = require("../Models/user.model.js");
const Product = require("../Models/product.model.js");
const CardDesign = require("../Models/carddesign.model.js");

// Create a new order
const createOrder = async (req, res) => {
    try {
        const newOrder = new Order({
            customer_id: req.body.customer_id,
            design_id: req.body.design_id,
            product_id: req.body.product_id,
            front_image: req.body.front_image,
            back_image: req.body.back_image,
            details: req.body.details,
            quantity: req.body.quantity,
            total_price: req.body.total_price,
            order_status: req.body.order_status || "Pending",
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
            error: err,
        });
    }
};

//Get an order by ID
const getOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate("customer_id design_id product_id");
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
            error: err,
        });
    }
};

//Get all orders
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate("customer_id design_id product_id");
        res.status(200).json({
            message: "Orders retrieved successfully",
            data: orders,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Failed to retrieve orders",
            error: err,
        });
    }
};

// const getUserOrders = async (req, res) => {
//     try {
//         const orders = await Order.find()
//             .populate("customer_id", "first_name last_name email") // Get User details
//             .populate("design_id", "name") // Get Card Design name
//             .select("customer_id design_id total_price details.material order_status created_at"); // Get relevant order details

//         if (!orders.length) {
//             return res.status(404).json({ message: "No orders found" });
//         }

//         // Format response
//         const formattedOrders = orders.map(order => ({
//             order_id: order._id,
//             user_id: order.customer_id ? order.customer_id._id : null,
//             user_name: order.customer_id ? `${order.customer_id.first_name} ${order.customer_id.last_name}` : "Unknown",
//             email: order.customer_id ? order.customer_id.email : "Unknown",
//             design_name: order.design_id ? order.design_id.name : "Unknown",
//             amount: order.total_price,
//             material: order.details ? order.details.material : "N/A",
//             status: order.order_status,
//             date: order.created_at
//         }));

//         res.status(200).json({
//             message: "Orders retrieved successfully",
//             data: formattedOrders
//         });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({
//             message: "Failed to retrieve orders",
//             error: err.message,
//         });
//     }
// };

const getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find()
          .populate({
            path: "customer_id",
            select: "username email first_name last_name phone_number",
          })
          .populate({
            path: "design_id",
            select: "name",
          })
        //   .populate({
        //     path: "transaction",  // ✅ Fetch transaction for payment method
        //     select: "payment_method",
        //   })
          .select("customer_id design_id quantity total_price details.material order_status created_at");
    
        console.log("Fetched Orders:", JSON.stringify(orders, null, 2)); // Debugging
    
        const formattedOrders = orders.map((order) => {
          if (!order.customer_id) {
            console.warn(`Order ${order._id} has no customer_id!`);
          }
          if (!order.design_id) {
            console.warn(`Order ${order._id} has no design_id!`);
          }
    
          return {
            orderId: order._id,
            userId: order.customer_id?._id || null,
            username: order.customer_id?.username || "Unknown User",
            fullName: `${order.customer_id?.first_name || ""} ${order.customer_id?.last_name || ""}`.trim(),
            email: order.customer_id?.email || "No Email",
            phone: order.customer_id?.phone_number || "No Phone Number",
            // paymentMethod: order.transaction?.payment_method || "No Payment Method",
            designName: order.design_id?.name || "No Design",
            amount: order.total_price,
            material: order.details?.material || "No Material Info",
            quantity: order.quantity || 0,
            status: order.order_status,
            date: order.created_at,
          };
        });
    
        res.status(200).json(formattedOrders);
      } catch (error) {
        console.error("Error fetching orders:", error); // Debugging
        res.status(500).json({ error: "Failed to fetch orders", details: error.message });
      }
  };

// Update an order by ID
const updateOrder = async (req, res) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedOrder) {
            return res.status(404).json({
                message: "Order not found",
            });
        }
        res.status(200).json({
            message: "Order updated successfully",
            data: updatedOrder,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Order update failed",
            error: err,
        });
    }
};

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
  

//Get orders for a specific customer
const getOrdersByCustomer = async (req, res) => {
    try {
        const orders = await Order.find({ customer_id: req.params.customer_id }).populate("design_id product_id");
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
            error: err,
        });
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
};
