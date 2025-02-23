const router = require('express').Router();
const userRoutes = require('./user.route');
const authRoute = require('./auth.route');
const cardDesignRoutes = require('./carddesign.route'); 
const dashboardRoutes = require("./dashboard.route");

const base = "/api/v1"

router.use(`${base}/users`, userRoutes);
router.use(`${base}/auth`, authRoute);
router.use(`${base}/card-designs`, cardDesignRoutes);
router.use(`${base}/dashboard`, dashboardRoutes);

module.exports = router;