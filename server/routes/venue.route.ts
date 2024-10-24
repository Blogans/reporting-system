import express from 'express';
import { testDBConnection } from '../controllers/venue.controller';

const router = express.Router();

// Test route
router.get('/test', testDBConnection);

export default router;