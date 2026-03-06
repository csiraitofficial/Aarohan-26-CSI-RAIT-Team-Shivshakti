import mongoose from "mongoose";

const venueSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        location: {
            type: String,
            required: true,
        },
        adminId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true, // One admin per venue for the demo
        },
        simulationMode: {
            type: String,
            enum: ["NORMAL", "SURGE", "EMERGENCY"],
            default: "NORMAL",
        },
    },
    { timestamps: true }
);

export default mongoose.model("Venue", venueSchema);
