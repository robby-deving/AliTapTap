const mongoose = require("mongoose");
const { Schema } = mongoose;

const orderModel = new Schema(
    {
        customer_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        design_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "CardDesign",
            required: true,
        },
        product_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        front_image: {
            type: String,
            required: true,
        },
        back_image: {
            type: String,
            required: true,
        },
        details: {
            orientation: {
                type: String,
                enum: ["Landscape", "Portrait"],
                required: true,
            },
            material: {
                type: String,
                enum: ["PVC", "Metal", "Wood"],
                required: true,
            },
            color: {
                type: String,
                required: true,
            },
            front_info: {
                company_name: {
                    default_text: { type: String },
                    position: { type: Object, required: true },
                    font: { type: String },
                    font_size: { type: Number, min: 1 },
                },
                full_name: {
                    default_text: { type: String },
                    position: { type: Object, required: true },
                    font: { type: String },
                    font_size: { type: Number, min: 1 },
                },
                email: {
                    default_text: { type: String },
                    position: { type: Object, required: true },
                    font: { type: String },
                    font_size: { type: Number, min: 1 },
                },
                phone: {
                    default_text: { type: String },
                    position: { type: Object, required: true },
                    font: { type: String },
                    font_size: { type: Number, min: 1 },
                },
                logo: {
                    default_url: { type: String },
                    position: { type: Object, required: true },
                },
            },
            back_info: {
                company_name: {
                    default_text: { type: String },
                    position: { type: Object, required: true },
                    font: { type: String },
                    font_size: { type: Number, min: 1 },
                },
                email: {
                    default_text: { type: String },
                    position: { type: Object, required: true },
                    font: { type: String },
                    font_size: { type: Number, min: 1 },
                },
                phone: {
                    default_text: { type: String },
                    position: { type: Object, required: true },
                    font: { type: String },
                    font_size: { type: Number, min: 1 },
                },
                logo: {
                    default_url: { type: String },
                    position: { type: Object, required: true },
                },
            },
        },
        quantity: {
            type: Number,
            required: true,
            min: 1,
        },
        total_price: {
            type: Number,
            required: true,
            min: 0,
        },
        order_status: {
            type: String,
            enum: ["Pending", "Shipped", "Delivered"],
            default: "Pending",
        },
        created_at: {
            type: Date,
            default: Date.now,
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

const Order = mongoose.model("Order", orderModel);

module.exports = Order;