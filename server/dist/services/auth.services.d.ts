import { getUserProfile } from '../database/dbUtils';
import type { UserRecord } from '../types';
export declare function authenticateWithGoogle(idToken: string): Promise<{
    token: string;
    user: UserRecord;
}>;
export declare function authenticateGuest(): Promise<{
    token: string;
    user: UserRecord;
}>;
export declare function getUserById(userId: string): Promise<UserRecord | null>;
export declare function selectMentorForUser(userId: string, mentorId: string): Promise<void>;
export { getUserProfile, updateUserProfile };
declare function updateUserProfile(userId: string, updates: {
    name?: string;
    college?: string;
    semester?: string;
}): Promise<UserRecord>;
//# sourceMappingURL=auth.services.d.ts.map