import { GeminiProvider } from './geminiProvider';
import { buildPrompt } from '../../utils/promptBuilder';
let provider = null;
export async function generateMentorResponse(mentorId, conversationHistory, currentMessage) {
    if (!provider) {
        provider = new GeminiProvider();
    }
    const prompt = buildPrompt(mentorId, conversationHistory, currentMessage);
    return provider.generateResponse(prompt);
}
//# sourceMappingURL=ai.service.js.map