const Review = require("../Models/review.model.js");
const User = require("../Models/user.model.js");
const CardDesign = require("../Models/carddesign.model.js");
const Order = require("../Models/order.model.js");

// Create a new review
const createReview = async (req, res) => {
    try {
        const { customer_id, design_id, order_id, ratings, review_text } = req.body;

        // Validate user
        const user = await User.findById(customer_id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Validate design
        const design = await CardDesign.findById(design_id);
        if (!design) {
            return res.status(404).json({ message: "Design not found" });
        }

        // Validate order
        const order = await Order.findById(order_id);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        // Ensure rating is within valid range
        if (ratings < 1 || ratings > 5) {
            return res.status(400).json({ message: "Ratings should be between 1 and 5" });
        }

        const newReview = new Review({
            customer_id,
            design_id,
            order_id,
            ratings,
            review_text,
        });

        const savedReview = await newReview.save();
        res.status(201).json({
            message: "Review created successfully",
            data: savedReview,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Review creation failed", error: err.message });
    }
};

// Update an existing review
const updateReview = async (req, res) => {
    try {
        const updatedReview = await Review.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );

        if (!updatedReview) {
            return res.status(404).json({ message: "Review not found!" });
        }

        res.status(200).json({
            message: "Review updated successfully",
            data: updatedReview,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Review update failed", error: err.message });
    }
};

// Soft delete a review
const deleteReview = async (req, res) => {
    try {
        const updatedReview = await Review.findByIdAndUpdate(
            req.params.id,
            { deleted_at: new Date() },
            { new: true }
        );

        if (!updatedReview) {
            return res.status(404).json({ message: "Review not found" });
        }

        res.status(200).json({ message: "Review marked as deleted" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Review soft delete failed!", error: error.message });
    }
};

// Get a single review
const getReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }
        res.status(200).json({ message: "Review retrieved successfully", data: review });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Review query failed", error: error.message });
    }
};

// Get all reviews, with optional filter for the latest reviews
const getAllReviews = async (req, res) => {
    const query = req.query.latest;
    try {
        const reviews = query
            ? await Review.find().sort({ _id: -1 }).limit(3)
            : await Review.find();

        res.status(200).json({ message: "Reviews retrieved successfully", data: reviews });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Reviews query failed", error: error.message });
    }
};

module.exports = {
    createReview,
    updateReview,
    deleteReview,
    getReview,
    getAllReviews,
};