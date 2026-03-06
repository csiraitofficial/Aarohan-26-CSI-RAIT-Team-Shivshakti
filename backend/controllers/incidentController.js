import Incident from "../models/Incident.js";

// Create Incident
export const createIncident = async (req, res) => {
    try {
        const incident = new Incident(req.body);
        await incident.save();
        res.status(201).json({ success: true, data: incident });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// Get all incidents
export const getIncidents = async (req, res) => {
    try {
        const incidents = await Incident.find().populate("zoneId reportedBy assignedTo");
        res.status(200).json({ success: true, count: incidents.length, data: incidents });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// Update incident status
export const updateIncidentStatus = async (req, res) => {
    try {
        const { status, assignedTo } = req.body;
        const incident = await Incident.findByIdAndUpdate(
            req.params.id,
            { status, assignedTo },
            { new: true }
        );
        if (!incident) return res.status(404).json({ success: false, message: "Incident not found" });
        res.status(200).json({ success: true, data: incident });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};
