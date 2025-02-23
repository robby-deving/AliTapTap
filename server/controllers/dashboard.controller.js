const Order = require("../Models/order.model");
const User = require("../Models/user.model");
const Transaction = require("../Models/transaction.model");
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
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Start of today

        // Get the start of the current week (Monday)
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay() + 1); // Adjust for Monday start
        startOfWeek.setHours(0, 0, 0, 0);

        // Get the start of the current month
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1); // First day of the month

        // Aggregate revenue data from completed transactions
        const revenueData = await Transaction.aggregate([
            {
                $match: {
                    status: "Completed", // Only include successful transactions
                    transaction_date: { $gte: startOfMonth }, // Filter from the start of the month
                },
            },
            {
                $facet: {
                    daily: [
                        { $match: { transaction_date: { $gte: today } } }, // Transactions today
                        { $group: { _id: null, total: { $sum: "$total_amount" } } },
                    ],
                    weekly: [
                        { $match: { transaction_date: { $gte: startOfWeek } } }, // Transactions this week
                        { $group: { _id: null, total: { $sum: "$total_amount" } } },
                    ],
                    monthly: [
                        { $match: { transaction_date: { $gte: startOfMonth } } }, // Transactions this month
                        { $group: { _id: null, total: { $sum: "$total_amount" } } },
                    ],
                },
            },
        ]);

        const dailyRevenue = revenueData[0].daily.length > 0 ? revenueData[0].daily[0].total : 0;
        const weeklyRevenue = revenueData[0].weekly.length > 0 ? revenueData[0].weekly[0].total : 0;
        const monthlyRevenue = revenueData[0].monthly.length > 0 ? revenueData[0].monthly[0].total : 0;

        res.status(200).json({
            dailyRevenue,
            weeklyRevenue,
            monthlyRevenue,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Failed to retrieve revenue",
            error: err.message,
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

const getRecentTransactions = async (req, res) => {
    try {
        const recentTransactions = await Transaction.find()
            .sort({ transaction_date: -1 }) // Sort by most recent
            .limit(10)
            .populate("customer_id", "first_name last_name") // Fetch user details
            .select("transaction_number total_amount transaction_date customer_id");

        res.status(200).json({
            message: "Recent transactions",
            recentTransactions});
    } catch (error) {
        res.status(500).json({ message: "Error fetching recent transactions", error });
    }
};

const getUnverifiedOrders = async (req, res) => {
    try {
        // Find all orders with status "Pending"
        const orders = await Order.find({ order_status: "Pending" })
            .select("_id customer_id") // Fetch only necessary fields
            .lean();

        if (orders.length === 0) {
            return res.status(200).json([]); // Return empty array if no pending orders
        }

        // Fetch customer details
        const customerIds = orders.map(order => order.customer_id);
        const customers = await User.find({ _id: { $in: customerIds } })
            .select("_id first_name last_name")
            .lean();

        // Fetch transactions related to these orders
        const orderIds = orders.map(order => order._id);
        const transactions = await Transaction.find({ order_id: { $in: orderIds } })
            .select("order_id transaction_number")
            .lean();

        // Combine order, customer, and transaction data
        const formattedOrders = orders.map(order => {
            const customer = customers.find(c => c._id.toString() === order.customer_id.toString());
            const transaction = transactions.find(t => t.order_id.toString() === order._id.toString());

            return {
                order_id: order._id,
                name: customer ? `${customer.first_name} ${customer.last_name}` : "Unknown",
                transaction_number: transaction?.transaction_number || "N/A",
            };
        });

        res.status(200).json({
            message: "Unverified Orders",
            formattedOrders
        });
    } catch (error) {
        console.error("Error fetching unverified orders:", error);
        res.status(500).json({ error: "Server error" });
    }
};

const getMonthlySales = async (req, res) => {
    try {
        // Get the current year
        const currentYear = new Date().getFullYear();

        // Aggregate sales data grouped by month
        const salesData = await Transaction.aggregate([
            {
                $match: {
                    status: "Completed",
                    transaction_date: {
                        $gte: new Date(`${currentYear}-01-01`),
                        $lte: new Date(`${currentYear}-12-31`)
                    }
                }
            },
            {
                $group: {
                    _id: { $month: "$transaction_date" }, // Group by month
                    totalRevenue: { $sum: "$total_amount" } // Sum revenue per month
                }
            },
            {
                $sort: { _id: 1 } // Sort by month
            }
        ]);

        // Define month names
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        // Create an array for all 12 months with default revenue 0
        const monthlySales = Array.from({ length: 12 }, (_, index) => ({
            month: monthNames[index],
            revenue: 0
        }));

        // Map the aggregated sales data to the array
        salesData.forEach(data => {
            monthlySales[data._id - 1].revenue = data.totalRevenue;
        });

        res.status(200).json({ success: true, data: monthlySales });
    } catch (error) {
        console.error("Error fetching sales data:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};


module.exports = {
    getTotalOrders,
    getRevenue,
    getTotalUsers,
    getBestSellingMaterials,
    getRecentTransactions,
    getUnverifiedOrders,
    getMonthlySales
};