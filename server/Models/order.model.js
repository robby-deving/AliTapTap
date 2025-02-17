const mongoose = require("mongoose");
const { Schema } = mongoose;

const orderModel = new Schema(
    {
        customer_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        customer_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "CardDesigns",
            required: true,
        },
        product_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Products",
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
                    default_text: { type: String, required: true },
                    position: {
                        x: { type: Number },
                        y: { type: Number },
                    },
                    font: { type: String },
                    font_size: { type: Number },
                },
                full_name: {
                    default_text: { type: String, required: true },
                    position: {
                        x: { type: Number },
                        y: { type: Number },
                    },
                    font: { type: String },
                    font_size: { type: Number },
                },
            },
            back_info: {
                company_name: {
                    default_text: { type: String, required: true },
                    position: {
                        x: { type: Number },
                        y: { type: Number },
                    },
                    font: { type: String },
                    font_size: { type: Number },
                },
                email: {
                    default_text: { type: String, required: true },
                    position: {
                        x: { type: Number },
                        y: { type: Number },
                    },
                    font: { type: String },
                    font_size: { type: Number },
                },
            },
        },
        quantity: {
            type: Number,
            required: true,
        },
        total_price: {
            type: Number,
            required: true,
        },
        order_status: {
            type: String,
            default: "Pending",
        },
    },
    {
        timestamps: {
            createdAt: "created_at",
        },
    }
);

module.exports = mongoose.model("Order", orderModel);