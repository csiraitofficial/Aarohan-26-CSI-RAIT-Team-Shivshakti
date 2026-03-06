import express from "express";
import { setupVenue, getMyVenue } from "../controllers/venueController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/setup", verifyToken, setupVenue);
router.get("/my-venue", verifyToken, getMyVenue);

export default router;
