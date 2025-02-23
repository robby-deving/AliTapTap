const mongoose = require("mongoose");
const { Schema } = mongoose;

const positionSchema = new Schema({
  x: { type: Number, required: true },
  y: { type: Number, required: true },
});

const textElementSchema = new Schema({
  default_text: { type: String, required: true },
  position: { type: positionSchema, required: true },
  font: { type: String, required: true },
  font_size: { type: Number, required: true },
});

const logoElementSchema = new Schema({
  default_url: { type: String, required: true },
  position: { type: positionSchema, required: true },
});

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
        company_name: { type: textElementSchema, required: true },
        full_name: { type: textElementSchema, required: true },
        email: { type: textElementSchema, required: true },
        phone: { type: textElementSchema, required: true },
        logo: { type: logoElementSchema, required: true },
      },
      back_info: {
        company_name: { type: textElementSchema, required: true },
        email: { type: textElementSchema, required: true },
        phone: { type: textElementSchema, required: true },
        logo: { type: logoElementSchema, required: true },
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
