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
router.get("/best-selling-materials", dashboardController.getBestSellingMaterials);

module.exports = router;