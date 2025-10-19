import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import User from "../models/userModel.js";
import msgModel from "../models/messageModel.js";

export const register = async (req, res) => {
    const { name, password } = req.body;
    if (!name || !password) {
        return res.json({ success: false, message: "Details missing" })
    }

    try {
        const userExists = await User.findOne({ name });
        if (userExists) {
            return res.json({ success: false, message: 'User Name already taken' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const profilePic = 'https://avatar.iran.liara.run/public';
        const user = new User({ name, password: hashedPassword, profilePic });
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            //sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.json({ success: true });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

export const login = async (req, res) => {
    const { name, password } = req.body;
    if (!name || !password) {
        return res.json({ success: false, message: "Details missing" })
    }

    try {
        const user = await User.findOne({ name });
        if (!user) {
            return res.json({ success: false, message: 'Invalid User Name' });
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.json({ success: false, message: 'Incorrect Password' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
             sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            //sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.json({ success: true });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

export const logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict'
        })
        return res.json({ success: true });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

export const isAuthenticated = async (req, res) => {
    console.log("jerlo");
    try {
        return res.json({ success: true });
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}
