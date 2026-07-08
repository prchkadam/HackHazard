import { getSession } from './neo4j';
import { v4 as uuidv4 } from 'uuid';

export async function dbSeedDemoData(): Promise<string> {
  const session = getSession();
  const demoUserId = 'demo_user_avati_hack';
  const now = Date.now();
  const oneDay = 24 * 60 * 60 * 1000;

  try {
    // 1. Clean up existing demo data if any, so we can re-seed cleanly
    await session.run(
      `
      MATCH (u:User {id: $demoUserId})
      OPTIONAL MATCH (u)-[r1:COMPLETED]->(s:FocusSession)
      OPTIONAL MATCH (s)-[r2:HAS_JOURNAL]->(j:Journal)
      OPTIONAL MATCH (u)-[r3:RECEIVED]->(l:Letter)
      OPTIONAL MATCH (u)-[r4:OWNS]->(c:Companion)
      DETACH DELETE u, s, j, l, c
      `,
      { demoUserId }
    );

    // 2. Create Demo User
    await session.run(
      `
      CREATE (u:User {
        id: $demoUserId,
        name: 'Alex Rivera',
        email: 'alex.rivera@demo.com',
        photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        isGuest: false,
        college: 'State Technical University',
        semester: '5th Semester',
        createdAt: $createdAt,
        lastLogin: $createdAt
      })
      `,
      { demoUserId, createdAt: now - 10 * oneDay }
    );

    // 3. Assign Mentor 'ira' (Calm, Reflective)
    await session.run(
      `
      MATCH (u:User {id: $demoUserId})
      MATCH (m:Mentor {id: 'ira'})
      CREATE (u)-[:HAS_MENTOR]->(m)
      `,
      { demoUserId }
    );

    // 4. Create Companion (Set to growing stage, proud mood)
    await session.run(
      `
      MATCH (u:User {id: $demoUserId})
      CREATE (c:Companion {
        id: 'demo_companion_id',
        stage: 'growing',
        growthScore: 12,
        mood: 'proud',
        createdAt: $createdAt,
        lastUpdated: $createdAt
      })
      CREATE (u)-[:OWNS]->(c)
      `,
      { demoUserId, createdAt: now - 10 * oneDay }
    );

    // 5. Seed Focus Sessions & Journals
    // Session 1: React Native Navigation (Completed 4 hours ago, no reflection yet)
    await session.run(
      `
      MATCH (u:User {id: $demoUserId})
      CREATE (s:FocusSession {
        id: 'demo_session_1',
        userId: $demoUserId,
        topic: 'React Native Navigation',
        plannedDuration: 45,
        actualDuration: 2700,
        startedAt: $startedAt,
        endedAt: $endedAt,
        status: 'completed',
        reflectionDone: false
      })
      CREATE (u)-[:COMPLETED]->(s)
      `,
      {
        demoUserId,
        startedAt: new Date(now - 4 * 60 * 60 * 1000).toISOString(),
        endedAt: new Date(now - 4 * 60 * 60 * 1000 + 45 * 60 * 1000).toISOString(),
      }
    );

    // Session 2: Neo4j Cypher Queries (Completed 2 days ago, has reflection & journal)
    await session.run(
      `
      MATCH (u:User {id: $demoUserId})
      CREATE (s:FocusSession {
        id: 'demo_session_2',
        userId: $demoUserId,
        topic: 'Neo4j Cypher Queries',
        plannedDuration: 30,
        actualDuration: 1800,
        startedAt: $startedAt,
        endedAt: $endedAt,
        status: 'completed',
        reflectionDone: true
      })
      CREATE (j:Journal {
        sessionId: 'demo_session_2',
        summary: 'Mastered the fundamentals of matching nodes and configuring active relationships.',
        reflection: 'Struggled a bit with variable-length path queries initially, but clarified it with mentor support.',
        encouragement: 'Your structural thinking is improving. Keep mapping your conceptual trees!',
        createdAt: $endedAt
      })
      CREATE (u)-[:COMPLETED]->(s)
      CREATE (s)-[:HAS_JOURNAL]->(j)
      `,
      {
        demoUserId,
        startedAt: new Date(now - 2 * oneDay).toISOString(),
        endedAt: new Date(now - 2 * oneDay + 30 * 60 * 1000).toISOString(),
      }
    );

    // Session 3: Data Structures & Algorithms (Completed 5 days ago, has reflection & journal)
    await session.run(
      `
      MATCH (u:User {id: $demoUserId})
      CREATE (s:FocusSession {
        id: 'demo_session_3',
        userId: $demoUserId,
        topic: 'Binary Search Trees',
        plannedDuration: 60,
        actualDuration: 3600,
        startedAt: $startedAt,
        endedAt: $endedAt,
        status: 'completed',
        reflectionDone: true
      })
      CREATE (j:Journal {
        sessionId: 'demo_session_3',
        summary: 'Analyzed left/right child nodes and tree traversal recursive routines.',
        reflection: 'Recursion felt abstract, but drawing nodes visually on paper built strong intuition.',
        encouragement: 'Patience in visualization is your superpower. Growth is a series of balanced roots.',
        createdAt: $endedAt
      })
      CREATE (u)-[:COMPLETED]->(s)
      CREATE (s)-[:HAS_JOURNAL]->(j)
      `,
      {
        demoUserId,
        startedAt: new Date(now - 5 * oneDay).toISOString(),
        endedAt: new Date(now - 5 * oneDay + 60 * 60 * 1000).toISOString(),
      }
    );

    // 6. Seed a Weekly Letter from Ira
    await session.run(
      `
      MATCH (u:User {id: $demoUserId})
      CREATE (l:Letter {
        id: 'demo_letter_1',
        title: 'Finding Your Conceptual Balance',
        content: 'Dear Alex,\\n\\nI have been observing your focus sessions on **Binary Search Trees** and **Cypher Queries** this week. There is a deep, quiet strength in how you take abstract concepts and build them step-by-step from the roots up.\\n\\nRemember that learning is not about rushing to the end of a textbook. Like a growing leaf, clarity unfolds at its own natural pace. Continue visualizing your challenges, and trust the process.\\n\\nWith peace,\\nIra',
        mentorId: 'ira',
        createdAt: $createdAt
      })
      CREATE (u)-[:RECEIVED]->(l)
      `,
      { demoUserId, createdAt: now - 3 * oneDay }
    );

    return demoUserId;
  } finally {
    await session.close();
  }
}
