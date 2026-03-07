import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Incident from './models/Incident.js';
import Alert from './models/Alert.js';

dotenv.config();

async function runTest() {
    await mongoose.connect(process.env.MONGO_URI);

    // Simulate the route logic:
    const user = await User.findOne({ name: 'Nutan Andhale' });
    const query = user && user.zoneAssigned ? { zoneId: user.zoneAssigned } : {};

    const dbAlerts = await Alert.find(query).populate('zoneId').sort({ createdAt: -1 });
    const dbIncidents = await Incident.find(query).populate('zoneId').sort({ createdAt: -1 });

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

    console.log("Mapped incident status:");
    console.log(formattedIncidents.map(i => i.status));

    const formattedAlerts = dbAlerts.map(a => ({
        status: a.status === 'RESOLVED' ? 'RESOLVED' : 'OPEN'
    }));

    const activeA = formattedAlerts.filter(a => a.status !== 'RESOLVED').length;
    const activeI = formattedIncidents.filter(a => a.status !== 'RESOLVED').length;

    console.log(`Active Alerts: ${activeA}, Active Incidents: ${activeI}`);
    process.exit(0);
}

runTest();
