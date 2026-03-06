import Zone from "../models/Zone.js";
import Alert from "../models/Alert.js";
import Venue from "../models/Venue.js";
import { calculateDensityAndRisk } from "../services/densityService.js";

// Helper function to get random integer between min and max (inclusive)
const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Start a simulation
export const startSimulation = async (req, res) => {
    try {
        const { mode } = req.body;

        if (!mode) {
            return res.status(400).json({ message: "Mode is required" });
        }

        const zones = await Zone.find();
        if (!zones || zones.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No zones found to simulate. Setup venue first.",
                alertsGenerated: 0
            });
        }

        // Update Venue Simulation Mode (Global for now)
        await Venue.updateMany({}, { simulationMode: mode });

        let totalGeneratedAlerts = 0;

        // Loop through all zones and apply simulation logic
        for (let zone of zones) {
            let entry = 0;
            let exit = 0;

            switch (mode) {
                case "NORMAL":
                    entry = getRandomInt(5, 15);
                    exit = getRandomInt(3, 10);
                    break;
                case "SURGE":
                    entry = getRandomInt(30, 80);
                    exit = getRandomInt(10, 25);
                    break;
                case "EMERGENCY":
                    entry = getRandomInt(100, 250);
                    exit = getRandomInt(5, 15);
                    break;
                default:
                    return res.status(400).json({ message: `Unknown mode: ${mode}` });
            }

            zone.entryCount = entry; // We store the RATE for this tick, not total sum, so the frontend can read "Entry Rate"
            zone.exitCount = exit;

            // Update Occupancy (Allow exceeding capacity for Surge/Emergency states)
            zone.currentOccupancy = Math.max(0, zone.currentOccupancy + entry - exit);
            // Optionally cap at 150% of capacity to prevent infinite growth
            if (zone.currentOccupancy > zone.capacity * 1.5) {
                zone.currentOccupancy = Math.round(zone.capacity * 1.5);
            }

            // Density Math
            const density = zone.capacity > 0 ? (zone.currentOccupancy / zone.capacity) : 0;

            let riskLevel = "LOW";
            if (density > 0.9) riskLevel = "CRITICAL";
            else if (density > 0.75) riskLevel = "HIGH";
            else if (density > 0.5) riskLevel = "MEDIUM";

            zone.riskLevel = riskLevel;

            // Auto-Generate Alerts
            // 1. Density Alerts
            if (density > 0.75) {
                const severity = density > 0.9 ? "CRITICAL" : "HIGH";
                const message = density > 0.9 ? "Immediate action required. Zone overcrowded." : "Crowd density increasing rapidly.";
                const alertType = density > 0.9 ? "Overcrowding" : "High Density";

                // Check if ACTIVE alert already exists for this zone and type
                const existingAlert = await Alert.findOne({ zoneId: zone._id, alertType: alertType, status: "ACTIVE" });

                if (!existingAlert) {
                    await Alert.create({
                        zoneId: zone._id,
                        alertType: alertType,
                        severity: severity,
                        message: message,
                        status: "ACTIVE"
                    });
                    totalGeneratedAlerts++;
                }
            }

            // 2. Surge Alerts
            const netFlow = entry - exit;
            if (netFlow > 30) {
                const existingSurge = await Alert.findOne({ zoneId: zone._id, alertType: "Surge", status: "ACTIVE" });
                if (!existingSurge) {
                    await Alert.create({
                        zoneId: zone._id,
                        alertType: "Surge",
                        severity: "WARNING",
                        message: `Rapid crowd growth detected (+${netFlow} net flow)`,
                        status: "ACTIVE"
                    });
                    totalGeneratedAlerts++;
                }
            }

            await zone.save();
        }

        console.log(`Global Simulation Tick → Mode: ${mode} | Zones Updated: ${zones.length} | New Alerts: ${totalGeneratedAlerts}`);

        return res.status(200).json({
            message: "Global simulation tick applied",
            mode: mode,
            success: true,
            alertsGenerated: totalGeneratedAlerts
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error" });
    }
};
