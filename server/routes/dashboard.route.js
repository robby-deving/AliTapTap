const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboard.controller");

// Get total orders
router.get("/total-orders", dashboardController.getTotalOrders);
// Get revenue
router.get("/revenue", dashboardController.getRevenue);
// Get number of users
router.get("/total-users", dashboardController.getTotalUsers);
// Get best selling materials
// router.get("/best-selling-materials", dashboardController.getBestSellingMaterials);
// Get best selling designs
router.get("/best-selling", dashboardController.getBestSellingDesigns);
// Get recent transactions
router.get("/recent-transactions", dashboardController.getRecentTransactions);
// Get unverified orders
router.get("/unverified-orders", dashboardController.getUnverifiedOrders);
// Get monthly sales for graph
router.get("/sales", dashboardController.getMonthlySales);

module.exports = router;