import Zone from "../models/Zone.js";
import { calculateDensityAndRisk } from "../services/densityService.js";

// Helper function to get random integer between min and max (inclusive)
const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Start a simulation
export const startSimulation = async (req, res) => {
    try {
        const { zoneId, mode } = req.body;

        if (!zoneId || !mode) {
            return res.status(400).json({ message: "zoneId and mode are required" });
        }

        const zone = await Zone.findById(zoneId);
        if (!zone) {
            return res.status(404).json({ message: "Zone not found" });
        }

        // Clear any existing simulation interval for this zone if we stored references,
        // but building a simple version as requested

        setInterval(async () => {
            try {
                // Find the zone fresh each iteration
                const currentZone = await Zone.findById(zoneId);
                if (!currentZone) return;

                let entry = 0;
                let exit = 0;

                switch (mode) {
                    case "NORMAL":
                        entry = getRandomInt(1, 5);
                        exit = getRandomInt(0, 3);
                        break;
                    case "RISING":
                        entry = getRandomInt(5, 10);
                        exit = getRandomInt(0, 2);
                        break;
                    case "CRITICAL":
                        entry = getRandomInt(10, 20);
                        exit = getRandomInt(0, 1);
                        break;
                    default:
                        console.log(`Unknown mode: ${mode}`);
                        return;
                }

                currentZone.entryCount += entry;
                currentZone.exitCount += exit;
                currentZone.currentOccupancy =
                    currentZone.entryCount - currentZone.exitCount;

                if (currentZone.currentOccupancy < 0) {
                    currentZone.currentOccupancy = 0;
                }

                // Update risk level organically during the simulation
                const { riskLevel } = calculateDensityAndRisk(currentZone);
                currentZone.riskLevel = riskLevel;

                await currentZone.save();

                console.log(
                    `Simulation Update → Zone: ${currentZone.zoneName} Occupancy: ${currentZone.currentOccupancy} Risk: ${currentZone.riskLevel}`
                );
            } catch (err) {
                console.error("Error updating simulation zone:", err);
            }
        }, 5000);

        return res.status(200).json({
            message: "Simulation started",
            mode: mode,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error" });
    }
};
