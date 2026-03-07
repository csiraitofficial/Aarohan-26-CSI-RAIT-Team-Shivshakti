import mongoose from "mongoose";

const alertSchema = new mongoose.Schema({
    zoneId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Zone",
        required: true,
    },
    alertType: {
        type: String,
    },
    severity: {
        type: String,
        enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
    },
    message: {
        type: String,
    },
    status: {
        type: String,
        enum: ["ACTIVE", "RESOLVED"],
        default: "ACTIVE",
    },
    recommendedActions: [{
        type: String
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model("Alert", alertSchema);
