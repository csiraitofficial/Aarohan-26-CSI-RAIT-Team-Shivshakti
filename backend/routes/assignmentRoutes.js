import express from "express";
import { createAssignment, getAssignments, getUserAssignments } from "../controllers/assignmentController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, createAssignment);
router.get("/", verifyToken, getAssignments);
router.get("/user/:userId", verifyToken, getUserAssignments);

export default router;
