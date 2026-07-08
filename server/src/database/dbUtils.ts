import { getSession } from './neo4j';
import type { UserRecord, CompanionRecord, MentorRecord } from '../types';

export function mapUserRecord(record: Record<string, unknown>, mentorId: string | null = null): UserRecord {
  return {
    id: record.id as string,
    name: record.name as string,
    email: (record.email as string | null) ?? null,
    photoUrl: (record.photoUrl as string | null) ?? null,
    isGuest: Boolean(record.isGuest),
    college: (record.college as string | null) ?? null,
    semester: (record.semester as string | null) ?? null,
    mentorId: mentorId,
    onboardingComplete: Boolean(mentorId),
    createdAt: new Date(Number(record.createdAt)).toISOString(),
  };
}

export async function findUserById(userId: string): Promise<UserRecord | null> {
  const session = getSession();
  try {
    const result = await session.run(
      `
      MATCH (u:User {id: $userId})
      OPTIONAL MATCH (u)-[:HAS_MENTOR]->(m:Mentor)
      RETURN u, m.id AS mentorId
      `,
      { userId },
    );

    const firstRecord = result.records[0];
    if (!firstRecord) {
      return null;
    }

    const userNode = firstRecord.get('u').properties;
    const mentorId = firstRecord.get('mentorId') as string | null;
    return mapUserRecord(userNode, mentorId);
  } finally {
    await session.close();
  }
}

export async function findUserByEmail(email: string): Promise<UserRecord | null> {
  const session = getSession();
  try {
    const result = await session.run(
      `
      MATCH (u:User {email: $email})
      OPTIONAL MATCH (u)-[:HAS_MENTOR]->(m:Mentor)
      RETURN u, m.id AS mentorId
      `,
      { email },
    );

    const firstRecord = result.records[0];
    if (!firstRecord) {
      return null;
    }

    const userNode = firstRecord.get('u').properties;
    const mentorId = firstRecord.get('mentorId') as string | null;
    return mapUserRecord(userNode, mentorId);
  } finally {
    await session.close();
  }
}

export async function findUserByGoogleId(googleId: string): Promise<UserRecord | null> {
  const session = getSession();
  try {
    const result = await session.run(
      `
      MATCH (u:User {googleId: $googleId})
      OPTIONAL MATCH (u)-[:HAS_MENTOR]->(m:Mentor)
      RETURN u, m.id AS mentorId
      `,
      { googleId },
    );

    const firstRecord = result.records[0];
    if (!firstRecord) {
      return null;
    }

    const userNode = firstRecord.get('u').properties;
    const mentorId = firstRecord.get('mentorId') as string | null;
    return mapUserRecord(userNode, mentorId);
  } finally {
    await session.close();
  }
}

export async function createUser(params: {
  id: string;
  googleId: string;
  name: string;
  email: string | null;
  photoUrl: string | null;
  createdAt: number;
}): Promise<UserRecord> {
  const session = getSession();
  try {
    await session.run(
      `
      CREATE (u:User {
        id: $id,
        googleId: $googleId,
        name: $name,
        email: $email,
        photoUrl: $photoUrl,
        isGuest: false,
        college: null,
        semester: null,
        createdAt: $createdAt,
        lastLogin: $createdAt
      })
      `,
      params,
    );
    return mapUserRecord({
      ...params,
      isGuest: false,
      college: null,
      semester: null,
    });
  } finally {
    await session.close();
  }
}

export async function createGuestUser(params: {
  id: string;
  name: string;
  createdAt: number;
}): Promise<UserRecord> {
  const session = getSession();
  try {
    await session.run(
      `
      CREATE (u:User {
        id: $id,
        name: $name,
        email: null,
        photoUrl: null,
        isGuest: true,
        college: null,
        semester: null,
        createdAt: $createdAt,
        lastLogin: $createdAt
      })
      `,
      params,
    );
    return mapUserRecord({
      ...params,
      email: null,
      photoUrl: null,
      isGuest: true,
      college: null,
      semester: null,
    });
  } finally {
    await session.close();
  }
}

export async function createCompanion(userId: string, companionId: string): Promise<CompanionRecord> {
  const session = getSession();
  try {
    await session.run(
      `
      MATCH (u:User {id: $userId})
      CREATE (c:Companion {
        id: $companionId,
        stage: 'seed',
        growthScore: 0,
        mood: 'calm',
        createdAt: datetime().epochMillis,
        lastUpdated: datetime().epochMillis
      })
      CREATE (u)-[:OWNS]->(c)
      `,
      { userId, companionId },
    );
    return { id: companionId, stage: 'seed', mood: 'calm' };
  } finally {
    await session.close();
  }
}

export async function assignMentor(userId: string, mentorId: string): Promise<void> {
  const session = getSession();
  try {
    const result = await session.run(
      `
      MATCH (u:User {id: $userId})
      MATCH (m:Mentor {id: $mentorId})
      OPTIONAL MATCH (u)-[old:HAS_MENTOR]->(:Mentor)
      DELETE old
      CREATE (u)-[:HAS_MENTOR]->(m)
      RETURN m
      `,
      { userId, mentorId },
    );

    if (result.records.length === 0) {
      throw new Error('MENTOR_NOT_FOUND');
    }
  } finally {
    await session.close();
  }
}

export async function getMentors(): Promise<MentorRecord[]> {
  const session = getSession();
  try {
    const result = await session.run(
      `
      MATCH (m:Mentor)
      RETURN m.id AS id, m.name AS name, m.personality AS personality,
             m.welcomeMessage AS welcomeMessage, m.avatar AS avatar
      ORDER BY m.name
      `,
    );
    return result.records.map((record) => ({
      id: record.get('id') as string,
      name: record.get('name') as string,
      personality: record.get('personality') as string,
      welcomeMessage: record.get('welcomeMessage') as string,
      avatar: record.get('avatar') as string | null,
    }));
  } finally {
    await session.close();
  }
}

export async function getUserProfile(userId: string): Promise<{ user: UserRecord; companion: CompanionRecord | null }> {
  const session = getSession();
  try {
    const result = await session.run(
      `
      MATCH (u:User {id: $userId})
      OPTIONAL MATCH (u)-[:HAS_MENTOR]->(m:Mentor)
      OPTIONAL MATCH (u)-[:OWNS]->(c:Companion)
      RETURN u, m.id AS mentorId, c
      `,
      { userId },
    );

    const firstRecord = result.records[0];
    if (!firstRecord) {
      throw new Error('USER_NOT_FOUND');
    }

    const userNode = firstRecord.get('u').properties;
    const mentorId = firstRecord.get('mentorId') as string | null;
    const companionNode = firstRecord.get('c');

    const user = mapUserRecord(userNode, mentorId);
    const companion = companionNode
      ? {
          id: companionNode.properties.id as string,
          stage: companionNode.properties.stage as CompanionRecord['stage'],
          mood: companionNode.properties.mood as CompanionRecord['mood'],
        }
      : null;

    return { user, companion };
  } finally {
    await session.close();
  }
}

export async function updateProfile(
  userId: string,
  updates: { name?: string; college?: string; semester?: string },
): Promise<UserRecord> {
  const session = getSession();
  try {
    await session.run(
      `
      MATCH (u:User {id: $userId})
      SET u.name = coalesce($name, u.name),
          u.college = coalesce($college, u.college),
          u.semester = coalesce($semester, u.semester)
      `,
      { userId, ...updates },
    );

    const user = await findUserById(userId);
    if (!user) {
      throw new Error('USER_NOT_FOUND');
    }
    return user;
  } finally {
    await session.close();
  }
}

export async function updateLastLogin(userId: string): Promise<void> {
  const session = getSession();
  try {
    await session.run(
      `MATCH (u:User {id: $userId}) SET u.lastLogin = datetime().epochMillis`,
      { userId },
    );
  } finally {
    await session.close();
  }
}
