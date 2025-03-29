const express = require('express');
const router = express.Router();
const cardDesignController = require('../controllers/carddesign.controller.js');

// Admin: Create a new card design (product) with images and material pricing
router.post('/admin/create', cardDesignController.createCardAdmin);

// Admin: Get all card products
router.get('/admin/get-card-products', cardDesignController.getCardProducts);

// Admin: Get a specific card product by ID
router.get('/admin/get-card-product/:id', cardDesignController.getCardProductById);

// Admin: Update a card product (product details like images, name, material)
router.put('/admin/update-card-product/:id', cardDesignController.updateCardProduct);

// Admin: Delete a card product
router.delete('/admin/delete-card-product/:id', cardDesignController.deleteCardProduct);

// Customer: Create or Update a card design with customizations (front_info and back_info)
router.post('/customer/create/:id', cardDesignController.createCardDesign);

// Get all card designs (products)
router.get('/get-card-designs', cardDesignController.getCardDesigns);

// Get a specific card design (product) by ID
router.get('/get-card-design/:id', cardDesignController.getCardDesignById);

// Update a card design (product)
router.put('/update-card-design/:id', cardDesignController.updateCardDesign);

// Delete a card design (product)
router.delete('/delete-card-design/:id', cardDesignController.deleteCardDesign);

module.exports = router;
