import express from 'express';
import { calculateSafePath } from '../controllers/routeController.js';

const router = express.Router();

router.post('/calculate-safe-path', calculateSafePath);

export default router;
