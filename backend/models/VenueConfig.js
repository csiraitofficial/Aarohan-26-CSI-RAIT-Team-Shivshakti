import mongoose from "mongoose";

const venueConfigSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            default: "Default Venue"
        },
        zones: [
            {
                name: { type: String, required: true },
                type: {
                    type: String,
                    enum: ["entry", "exit", "zone", "corridor"],
                    default: "zone"
                },
                capacity: { type: Number, default: 100 },
                currentOccupancy: { type: Number, default: 0 },
                coordinates: {
                    x: { type: Number, default: 0 },
                    y: { type: Number, default: 0 }
                },
                riskLevel: {
                    type: String,
                    enum: ["green", "yellow", "red"],
                    default: "green"
                },
                entryCount: { type: Number, default: 0 },
                exitCount: { type: Number, default: 0 }
            }
        ],
        paths: [
            {
                from: { type: String, required: true },
                to: { type: String, required: true },
                distance: { type: Number, default: 10 },
                maxFlow: { type: Number, default: 50 }
            }
        ]
    },
    { timestamps: true }
);

export default mongoose.model("VenueConfig", venueConfigSchema);
