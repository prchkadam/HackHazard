import type { FocusSessionRecord } from '../../database/focusDbUtils';
export declare function startFocusSession(userId: string, topic: string, plannedDuration: number): Promise<{
    sessionId: string;
    startedAt: string;
}>;
export declare function finishFocusSession(sessionId: string, userId: string, actualDuration: number): Promise<void>;
export declare function submitReflectionAndGenerateJournal(sessionId: string, userId: string, topic: string, reflection: {
    learned: string;
    difficult: string;
    nextSteps: string;
}): Promise<{
    journal: {
        summary: string;
        reflection: string;
        encouragement: string;
        createdAt: string;
    };
    growth: {
        stage: string;
        mood: string;
    };
}>;
export declare function getFocusHistory(userId: string): Promise<{
    sessions: FocusSessionRecord[];
    growth: {
        stage: string;
        mood: string;
    };
}>;
//# sourceMappingURL=focus.service.d.ts.map