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

// Get an order by ID
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

// Get all orders
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
  

// Get orders for a specific customer
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
};
