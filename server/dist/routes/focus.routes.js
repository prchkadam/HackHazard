import { Router } from 'express';
import { authMiddleware } from '../utils/jwt';
import { createSession, updateSession, submitReflection, getHistory, } from '../controllers/focus.controller';
const router = Router();
router.post('/session', authMiddleware, createSession);
router.patch('/session/:id', authMiddleware, updateSession);
router.post('/session/:id/reflection', authMiddleware, submitReflection);
router.get('/history', authMiddleware, getHistory);
export default router;
//# sourceMappingURL=focus.routes.js.map