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
export declare function dbCreateSession(userId: string, id: string, topic: string, plannedDuration: number, startedAt: string): Promise<void>;
export declare function dbUpdateSession(sessionId: string, userId: string, fields: {
    actualDuration?: number;
    status?: string;
    endedAt?: string;
}): Promise<void>;
export declare function dbSaveReflectionAndJournal(sessionId: string, userId: string, journal: JournalRecord): Promise<void>;
export declare function dbGetUserSessions(userId: string): Promise<FocusSessionRecord[]>;
export declare function dbGetCompletedCount(userId: string): Promise<number>;
export declare function computeGrowth(completedCount: number, hasReflection: boolean): GrowthRecord;
//# sourceMappingURL=focusDbUtils.d.ts.map