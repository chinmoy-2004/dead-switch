import bcrypt from 'bcryptjs';
import User from '../schema/User.schema.js';
import { generateToken } from '../lib/utils.js';

export const Signup = async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Please fill all fields' });
    }
    if (password.length < 8) {
        return res.status(400).json({ message: 'Password must be at least 8 characters long' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
    }
    if (!existingUser) {
        try {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            const user = await User.create({
                name,
                email,
                password: hashedPassword
            });
            if (!user) {
                return res.status(500).json({ message: 'User creation failed' });
            }
            const userId = user?._id;
            generateToken(userId, res);

            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
            });

        } catch (error) {
            console.log("error in auth.controller.js/signup", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
}

export const login=async (req, res) => {
    const {email,password} = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Please fill all fields' });
    }
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: 'invalid credintials' });
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
        return res.status(400).json({ message: 'invalid credintials' });
    }
    const userId = user?._id;
    generateToken(userId, res);
    res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
    });
}

export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", {maxage:0});
        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        console.log("error in auth.controller.js/logout", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const checkauth=async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authorized' });
        }
        res.status(200).json({
            _id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            isAdmin: req.user.isAdmin,
        });
    } catch (error) {
        console.log("error in auth.controller.js/checkauth", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}



