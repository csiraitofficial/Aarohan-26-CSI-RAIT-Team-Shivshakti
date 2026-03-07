import express from "express";
import { createAssignment, getAssignments, getUserAssignments, getAuthorities, respondAssignment } from "../controllers/assignmentController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/authorities", verifyToken, getAuthorities);
router.post("/", verifyToken, createAssignment);
router.post("/respond", verifyToken, respondAssignment);
router.get("/", verifyToken, getAssignments);
router.get("/user/:userId", verifyToken, getUserAssignments);

export default router;
