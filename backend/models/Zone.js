import mongoose from "mongoose";

const zoneSchema = new mongoose.Schema(
    {
        zoneName: {
            type: String,
            required: true,
        },
        capacity: {
            type: Number,
            required: true,
        },
        currentOccupancy: {
            type: Number,
            default: 0,
        },
        riskLevel: {
            type: String,
            enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
            default: "LOW",
        },
        entryCount: {
            type: Number,
            default: 0,
        },
        exitCount: {
            type: Number,
            default: 0,
        },
        coordinates: {
            latitude: {
                type: Number,
            },
            longitude: {
                type: Number,
            },
        },
        threshold: {
            medium: {
                type: Number,
            },
            high: {
                type: Number,
            },
            critical: {
                type: Number,
            },
        },
    },
    { timestamps: true }
);

export default mongoose.model("Zone", zoneSchema);
