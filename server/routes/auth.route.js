const { register, login, forgotPassword, resetPassword } = require("../controllers/auth.controller.js");

const router = require("express").Router();

// Register and Login routes
router.post("/register", register);
router.post("/login", login);

// Forgot Password and Reset Password routes
router.post("/forgot-password", forgotPassword); // Send reset pin code to email
router.post("/reset-password", resetPassword); // Reset password using pin code

module.exports = router;
