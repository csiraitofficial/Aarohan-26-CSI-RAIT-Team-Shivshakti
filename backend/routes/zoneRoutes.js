import express from "express";
import {
    createZone,
    getZones,
    getZoneById,
    updateZoneOccupancy,
} from "../controllers/zoneController.js";

const router = express.Router();

router.post("/", createZone);
router.get("/", getZones);
router.get("/:id", getZoneById);
router.patch("/:id", updateZoneOccupancy);

export default router;
