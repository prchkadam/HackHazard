import { Router } from 'express';
import { getProfile, patchProfile } from '../controllers/user.controller';
import { authMiddleware } from '../utils/jwt';
const router = Router();
router.get('/profile', authMiddleware, getProfile);
router.patch('/profile', authMiddleware, patchProfile);
export default router;
//# sourceMappingURL=user.routes.js.map