const express = require('express');
const router = express.Router();
require('dotenv').config();

const PAYMONGO_SECRET_KEY = process.env.PAYMONGO_SECRET_KEY;

// 1. Create Payment Intent
router.post("/make-payment", async (req, res) => {
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
                        capture_type: 'automatic'
                    }
                }
            })
        });

        const paymentIntent = await response.json();
        res.json({
            success: true,
            clientKey: paymentIntent.data.attributes.client_key,
            paymentIntentId: paymentIntent.data.id
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error creating payment intent",
            error: error.message
        });
    }
});

router.post("/attach-payment-method", async (req, res) => {
    try {
        const { paymentIntentId, paymentMethodId } = req.body;

        const response = await fetch(`https://api.paymongo.com/v1/payment_intents/${paymentIntentId}/attach`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${Buffer.from(PAYMONGO_SECRET_KEY).toString('base64')}`
            },
            body: JSON.stringify({
                data: {
                    attributes: {
                        payment_method: paymentMethodId
                    }
                }
            })
        });

        const result = await response.json();
        res.json(result);

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error attaching payment method",
            error: error.message
        });
    }
});

router.post("/create-payment-method", async (req, res) => {
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
                        details
                    }
                }
            })
        });

        const paymentMethod = await response.json();
        res.json(paymentMethod);

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error creating payment method",
            error: error.message
        });
    }
});
module.exports = router;