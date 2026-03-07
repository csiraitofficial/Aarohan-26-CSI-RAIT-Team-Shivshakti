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
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
