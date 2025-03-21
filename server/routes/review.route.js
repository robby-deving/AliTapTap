const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/review.controller.js");

// Create a review
router.post("/create-review", reviewController.createReview);

// Get all reviews
router.get("/get-reviews", reviewController.getAllReviews);

// Get a single review by ID
router.get("/get-review/:id", reviewController.getReview);

// Update a review
router.put("/update-review/:id", reviewController.updateReview);

// Delete a review
router.delete("/delete-review/:id", reviewController.deleteReview);

module.exports = router;