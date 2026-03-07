import Assignment from "../models/Assignment.js";
import User from "../models/User.js";

// Get all users with role 'authority'
export const getAuthorities = async (req, res) => {
    try {
        const authorities = await User.find({ role: 'authority' }).select("-password");
        res.status(200).json({ success: true, count: authorities.length, data: authorities });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// Create Assignment
export const createAssignment = async (req, res) => {
    try {
        const { userId, zoneId } = req.body;

        // 1. Create or Update Assignment record
        const assignment = await Assignment.findOneAndUpdate(
            { userId },
            { zoneId, status: 'Pending' },
            { upsert: true, new: true }
        );

        // 2. Sync to User model for quick access in profile
        await User.findByIdAndUpdate(userId, {
            zoneAssigned: zoneId,
            assignmentStatus: 'Pending'
        });

        res.status(201).json({ success: true, data: assignment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// Authority responds to assignment request
export const respondAssignment = async (req, res) => {
    try {
        const { status } = req.body; // 'Accepted' or 'Rejected'
        const userId = req.user.id; // From authMiddleware

        if (!['Accepted', 'Rejected'].includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        const updates = { assignmentStatus: status };

        if (status === 'Accepted') {
            await Assignment.findOneAndUpdate(
                { userId },
                { status: 'Active' }
            );
        } else if (status === 'Rejected') {
            updates.zoneAssigned = null;
            // Also update the Assignment record to reflect it was rejected/inactive
            await Assignment.findOneAndUpdate(
                { userId },
                { status: 'Rejected' }
            );
        }

        const user = await User.findByIdAndUpdate(userId, updates, { new: true }).populate('zoneAssigned');

        res.status(200).json({ success: true, user });
    } catch (error) {
        console.error("Respond assignment error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};
// Get all assignments
export const getAssignments = async (req, res) => {
    try {
        const assignments = await Assignment.find().populate("userId zoneId");
        res.status(200).json({ success: true, count: assignments.length, data: assignments });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// Get assignments for a specific user
export const getUserAssignments = async (req, res) => {
    try {
        const assignments = await Assignment.find({ userId: req.params.userId }).populate("zoneId");
        res.status(200).json({ success: true, count: assignments.length, data: assignments });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};
