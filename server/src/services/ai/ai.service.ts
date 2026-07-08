import { GeminiProvider } from './geminiProvider';
import { buildPrompt } from '../../utils/promptBuilder';
import type { AIResponse } from './aiProvider';
import type { ConversationMessage } from '../../utils/promptBuilder';

const provider = new GeminiProvider();

export async function generateMentorResponse(
  mentorId: string,
  conversationHistory: ConversationMessage[],
  currentMessage: string,
): Promise<AIResponse> {
  const prompt = buildPrompt(mentorId, conversationHistory, currentMessage);
  return provider.generateResponse(prompt);
}
