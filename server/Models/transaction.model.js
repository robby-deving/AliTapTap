const mongoose = require("mongoose");
const { Schema } = mongoose;

const transactionModel = new Schema(
    {
        order_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",  // Referencing the updated Order model
            required: true,
        },
        customer_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",  // Referencing the User model
            required: true,
        },
        merchandise_subtotal: {
            type: Number,
            required: true,
        },
        shipping_subtotal: {
            type: Number,
            required: true,
        },
        total_amount: {
            type: Number,
            required: true,
        },
        payment_method: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ["Completed", "Failed"],
            required: true,
        },
        transaction_date: {
            type: Date,
            default: Date.now,
        },
        transaction_number: {
            type: String,
            required: true,
            unique: true,
        },
        deleted_at: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "modified_at",
        },
    }
);

const Transaction = mongoose.model("Transaction", transactionModel);

module.exports = Transaction;