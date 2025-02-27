const router = require('express').Router();
const userRoutes = require('./user.route');
const authRoute = require('./auth.route');
const paymentRoutes = require('./payment.route');

const base = "/api/v1"

router.use(`${base}/users`, userRoutes);
router.use(`${base}/auth`, authRoute);
router.use(`${base}/pay`, paymentRoutes);

//http://localhost:5000/api/v1/pay/payment

module.exports = router;