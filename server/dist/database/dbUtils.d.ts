import type { UserRecord, CompanionRecord, MentorRecord } from '../types';
export declare function mapUserRecord(record: Record<string, unknown>, mentorId?: string | null): UserRecord;
export declare function findUserById(userId: string): Promise<UserRecord | null>;
export declare function findUserByEmail(email: string): Promise<UserRecord | null>;
export declare function findUserByGoogleId(googleId: string): Promise<UserRecord | null>;
export declare function createUser(params: {
    id: string;
    googleId: string;
    name: string;
    email: string | null;
    photoUrl: string | null;
    createdAt: number;
}): Promise<UserRecord>;
export declare function createGuestUser(params: {
    id: string;
    name: string;
    createdAt: number;
}): Promise<UserRecord>;
export declare function createCompanion(userId: string, companionId: string): Promise<CompanionRecord>;
export declare function assignMentor(userId: string, mentorId: string): Promise<void>;
export declare function getMentors(): Promise<MentorRecord[]>;
export declare function getUserProfile(userId: string): Promise<{
    user: UserRecord;
    companion: CompanionRecord | null;
}>;
export declare function updateProfile(userId: string, updates: {
    name?: string;
    college?: string;
    semester?: string;
}): Promise<UserRecord>;
export declare function updateLastLogin(userId: string): Promise<void>;
//# sourceMappingURL=dbUtils.d.ts.map