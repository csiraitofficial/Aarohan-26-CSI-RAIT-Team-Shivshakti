import Zone from "../models/Zone.js";
import Alert from "../models/Alert.js";
import Venue from "../models/Venue.js";
import { calculateDensityAndRisk } from "../services/densityService.js";
import Incident from "../models/Incident.js";


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

            // Randomly force an Overcrowding scenario for demonstration purposes (50% chance per tick to test buzzer sooner)
            // OR if SURGE/EMERGENCY is clicked, instantly overcrowd to guarantee the buzzer fires.
            const forceOvercrowding = Math.random() < 0.50 || mode === "SURGE" || mode === "EMERGENCY";
            if (forceOvercrowding) {
                console.log(`[SIM] Forcing artificial surge in Zone: ${zone.zoneName}`);
                entry = zone.capacity * 2; // Massive influx to guarantee > 100% capacity
                exit = 0;              // Gate blocked
            }

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
                        severity: "HIGH",
                        message: `Rapid crowd growth detected (+${netFlow} net flow)`,
                        status: "ACTIVE"
                    });
                    totalGeneratedAlerts++;
                }
            }

            // 3. Auto-log Incidents for extreme overcrowding (> 100% capacity)
            if (density > 1.0) {
                const existingIncident = await Incident.findOne({
                    zoneId: zone._id,
                    type: "Overcrowding",
                    status: { $in: ["Active", "Dispatched", "Monitoring"] }
                });

                if (!existingIncident) {
                    await Incident.create({
                        zoneId: zone._id,
                        type: "Overcrowding",
                        severity: density > 1.1 ? "CRITICAL" : "HIGH",
                        status: "Active",
                        description: `Auto-logged: Sector density reached ${(density * 100).toFixed(0)}% of max capacity.`,
                    });
                } else if (density > 1.1 && existingIncident.severity !== "CRITICAL") {
                    // Escalate Severity if conditions worsen
                    existingIncident.severity = "CRITICAL";
                    existingIncident.description = `Escalated: Sector density reached ${(density * 100).toFixed(0)}%.`;
                    await existingIncident.save();
                }
            } else if (density <= 1.0) {
                // Auto-resolve overcrowding incidents if crowd clears
                const activeIncidents = await Incident.find({
                    zoneId: zone._id,
                    type: "Overcrowding",
                    status: { $in: ["Active", "Dispatched", "Monitoring"] }
                });

                for (let inc of activeIncidents) {
                    inc.status = "Resolved";
                    inc.description = `${inc.description} | Auto-resolved: Crowd density dropped back to safe levels (${(density * 100).toFixed(0)}%).`;
                    await inc.save();
                }
            }

            await Zone.updateOne(
                { _id: zone._id },
                {
                    $set: {
                        entryCount: zone.entryCount,
                        exitCount: zone.exitCount,
                        currentOccupancy: zone.currentOccupancy,
                        riskLevel: zone.riskLevel
                    }
                }
            );
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
        return res.status(500).json({ message: "Server Error", error: error.stack });
    }
};
