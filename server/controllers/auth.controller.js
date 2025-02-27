const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../Models/user.model.js");

const register = async (req, res) => {
    try {
        const { 
            username, first_name, last_name, email, password, phone_number, 
            profile_picture, gender, isAdmin, address, payment_method 
        } = req.body;

        if (!username || !first_name || !last_name || !email || !password) {
            return res.status(400).json({ message: "All required fields (username, first_name, last_name, email, password) must be provided." });
        }

        
        const hashedPassword = bcrypt.hashSync(password, 10);

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
        console.log(error);
        res.status(500).json({
            message: "User registration failed",
            error: error
        });
    }
};

const login = async (req, res) => {
    try {
    const user = await User.findOne({email: req.body.email});
    if (!user) {
        return res.status(404).json({
            message: "Email does not exist"
        })
    }

    const comparedPassword = await bcrypt.compare(req.body.password, user.password);
    if (!comparedPassword) {
        return res.status(404).json({
            message: "Email or Password is incorrect"
        })
    }

    const token = jwt.sign({
        id: user._id,
        isAdmin: user.isAdmin
    }, process.env.JWT_KEY, { 
        expiresIn: "5 d"
    });

    const {password, ...info} = user._doc;

    res.status(200).json({
        data: {...info, token},
        message: "Login successful"
    });
    } catch (error) {
        console.log(error);
        res.status(500).json ({
            message: "Login failed",
            error: error
        })
    }
}

module.exports = {
    register,
    login
};