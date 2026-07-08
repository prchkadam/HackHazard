import type { Request, Response } from 'express';
import { dbSeedDemoData } from '../database/demoDbUtils';
import { signToken } from '../utils/jwt';
import { findUserById } from '../database/dbUtils';
import { sendSuccess, sendError } from '../utils/response';

export async function seedDemo(req: Request, res: Response): Promise<void> {
  try {
    const demoUserId = await dbSeedDemoData();
    const user = await findUserById(demoUserId);

    if (!user) {
      sendError(res, 'Failed to retrieve seeded user', 'SERVER_ERROR', 500);
      return;
    }

    const token = signToken({ userId: demoUserId, isGuest: false });
    sendSuccess(res, { token, user });
  } catch (error) {
    console.error('Demo seeding failed:', error);
    sendError(res, 'Failed to seed demo data', 'SERVER_ERROR', 500);
  }
}
