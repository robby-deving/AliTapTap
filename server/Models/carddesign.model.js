const mongoose = require("mongoose");
const { Schema } = mongoose;

const cardDesignModel = new Schema(
  {
    front_image: {
      type: String,
      required: true,
    },
    back_image: {
      type: String,
      required: true,
    },
    categories: {
      type: [String],
      required: true,
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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
