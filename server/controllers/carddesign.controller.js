const cloudinary = require("../cloudinary");
const CardDesign = require("../Models/carddesign.model");
const User = require("../Models/user.model");

const createCardAdmin = async (req, res) => {
  try {
    const { name, front_image, back_image, materials } = req.body;

    // Validate required fields
    if (!name || !front_image || !back_image || !materials) {
      return res.status(400).json({ message: "Name, images, and materials are required." });
    }

    // Validate if materials have all pricing fields
    if (!materials.PVC || !materials.Metal || !materials.Wood) {
      return res.status(400).json({ message: "Materials pricing for PVC, Metal, and Wood is required." });
    }

    // Upload images to Cloudinary
    let frontImageUrl = null;
    let backImageUrl = null;

    if (front_image) {
      const frontImageUpload = await cloudinary.uploader.upload(front_image, {
        folder: "card_designs",
      });
      frontImageUrl = frontImageUpload.secure_url;
    }

    if (back_image) {
      const backImageUpload = await cloudinary.uploader.upload(back_image, {
        folder: "card_designs",
      });
      backImageUrl = backImageUpload.secure_url;
    }

    // Create the card design (product)
    const newCardDesign = new CardDesign({
      name,
      front_image: frontImageUrl,
      back_image: backImageUrl,
      materials: materials,
      created_at: new Date(), // Save the timestamp
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
    const cardProducts = await CardDesign.find({ deleted_at: null }) // Only fetch non-deleted products
      .select("_id name front_image back_image materials created_at modified_at") // Removed deleted_at
      .populate("created_by", "name email"); // Optional: Include creator details

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

    // Check if materials have valid pricing fields
    if (materials) {
      // Ensure that all required materials are updated with price_per_unit
      const requiredMaterials = ["PVC", "Metal", "Wood"];
      for (const material of requiredMaterials) {
        if (!materials[material] || !materials[material].price_per_unit) {
          return res.status(400).json({
            message: `Materials pricing for ${material} with price_per_unit is required.`,
          });
        }
      }
    }

    // Upload new images if provided
    let frontImageUrl = existingCardProduct.front_image;
    let backImageUrl = existingCardProduct.back_image;

    if (front_image) {
      const frontImageUpload = await cloudinary.uploader.upload(front_image, {
        folder: "card_designs",
      });
      frontImageUrl = frontImageUpload.secure_url;
    }

    if (back_image) {
      const backImageUpload = await cloudinary.uploader.upload(back_image, {
        folder: "card_designs",
      });
      backImageUrl = backImageUpload.secure_url;
    }

    const updatedCardProduct = await CardDesign.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          name: name || existingCardProduct.name,
          front_image: frontImageUrl,  
          back_image: backImageUrl,    
          materials: materials || existingCardProduct.materials,  
          modified_at: new Date(),  
        },
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

const deleteCardProduct = async (req, res) => {
  try {
    const deletedCardProduct = await CardDesign.findByIdAndUpdate(
      req.params.id,
      { deleted_at: new Date() },  
      { new: true }
    );

    if (!deletedCardProduct) {
      return res.status(404).json({ message: "Card product not found" });
    }

    const io = req.app.get('io');
    io.emit('product_deleted', deletedCardProduct);  

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

const createCardDesign = async (req, res) => {
  try {
    const { front_info, back_info } = req.body;
    if (!Array.isArray(front_info) || !Array.isArray(back_info)) {
      return res.status(400).json({ message: "front_info and back_info must be arrays." });
    }
    const cardDesign = await CardDesign.findById(req.params.id);

    if (!cardDesign) {
      return res.status(404).json({ message: "Card design not found" });
    }
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

const updateCardDesign = async (req, res) => {
  try {
    const { details, materials } = req.body;

    const existingCardDesign = await CardDesign.findById(req.params.id);
    if (!existingCardDesign) {
      return res.status(404).json({ message: "Card design not found" });
    }

    const updatedDetails = {
      ...existingCardDesign.details,
      ...details,
      front_info: details.front_info ? details.front_info : existingCardDesign.details.front_info,
      back_info: details.back_info ? details.back_info : existingCardDesign.details.back_info,
    };

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