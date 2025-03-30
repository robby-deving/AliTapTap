const express = require('express');
const router = express.Router();
const cors = require('cors');
require('dotenv').config();

const PAYMONGO_SECRET_KEY = process.env.PAYMONGO_SECRET_KEY;

const corsOptions = {
  origin: ['http://localhost:8081', 'http://localhost:19006'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

// Apply CORS to payment routes
router.use(cors(corsOptions));

// Create payment intent
router.post("/payment-intents", async (req, res) => {
    try {
        const { amount, description } = req.body;

        const response = await fetch('https://api.paymongo.com/v1/payment_intents', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${Buffer.from(PAYMONGO_SECRET_KEY).toString('base64')}`
            },
            body: JSON.stringify({
                data: {
                    attributes: {
                        amount: amount * 100, // Convert to cents
                        currency: 'PHP',
                        description,
                        payment_method_allowed: ['card', 'gcash', 'grab_pay'],
                        capture_type: 'automatic',
                        return_url: 'http://yourapp.com/success',
                        cancel_url: 'http://yourapp.com/cancel'
                    }
                }
            })
        });

        const paymentIntent = await response.json();
        res.status(201).json({
            success: true,
            data: {
                clientKey: paymentIntent.data.attributes.client_key,
                paymentIntentId: paymentIntent.data.id
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error creating payment intent",
            error: error.message
        });
    }
});

// Attach payment method to intent
router.put("/payment-intents/:intentId/payment-methods/:methodId", async (req, res) => {
    try {
        const { intentId, methodId } = req.params;
        console.log("Intent ID:", intentId);
        console.log("Method ID:", methodId);
        
        const response = await fetch(`https://api.paymongo.com/v1/payment_intents/${intentId}/attach`, {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${Buffer.from(PAYMONGO_SECRET_KEY).toString('base64')}`
            },
            body: JSON.stringify({data: {attributes: {payment_method: methodId, return_url: 'http://yourapp.com/success'}}})
        });  

        const result = await response.json();

        res.status(200).json({
            success: true,
            data: result.data
        });

        console.log("Result:", result);
        

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error attaching payment method",
            error: error.message
        });
    }
});

// Create payment method
router.post("/payment-methods", async (req, res) => {
    try {
        const { type, details } = req.body;

        const response = await fetch('https://api.paymongo.com/v1/payment_methods', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${Buffer.from(PAYMONGO_SECRET_KEY).toString('base64')}`
            },
            body: JSON.stringify({
                data: {
                    attributes: {
                        type,
                        details,
                    }
                }
            })
        });

        const paymentMethod = await response.json();
        res.status(201).json({
            success: true,
            data: paymentMethod.data
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error creating payment method",
            error: error.message
        });
    }
});

// Retrieve payment intent
router.get("/payment-intents/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const response = await fetch(`https://api.paymongo.com/v1/payment_intents/${id}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Basic ${Buffer.from(PAYMONGO_SECRET_KEY).toString('base64')}`
            }
        });

        const paymentIntent = await response.json();
        
        if (!paymentIntent.data) {
            return res.status(404).json({
                success: false,
                message: "Payment intent not found"
            });
        }

        res.status(200).json({
            success: true,
            data: paymentIntent.data
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error retrieving payment intent",
            error: error.message
        });
    }
});

module.exports = router;