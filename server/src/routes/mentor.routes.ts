import { Router } from 'express';
import { listMentors, selectMentor } from '../controllers/mentor.controller';
import { authMiddleware } from '../utils/jwt';

const router = Router();

router.get('/', listMentors);
router.post('/select', authMiddleware, selectMentor);

export default router;
