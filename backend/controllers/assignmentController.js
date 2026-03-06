import Assignment from "../models/Assignment.js";

// Create Assignment
export const createAssignment = async (req, res) => {
    try {
        const assignment = new Assignment(req.body);
        await assignment.save();
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
