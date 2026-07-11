import { GeminiProvider } from './geminiProvider';
import { buildPrompt } from '../../utils/promptBuilder';
import type { AIResponse } from './aiProvider';
import type { ConversationMessage } from '../../utils/promptBuilder';

let provider: GeminiProvider | null = null;

export async function generateMentorResponse(
  mentorId: string,
  conversationHistory: ConversationMessage[],
  currentMessage: string,
): Promise<AIResponse> {
  if (!provider) {
    provider = new GeminiProvider();
  }
  const prompt = buildPrompt(mentorId, conversationHistory, currentMessage);
  return provider.generateResponse(prompt);
}

