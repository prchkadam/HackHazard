import { getSession } from './neo4j';

export interface JourneyItem {
  id: string;
  type: 'focus' | 'reflection' | 'journal' | 'growth' | 'letter' | 'message';
  title: string;
  description: string;
  date: string;
  companionMood?: 'calm' | 'proud' | 'growing' | 'thinking' | 'waiting';
  meta?: Record<string, any>;
}

export async function dbGetJourneyTimeline(userId: string): Promise<JourneyItem[]> {
  const session = getSession();
  try {
    // 1. Get Focus Sessions and associated Journals
    const sessionsResult = await session.run(
      `
      MATCH (u:User {id: $userId})-[:COMPLETED]->(s:FocusSession)
      OPTIONAL MATCH (s)-[:HAS_JOURNAL]->(j:Journal)
      RETURN s, j
      ORDER BY s.startedAt DESC
      `,
      { userId }
    );

    // 2. Get Weekly Letters
    const lettersResult = await session.run(
      `
      MATCH (u:User {id: $userId})-[:RECEIVED]->(l:Letter)
      RETURN l
      ORDER BY l.createdAt DESC
      `,
      { userId }
    );

    const items: JourneyItem[] = [];

    // Process Focus & Journal & Growth items
    sessionsResult.records.forEach((record) => {
      const s = record.get('s').properties;
      const j = record.get('j');

      const dateStr = s.endedAt || s.startedAt;

      // Add Focus Session card
      items.push({
        id: `focus_${s.id}`,
        type: 'focus',
        title: `Focused on ${s.topic}`,
        description: s.actualDuration 
          ? `Spent ${Math.round(Number(s.actualDuration) / 60)} minutes in deep focus.`
          : `Planned a ${s.plannedDuration} minute session.`,
        date: new Date(dateStr).toISOString(),
        companionMood: s.reflectionDone ? 'proud' : 'calm'
      });

      // Add Journal card if reflection was done
      if (j) {
        const jp = j.properties;
        items.push({
          id: `journal_${s.id}`,
          type: 'journal',
          title: 'AI Reflection Summary',
          description: jp.summary,
          date: new Date(jp.createdAt || dateStr).toISOString(),
          meta: {
            reflection: jp.reflection,
            encouragement: jp.encouragement
          }
        });
      }
    });

    // Process Letters
    lettersResult.records.forEach((record) => {
      const l = record.get('l').properties;
      items.push({
        id: `letter_${l.id}`,
        type: 'letter',
        title: l.title || 'Weekly Letter from Mentor',
        description: l.content,
        date: new Date(Number(l.createdAt)).toISOString(),
        meta: {
          mentorId: l.mentorId
        }
      });
    });

    // Sort all timeline items chronologically (newest first)
    return items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } finally {
    await session.close();
  }
}

export async function dbSaveWeeklyLetter(userId: string, letter: { id: string; title: string; content: string; mentorId: string; createdAt: number }): Promise<void> {
  const session = getSession();
  try {
    await session.run(
      `
      MATCH (u:User {id: $userId})
      CREATE (l:Letter {
        id: $id,
        title: $title,
        content: $content,
        mentorId: $mentorId,
        createdAt: $createdAt
      })
      CREATE (u)-[:RECEIVED]->(l)
      `,
      { userId, ...letter }
    );
  } finally {
    await session.close();
  }
}

export async function dbGetLastWeeklyLetter(userId: string): Promise<any | null> {
  const session = getSession();
  try {
    const result = await session.run(
      `
      MATCH (u:User {id: $userId})-[:RECEIVED]->(l:Letter)
      RETURN l
      ORDER BY l.createdAt DESC
      LIMIT 1
      `,
      { userId }
    );
    const rec = result.records[0];
    return rec ? rec.get('l').properties : null;
  } finally {
    await session.close();
  }
}
