import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import zoneRoutes from './routes/zoneRoutes.js';
import simulationRoutes from './routes/simulationRoutes.js';
import authorityRoutes from './routes/authorityRoutes.js';
import routeRoutes from './routes/routeRoutes.js';
import infoRoutes from './routes/infoRoutes.js';
import ticketRoutes from './routes/ticketRoutes.js';
import authRoutes from './routes/authRoutes.js';
import venueRoutes from './routes/venueRoutes.js';
import assignmentRoutes from './routes/assignmentRoutes.js';
import incidentRoutes from './routes/incidentRoutes.js';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

// Request logger
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Mount routes
app.use('/api/zones', zoneRoutes);
app.use('/api', simulationRoutes);
app.use('/api/authority', authorityRoutes);
app.use('/api/routes', routeRoutes);
app.use('/api/info', infoRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/venues', venueRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/incidents', incidentRoutes);

// Test route
app.get('/api/test', (req, res) => {
    res.json({
        message: "Backend is running successfully"
    });
});

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});
