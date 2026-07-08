import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import authRoutes from './routes/auth.routes';
import mentorRoutes from './routes/mentor.routes';
import userRoutes from './routes/user.routes';
import aiRoutes from './routes/ai.routes';
import { errorHandler } from './middleware/error.middleware';
const app = express();
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.get('/health', (_req, res) => {
    res.status(200).json({ success: true, message: 'Avati API is running' });
});
app.use('/auth', authRoutes);
app.use('/mentors', mentorRoutes);
app.use('/mentor', mentorRoutes);
app.use('/user', userRoutes);
app.use('/api', aiRoutes);
app.use(errorHandler);
export default app;
//# sourceMappingURL=app.js.map