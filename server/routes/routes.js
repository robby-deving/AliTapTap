const express = require('express');
const router = express.Router();
const userRoutes = require('./user.route');
const authRoute = require('./auth.route');
const cardDesignRoutes = require('./carddesign.route');
const dashboardRoutes = require("./dashboard.route");
const transactionRoutes = require('./transaction.route');  
const orderRoutes = require('./order.route');

const paymentRoutes = require('./payment.route');

const base = "/api/v1";

router.use(`${base}/users`, userRoutes);
router.use(`${base}/auth`, authRoute);
router.use(`${base}/card-designs`, cardDesignRoutes);
router.use(`${base}/dashboard`, dashboardRoutes);
router.use(`${base}/transactions`, transactionRoutes);  
router.use(`${base}/orders`, orderRoutes);

router.use(`${base}/pay`, paymentRoutes); 

module.exports = router;
