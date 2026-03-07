import VenueConfig from "../models/VenueConfig.js";

/**
 * Dijkstra's Algorithm implementation for safe pathfinding
 * Graph nodes = zones
 * Graph edges = paths
 * Edge weight = distance + (crowd_density_factor)
 */
export const calculateSafePath = async (req, res) => {
    try {
        const { start, destination } = req.query;

        if (!start || !destination) {
            return res.status(400).json({ success: false, message: "Start and destination are required" });
        }

        const config = await VenueConfig.findOne();
        if (!config) {
            return res.status(404).json({ success: false, message: "Venue configuration not found" });
        }

        const zones = config.zones;
        const paths = config.paths;

        // Build adjacency list
        const graph = {};
        zones.forEach(zone => {
            graph[zone.name] = [];
        });

        paths.forEach(path => {
            const fromZone = zones.find(z => z.name === path.from);
            const toZone = zones.find(z => z.name === path.to);

            if (fromZone && toZone) {
                // Weight formula: weight = distance + (occupancy/capacity * 100)
                const densityFactor = (toZone.currentOccupancy / (toZone.capacity || 1)) * 100;
                const weight = path.distance + densityFactor;

                graph[path.from].push({ node: path.to, weight });
                // Assuming bidirectional paths for simplicity, or add as separate paths in config
                graph[path.to].push({ node: path.from, weight: path.distance + (fromZone.currentOccupancy / (fromZone.capacity || 1)) * 100 });
            }
        });

        // Dijkstra implementation
        const distances = {};
        const prev = {};
        const queue = [];

        Object.keys(graph).forEach(node => {
            distances[node] = Infinity;
            prev[node] = null;
            queue.push(node);
        });

        distances[start] = 0;

        while (queue.length > 0) {
            // Get node with minimum distance
            queue.sort((a, b) => distances[a] - distances[b]);
            const u = queue.shift();

            if (u === destination) break;
            if (distances[u] === Infinity) break;

            graph[u].forEach(neighbor => {
                const alt = distances[u] + neighbor.weight;
                if (alt < distances[neighbor.node]) {
                    distances[neighbor.node] = alt;
                    prev[neighbor.node] = u;
                }
            });
        }

        // Reconstruct path
        const path = [];
        let curr = destination;
        while (curr) {
            path.unshift(curr);
            curr = prev[curr];
        }

        if (path[0] !== start) {
            return res.status(200).json({
                success: false,
                message: "No path found between selected zones",
                path: [],
                distance: 0
            });
        }

        // Calculate estimated time (simple heuristic: 1 unit distance = 1 sec, adjusted by crowd)
        const totalDistance = Math.round(distances[destination]);
        const minutes = Math.floor(totalDistance / 60);
        const seconds = totalDistance % 60;
        const estimatedTime = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;

        // Determine risk level based on the most crowded zone in the path
        let maxDensity = 0;
        path.forEach(zoneName => {
            const zone = zones.find(z => z.name === zoneName);
            if (zone) {
                const density = zone.currentOccupancy / (zone.capacity || 1);
                if (density > maxDensity) maxDensity = density;
            }
        });

        let risk_level = "low";
        if (maxDensity > 0.8) risk_level = "high";
        else if (maxDensity > 0.5) risk_level = "moderate";

        res.status(200).json({
            success: true,
            path,
            distance: totalDistance,
            estimated_time: estimatedTime,
            risk_level
        });

    } catch (error) {
        console.error("Pathfinding Error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const getVenueConfig = async (req, res) => {
    try {
        let config = await VenueConfig.findOne();
        if (!config) {
            // Create a default one if it doesn't exist
            config = new VenueConfig({
                name: "Stadium Alpha",
                zones: [],
                paths: []
            });
            await config.save();
        }
        res.status(200).json({ success: true, config });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const saveVenueConfig = async (req, res) => {
    try {
        const { zones, paths, name } = req.body;
        let config = await VenueConfig.findOne();

        if (!config) {
            config = new VenueConfig({ name, zones, paths });
        } else {
            config.name = name || config.name;
            config.zones = zones;
            config.paths = paths;
        }

        await config.save();
        res.status(200).json({ success: true, config });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const runSimulationTick = async (req, res) => {
    try {
        const { mode } = req.body;
        const config = await VenueConfig.findOne();
        if (!config) return res.status(404).json({ message: "No config found" });

        const logs = [];
        logs.push(`[${new Date().toLocaleTimeString()}] Simulation started in ${mode} mode.`);

        // Simple movement simulation
        config.zones.forEach(zone => {
            let inflow = 0;
            let outflow = 0;

            if (mode === "NORMAL") {
                if (zone.type === "entry") inflow = Math.floor(Math.random() * 10) + 5;
                if (zone.type === "exit") outflow = Math.floor(Math.random() * 8) + 3;
                else outflow = Math.floor(Math.random() * 5) + 2;
            } else if (mode === "SURGE") {
                if (zone.type === "entry") {
                    inflow = Math.floor(Math.random() * 30) + 20;
                    logs.push(`[SYSTEM] Large inflow detected at ${zone.name}`);
                }
                outflow = Math.floor(Math.random() * 10) + 5;
            }

            zone.currentOccupancy = Math.max(0, zone.currentOccupancy + inflow - outflow);

            // Risk level update
            const density = zone.currentOccupancy / (zone.capacity || 1);
            if (density > 0.9) {
                zone.riskLevel = "red";
                logs.push(`[ALERT] ${zone.name} is critically overcrowded!`);
            } else if (density > 0.6) {
                zone.riskLevel = "yellow";
                logs.push(`[WARN] ${zone.name} density increasing.`);
            } else {
                zone.riskLevel = "green";
            }
        });

        await config.save();
        res.status(200).json({ success: true, logs, config });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getNavigationZones = async (req, res) => {
    try {
        const config = await VenueConfig.findOne();
        if (!config) return res.status(404).json({ message: "Not found" });
        res.status(200).json({ success: true, zones: config.zones });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
