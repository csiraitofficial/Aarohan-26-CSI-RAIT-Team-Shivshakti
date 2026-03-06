import mongoose from "mongoose";

const historicalDensitySchema = new mongoose.Schema({
    zoneId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Zone",
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
    occupancy: {
        type: Number,
    },
    riskScore: {
        type: Number,
    },
});

export default mongoose.model("HistoricalDensity", historicalDensitySchema);
