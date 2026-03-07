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
        const user = await User.findById(req.user.id);
        let query = {};

        // If authority has a zone assigned, only show zones from that same venue
        if (user && user.zoneAssigned) {
            const assignedZone = await Zone.findById(user.zoneAssigned);
            if (assignedZone && assignedZone.venueId) {
                query = { venueId: assignedZone.venueId };
            }
        }

        const zones = await Zone.find(query);
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
            recommendedActions: a.recommendedActions,
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

// @desc    Resolve a single alert
// @route   PATCH /api/authority/alerts/:id/resolve
// @access  Private/Authority
router.patch('/alerts/:id/resolve', verifyToken, verifyAuthority, async (req, res) => {
    try {
        const alert = await Alert.findByIdAndUpdate(
            req.params.id,
            { status: 'RESOLVED' },
            { new: true }
        );
        if (!alert) return res.status(404).json({ success: false, message: 'Alert not found' });
        res.status(200).json({ success: true, data: alert });
    } catch (error) {
        console.error('Error resolving alert:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

// @desc    Resolve a single incident
// @route   PATCH /api/authority/incidents/:id/resolve
// @access  Private/Authority
router.patch('/incidents/:id/resolve', verifyToken, verifyAuthority, async (req, res) => {
    try {
        const incident = await Incident.findByIdAndUpdate(
            req.params.id,
            { status: 'Resolved' },
            { new: true }
        );
        if (!incident) return res.status(404).json({ success: false, message: 'Incident not found' });
        res.status(200).json({ success: true, data: incident });
    } catch (error) {
        console.error('Error resolving incident:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

// @desc    Resolve ALL active alerts & incidents for this authority's venue
// @route   POST /api/authority/resolve-all
// @access  Private/Authority
router.post('/resolve-all', verifyToken, verifyAuthority, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        let zoneFilter = {};

        if (user && user.zoneAssigned) {
            const assignedZone = await Zone.findById(user.zoneAssigned);
            if (assignedZone && assignedZone.venueId) {
                const venueZones = await Zone.find({ venueId: assignedZone.venueId }).select('_id');
                const zoneIds = venueZones.map(z => z._id);
                zoneFilter = { zoneId: { $in: zoneIds } };
            }
        }

        const alertResult = await Alert.updateMany(
            { ...zoneFilter, status: 'ACTIVE' },
            { status: 'RESOLVED' }
        );
        const incidentResult = await Incident.updateMany(
            { ...zoneFilter, status: { $ne: 'Resolved' } },
            { status: 'Resolved' }
        );

        res.status(200).json({
            success: true,
            alertsResolved: alertResult.modifiedCount,
            incidentsResolved: incidentResult.modifiedCount
        });
    } catch (error) {
        console.error('Error resolving all:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

export default router;
