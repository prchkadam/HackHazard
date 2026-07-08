import { Router } from 'express';
import { authMiddleware } from '../utils/jwt';
import { rateLimiter } from '../middleware/rateLimiter';
import { handleChat } from '../controllers/ai.controller';

const router = Router();

router.post('/chat', authMiddleware, rateLimiter, handleChat);

export default router;
