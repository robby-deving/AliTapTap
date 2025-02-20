const Transaction = require("../Models/transaction.model.js");
const User = require("../Models/user.model");

const createTransaction = async (req, res) => {
    try {
        const transactionNumber = `TX${Date.now()}${Math.floor(Math.random() * 1000)}`;

        const newTransaction = new Transaction({
            order_id: req.body.order_id,
            customer_id: req.body.customer_id,
            merchandise_subtotal: req.body.merchandise_subtotal,
            shipping_subtotal: req.body.shipping_subtotal,
            total_amount: req.body.total_amount,
            payment_method: req.body.payment_method,
            status: req.body.status,
            transaction_number: transactionNumber,  
        });

        const savedTransaction = await newTransaction.save();
        res.status(201).json({
            message: "Transaction created successfully",
            data: savedTransaction,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Transaction creation failed",
            error: err,
        });
    }
};


const updateTransaction = async (req, res) => {
    try {
        const updatedTransaction = await Transaction.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );

        if (!updatedTransaction) {
            return res.status(404).json({
                message: "Transaction not found!",
            });
        }

        res.status(200).json({
            message: "Transaction updated successfully",
            data: updatedTransaction,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Transaction update failed",
            error: err,
        });
    }
};

const deleteTransaction = async (req, res) => {
    try {
        const updatedTransaction = await Transaction.findByIdAndUpdate(
            req.params.id,
            { deleted_at: new Date() },
            { new: true } 
        );

        if (!updatedTransaction) {
            return res.status(404).json({
                message: "Transaction not found",
            });
        }

        res.status(200).json({
            message: "Transaction marked as deleted",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Transaction soft delete failed!",
            error: error.message,
        });
    }
};


const getTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);
        if (!transaction) {
            return res.status(404).json({
                message: "Transaction not found",
            });
        }
        res.status(200).json({
            message: "Transaction retrieved successfully",
            data: transaction,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Transaction query failed",
            error: error,
        });
    }
};

const getAllTransactions = async (req, res) => {
    const query = req.query.latest;
    try {
        const transactions = query
            ? await Transaction.find().sort({ _id: -1 }).limit(3)
            : await Transaction.find();

        res.status(200).json({
            message: "Transactions retrieved successfully",
            data: transactions,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Transactions query failed",
            error: error,
        });
    }
};

module.exports = {
    createTransaction,
    updateTransaction,
    deleteTransaction,
    getTransaction,
    getAllTransactions,
};
