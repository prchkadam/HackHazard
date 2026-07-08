import { GeminiProvider } from './geminiProvider';
import { buildPrompt } from '../../utils/promptBuilder';
const provider = new GeminiProvider();
export async function generateMentorResponse(mentorId, conversationHistory, currentMessage) {
    const prompt = buildPrompt(mentorId, conversationHistory, currentMessage);
    return provider.generateResponse(prompt);
}
//# sourceMappingURL=ai.service.js.map