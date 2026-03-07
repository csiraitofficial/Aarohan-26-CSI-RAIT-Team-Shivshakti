import express from 'express';
import {
    calculateSafePath,
    getVenueConfig,
    saveVenueConfig,
    runSimulationTick,
    getNavigationZones
} from '../controllers/navigationController.js';

const router = express.Router();

router.get('/route', calculateSafePath);
router.get('/config', getVenueConfig);
router.post('/config', saveVenueConfig);
router.post('/simulate', runSimulationTick);
router.get('/zones', getNavigationZones);

export default router;
