const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller.js');

// Create a new product
router.post('/create', productController.createProduct);

// Get all products
router.get('/get-products', productController.getAllProducts);

// Get a product by ID
router.get('/get-product/:id', productController.getProduct);

// Update a product by ID
router.put('/update-product/:id', productController.updateProduct);

// Delete a product by ID
router.delete('/delete-product/:id', productController.deleteProduct);

module.exports = router;
