import express from 'express';
import { generateIncidentReport } from '../controllers/report.controller.js';
import { checkPermission } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/incidents', checkPermission('VIEW_INCIDENTS'), generateIncidentReport);

export default router;