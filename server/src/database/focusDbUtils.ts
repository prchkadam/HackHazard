
import { getSession } from './neo4j';

export interface FocusSessionRecord {
  id: string;
  userId: string;
  topic: string;
  plannedDuration: number;
  actualDuration: number | null;
  startedAt: string;
  endedAt: string | null;
  status: 'pending' | 'running' | 'completed';
  reflectionDone: boolean;
  journal: JournalRecord | null;
  growth: GrowthRecord;
}

export interface JournalRecord {
  summary: string;
  reflection: string;
  encouragement: string;
  createdAt: string;
}

export interface GrowthRecord {
  stage: 'seed' | 'growing' | 'bloomed';
  mood: 'calm' | 'proud' | 'growing' | 'thinking' | 'waiting';
}

// ──────────────────────────────
// Session CRUD
// ──────────────────────────────

export async function dbCreateSession(
  userId: string,
  id: string,
  topic: string,
  plannedDuration: number,
  startedAt: string,
): Promise<void> {
  const session = getSession();
  try {
    await session.run(
      `
      MATCH (u:User {id: $userId})
      CREATE (s:FocusSession {
        id: $id,
        userId: $userId,
        topic: $topic,
        plannedDuration: $plannedDuration,
        startedAt: $startedAt,
        endedAt: null,
        actualDuration: null,
        status: 'running',
        reflectionDone: false
      })
      CREATE (u)-[:COMPLETED]->(s)
      `,
      { userId, id, topic, plannedDuration, startedAt },
    );
  } finally {
    await session.close();
  }
}

export async function dbUpdateSession(
  sessionId: string,
  userId: string,
  fields: { actualDuration?: number; status?: string; endedAt?: string },
): Promise<void> {
  const session = getSession();
  try {
    await session.run(
      `
      MATCH (s:FocusSession {id: $sessionId, userId: $userId})
      SET s.actualDuration = coalesce($actualDuration, s.actualDuration),
          s.status         = coalesce($status, s.status),
          s.endedAt        = coalesce($endedAt, s.endedAt)
      `,
      {
        sessionId,
        userId,
        actualDuration: fields.actualDuration ?? null,
        status: fields.status ?? null,
        endedAt: fields.endedAt ?? null,
      },
    );
  } finally {
    await session.close();
  }
}

export async function dbSaveReflectionAndJournal(
  sessionId: string,
  userId: string,
  journal: JournalRecord,
): Promise<void> {
  const session = getSession();
  try {
    await session.run(
      `
      MATCH (s:FocusSession {id: $sessionId, userId: $userId})
      SET s.reflectionDone = true
      CREATE (j:Journal {
        sessionId: $sessionId,
        summary: $summary,
        reflection: $reflection,
        encouragement: $encouragement,
        createdAt: $createdAt
      })
      CREATE (s)-[:HAS_JOURNAL]->(j)
      `,
      { sessionId, userId, ...journal },
    );
  } finally {
    await session.close();
  }
}

export async function dbGetUserSessions(userId: string): Promise<FocusSessionRecord[]> {
  const session = getSession();
  try {
    const result = await session.run(
      `
      MATCH (u:User {id: $userId})-[:COMPLETED]->(s:FocusSession)
      OPTIONAL MATCH (s)-[:HAS_JOURNAL]->(j:Journal)
      RETURN s, j
      ORDER BY s.startedAt DESC
      LIMIT 30
      `,
      { userId },
    );

    return result.records.map((r: import('neo4j-driver').Record) => {
      const s = r.get('s').properties as Record<string, unknown>;
      const j = r.get('j');

      const journal: JournalRecord | null = j
        ? {
            summary: j.properties.summary as string,
            reflection: j.properties.reflection as string,
            encouragement: j.properties.encouragement as string,
            createdAt: j.properties.createdAt as string,
          }
        : null;

      const completedCount = 0; // will be enriched later
      const growth = computeGrowth(completedCount, Boolean(s.reflectionDone));

      return {
        id: s.id as string,
        userId: s.userId as string,
        topic: s.topic as string,
        plannedDuration: Number(s.plannedDuration),
        actualDuration: s.actualDuration != null ? Number(s.actualDuration) : null,
        startedAt: s.startedAt as string,
        endedAt: s.endedAt as string | null,
        status: s.status as FocusSessionRecord['status'],
        reflectionDone: Boolean(s.reflectionDone),
        journal,
        growth,
      };
    });
  } finally {
    await session.close();
  }
}

export async function dbGetCompletedCount(userId: string): Promise<number> {
  const session = getSession();
  try {
    const result = await session.run(
      `
      MATCH (u:User {id: $userId})-[:COMPLETED]->(s:FocusSession {status: 'completed'})
      RETURN count(s) AS total
      `,
      { userId },
    );
    const rec = result.records[0];
    return rec ? Number(rec.get('total')) : 0;
  } finally {
    await session.close();
  }
}

// ──────────────────────────────
// Growth calculation (no credits)
// ──────────────────────────────

export function computeGrowth(completedCount: number, hasReflection: boolean): GrowthRecord {
  let stage: GrowthRecord['stage'] = 'seed';
  if (completedCount >= 10) stage = 'bloomed';
  else if (completedCount >= 3) stage = 'growing';

  let mood: GrowthRecord['mood'] = 'calm';
  if (hasReflection && completedCount >= 1) mood = 'proud';
  else if (completedCount >= 3) mood = 'growing';

  return { stage, mood };
}
