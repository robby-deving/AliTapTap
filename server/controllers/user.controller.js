const User = require("../Models/user.model.js");

const updateUser = async (req, res) => {
    try {
        const updateUser = await User.findByIdAndUpdate(req.params.id, {
            $set: req.body
        },{
            new: true
        });
        if (!updateUser) {
            return res.status(404).json({
                message: "User not found!"
            });
        }
        res.status(200).json({
            message: "User updated successfully",
            data: updateUser
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "User update failed",
            error: err
        });
    }
};

const deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({
            message: "User deleted successfully"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "User Deletion Failed!",
        });
    }
}

const getAdmin = async (req, res) => {
    try {
        const admin = await User.findById(req.params.id);
        if (!admin) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const {password, ...info} = admin._doc;
        res.status(200).json({
            message: "User gotten successfully",
            data: info
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "User query failed",
            error: error
        });
    }
};

const getAllUsers = async (req, res) => {
    const query = req.query.latest;
    try {
        const users = query ? await User.find().sort({_id: -1}).limit(3) : await User.find();

        res.status(200).json({
            message: "Users has been found successfully",
            data: users
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "User query failed",
            error: error
        });
    }
};

const getUserStats = async (req, res) => {
    try { 
        const date = new Date();
        const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

        const userStats = await User.aggregate ([
            {
                $match: { createdAt: { $gte: lastYear } },
            },
            {
                $project: {
                    month: { $month: "$createdAt" }
                },
            },
            {
                $group: {
                    _id: "$month",
                    total: { $sum: 1 }
                },
            },
        ]);
        res.status(200).json({
            message: "User statistics gotten successfully",
            userStats
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "User statistics query failed",
            error: error.message 
        });
    }
}

const addAddress = async (req, res) => {
    try {
        const { _id, street, barangay, city, province, zip, phone_number, first_name, last_name } = req.body;
        const userId = req.params.id;

        if (!street || !barangay || !city || !province || !zip) {
            return res.status(400).json({ message: "All address fields are required." });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        let addressMessage = "Address added successfully";
        let addressUpdated = false;

        if (_id) {
            // Check if the address with this ID exists in user's address array
            const addressIndex = user.address.findIndex(addr => addr._id.toString() === _id);

            if (addressIndex !== -1) {
                // Update the existing address
                user.address[addressIndex] = { _id, street, barangay, city, province, zip };
                addressMessage = "Address updated successfully";
                addressUpdated = true;
            }
        }

        if (!addressUpdated) {
            // Check if the exact address (excluding ID) already exists
            const isDuplicate = user.address.some(addr =>
                addr.street === street &&
                addr.barangay === barangay &&
                addr.city === city &&
                addr.province === province &&
                addr.zip === zip
            );

            if (isDuplicate) {
                addressMessage = "Address already exists. Only personal details updated.";
            } else {
                user.address.push({ street, barangay, city, province, zip });
            }
        }

        // Update personal details if provided
        if (phone_number) user.phone_number = phone_number;
        if (first_name) user.first_name = first_name;
        if (last_name) user.last_name = last_name;

        // Save changes
        await user.save();

        res.status(200).json({
            message: addressMessage,
            data: {
                _id: user._id,
                first_name: user.first_name,
                last_name: user.last_name,
                phone_number: user.phone_number,
                email: user.email,
                profile_picture: user.profile_picture,
                address: user.address
            }
        });
    } catch (error) {
        console.error("Error adding/updating address:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

const updateUserProfile = async (req, res) => {
    try {
        const userId = req.params.id; // Get user ID from URL params
        const { first_name, last_name, username, email, phone_number, gender } = req.body;

        // Find the user by ID
        let user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update user details
        user.first_name = first_name || user.first_name;
        user.last_name = last_name || user.last_name;
        user.username = username || user.username;
        user.email = email || user.email;
        user.phone_number = phone_number || user.phone_number;
        user.gender = gender || user.gender;

        // Save the updated user data
        const updatedUser = await user.save();

        res.status(200).json({
            message: "Profile updated successfully",
            user: updatedUser
        });
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = {
    updateUser,
    deleteUser,
    getAdmin,
    getAllUsers,
    getUserStats,
    addAddress,
    updateUserProfile
};