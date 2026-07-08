import { Router } from 'express';
import { googleLogin, guestLogin, getMe, logout } from '../controllers/auth.controller';
import { authMiddleware } from '../utils/jwt';
const router = Router();
router.post('/google', googleLogin);
router.post('/guest', guestLogin);
router.get('/me', authMiddleware, getMe);
router.post('/logout', authMiddleware, logout);
export default router;
//# sourceMappingURL=auth.routes.js.map