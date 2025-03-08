const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller.js");

// Create a new order
// router.post("/create", orderController.createOrder);

// // Get an order by ID
// router.get("/get-order/:id", orderController.getOrder);

// // Get all orders
// router.get("/get-orders", orderController.getAllOrders);

// // Get orders by customer ID
// router.get("/get-orders/customer/:customer_id", orderController.getOrdersByCustomer);

// // Update an order by ID
// router.put("/update-order/:id", orderController.updateOrder);

// // Delete an order by ID
// router.delete("/delete-order/:id", orderController.deleteOrder);

// Get orders for admin orders page
router.get("/get-user-orders", orderController.getUserOrders);

module.exports = router;
