const router = require('express').Router();
const userRoutes = require('./user.route');
const base = "/api/v1"

router.use(`${base}/users`, userRoutes);

module.exports = router;