import type { JournalRecord } from '../../database/focusDbUtils';
/**
 * Generates a short journal entry from a completed reflection.
 * Uses low maxOutputTokens to minimise credit usage.
 */
export declare function generateJournal(topic: string, reflection: {
    learned: string;
    difficult: string;
    nextSteps: string;
}): Promise<JournalRecord>;
//# sourceMappingURL=reflection.service.d.ts.map