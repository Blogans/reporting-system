import express from 'express';
import { testDBConnection } from '../controllers/database.controller';

const router = express.Router();

// Test route
router.get('/db', testDBConnection);

export default router;