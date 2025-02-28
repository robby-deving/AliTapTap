const mongoose = require("mongoose");
const { Schema } = mongoose;

const positionSchema = new Schema({
  x: { type: Number, required: false },
  y: { type: Number, required: false },
});

const elementSchema = new Schema({
  id: { type: Number, required: false },
  text: { type: String, default: "" },
  uri: { type: String, default: "" },
  position: { type: positionSchema, required: false },
  size: { type: Number, required: false },
});

const cardDesignModel = new Schema(
  {
    name: {
      type: String,
      required: true,  // This is required for admin when creating a product
    },
    front_image: {
      type: String,
      required: true,  // Admin needs to upload the front image
    },
    back_image: {
      type: String,
      required: true,  // Admin needs to upload the back image
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,  // Admin creating the product (should be a valid user)
    },
    details: {
      front_info: {
        type: [elementSchema],  // This stays for user customization
        required: false,  
      },
      back_info: {
        type: [elementSchema],  // This stays for user customization
        required: false,  
      },
    },
    materials: {
      PVC: {
        price_per_unit: { type: Number, required: true },  // Admin sets pricing for PVC
      },
      Metal: {
        price_per_unit: { type: Number, required: true },  // Admin sets pricing for Metal
      },
      Wood: {
        price_per_unit: { type: Number, required: true },  // Admin sets pricing for Wood
      },
    },
    deleted_at: {
      type: Date,
      default: null,  // Default value for "deleted" flag
    },
  },
  {
    timestamps: {
      createdAt: "created_at",  
      updatedAt: "modified_at", 
    },
  }
);

module.exports = mongoose.model("CardDesign", cardDesignModel);
