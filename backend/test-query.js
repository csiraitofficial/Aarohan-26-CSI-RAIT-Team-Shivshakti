import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Incident from './models/Incident.js';
import Alert from './models/Alert.js';

dotenv.config();

async function runTest() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to DB");

    const user = await User.findOne({ name: 'Nutan Andhale' });
    console.log("User:", user.name, "Zone Assigned:", user.zoneAssigned);

    const query = user && user.zoneAssigned ? { zoneId: user.zoneAssigned } : {};
    console.log("Query:", query);

    const incidents = await Incident.find(query);
    console.log("Found incidents:", incidents.length);
    if (incidents.length > 0) {
        console.log("First incident:", incidents[0].type, incidents[0].status);
    }

    const alerts = await Alert.find(query);
    console.log("Found alerts:", alerts.length);

    process.exit(0);
}

runTest();
