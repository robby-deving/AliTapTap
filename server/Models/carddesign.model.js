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
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,  
    },
    details: {
      front_info: {
        type: [elementSchema],  
        required: false,  
      },
      back_info: {
        type: [elementSchema],  
        required: false,  
      },
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

module.exports = mongoose.model("CardDesign", cardDesignModel);