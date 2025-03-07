const mongoose = require("mongoose");
const { Schema } = mongoose;

const userModel = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone_number: {
      type: String,
    },
    profile_picture: {
      type: String, // URL Path
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    address: [
      {
        street: { type: String, required: true },
        barangay: { type: String, required: true },
        city: { type: String, required: true },
        province: { type: String, required: true },
        zip: { type: String, required: true },
      },
    ],
    payment_method: [
      {
        type: String,
        last4: String,
        exp_date: String,
      },
    ],
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

module.exports = mongoose.model("User", userModel);