import express from 'express';
import { verifyToken, verifyAuthority } from '../middleware/authMiddleware.js';
import Zone from '../models/Zone.js';
import Alert from '../models/Alert.js';

const router = express.Router();

// Base PATH: /api/authority

// @desc    Get all zones
// @route   GET /api/authority/zones
// @access  Private/Authority
router.get('/zones', verifyToken, verifyAuthority, async (req, res) => {
    try {
        const zones = await Zone.find();
        res.status(200).json({ success: true, count: zones.length, data: zones });
    } catch (error) {
        console.error('Error fetching zones:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

// @desc    Get recent alerts
// @route   GET /api/authority/alerts
// @access  Private/Authority
router.get('/alerts', verifyToken, verifyAuthority, async (req, res) => {
    try {
        const alerts = await Alert.find().sort({ createdAt: -1 }); // Newest first
        res.status(200).json({ success: true, count: alerts.length, data: alerts });
    } catch (error) {
        console.error('Error fetching alerts:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

export default router;
