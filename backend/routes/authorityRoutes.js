import express from 'express';
import { verifyToken, verifyAuthority } from '../middleware/authMiddleware.js';
import Zone from '../models/Zone.js';
import Alert from '../models/Alert.js';
import Incident from '../models/Incident.js';
import User from '../models/User.js';

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

// @desc    Get recent alerts & incidents for authority's sector (or all if unassigned)
// @route   GET /api/authority/alerts
// @access  Private/Authority
router.get('/alerts', verifyToken, verifyAuthority, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const query = user && user.zoneAssigned ? { zoneId: user.zoneAssigned } : {};

        // 1. Fetch Alerts
        const dbAlerts = await Alert.find(query).populate('zoneId').sort({ createdAt: -1 });

        // 2. Fetch Incidents
        const dbIncidents = await Incident.find(query).populate('zoneId').sort({ createdAt: -1 });

        const formattedAlerts = dbAlerts.map(a => ({
            _id: a._id.toString(),
            zoneId: a.zoneId ? a.zoneId._id.toString() : null,
            zoneName: a.zoneId ? a.zoneId.zoneName : 'Unknown Zone',
            alertType: a.alertType,
            severity: a.severity,
            message: a.message,
            status: a.status === 'RESOLVED' ? 'RESOLVED' : 'OPEN', // Map ACTIVE -> OPEN for UI
            createdAt: a.createdAt,
            source: 'Alert'
        }));

        const formattedIncidents = dbIncidents.map(inc => {
            let mappedStatus = 'OPEN';
            if (inc.status === 'Resolved') mappedStatus = 'RESOLVED';
            else if (inc.status === 'Dispatched' || inc.status === 'Monitoring') mappedStatus = 'IN-PROGRESS';

            return {
                _id: inc._id.toString(),
                zoneId: inc.zoneId ? inc.zoneId._id.toString() : null,
                zoneName: inc.zoneId ? inc.zoneId.zoneName : 'Unknown Zone',
                alertType: inc.type.toUpperCase(),
                severity: inc.severity,
                message: `[INCIDENT] ${inc.description}`,
                status: mappedStatus,
                createdAt: inc.createdAt,
                incidentId: inc.incidentId,
                source: 'Incident'
            };
        });

        const combined = [...formattedAlerts, ...formattedIncidents].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        console.log(`[ALERTS DEBUG] User: ${user.name}, ZoneAssigned: ${user.zoneAssigned}`);
        console.log(`[ALERTS DEBUG] dbAlerts: ${dbAlerts.length}, dbIncidents: ${dbIncidents.length}`);
        console.log(`[ALERTS DEBUG] Final Combined Length: ${combined.length}`);

        res.status(200).json({ success: true, count: combined.length, data: combined });
    } catch (error) {
        console.error('Error fetching alerts:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

export default router;
