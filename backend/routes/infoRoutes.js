import express from 'express';
import { getFAQs, getSystemStatus } from '../controllers/infoController.js';

const router = express.Router();

router.get('/faqs', getFAQs);
router.get('/system-status', getSystemStatus);

export default router;
