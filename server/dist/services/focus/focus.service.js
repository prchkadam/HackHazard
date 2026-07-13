import { v4 as uuidv4 } from 'uuid';
import { dbCreateSession, dbUpdateSession, dbSaveReflectionAndJournal, dbGetUserSessions, dbGetCompletedCount, computeGrowth, } from '../../database/focusDbUtils';
import { generateJournal } from './reflection.service';
// ──────────────────────────────
// Start a new session
// ──────────────────────────────
export async function startFocusSession(userId, topic, plannedDuration) {
    const sessionId = uuidv4();
    const startedAt = new Date().toISOString();
    await dbCreateSession(userId, sessionId, topic, plannedDuration, startedAt);
    return { sessionId, startedAt };
}
// ──────────────────────────────
// Update session (pause / finish)
// ──────────────────────────────
export async function finishFocusSession(sessionId, userId, actualDuration) {
    const endedAt = new Date().toISOString();
    await dbUpdateSession(sessionId, userId, {
        actualDuration,
        status: 'completed',
        endedAt,
    });
}
// ──────────────────────────────
// Submit reflection + generate journal (1 AI call per session)
// ──────────────────────────────
export async function submitReflectionAndGenerateJournal(sessionId, userId, topic, reflection) {
    const journal = await generateJournal(topic, reflection);
    await dbSaveReflectionAndJournal(sessionId, userId, journal);
    const completedCount = await dbGetCompletedCount(userId);
    const growth = computeGrowth(completedCount, true);
    return { journal, growth };
}
// ──────────────────────────────
// Get history + growth state
// ──────────────────────────────
export async function getFocusHistory(userId) {
    const [sessions, completedCount] = await Promise.all([
        dbGetUserSessions(userId),
        dbGetCompletedCount(userId),
    ]);
    const latestReflection = sessions.some((s) => s.reflectionDone);
    const growth = computeGrowth(completedCount, latestReflection);
    return { sessions, growth };
}
//# sourceMappingURL=focus.service.js.map