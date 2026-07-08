import type { Response } from 'express';
import type { AuthenticatedRequest } from '../utils/jwt';
import { getAllMentors } from '../services/mentor.service';
import { selectMentorForUser } from '../services/auth.services';
import { sendSuccess, sendError } from '../utils/response';

export async function listMentors(_req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const mentors = await getAllMentors();
    sendSuccess(res, mentors);
  } catch {
    sendError(res, "We're having trouble connecting right now. Please try again.", 'SERVER_ERROR', 500);
  }
}

export async function selectMentor(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      sendError(res, 'Authentication required', 'AUTH_REQUIRED', 401);
      return;
    }

    const { mentorId } = req.body as { mentorId?: string };
    if (!mentorId) {
      sendError(res, 'Mentor ID is required', 'MENTOR_NOT_FOUND', 400);
      return;
    }

    await selectMentorForUser(req.user.userId, mentorId);
    sendSuccess(res, { mentorId });
  } catch (err) {
    if (err instanceof Error && err.message === 'MENTOR_NOT_FOUND') {
      sendError(res, "We couldn't find that mentor. Please try again.", 'MENTOR_NOT_FOUND', 404);
      return;
    }
    sendError(res, "We're having trouble connecting right now. Please try again.", 'SERVER_ERROR', 500);
  }
}
