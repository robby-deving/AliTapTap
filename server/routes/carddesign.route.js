const express = require('express');
const router = express.Router();
const cardDesignController = require('../controllers/carddesign.controller.js');
const User = require('../Models/user.model'); 

// Create a new card design
router.post('/create', cardDesignController.createCardDesign);

// Get all card designs
router.get('/get-card-designs', cardDesignController.getCardDesigns);

// Get a card design by ID
router.get('/get-card-design/:id', cardDesignController.getCardDesignById);

// Update a card design by ID
router.put('/update-card-design/:id', cardDesignController.updateCardDesign);

// Delete a card design by ID
router.delete('/delete-card-design/:id', cardDesignController.deleteCardDesign);

module.exports = router;
