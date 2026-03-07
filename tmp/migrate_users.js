import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../backend/.env') });

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://Foodora123:Sidd2005@foodora.aetx2nt.mongodb.net/troublefree_ai?retryWrites=true&w=majority';

async function migrate() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));

        const res = await User.updateMany(
            { role: 'authority' },
            { $set: { status: 'APPROVED' } }
        );

        console.log(`Updated ${res.modifiedCount} users to APPROVED`);
        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
}

migrate();
