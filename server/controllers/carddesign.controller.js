const cloudinary = require("../cloudinary");
const CardDesign = require("../Models/carddesign.model");
const User = require("../Models/user.model");

// Admin: Create a new card (product) with images and material pricing
const createCardAdmin = async (req, res) => {
  try {
    const { name, front_image, back_image, created_by, materials } = req.body;

    // Validate required fields
    if (!name || !front_image || !back_image || !created_by || !materials) {
      return res.status(400).json({ message: "Name, images, created_by, and materials are required." });
    }

    // Validate if materials have all pricing fields
    if (!materials.PVC || !materials.Metal || !materials.Wood) {
      return res.status(400).json({ message: "Materials pricing for PVC, Metal, and Wood is required." });
    }

    // Check if user exists
    const userExists = await User.findById(created_by);
    if (!userExists) {
      return res.status(400).json({ message: "Invalid user ID, user not found" });
    }

    // Upload images to Cloudinary
    let frontImageUrl = null;
    let backImageUrl = null;

    if (front_image) {
      const frontImageUpload = await cloudinary.uploader.upload(front_image, {
        folder: "card_designs",  // Specify a folder in Cloudinary
      });
      frontImageUrl = frontImageUpload.secure_url;  // Cloudinary URL for the front image
    }

    if (back_image) {
      const backImageUpload = await cloudinary.uploader.upload(back_image, {
        folder: "card_designs",  // Specify a folder in Cloudinary
      });
      backImageUrl = backImageUpload.secure_url;  // Cloudinary URL for the back image
    }

    // Create the card design (product)
    const newCardDesign = new CardDesign({
      name,  // Include name now
      front_image: frontImageUrl,  // Cloudinary URL
      back_image: backImageUrl,    // Cloudinary URL
      created_by,
      materials: materials,  // Materials with prices (PVC, Metal, Wood)
    });

    await newCardDesign.save();

    res.status(201).json({
      message: "Card design (product) created successfully",
      data: newCardDesign,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Card design creation failed",
      error: err.message,
    });
  }
};

// Get all card products (admin products)
const getCardProducts = async (req, res) => {
  try {
    const cardProducts = await CardDesign.find({ deleted_at: null });  // Fetch all card products
    res.status(200).json({
      message: "Card products retrieved successfully",
      data: cardProducts,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Failed to retrieve card products",
      error: err.message,
    });
  }
};

// Get a specific card product (product) by ID (admin view)
const getCardProductById = async (req, res) => {
  try {
    const cardProduct = await CardDesign.findById(req.params.id);  // Fetch the card product by ID

    if (!cardProduct) {
      return res.status(404).json({ message: "Card product not found" });
    }

    res.status(200).json({
      message: "Card product retrieved successfully",
      data: cardProduct,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Failed to retrieve card product",
      error: err.message,
    });
  }
};

// Update a card product (admin side)
const updateCardProduct = async (req, res) => {
  try {
    const { name, front_image, back_image, materials } = req.body;

    // Find the card product by ID
    const existingCardProduct = await CardDesign.findById(req.params.id);
    if (!existingCardProduct) {
      return res.status(404).json({ message: "Card product not found" });
    }

    // Update card product details
    const updatedCardProduct = await CardDesign.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          name: name || existingCardProduct.name,
          front_image: front_image || existingCardProduct.front_image,
          back_image: back_image || existingCardProduct.back_image,
          materials: materials || existingCardProduct.materials,
        }
      },
      { new: true }
    );

    res.status(200).json({
      message: "Card product updated successfully",
      data: updatedCardProduct,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Failed to update card product",
      error: err.message,
    });
  }
};

// Delete a card product (admin side)
const deleteCardProduct = async (req, res) => {
  try {
    const deletedCardProduct = await CardDesign.findByIdAndUpdate(
      req.params.id,
      { deleted_at: new Date() },  // Mark the card product as deleted
      { new: true }
    );

    if (!deletedCardProduct) {
      return res.status(404).json({ message: "Card product not found" });
    }

    res.status(200).json({
      message: "Card product marked as deleted",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Failed to delete card product",
      error: err.message,
    });
  }
};

// Customer: Create or Update the card design with front_info and back_info (customizations)
const createCardDesign = async (req, res) => {
  try {
    const { front_info, back_info } = req.body;

    // Validate required fields (for customer design customization)
    if (!Array.isArray(front_info) || !Array.isArray(back_info)) {
      return res.status(400).json({ message: "front_info and back_info must be arrays." });
    }

    // Find the card design based on its ID (admin-created card)
    const cardDesign = await CardDesign.findById(req.params.id);

    if (!cardDesign) {
      return res.status(404).json({ message: "Card design not found" });
    }

    // Update card design with the customer's front_info and back_info
    cardDesign.details = {
      front_info,
      back_info,
    };

    await cardDesign.save();

    res.status(200).json({
      message: "Card design updated successfully",
      data: cardDesign,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Card design update failed",
      error: err.message,
    });
  }
};

// Get all card designs (products)
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
      error: err.message,
    });
  }
};

// Get a specific card design (product) by ID
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
      error: err.message,
    });
  }
};

// Update a card design (product)
const updateCardDesign = async (req, res) => {
  try {
    const { details, materials } = req.body;

    const existingCardDesign = await CardDesign.findById(req.params.id);
    if (!existingCardDesign) {
      return res.status(404).json({ message: "Card design not found" });
    }

    // Merge existing details but replace front_info and back_info if provided
    const updatedDetails = {
      ...existingCardDesign.details,
      ...details,
      front_info: details.front_info ? details.front_info : existingCardDesign.details.front_info,
      back_info: details.back_info ? details.back_info : existingCardDesign.details.back_info,
    };

    // Update card design with new details and materials
    const updatedCardDesign = await CardDesign.findByIdAndUpdate(
      req.params.id,
      { $set: { details: updatedDetails, materials: materials || existingCardDesign.materials } },
      { new: true }
    );

    res.status(200).json({
      message: "Card design updated successfully",
      data: updatedCardDesign,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Card design update failed",
      error: err.message,
    });
  }
};

// Delete a card design (product)
const deleteCardDesign = async (req, res) => {
  try {
    const deletedCardDesign = await CardDesign.findByIdAndUpdate(
      req.params.id,
      { deleted_at: new Date() },
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
      error: err.message,
    });
  }
};

// Export the controller methods for both admin and customer sides
module.exports = {
  createCardAdmin,
  getCardProducts, 
  getCardProductById, 
  updateCardProduct,  
  deleteCardProduct,  
  createCardDesign,  
  getCardDesigns,  
  getCardDesignById,  
  updateCardDesign,  
  deleteCardDesign,  
};