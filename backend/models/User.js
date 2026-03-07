import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["public", "authority", "admin"],
      default: "public",
    },
    zoneAssigned: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Zone",
      required: false,
    },
    isNodeSetup: {
      type: Boolean,
      default: false,
    },
    nodeDetails: {
      type: Object,
      default: {},
    },
    assignmentStatus: {
      type: String,
      enum: ["None", "Pending", "Accepted", "Rejected"],
      default: "None",
    },
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "APPROVED", // Default to APPROVED for now so new signups work unless user wants it otherwise
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
