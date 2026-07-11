import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import authRoutes from './routes/auth.routes';
import mentorRoutes from './routes/mentor.routes';
import userRoutes from './routes/user.routes';
import aiRoutes from './routes/ai.routes';
import focusRoutes from './routes/focus.routes';
import journeyRoutes from './routes/journey.routes';
import { errorHandler } from './middleware/error.middleware';
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

import { verifyConnection } from './database/neo4j';

app.get('/', (_req, res) => {
  res.status(200).send('Hello World');
});

app.get('/health', async (_req, res) => {
  let dbStatus = 'disconnected';
  try {
    await verifyConnection();
    dbStatus = 'connected';
  } catch (err) {
    dbStatus = 'error';
  }

  const aiStatus = process.env.GEMINI_API_KEY ? 'configured' : 'missing';

  res.status(200).json({
    status: 'healthy',
    uptime: process.uptime(),
    database: dbStatus,
    'AI provider': aiStatus
  });
});

app.use('/auth', authRoutes);
app.use('/mentors', mentorRoutes);
app.use('/mentor', mentorRoutes);
app.use('/user', userRoutes);
app.use('/api', aiRoutes);
app.use('/focus', focusRoutes);
app.use('/journey', journeyRoutes);

app.use(errorHandler);

export default app;
