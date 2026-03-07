import express from "express";
import { register, login, getMe, updateNodeSetup, getAllUsers } from "../controllers/authController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", verifyToken, getMe);
router.patch("/node-setup", verifyToken, updateNodeSetup);
router.get("/users", verifyToken, getAllUsers);

export default router;
