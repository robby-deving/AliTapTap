const mongoose = require('mongoose');
const { Schema } = mongoose;

const productModel = new Schema({
    material: {
        type: String,
        required: true
    },
    base_price: {
        type: Number,
        required: true
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

module.exports = mongoose.model("Product", productModel);