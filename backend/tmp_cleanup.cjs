const mongoose = require('mongoose');

async function cleanup() {
    try {
        await mongoose.connect('mongodb+srv://Foodora123:Sidd2005@foodora.aetx2nt.mongodb.net/troublefree_ai?retryWrites=true&w=majority');
        console.log('Connected to MongoDB');

        const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));
        const Assignment = mongoose.model('Assignment', new mongoose.Schema({}, { strict: false }));

        // 1. Reset Nutan so Admin can re-assign fresh
        const res1 = await User.updateOne(
            { name: 'Nutan Andhale' },
            { assignmentStatus: 'None', zoneAssigned: null, status: 'APPROVED' }
        );
        console.log('Nutan reset:', res1.modifiedCount);

        // 2. Remove stale assignments for Nutan
        const nutan = await User.findOne({ name: 'Nutan Andhale' });
        if (nutan) {
            const res2 = await Assignment.deleteMany({ userId: nutan._id });
            console.log('Stale assignments deleted:', res2.deletedCount);
        }

        // 3. Approve all authority users
        const res3 = await User.updateMany({ role: 'authority' }, { status: 'APPROVED' });
        console.log('Authorities approved:', res3.modifiedCount);

        process.exit(0);
    } catch (err) {
        console.error('Cleanup failed:', err.message);
        process.exit(1);
    }
}

cleanup();
