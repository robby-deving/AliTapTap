const Order = require("../Models/order.model");
const User = require("../Models/user.model");
const mongoose = require("mongoose");

const getTotalOrders = async (req, res) => {
    try {
        const totalOrders = await Order.countDocuments();
        res.status(200).json({
            message: "Total orders retrieved successfully",
            totalOrders: totalOrders,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Failed to retrieve total orders",
            error: err,
        });
    }
};

const getRevenue = async (req, res) => {
    try {
        const { period } = req.query;
        let startDate;

        // Get today's date
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset time to start of the day

        if (period === "daily") {
            startDate = today;
        } else if (period === "weekly") {
            startDate = new Date(today);
            startDate.setDate(today.getDate() - 7); // Last 7 days
        } else if (period === "monthly") {
            startDate = new Date(today);
            startDate.setMonth(today.getMonth() - 1); // Last month
        } else {
            return res.status(400).json({
                message: "Invalid period. Use 'daily', 'weekly', or 'monthly'.",
            });
        }

        const revenueData = await Order.aggregate([
            {
                $match: {
                    created_at: { $gte: startDate },
                },
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: "$total_price" },
                },
            },
        ]);

        const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

        res.status(200).json({
            message: `Total revenue for ${period}`,
            totalRevenue,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Failed to retrieve revenue",
            error: err,
        });
    }
};

const getTotalUsers = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();

        res.status(200).json({
            message: "Total number of registered users",
            totalUsers,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Failed to retrieve total users",
            error: err,
        });
    }
};

const getBestSellingMaterials = async (req, res) => {
    try {
        const bestSellingMaterials = await Order.aggregate([
            {
                $group: {
                    _id: "$details.material", // Group by material type
                    totalSold: { $sum: "$quantity" } // Sum the quantity sold
                }
            },
            { $sort: { totalSold: -1 } }, // Sort by total sold (descending)
            { $limit: 5 } // Get the top 5 best-selling materials
        ]);

        res.status(200).json({
            message: "Best-selling materials",
            bestSellingMaterials
        });
    } catch (err) {
        console.error("Error fetching best-selling materials:", err);
        res.status(500).json({
            message: "Failed to retrieve best-selling materials",
            error: err.message || err
        });
    }
};

module.exports = {
    getTotalOrders,
    getRevenue,
    getTotalUsers,
    getBestSellingMaterials,
};