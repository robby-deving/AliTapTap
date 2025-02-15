const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../Models/user.model.js");

const register = async (req, res) => {
    try {
        const hashedPassword = bcrypt.hashSync(req.body.password, 10);
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        })

        await newUser.save();

        const {password, ...info} = newUser._doc;
        res.status(200).json ({
            message: "User created successfully",
            data: info
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "User creation failed",
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