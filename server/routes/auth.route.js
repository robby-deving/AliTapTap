const { register, login, forgotPassword, resetPassword } = require("../controllers/auth.controller.js");

const router = require("express").Router();

// Register and Login routes
router.post("/register", register);
router.post("/login", login);

// Forgot Password and Reset Password routes
router.post("/forgot-password", forgotPassword); 
router.post("/reset-password", resetPassword);

module.exports = router;
