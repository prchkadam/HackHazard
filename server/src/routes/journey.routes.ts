import { Router } from 'express';
import { authMiddleware } from '../utils/jwt';
import { getJourney } from '../controllers/journey.controller';

const router = Router();

router.get('/', authMiddleware, getJourney);

export default router;
