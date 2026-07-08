import type { Response } from 'express';
import type { AuthenticatedRequest } from '../utils/jwt';
import { getUserProfile, updateUserProfile } from '../services/auth.services';
import { sendSuccess, sendError } from '../utils/response';

export async function getProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      sendError(res, 'Authentication required', 'AUTH_REQUIRED', 401);
      return;
    }
    const profile = await getUserProfile(req.user.userId);
    sendSuccess(res, profile);
  } catch (err) {
    if (err instanceof Error && err.message === 'USER_NOT_FOUND') {
      sendError(res, "We couldn't find your account.", 'USER_NOT_FOUND', 404);
      return;
    }
    sendError(res, "We're having trouble connecting right now. Please try again.", 'SERVER_ERROR', 500);
  }
}

export async function patchProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      sendError(res, 'Authentication required', 'AUTH_REQUIRED', 401);
      return;
    }

    const { name, college, semester } = req.body as {
      name?: string;
      college?: string;
      semester?: string;
    };

    const updates: { name?: string; college?: string; semester?: string } = {};
    if (name !== undefined) updates.name = name;
    if (college !== undefined) updates.college = college;
    if (semester !== undefined) updates.semester = semester;

    const user = await updateUserProfile(req.user.userId, updates);
    sendSuccess(res, user);
  } catch {
    sendError(res, "We're having trouble connecting right now. Please try again.", 'SERVER_ERROR', 500);
  }
}
