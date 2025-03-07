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
    front_image: {
      type: String,
      required: true,
    },
    back_image: {
      type: String,
      required: true,
    },
    details: {
      material: {
        type: String,
        enum: ["PVC", "Metal", "Wood"],
        required: true,
      },
      price_per_unit: {
        type: Number,
        required: true,
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
    
    address_id: {
      type: Number,  
      required: true,
    },
    address_details: {
      street: { type: String },
      city: { type: String },
      region: { type: String },
      zip: { type: String },
      country: { type: String },
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
