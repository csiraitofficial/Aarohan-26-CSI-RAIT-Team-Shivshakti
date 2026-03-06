import Zone from "../models/Zone.js";
import { calculateDensityAndRisk } from "../services/densityService.js";

// Create a new zone
export const createZone = async (req, res) => {
    try {
        const { zoneName, capacity, coordinates, threshold } = req.body;

        const zone = new Zone({
            zoneName,
            capacity,
            coordinates,
            threshold,
            currentOccupancy: 0,
            entryCount: 0,
            exitCount: 0,
            riskLevel: "LOW",
        });

        await zone.save();
        return res.status(201).json(zone);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error" });
    }
};

// Fetch all zones
export const getZones = async (req, res) => {
    try {
        const zones = await Zone.find();
        return res.status(200).json(zones);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error" });
    }
};

// Fetch zone by ID
export const getZoneById = async (req, res) => {
    try {
        const zone = await Zone.findById(req.params.id);
        if (!zone) {
            return res.status(404).json({ message: "Zone not found" });
        }
        return res.status(200).json(zone);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error" });
    }
};

// Update zone occupancy
export const updateZoneOccupancy = async (req, res) => {
    try {
        const { entryCount, exitCount } = req.body;

        const zone = await Zone.findById(req.params.id);
        if (!zone) {
            return res.status(404).json({ message: "Zone not found" });
        }

        zone.entryCount += entryCount || 0;
        zone.exitCount += exitCount || 0;

        zone.currentOccupancy = zone.entryCount - zone.exitCount;

        if (zone.currentOccupancy < 0) {
            zone.currentOccupancy = 0;
        }

        const { riskLevel } = calculateDensityAndRisk(zone);
        zone.riskLevel = riskLevel;

        await zone.save();
        return res.status(200).json(zone);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error" });
    }
};
