import { OAuth2Client } from 'google-auth-library';
import { randomUUID } from 'crypto';
import { signToken } from '../utils/jwt';
import {
  findUserById,
  findUserByGoogleId,
  createUser,
  createGuestUser,
  createCompanion,
  assignMentor,
  getUserProfile,
  updateProfile,
  updateLastLogin,
} from '../database/dbUtils';
import type { UserRecord, CompanionRecord } from '../types';

export async function authenticateWithGoogle(idToken: string): Promise<{ token: string; user: UserRecord }> {
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

export async function authenticateGuest(): Promise<{ token: string; user: UserRecord }> {
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

export async function getUserById(userId: string): Promise<UserRecord | null> {
  return findUserById(userId);
}

export async function selectMentorForUser(userId: string, mentorId: string): Promise<void> {
  await assignMentor(userId, mentorId);
}

export { getUserProfile, updateUserProfile };

async function updateUserProfile(
  userId: string,
  updates: { name?: string; college?: string; semester?: string },
): Promise<UserRecord> {
  return updateProfile(userId, updates);
}
