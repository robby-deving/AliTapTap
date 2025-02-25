const Order = require("../Models/order.model.js");
const User = require("../Models/user.model.js");
const Product = require("../Models/product.model.js");
const CardDesign = require("../Models/carddesign.model.js");

// Create a new order
const createOrder = async (req, res) => {
    try {
        const { customer_id, design_id, product_id, front_image, back_image, details, quantity, total_price, order_status } = req.body;

        if (!customer_id || !design_id || !product_id || !front_image || !back_image || !details || !quantity || !total_price) {
            return res.status(400).json({ message: "All fields are required." });
        }

        // Validate if front_info and back_info are arrays
        if (!Array.isArray(details.front_info) || !Array.isArray(details.back_info)) {
            return res.status(400).json({ message: "front_info and back_info must be arrays." });
        }

        // Check if customer, design, and product exist
        const customerExists = await User.findById(customer_id);
        if (!customerExists) {
            return res.status(400).json({ message: "Invalid customer ID, user not found." });
        }

        const designExists = await CardDesign.findById(design_id);
        if (!designExists) {
            return res.status(400).json({ message: "Invalid design ID, card design not found." });
        }

        const productExists = await Product.findById(product_id);
        if (!productExists) {
            return res.status(400).json({ message: "Invalid product ID, product not found." });
        }

        const newOrder = new Order({
            customer_id,
            design_id,
            product_id,
            front_image,
            back_image,
            details: {
                material: details.material,
                color: details.color,
                front_info: details.front_info,
                back_info: details.back_info,
            },
            quantity,
            total_price,
            order_status: order_status || "Pending",
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
            error: err.message,
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
            front_info: details.front_info ? details.front_info : existingOrder.details.front_info,
            back_info: details.back_info ? details.back_info : existingOrder.details.back_info,
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
            error: err.message,
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
