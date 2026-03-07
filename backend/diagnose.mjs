import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import Zone from './models/Zone.js';
import Alert from './models/Alert.js';
import Incident from './models/Incident.js';

(async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const zone = await Zone.findOne();
        console.log("Found Zone");

        const density = 1.5;
        zone.currentOccupancy = zone.capacity * 1.5;
        zone.riskLevel = "CRITICAL";

        try {
            await zone.save();
            console.log("Zone saved!");
        } catch (e) { console.log("Zone Err:", e.errors); }

        try {
            await Alert.create({ zoneId: zone._id, alertType: "Overcrowding", severity: "CRITICAL", message: "Immediate action.", status: "ACTIVE" });
            console.log("Alert saved!");
        } catch (e) { console.log("Alert Err:", e.errors); }

        try {
            await Incident.create({ zoneId: zone._id, type: "Overcrowding", severity: "CRITICAL", status: "Active", description: "Auto-logged" });
            console.log("Incident saved!");
        } catch (e) { console.log("Incident Err:", e.errors); }

    } catch (err) {
        console.error("Fatal:", err);
    } finally {
        process.exit(0);
    }
})();
