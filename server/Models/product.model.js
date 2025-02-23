const mongoose = require("mongoose");
const { Schema } = mongoose;

const productModel = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        materials: {
            PVC: {
                price_per_unit: { type: Number, required: true }, 
            },
            Metal: {
                price_per_unit: { type: Number, required: true }, 
            },
            Wood: {
                price_per_unit: { type: Number, required: true },  
            },
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

const Product = mongoose.model("Product", productModel);

module.exports = Product;
