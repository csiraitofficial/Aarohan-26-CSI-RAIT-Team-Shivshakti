import express from "express";
import { startSimulation } from "../controllers/simulationController.js";

const router = express.Router();

router.post("/simulate", startSimulation);

export default router;
