import mongoose from "mongoose";

const incidentSchema = new mongoose.Schema(
    {
        incidentId: {
            type: String,
            required: true,
            unique: true,
            default: () => `INC-${Math.floor(1000 + Math.random() * 9000)}`
        },
        zoneId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Zone",
            required: true,
        },
        type: {
            type: String,
            required: true,
            enum: ["Overcrowding", "Gate Congestion", "Medical Emergency", "Stampede Risk", "Fire Hazard", "Technical Issue"],
        },
        severity: {
            type: String,
            required: true,
            enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
        },
        status: {
            type: String,
            required: true,
            enum: ["Active", "Dispatched", "Monitoring", "Resolved"],
            default: "Active",
        },
        reportedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        description: {
            type: String,
            required: true,
        },
        locationNotes: {
            type: String,
        }
    },
    { timestamps: true }
);

export default mongoose.model("Incident", incidentSchema);
