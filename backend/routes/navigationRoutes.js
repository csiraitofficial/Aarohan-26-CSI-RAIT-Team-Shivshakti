import express from 'express';
import {
    calculateSafePath,
    getVenueConfig,
    saveVenueConfig,
    runSimulationTick,
    getNavigationZones
} from '../controllers/navigationController.js';
import Zone from '../models/Zone.js';

const router = express.Router();

router.get('/route', calculateSafePath);
router.get('/config', getVenueConfig);
router.post('/config', saveVenueConfig);
router.post('/simulate', runSimulationTick);
router.get('/zones', getNavigationZones);

// @desc    Calculate a safe route using real Zone data from DB
// @route   POST /api/navigation/safe-route
// @access  Public
router.post('/safe-route', async (req, res) => {
    try {
        const { startZoneId, endZoneId } = req.body;

        if (!startZoneId || !endZoneId) {
            return res.status(400).json({ success: false, message: 'Start and end zone IDs are required' });
        }

        // Fetch all zones from DB (real admin-created data)
        const zones = await Zone.find();
        if (!zones || zones.length === 0) {
            return res.status(404).json({ success: false, message: 'No zones configured by admin' });
        }

        const startZone = zones.find(z => z._id.toString() === startZoneId);
        const endZone = zones.find(z => z._id.toString() === endZoneId);

        if (!startZone || !endZone) {
            return res.status(404).json({ success: false, message: 'Start or end zone not found' });
        }

        // Build zone data with risk analysis
        const zoneData = zones.map(z => {
            const density = z.capacity > 0 ? (z.currentOccupancy / z.capacity) : 0;
            let riskLevel = 'LOW';
            if (density >= 0.9) riskLevel = 'CRITICAL';
            else if (density >= 0.8) riskLevel = 'HIGH';
            else if (density >= 0.5) riskLevel = 'MODERATE';

            return {
                _id: z._id.toString(),
                name: z.zoneName,
                capacity: z.capacity,
                currentOccupancy: z.currentOccupancy,
                density: Math.round(density * 100),
                riskLevel,
                isBlocked: density >= 0.8 // >80% = avoid
            };
        });

        // Build a fully connected graph with weighted edges
        // Weight = base cost + density penalty (heavy penalty for >80%)
        const graph = {};
        zoneData.forEach(z => {
            graph[z._id] = [];
        });

        // Connect every zone to every other zone (simplified venue model)
        // Weight is based on destination zone's density
        for (let i = 0; i < zoneData.length; i++) {
            for (let j = 0; j < zoneData.length; j++) {
                if (i !== j) {
                    const dest = zoneData[j];
                    // Base cost + heavy penalty for congested zones
                    let weight = 10; // base traversal cost
                    if (dest.density >= 90) {
                        weight += 10000; // Essentially block CRITICAL zones
                    } else if (dest.density >= 80) {
                        weight += 5000; // Heavy penalty for HIGH risk
                    } else if (dest.density >= 50) {
                        weight += dest.density * 2; // Moderate penalty
                    } else {
                        weight += dest.density * 0.5; // Low penalty for safe zones
                    }
                    graph[zoneData[i]._id].push({ node: dest._id, weight });
                }
            }
        }

        // Dijkstra's Algorithm
        const distances = {};
        const prev = {};
        const queue = new Set();

        Object.keys(graph).forEach(node => {
            distances[node] = Infinity;
            prev[node] = null;
            queue.add(node);
        });

        distances[startZoneId] = 0;

        while (queue.size > 0) {
            // Get node with minimum distance
            let u = null;
            let minDist = Infinity;
            queue.forEach(node => {
                if (distances[node] < minDist) {
                    minDist = distances[node];
                    u = node;
                }
            });

            if (u === null || u === endZoneId) break;
            queue.delete(u);

            (graph[u] || []).forEach(neighbor => {
                if (queue.has(neighbor.node)) {
                    const alt = distances[u] + neighbor.weight;
                    if (alt < distances[neighbor.node]) {
                        distances[neighbor.node] = alt;
                        prev[neighbor.node] = u;
                    }
                }
            });
        }

        // Reconstruct path
        const path = [];
        let curr = endZoneId;
        while (curr) {
            path.unshift(curr);
            curr = prev[curr];
        }

        if (path[0] !== startZoneId) {
            return res.status(200).json({
                success: false,
                message: 'No safe route found between selected zones',
                safetyScore: 0,
                path: [],
                instructions: []
            });
        }

        // Build route details with zone info
        const routePath = path.map(id => zoneData.find(z => z._id === id));

        // Calculate safety score (100 - max density in path)
        const maxDensityInPath = Math.max(...routePath.map(z => z.density));
        const safetyScore = Math.max(0, 100 - maxDensityInPath);

        // Find avoided zones and why
        const avoidedZones = zoneData.filter(z =>
            z.isBlocked && !path.includes(z._id)
        );

        // Generate turn-by-turn instructions
        const instructions = [];
        instructions.push({
            step: 1,
            action: 'START',
            zone: routePath[0].name,
            detail: `Begin at ${routePath[0].name} (${routePath[0].density}% occupancy, ${routePath[0].riskLevel} risk)`
        });

        for (let i = 1; i < routePath.length - 1; i++) {
            const zone = routePath[i];
            instructions.push({
                step: i + 1,
                action: 'PROCEED',
                zone: zone.name,
                detail: `Move through ${zone.name} — ${zone.density}% occupancy (${zone.riskLevel} risk). ${zone.density < 50 ? 'This area is safe for transit.' : 'Exercise caution, moderate crowd levels.'}`
            });
        }

        if (routePath.length > 1) {
            const dest = routePath[routePath.length - 1];
            instructions.push({
                step: routePath.length,
                action: 'ARRIVE',
                zone: dest.name,
                detail: `Arrive at ${dest.name} (${dest.density}% occupancy, ${dest.riskLevel} risk)`
            });
        }

        // Add avoidance explanations
        avoidedZones.forEach(z => {
            instructions.push({
                step: null,
                action: 'AVOIDED',
                zone: z.name,
                detail: `⚠️ ${z.name} was bypassed — ${z.density}% occupancy (${z.riskLevel} risk, exceeds 80% safety threshold)`
            });
        });

        res.status(200).json({
            success: true,
            safetyScore,
            riskLevel: safetyScore >= 80 ? 'LOW' : safetyScore >= 50 ? 'MODERATE' : 'HIGH',
            path: routePath,
            avoidedZones,
            instructions,
            totalStops: routePath.length,
            estimatedTime: `${routePath.length * 2} min`
        });

    } catch (error) {
        console.error('Safe Route Error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

export default router;
