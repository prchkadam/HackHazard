import axios from 'axios';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';
const FALLBACK_RESPONSE = {
    message: "I'm having a little trouble connecting right now. Please try again in a moment.",
    suggestedQuestions: [
        'Can you explain this topic again?',
        'Can you give an example?',
        'Can you simplify that?',
    ],
    title: 'Connection Issue',
};
export class GeminiProvider {
    apiKey;
    constructor() {
        const key = process.env.GEMINI_API_KEY;
        if (!key) {
            throw new Error('GEMINI_API_KEY environment variable is not set');
        }
        this.apiKey = key;
    }
    async generateResponse(prompt) {
        const url = `${GEMINI_API_URL}?key=${this.apiKey}`;
        const requestBody = {
            contents: [
                {
                    parts: [{ text: prompt }],
                    role: 'user',
                },
            ],
            generationConfig: {
                responseMimeType: 'application/json',
                temperature: 0.7,
                maxOutputTokens: 8192,
            },
        };
        const response = await axios.post(url, requestBody, {
            headers: { 'Content-Type': 'application/json' },
            timeout: 30000,
        });
        const firstCandidate = response.data.candidates[0];
        if (!firstCandidate) {
            return FALLBACK_RESPONSE;
        }
        const rawText = firstCandidate.content.parts[0]?.text ?? '';
        try {
            const parsed = JSON.parse(rawText);
            return {
                message: typeof parsed.message === 'string' ? parsed.message : FALLBACK_RESPONSE.message,
                suggestedQuestions: Array.isArray(parsed.suggestedQuestions) && parsed.suggestedQuestions.length === 3
                    ? parsed.suggestedQuestions
                    : FALLBACK_RESPONSE.suggestedQuestions,
                title: typeof parsed.title === 'string' ? parsed.title : FALLBACK_RESPONSE.title,
                quiz: Array.isArray(parsed.quiz) ? parsed.quiz : undefined,
                practice: Array.isArray(parsed.practice) ? parsed.practice : undefined,
            };
        }
        catch (error) {
            console.error("JSON parsing error:", error);
            console.error("Raw text was:", rawText);
            return FALLBACK_RESPONSE;
        }
    }
}
//# sourceMappingURL=geminiProvider.js.map