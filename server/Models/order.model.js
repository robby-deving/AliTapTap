const mongoose = require("mongoose");
const { Schema } = mongoose;

const positionSchema = new Schema({
  x: { type: Number, required: true },
  y: { type: Number, required: true },
});

const elementSchema = new Schema({
  id: { type: Number, required: true },
  text: { type: String, default: "" }, 
  uri: { type: String, default: "" }, 
  position: { type: positionSchema, required: true },
  size: { type: Number, required: true },
});

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
      color: {
        type: String,
        required: true,
      },
      front_info: {
        type: [elementSchema], 
        required: true,
      },
      back_info: {
        type: [elementSchema], 
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