import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const verifyToken = async (req, res, next) => {
    try {
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        } else if (req.cookies && req.cookies.token) {
            token = req.cookies.token;
        }

        if (!token) {
            return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');

        req.user = await User.findById(decoded.id);

        if (!req.user) {
            return res.status(401).json({ success: false, message: 'The user belonging to this token does no longer exist.' });
        }

        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
    }
};

export const verifyAuthority = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    if (req.user.role !== 'authority' && req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: `User role ${req.user.role} is not authorized to access this route`
        });
    }

    // Admin approves authority accounts. Status must be APPROVED.
    if (req.user.role === 'authority' && req.user.status !== 'APPROVED') {
        return res.status(403).json({
            success: false,
            message: 'Authority account is pending admin approval'
        });
    }

    next();
};
