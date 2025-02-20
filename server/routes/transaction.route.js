const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transaction.controller.js');


// Create a new transaction
router.post('/create', transactionController.createTransaction);

// Get all transactions
router.get('/get-transactions', transactionController.getAllTransactions);

// Get a transaction by ID
router.get('/get-transaction/:id', transactionController.getTransaction);

// Update a transaction by ID
router.put('/update-transaction/:id', transactionController.updateTransaction);

// Delete a transaction by ID
router.delete('/delete-transaction/:id', transactionController.deleteTransaction);

module.exports = router;
