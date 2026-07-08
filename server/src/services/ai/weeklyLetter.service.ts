import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { dbGetUserSessions } from '../../database/focusDbUtils';
import { dbGetLastWeeklyLetter, dbSaveWeeklyLetter } from '../../database/journeyDbUtils';
import { getSession } from '../../database/neo4j';

const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

export async function generateWeeklyLetter(userId: string): Promise<any | null> {
  const lastLetter = await dbGetLastWeeklyLetter(userId);
  const now = Date.now();
  const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

  // Only generate a new letter once a week
  if (lastLetter && now - Number(lastLetter.createdAt) < ONE_WEEK_MS) {
    return lastLetter;
  }

  // Get user's mentor details
  const neoSession = getSession();
  let mentorName = 'Your Mentor';
  let mentorId = 'ved';
  try {
    const res = await neoSession.run(
      `
      MATCH (u:User {id: $userId})-[:HAS_MENTOR]->(m:Mentor)
      RETURN m.name AS name, m.id AS id
      `,
      { userId }
    );
    const rec = res.records[0];
    if (rec) {
      mentorName = rec.get('name') as string;
      mentorId = rec.get('id') as string;
    }
  } finally {
    await neoSession.close();
  }

  // Get focus history to personalize the letter
  const sessions = await dbGetUserSessions(userId);
  const topics = sessions.slice(0, 5).map(s => s.topic).join(', ');

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  const prompt = `You are ${mentorName}, a mentor for Avati.
Write a warm, highly encouraging weekly summary letter to the user.
Keep it strictly under 300 words.
Do not use placeholders like [User Name] or [Mentor Name]. Format it directly as a readable letter.
Personalize it based on these topics they focused on this week: "${topics || 'starting their focus habit'}".
Return ONLY valid JSON in this exact shape:
{
  "title": "A short inspiring title for the letter (max 6 words)",
  "content": "The full letter body text in Markdown format. Be highly encouraging, patient, and consistent with the ${mentorName} mentor personality."
}`;

  try {
    const url = `${GEMINI_API_URL}?key=${apiKey}`;
    const response = await axios.post<{
      candidates: Array<{ content: { parts: Array<{ text: string }> } }>;
    }>(
      url,
      {
        contents: [{ parts: [{ text: prompt }], role: 'user' }],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.7,
          maxOutputTokens: 512,
        },
      },
      { headers: { 'Content-Type': 'application/json' }, timeout: 20000 }
    );

    const rawText = response.data.candidates[0]?.content.parts[0]?.text ?? '';
    const parsed = JSON.parse(rawText) as { title: string; content: string };

    const letterRecord = {
      id: uuidv4(),
      title: parsed.title,
      content: parsed.content,
      mentorId,
      createdAt: now,
    };

    await dbSaveWeeklyLetter(userId, letterRecord);
    return letterRecord;
  } catch (error) {
    console.error('Failed to generate weekly letter:', error);
    return null;
  }
}
