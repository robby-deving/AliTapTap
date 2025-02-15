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

module.exports = {
    updateUser,
    deleteUser,
    getAdmin,
    getAllUsers,
    getUserStats
};