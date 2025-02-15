const { register, login } = require("../controllers/auth.controller.js");

const router = require("express").Router();

router.post("/register", register) ;

router.post("/login", login);

/*const register = async (req, res) => {
    try {
        const { username, first_name, last_name, email, password, phone_number, profile_picture, gender } = req.body;

        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email is already in use" });
        }

        // Hash password
        const hashedPassword = bcrypt.hashSync(password, 10);

        const newUser = new User({
            username,
            first_name,
            last_name,
            email,
            password: hashedPassword,
            phone_number,
            profile_picture,
            gender
        });

        await newUser.save();

        const { password: _, ...info } = newUser._doc;

        res.status(201).json({
            message: "User created successfully",
            data: info
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "User registration failed",
            error: error.message
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "Email does not exist" });
        }

        // Check if password is correct
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Email or password is incorrect" });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, isAdmin: user.isAdmin },
            process.env.JWT_KEY,
            { expiresIn: "5d" }
        );

        const { password: _, ...info } = user._doc;

        res.status(200).json({
            message: "Login successful",
            data: { ...info, token }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Login failed",
            error: error.message
        });
    }
};*/

module.exports = router;

/*
router.post("/register", async (req, res) => {
    try {
        const hashedPassword = bcrypt.hashSync(req.body.password, 10);
        const newUser = new User({
            username: req.body.username,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            password: hashedPassword,
            phone_number: req.body.phone_number,
            profile_picture: req.body.profile_picture,
            gender: req.body.gender,
            address: req.body.address || [], // Ensure empty array fallback
            payment_method: req.body.payment_method || [], // Ensure empty array fallback
        })

        await newUser.save();

        const {password, ...info} = newUser._doc;
        res.status(200).json ({
            message: "User has been registered",
            data: info
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "User creation failed",
            error: error
        });
    }
});

router.post("/login", async (req, res) => {
    try {
        const {email, password} = req.body;

    const user = await User.findOne({email: email});
    if (!user) {
        return res.status(404).json({
            message: "Email does not exist"
        })
    }

    const comparedPassword = await bcrypt.compare(password, user.password);
    if (!comparedPassword) {
        return res.status(404).json({
            message: "Email or Password is incorrect"
        })
    }
    res.status(200).json({
        data: user,
        message: "Login successful"
    });
    } catch (error) {
        console.log(error);
        res.status(500).json ({
            message: "Login failed",
            error: error
        })
    }
});

module.exports = router;*/