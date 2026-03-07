import mongoose from 'mongoose';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import User from './models/User.js';

dotenv.config();

async function runTest() {
    await mongoose.connect(process.env.MONGO_URI);

    const user = await User.findOne({ name: 'Nutan Andhale' });
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '30d' });
    console.log("Token:", token);

    const res = await fetch('http://localhost:5000/api/authority/alerts', {
        headers: { 'Authorization': `Bearer ${token}` }
    });

    const data = await res.json();
    console.log("Status:", res.status);
    console.log("Response:", JSON.stringify(data).substring(0, 1000));

    if (data.data) {
        const active = data.data.filter(a => a.status !== 'RESOLVED').length;
        console.log("Active alerts count frontend logic:", active);
    }

    process.exit(0);
}

runTest();
