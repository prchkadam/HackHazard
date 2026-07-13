export interface JourneyItem {
    id: string;
    type: 'focus' | 'reflection' | 'journal' | 'growth' | 'letter' | 'message';
    title: string;
    description: string;
    date: string;
    companionMood?: 'calm' | 'proud' | 'growing' | 'thinking' | 'waiting';
    meta?: Record<string, any>;
}
export declare function dbGetJourneyTimeline(userId: string): Promise<JourneyItem[]>;
export declare function dbSaveWeeklyLetter(userId: string, letter: {
    id: string;
    title: string;
    content: string;
    mentorId: string;
    createdAt: number;
}): Promise<void>;
export declare function dbGetLastWeeklyLetter(userId: string): Promise<any | null>;
//# sourceMappingURL=journeyDbUtils.d.ts.map