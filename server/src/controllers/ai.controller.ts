import type { Response } from 'express';
import { z } from 'zod';
import type { AuthenticatedRequest } from '../utils/jwt';
import { generateMentorResponse } from '../services/ai/ai.service';
import { sendSuccess, sendError } from '../utils/response';

const ConversationMessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string().min(1),
  timestamp: z.string().optional(),
});

const ChatRequestSchema = z.object({
  mentorId: z.enum(['ved', 'kai', 'ira']),
  conversationHistory: z.array(ConversationMessageSchema).max(50),
  currentMessage: z.string().min(1).max(2000),
});

export async function handleChat(req: AuthenticatedRequest, res: Response): Promise<void> {
  const parsed = ChatRequestSchema.safeParse(req.body);

  if (!parsed.success) {
    sendError(
      res,
      'Invalid request. Please check your input.',
      'VALIDATION_ERROR',
      400,
    );
    return;
  }

  const { mentorId, conversationHistory, currentMessage } = parsed.data;

  const history = conversationHistory.map((msg) => {
    if (msg.timestamp !== undefined) {
      return { role: msg.role, content: msg.content, timestamp: msg.timestamp };
    }
    return { role: msg.role, content: msg.content };
  });

  try {
    const result = await generateMentorResponse(mentorId, history, currentMessage);
    sendSuccess(res, result);
  } catch {
    sendError(
      res,
      "We're having trouble connecting right now. Please try again.",
      'SERVER_ERROR',
      500,
    );
  }
}
