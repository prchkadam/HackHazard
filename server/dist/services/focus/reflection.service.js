import axios from 'axios';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';
const FALLBACK_JOURNAL = {
    summary: 'Great job completing your focus session!',
    reflection: 'Every session is a step forward in your journey.',
    encouragement: 'Keep showing up. That is where growth lives.',
    createdAt: new Date().toISOString(),
};
/**
 * Generates a short journal entry from a completed reflection.
 * Uses low maxOutputTokens to minimise credit usage.
 */
export async function generateJournal(topic, reflection) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey)
        return FALLBACK_JOURNAL;
    const prompt = `You are a calm journal writer for a learning companion app.
Given a focus session topic and the user's reflection, write a short journal entry.
Return ONLY valid JSON in this exact shape:
{
  "summary": "1–2 sentence summary of what they did",
  "reflection": "1–2 sentence reflection on what they found difficult and what they learned",
  "encouragement": "1 warm, brief encouraging sentence"
}

Topic: ${topic}
Learned: ${reflection.learned}
Difficult: ${reflection.difficult}
Next steps: ${reflection.nextSteps}`;
    try {
        const url = `${GEMINI_API_URL}?key=${apiKey}`;
        const response = await axios.post(url, {
            contents: [{ parts: [{ text: prompt }], role: 'user' }],
            generationConfig: {
                responseMimeType: 'application/json',
                temperature: 0.6,
                maxOutputTokens: 256,
            },
        }, { headers: { 'Content-Type': 'application/json' }, timeout: 20000 });
        const rawText = response.data.candidates[0]?.content.parts[0]?.text ?? '';
        const parsed = JSON.parse(rawText);
        return {
            summary: typeof parsed.summary === 'string' ? parsed.summary : FALLBACK_JOURNAL.summary,
            reflection: typeof parsed.reflection === 'string' ? parsed.reflection : FALLBACK_JOURNAL.reflection,
            encouragement: typeof parsed.encouragement === 'string' ? parsed.encouragement : FALLBACK_JOURNAL.encouragement,
            createdAt: new Date().toISOString(),
        };
    }
    catch {
        return { ...FALLBACK_JOURNAL, createdAt: new Date().toISOString() };
    }
}
//# sourceMappingURL=reflection.service.js.map