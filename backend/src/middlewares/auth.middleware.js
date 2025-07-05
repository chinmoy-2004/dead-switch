import jwt from 'jsonwebtoken';
import User from '../schema/User.schema.js';
import dotenv from 'dotenv';
dotenv.config();


export const protectroute = async (req, res, next) => {
    try {


        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({ message: 'Not authorized, no token' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }

        const user = await User.findById(decoded.userId).select('-password');
        if (!user) {
            return res.status(401).json({ message: 'Not authorized, user not found' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Error in auth.middleware.js/protectroute", error);
        return res.status(500).json({ message: 'Internal server error' });
    }

}