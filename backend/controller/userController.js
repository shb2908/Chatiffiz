import User from "../models/userModel.js";


export const allUsers = async (req, res) => {
    try {
        const users = await User.find({});

        res.json({
            success: true,
            users
        })
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

export const getUserData = async (req, res) => {
    try {
        const { userId } = req.body;

        const user = await User.findById(userId);

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        res.json({
            success: true,
            userData: user
        })
    } catch (error) {
        res.json({ success: false, message: error.message });

    }
}