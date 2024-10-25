// routes/auth.route.ts
import { Router } from 'express';
import { Request, Response, NextFunction } from 'express';
const router = Router();

type AsyncRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

import { register, login, logout, checkAuth } from '../controllers/auth.controller';

router.post('/register', register as AsyncRequestHandler);
router.post('/login', login as AsyncRequestHandler);
router.post('/logout', logout as AsyncRequestHandler);
router.get('/check', checkAuth as AsyncRequestHandler);

export default router;