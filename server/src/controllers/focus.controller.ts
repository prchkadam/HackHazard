import type { Response } from 'express';
import { z } from 'zod';
import type { AuthenticatedRequest } from '../utils/jwt';
import { sendSuccess, sendError } from '../utils/response';
import {
  startFocusSession,
  finishFocusSession,
  submitReflectionAndGenerateJournal,
  getFocusHistory,
} from '../services/focus/focus.service';

// ──────────────────────────────
// POST /focus/session
// ──────────────────────────────
const CreateSessionSchema = z.object({
  topic: z.string().min(1).max(200),
  plannedDuration: z.number().int().min(1).max(180), // minutes
});

export async function createSession(req: AuthenticatedRequest, res: Response): Promise<void> {
  if (!req.user) { sendError(res, 'Authentication required', 'AUTH_REQUIRED', 401); return; }

  const parsed = CreateSessionSchema.safeParse(req.body);
  if (!parsed.success) { sendError(res, 'Invalid request', 'VALIDATION_ERROR', 400); return; }

  try {
    const result = await startFocusSession(req.user.userId, parsed.data.topic, parsed.data.plannedDuration);
    sendSuccess(res, result);
  } catch {
    sendError(res, "We're having trouble starting your session. Please try again.", 'SERVER_ERROR', 500);
  }
}

// ──────────────────────────────
// PATCH /focus/session/:id
// ──────────────────────────────
const UpdateSessionSchema = z.object({
  actualDuration: z.number().int().min(0).optional(),
  status: z.enum(['completed']).optional(),
});

export async function updateSession(req: AuthenticatedRequest, res: Response): Promise<void> {
  if (!req.user) { sendError(res, 'Authentication required', 'AUTH_REQUIRED', 401); return; }

  const parsed = UpdateSessionSchema.safeParse(req.body);
  if (!parsed.success) { sendError(res, 'Invalid request', 'VALIDATION_ERROR', 400); return; }

  const sessionId = req.params.id as string;
  if (!sessionId) { sendError(res, 'Session ID required', 'VALIDATION_ERROR', 400); return; }

  try {
    if (parsed.data.actualDuration !== undefined) {
      await finishFocusSession(sessionId, req.user.userId, parsed.data.actualDuration);
    }
    sendSuccess(res, { updated: true });
  } catch {
    sendError(res, "We're having trouble updating your session. Please try again.", 'SERVER_ERROR', 500);
  }
}

// ──────────────────────────────
// POST /focus/session/:id/reflection
// ──────────────────────────────
const ReflectionSchema = z.object({
  topic: z.string().min(1).max(200),
  learned: z.string().min(1).max(1000),
  difficult: z.string().min(1).max(1000),
  nextSteps: z.string().min(1).max(1000),
});

export async function submitReflection(req: AuthenticatedRequest, res: Response): Promise<void> {
  if (!req.user) { sendError(res, 'Authentication required', 'AUTH_REQUIRED', 401); return; }

  const parsed = ReflectionSchema.safeParse(req.body);
  if (!parsed.success) { sendError(res, 'Invalid request', 'VALIDATION_ERROR', 400); return; }

  const sessionId = req.params.id as string;
  if (!sessionId) { sendError(res, 'Session ID required', 'VALIDATION_ERROR', 400); return; }

  try {
    const result = await submitReflectionAndGenerateJournal(
      sessionId,
      req.user.userId,
      parsed.data.topic,
      { learned: parsed.data.learned, difficult: parsed.data.difficult, nextSteps: parsed.data.nextSteps },
    );
    sendSuccess(res, result);
  } catch {
    sendError(res, "We're having trouble saving your reflection. Please try again.", 'SERVER_ERROR', 500);
  }
}

// ──────────────────────────────
// GET /focus/history
// ──────────────────────────────
export async function getHistory(req: AuthenticatedRequest, res: Response): Promise<void> {
  if (!req.user) { sendError(res, 'Authentication required', 'AUTH_REQUIRED', 401); return; }

  try {
    const result = await getFocusHistory(req.user.userId);
    sendSuccess(res, result);
  } catch {
    sendError(res, "We're having trouble loading your history. Please try again.", 'SERVER_ERROR', 500);
  }
}
