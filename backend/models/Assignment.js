import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        zoneId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Zone",
            required: true,
        },
        shift: {
            type: String,
            enum: ["Morning", "Evening", "Night", "Full Event"],
            default: "Full Event"
        },
        status: {
            type: String,
            enum: ["Pending", "Active", "Inactive", "On Break", "Rejected"],
            default: "Pending",
        }
    },
    { timestamps: true }
);

export default mongoose.model("Assignment", assignmentSchema);
