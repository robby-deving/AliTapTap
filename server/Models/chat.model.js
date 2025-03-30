const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    fromAdmin: {
      type: Boolean,
      default: false, // False means message is from a regular user
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Chat", chatSchema); 