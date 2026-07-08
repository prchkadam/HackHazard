import { OAuth2Client } from 'google-auth-library';
import { randomUUID } from 'crypto';
import { signToken } from '../utils/jwt';
import { findUserById, findUserByGoogleId, createUser, createGuestUser, createCompanion, assignMentor, getUserProfile, updateProfile, updateLastLogin, } from '../database/dbUtils';
export async function authenticateWithGoogle(idToken) {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    if (!clientId) {
        throw new Error('GOOGLE_CLIENT_ID is not configured');
    }
    const client = new OAuth2Client(clientId);
    const ticket = await client.verifyIdToken({ idToken, audience: clientId });
    const payload = ticket.getPayload();
    if (!payload?.sub) {
        throw new Error('Invalid Google token');
    }
    const googleId = payload.sub;
    const existingUser = await findUserByGoogleId(googleId);
    if (existingUser) {
        await updateLastLogin(existingUser.id);
        const token = signToken({ userId: existingUser.id, isGuest: false });
        return { token, user: existingUser };
    }
    const userId = randomUUID();
    const companionId = randomUUID();
    const now = Date.now();
    const user = await createUser({
        id: userId,
        googleId,
        name: payload.name ?? 'Avati User',
        email: payload.email ?? null,
        photoUrl: payload.picture ?? null,
        createdAt: now,
    });
    await createCompanion(userId, companionId);
    const token = signToken({ userId, isGuest: false });
    return { token, user };
}
export async function authenticateGuest() {
    const userId = randomUUID();
    const companionId = randomUUID();
    const now = Date.now();
    const user = await createGuestUser({
        id: userId,
        name: 'Guest Learner',
        createdAt: now,
    });
    await createCompanion(userId, companionId);
    const token = signToken({ userId, isGuest: true });
    return { token, user };
}
export async function getUserById(userId) {
    return findUserById(userId);
}
export async function selectMentorForUser(userId, mentorId) {
    await assignMentor(userId, mentorId);
}
export { getUserProfile, updateUserProfile };
async function updateUserProfile(userId, updates) {
    return updateProfile(userId, updates);
}
//# sourceMappingURL=auth.services.js.map