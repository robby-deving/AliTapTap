const Order = require("../Models/order.model");
const User = require("../Models/user.model");
const Transaction = require("../Models/transaction.model");
const CardDesign = require("../Models/carddesign.model");
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
        // const startOfWeek = new Date(today);
        // startOfWeek.setDate(today.getDate() - today.getDay() + 1);
        // startOfWeek.setHours(0, 0, 0, 0);

        // Get the start of the current month
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1); // First day of the month

        // Get the start of the current year
        const startOfYear = new Date(today.getFullYear(), 0, 1); // First day of the year

        // Aggregate revenue data from completed transactions
        const revenueData = await Transaction.aggregate([
            {
                $match: {
                    status: "Completed", // Only include successful transactions
                    transaction_date: { $gte: startOfYear }, // Filter from the start of the year
                },
            },
            {
                $facet: {
                    daily: [
                        { $match: { transaction_date: { $gte: today } } }, // Transactions today
                        { $group: { _id: null, total: { $sum: "$total_amount" } } },
                    ],
                    monthly: [
                        { $match: { transaction_date: { $gte: startOfMonth } } }, // Transactions this month
                        { $group: { _id: null, total: { $sum: "$total_amount" } } },
                    ],
                    yearly: [
                        { $match: { transaction_date: { $gte: startOfYear } } }, // Transactions this year
                        { $group: { _id: null, total: { $sum: "$total_amount" } } },
                    ],
                },
            },
        ]);

        const dailyRevenue = revenueData[0].daily.length > 0 ? revenueData[0].daily[0].total : 0;
        const monthlyRevenue = revenueData[0].monthly.length > 0 ? revenueData[0].monthly[0].total : 0;
        const yearlyRevenue = revenueData[0].yearly.length > 0 ? revenueData[0].yearly[0].total : 0;

        res.status(200).json({
            dailyRevenue,
            monthlyRevenue,
            yearlyRevenue,
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

// const getBestSellingMaterials = async (req, res) => {
//     try {
//         const bestSellingMaterials = await Order.aggregate([
//             {
//                 $group: {
//                     _id: "$details.material",
//                     totalSold: { $sum: "$quantity" }
//                 }
//             },
//             { $sort: { totalSold: -1 } },
//             { $limit: 5 }
//         ]);

//         res.status(200).json({
//             message: "Best-selling materials",
//             bestSellingMaterials
//         });
//     } catch (err) {
//         console.error("Error fetching best-selling materials:", err);
//         res.status(500).json({
//             message: "Failed to retrieve best-selling materials",
//             error: err.message || err
//         });
//     }
// };

const getBestSellingDesigns = async (req, res) => {
    try {
        const bestSelling = await Transaction.aggregate([
            // Match only completed transactions
            {
                $match: { status: "Completed" }
            },
            // Lookup orders related to transactions
            {
                $lookup: {
                    from: "orders",  // Refers to Order collection
                    localField: "order_id",
                    foreignField: "_id",
                    as: "orderDetails"
                }
            },
            // Unwind the orders array
            { $unwind: "$orderDetails" },
            // Lookup card designs related to orders
            {
                $lookup: {
                    from: "carddesigns",  // Refers to CardDesign collection
                    localField: "orderDetails.design_id",
                    foreignField: "_id",
                    as: "designDetails"
                }
            },
            // Unwind the card design array
            { $unwind: "$designDetails" },
            // Group by design name and sum the quantity sold
            {
                $group: {
                    _id: "$designDetails.name",  // Group by design name
                    totalSold: { $sum: "$orderDetails.quantity" }  // Sum total quantity sold
                }
            },
            // Sort by most sold first
            {
                $sort: { totalSold: -1 }
            },
            {
                $limit: 5
            }
        ]);

        res.status(200).json(bestSelling);
    } catch (error) {
        console.error("Error fetching best-selling designs:", error);
        res.status(500).json({ message: "Failed to fetch best-selling designs", error });
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
            .sort({ created_at: 1 }) // Sort by earliest order date first
            .limit(10) // Limit results to 10
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
      const salesData = await Transaction.aggregate([
        {
          $match: { status: "Completed" }, // Only count completed transactions
        },
        {
          $group: {
            _id: { $month: "$transaction_date" }, // Group by transaction month
            totalSales: { $sum: "$total_amount" }, // Sum total sales per month
          },
        },
        { $sort: { _id: 1 } }, // Sort by month (January to December)
      ]);
  
      // Convert month number (1-12) to month names
      const formattedData = salesData.map((item) => ({
        month: new Date(0, item._id - 1).toLocaleString("default", { month: "long" }),
        sales: item.totalSales,
      }));
  
      res.status(200).json(formattedData);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  };  


module.exports = {
    getTotalOrders,
    getRevenue,
    getTotalUsers,
    // getBestSellingMaterials,
    getRecentTransactions,
    getUnverifiedOrders,
    getMonthlySales,
    getBestSellingDesigns
};