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
            { zoneId, status: 'Active' },
            { upsert: true, new: true }
        );

        // 2. Sync to User model for quick access in profile
        await User.findByIdAndUpdate(userId, { zoneAssigned: zoneId });

        res.status(201).json({ success: true, data: assignment });
    } catch (error) {
        console.error(error);
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
