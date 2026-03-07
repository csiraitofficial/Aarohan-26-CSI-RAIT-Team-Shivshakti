const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../.env') });

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
