import express from "express";
import { setupVenue, getMyVenue, deleteVenue } from "../controllers/venueController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/setup", verifyToken, setupVenue);
router.get("/my-venue", verifyToken, getMyVenue);
router.delete("/", verifyToken, deleteVenue);

export default router;
