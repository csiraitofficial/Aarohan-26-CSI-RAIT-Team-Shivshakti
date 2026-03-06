import express from "express";
import { createIncident, getIncidents, updateIncidentStatus } from "../controllers/incidentController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, createIncident);
router.get("/", verifyToken, getIncidents);
router.patch("/:id", verifyToken, updateIncidentStatus);

export default router;
