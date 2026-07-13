import { getSession } from './neo4j';
export function mapUserRecord(record, mentorId = null) {
    return {
        id: record.id,
        name: record.name,
        email: record.email ?? null,
        photoUrl: record.photoUrl ?? null,
        isGuest: Boolean(record.isGuest),
        college: record.college ?? null,
        semester: record.semester ?? null,
        mentorId: mentorId,
        onboardingComplete: Boolean(mentorId),
        createdAt: new Date(Number(record.createdAt)).toISOString(),
    };
}
export async function findUserById(userId) {
    const session = getSession();
    try {
        const result = await session.run(`
      MATCH (u:User {id: $userId})
      OPTIONAL MATCH (u)-[:HAS_MENTOR]->(m:Mentor)
      RETURN u, m.id AS mentorId
      `, { userId });
        const firstRecord = result.records[0];
        if (!firstRecord) {
            return null;
        }
        const userNode = firstRecord.get('u').properties;
        const mentorId = firstRecord.get('mentorId');
        return mapUserRecord(userNode, mentorId);
    }
    finally {
        await session.close();
    }
}
export async function findUserByEmail(email) {
    const session = getSession();
    try {
        const result = await session.run(`
      MATCH (u:User {email: $email})
      OPTIONAL MATCH (u)-[:HAS_MENTOR]->(m:Mentor)
      RETURN u, m.id AS mentorId
      `, { email });
        const firstRecord = result.records[0];
        if (!firstRecord) {
            return null;
        }
        const userNode = firstRecord.get('u').properties;
        const mentorId = firstRecord.get('mentorId');
        return mapUserRecord(userNode, mentorId);
    }
    finally {
        await session.close();
    }
}
export async function findUserByGoogleId(googleId) {
    const session = getSession();
    try {
        const result = await session.run(`
      MATCH (u:User {googleId: $googleId})
      OPTIONAL MATCH (u)-[:HAS_MENTOR]->(m:Mentor)
      RETURN u, m.id AS mentorId
      `, { googleId });
        const firstRecord = result.records[0];
        if (!firstRecord) {
            return null;
        }
        const userNode = firstRecord.get('u').properties;
        const mentorId = firstRecord.get('mentorId');
        return mapUserRecord(userNode, mentorId);
    }
    finally {
        await session.close();
    }
}
export async function createUser(params) {
    const session = getSession();
    try {
        await session.run(`
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
      `, params);
        return mapUserRecord({
            ...params,
            isGuest: false,
            college: null,
            semester: null,
        });
    }
    finally {
        await session.close();
    }
}
export async function createGuestUser(params) {
    const session = getSession();
    try {
        await session.run(`
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
      `, params);
        return mapUserRecord({
            ...params,
            email: null,
            photoUrl: null,
            isGuest: true,
            college: null,
            semester: null,
        });
    }
    finally {
        await session.close();
    }
}
export async function createCompanion(userId, companionId) {
    const session = getSession();
    try {
        await session.run(`
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
      `, { userId, companionId });
        return { id: companionId, stage: 'seed', mood: 'calm' };
    }
    finally {
        await session.close();
    }
}
export async function assignMentor(userId, mentorId) {
    const session = getSession();
    try {
        const result = await session.run(`
      MATCH (u:User {id: $userId})
      MATCH (m:Mentor {id: $mentorId})
      OPTIONAL MATCH (u)-[old:HAS_MENTOR]->(:Mentor)
      DELETE old
      CREATE (u)-[:HAS_MENTOR]->(m)
      RETURN m
      `, { userId, mentorId });
        if (result.records.length === 0) {
            throw new Error('MENTOR_NOT_FOUND');
        }
    }
    finally {
        await session.close();
    }
}
export async function getMentors() {
    const session = getSession();
    try {
        const result = await session.run(`
      MATCH (m:Mentor)
      RETURN m.id AS id, m.name AS name, m.personality AS personality,
             m.welcomeMessage AS welcomeMessage, m.avatar AS avatar
      ORDER BY m.name
      `);
        return result.records.map((record) => ({
            id: record.get('id'),
            name: record.get('name'),
            personality: record.get('personality'),
            welcomeMessage: record.get('welcomeMessage'),
            avatar: record.get('avatar'),
        }));
    }
    finally {
        await session.close();
    }
}
export async function getUserProfile(userId) {
    const session = getSession();
    try {
        const result = await session.run(`
      MATCH (u:User {id: $userId})
      OPTIONAL MATCH (u)-[:HAS_MENTOR]->(m:Mentor)
      OPTIONAL MATCH (u)-[:OWNS]->(c:Companion)
      RETURN u, m.id AS mentorId, c
      `, { userId });
        const firstRecord = result.records[0];
        if (!firstRecord) {
            throw new Error('USER_NOT_FOUND');
        }
        const userNode = firstRecord.get('u').properties;
        const mentorId = firstRecord.get('mentorId');
        const companionNode = firstRecord.get('c');
        const user = mapUserRecord(userNode, mentorId);
        const companion = companionNode
            ? {
                id: companionNode.properties.id,
                stage: companionNode.properties.stage,
                mood: companionNode.properties.mood,
            }
            : null;
        return { user, companion };
    }
    finally {
        await session.close();
    }
}
export async function updateProfile(userId, updates) {
    const session = getSession();
    try {
        await session.run(`
      MATCH (u:User {id: $userId})
      SET u.name = coalesce($name, u.name),
          u.college = coalesce($college, u.college),
          u.semester = coalesce($semester, u.semester)
      `, { userId, ...updates });
        const user = await findUserById(userId);
        if (!user) {
            throw new Error('USER_NOT_FOUND');
        }
        return user;
    }
    finally {
        await session.close();
    }
}
export async function updateLastLogin(userId) {
    const session = getSession();
    try {
        await session.run(`MATCH (u:User {id: $userId}) SET u.lastLogin = datetime().epochMillis`, { userId });
    }
    finally {
        await session.close();
    }
}
//# sourceMappingURL=dbUtils.js.map