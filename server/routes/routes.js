const express = require('express');
const router = express.Router();
const userRoutes = require('./user.route');
<<<<<<< HEAD
const authRoute = require('./auth.route');
const cardDesignRoutes = require('./carddesign.route');
const dashboardRoutes = require("./dashboard.route");
const productRoutes = require('./product.route');  
const transactionRoutes = require('./transaction.route');  
const orderRoutes = require('./order.route');

const base = "/api/v1";

router.use(`${base}/users`, userRoutes);
router.use(`${base}/auth`, authRoute);
router.use(`${base}/card-designs`, cardDesignRoutes);
router.use(`${base}/dashboard`, dashboardRoutes);
router.use(`${base}/products`, productRoutes);  
router.use(`${base}/transactions`, transactionRoutes);  
router.use(`${base}/orders`, orderRoutes);
=======
const paymentRoutes = require('./payment.route');

const base = "/api/v1"

router.use(`${base}/users`, userRoutes);
router.use(`${base}/pay`, paymentRoutes);

//http://localhost:5000/api/v1/pay/payment
>>>>>>> f/payment

module.exports = router;
