import { getSession } from '../database/neo4j';
import { getMentors } from '../database/dbUtils';
const MENTORS = [
    {
        id: 'ved',
        name: 'Ved',
        personality: 'Logical, Patient, Concept Focused',
        welcomeMessage: "Let's build intuition first, one step at a time.",
        avatar: null,
    },
    {
        id: 'kai',
        name: 'Kai',
        personality: 'Energetic, Fast, Motivating',
        welcomeMessage: "Let's make a fast recovery plan and keep moving.",
        avatar: null,
    },
    {
        id: 'ira',
        name: 'Ira',
        personality: 'Calm, Reflective, Supportive',
        welcomeMessage: "Growth isn't about speed. You're exactly where you need to be.",
        avatar: null,
    },
];
export async function seedMentors() {
    const session = getSession();
    try {
        for (const mentor of MENTORS) {
            await session.run(`
        MERGE (m:Mentor {id: $id})
        ON CREATE SET
          m.name = $name,
          m.personality = $personality,
          m.welcomeMessage = $welcomeMessage,
          m.avatar = $avatar
        `, mentor);
        }
    }
    finally {
        await session.close();
    }
}
export async function getAllMentors() {
    return getMentors();
}
//# sourceMappingURL=mentor.service.js.map