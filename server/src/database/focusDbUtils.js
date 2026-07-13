import { getSession } from './neo4j';
// ──────────────────────────────
// Session CRUD
// ──────────────────────────────
export async function dbCreateSession(userId, id, topic, plannedDuration, startedAt) {
    const session = getSession();
    try {
        await session.run(`
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
      `, { userId, id, topic, plannedDuration, startedAt });
    }
    finally {
        await session.close();
    }
}
export async function dbUpdateSession(sessionId, userId, fields) {
    const session = getSession();
    try {
        await session.run(`
      MATCH (s:FocusSession {id: $sessionId, userId: $userId})
      SET s.actualDuration = coalesce($actualDuration, s.actualDuration),
          s.status         = coalesce($status, s.status),
          s.endedAt        = coalesce($endedAt, s.endedAt)
      `, {
            sessionId,
            userId,
            actualDuration: fields.actualDuration ?? null,
            status: fields.status ?? null,
            endedAt: fields.endedAt ?? null,
        });
    }
    finally {
        await session.close();
    }
}
export async function dbSaveReflectionAndJournal(sessionId, userId, journal) {
    const session = getSession();
    try {
        await session.run(`
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
      `, { sessionId, userId, ...journal });
    }
    finally {
        await session.close();
    }
}
export async function dbGetUserSessions(userId) {
    const session = getSession();
    try {
        const result = await session.run(`
      MATCH (u:User {id: $userId})-[:COMPLETED]->(s:FocusSession)
      OPTIONAL MATCH (s)-[:HAS_JOURNAL]->(j:Journal)
      RETURN s, j
      ORDER BY s.startedAt DESC
      LIMIT 30
      `, { userId });
        return result.records.map((r) => {
            const s = r.get('s').properties;
            const j = r.get('j');
            const journal = j
                ? {
                    summary: j.properties.summary,
                    reflection: j.properties.reflection,
                    encouragement: j.properties.encouragement,
                    createdAt: j.properties.createdAt,
                }
                : null;
            const completedCount = 0; // will be enriched later
            const growth = computeGrowth(completedCount, Boolean(s.reflectionDone));
            return {
                id: s.id,
                userId: s.userId,
                topic: s.topic,
                plannedDuration: Number(s.plannedDuration),
                actualDuration: s.actualDuration != null ? Number(s.actualDuration) : null,
                startedAt: s.startedAt,
                endedAt: s.endedAt,
                status: s.status,
                reflectionDone: Boolean(s.reflectionDone),
                journal,
                growth,
            };
        });
    }
    finally {
        await session.close();
    }
}
export async function dbGetCompletedCount(userId) {
    const session = getSession();
    try {
        const result = await session.run(`
      MATCH (u:User {id: $userId})-[:COMPLETED]->(s:FocusSession {status: 'completed'})
      RETURN count(s) AS total
      `, { userId });
        const rec = result.records[0];
        return rec ? Number(rec.get('total')) : 0;
    }
    finally {
        await session.close();
    }
}
// ──────────────────────────────
// Growth calculation (no credits)
// ──────────────────────────────
export function computeGrowth(completedCount, hasReflection) {
    let stage = 'seed';
    if (completedCount >= 10)
        stage = 'bloomed';
    else if (completedCount >= 3)
        stage = 'growing';
    let mood = 'calm';
    if (hasReflection && completedCount >= 1)
        mood = 'proud';
    else if (completedCount >= 3)
        mood = 'growing';
    return { stage, mood };
}
//# sourceMappingURL=focusDbUtils.js.map