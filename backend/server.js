import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import zoneRoutes from './routes/zoneRoutes.js';
import simulationRoutes from './routes/simulationRoutes.js';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

// Mount routes
app.use('/api/zones', zoneRoutes);
app.use('/api', simulationRoutes);

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
