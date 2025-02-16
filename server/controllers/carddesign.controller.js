const CardDesign = require("../Models/carddesign.model");
const User = require("../Models/user.model");

const createCardDesign = async (req, res) => {
  try {
    const { front_image, back_image, categories, created_by, details } = req.body;

    const userExists = await User.findById(created_by);
    if (!userExists) {
      return res.status(400).json({ message: "Invalid user ID, user not found" });
    }

    const newCardDesign = new CardDesign({
      front_image,
      back_image,
      categories,
      created_by,
      details,
    });

    await newCardDesign.save();
    res.status(201).json({
      message: "Card design created successfully",
      data: newCardDesign,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Card design creation failed",
      error: err,
    });
  }
};

const getCardDesigns = async (req, res) => {
  try {
    const cardDesigns = await CardDesign.find({ deleted_at: null }).populate("created_by");
    res.status(200).json({
      message: "Card designs retrieved successfully",
      data: cardDesigns,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Card design query failed",
      error: err,
    });
  }
};

const getCardDesignById = async (req, res) => {
  try {
    const cardDesign = await CardDesign.findById(req.params.id).populate("created_by");

    if (!cardDesign) {
      return res.status(404).json({ message: "Card design not found" });
    }

    res.status(200).json({
      message: "Card design retrieved successfully",
      data: cardDesign,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Card design query failed",
      error: err,
    });
  }
};

const updateCardDesign = async (req, res) => {
  try {
    const { created_by, ...updateData } = req.body; 

    const updatedCardDesign = await CardDesign.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    if (!updatedCardDesign) {
      return res.status(404).json({ message: "Card design not found" });
    }

    res.status(200).json({
      message: "Card design updated successfully",
      data: updatedCardDesign,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Card design update failed",
      error: err,
    });
  }
};

const deleteCardDesign = async (req, res) => {
  try {
    const deletedCardDesign = await CardDesign.findByIdAndUpdate(
      req.params.id,
      { deleted_at: new Date() }, // Soft delete
      { new: true }
    );

    if (!deletedCardDesign) {
      return res.status(404).json({ message: "Card design not found" });
    }

    res.status(200).json({
      message: "Card design marked as deleted",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Card design deletion failed",
      error: err,
    });
  }
};

module.exports = {
  createCardDesign,
  getCardDesigns,
  getCardDesignById,
  updateCardDesign,
  deleteCardDesign,
};
