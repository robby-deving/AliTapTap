require('dotenv').config(); // Load environment variables
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../Models/user.model.js");
const nodemailer = require("nodemailer");
const crypto = require("crypto"); // For generating secure random pin codes

// Set up the email transporter with environment variables
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,  
    pass: process.env.SMTP_PASS,  
  },
});

// Register user
const register = async (req, res) => {
  try {
    const { username, first_name, last_name, email, password, phone_number, profile_picture, gender, isAdmin, address, payment_method } = req.body;

    if (!username || !first_name || !last_name || !email || !password) {
      return res.status(400).json({ message: "All required fields must be provided." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      first_name,
      last_name,
      email,
      password: hashedPassword,
      phone_number: phone_number || null,
      profile_picture: profile_picture || null,
      gender: gender || "Other",
      isAdmin: isAdmin || false,
      address: address || [],
      payment_method: Array.isArray(payment_method)
        ? payment_method.map(pm => typeof pm === "object" ? pm.type : pm)
        : [] // Ensure it's an array of strings
    });

    await newUser.save();

    const { password: _, ...userInfo } = newUser._doc;

    res.status(201).json({
      message: "User registered successfully",
      data: userInfo
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "User registration failed",
      error: error.message
    });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "Email does not exist"
      });
    }

    const comparedPassword = await bcrypt.compare(password, user.password);
    if (!comparedPassword) {
      return res.status(400).json({
        message: "Email or Password is incorrect"
      });
    }

    const token = jwt.sign({
      id: user._id,
      isAdmin: user.isAdmin
    }, process.env.JWT_KEY, { expiresIn: "5d" });

    const { password: _, ...userInfo } = user._doc;

    res.status(200).json({
      data: { ...userInfo, token },
      message: "Login successful"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Login failed",
      error: error.message
    });
  }
};

// Forgot Password - Send pin code to email
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate a 5-digit pin code and set expiration (15 minutes)
    const pinCode = crypto.randomInt(10000, 99999).toString(); 
    const formattedPinCode = pinCode.split('').join(' ');

    const expirationTime = new Date();
    expirationTime.setMinutes(expirationTime.getMinutes() + 15); 

    // Save pin code and expiration to user's record
    user.resetPinCode = pinCode;
    user.resetPinCodeExpiration = expirationTime;
    await user.save();

// Send pin code via email with HTML design
const mailOptions = {
  from: process.env.SMTP_USER,  
  to: email,
  subject: "Password Reset Request",
  html: `
  <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 0;
          color: black; /* Set the default text color to black */
        }
        .container {
          max-width: 600px;
          margin: 25px auto; 
          background: #ffffff;
          border-radius: 10px;
          padding: 25px;  
          text-align: center;
        }
        .logo {
          width: 120px;  
          margin-top: 10px;
          margin-bottom: 15px; 
        }
        .title {
          font-size: 22px; 
          color: black; /* Ensure title text color is black */
          margin-bottom: 15px; 
          font-weight: bold;  /* Bold the title */
        }
        .message {
          font-size: 16px;
          margin-bottom: 15px;  
        }
        .pin-container {
          background: #FDCB07;
          color: black;  /* Changed pin code color to black */
          font-size: 24px;
          padding: 12px 25px; 
          margin: 20px auto;  
          border-radius: 10px;
          font-weight: bold;
          display: inline-block;
          text-align: center;
          letter-spacing: 5px;
        }
        .footer {
          text-align: center;
          margin-top: 15px; 
          font-size: 12px;
          color: #999;
          margin-bottom: 10px; 
        }
      </style>
    </head>
    <body>
      <div class="container">
        <img class="logo" src="cid:logo_b.png" alt="Logo" />
        <h1 class="title">AliTapTap Password Reset Request</h1>
        <p class="message">Hello ${user.first_name},</p>
        <p class="message">You requested a password reset for your account. Please use the following pin code to reset your password:</p>
        <div class="pin-container">${formattedPinCode}</div>
        <p class="message">This pin code will expire in 15 minutes. If you didn't request a password reset, please ignore this email.</p>
        <footer class="footer">© 2025 AliTapTap. All rights reserved.</footer>
      </div>
    </body>
  </html>
  `,
  attachments: [
    {
      filename: 'AliTapTap',
      path: '../client/assets/images/logo_b.png',
      cid: 'logo_b.png' // This CID will be used in the HTML img tag
    }
  ]
};


    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({ message: "Failed to send email", error: error.message });
      }
      res.json({ message: "Pin code sent to email" });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error sending pin code", error: err.message });
  }
};


// Reset Password - Validate pin code and reset password
const resetPassword = async (req, res) => {
  const { email, pinCode, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the pin code matches and hasn't expired
    if (user.resetPinCode !== pinCode) {
      return res.status(400).json({ message: "Invalid pin code" });
    }
    if (new Date() > user.resetPinCodeExpiration) {
      return res.status(400).json({ message: "Pin code has expired" });
    }

    // Hash new password and update user record
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetPinCode = null; 
    user.resetPinCodeExpiration = null;
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error resetting password", error: err.message });
  }
};

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
};
