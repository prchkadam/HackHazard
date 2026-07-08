export interface UserRecord {
  id: string;
  name: string;
  email: string | null;
  photoUrl: string | null;
  isGuest: boolean;
  college: string | null;
  semester: string | null;
  mentorId: string | null;
  onboardingComplete: boolean;
  createdAt: string;
}

export interface MentorRecord {
  id: string;
  name: string;
  personality: string;
  welcomeMessage: string;
  avatar: string | null;
}

export interface CompanionRecord {
  id: string;
  stage: 'seed' | 'growing' | 'bloomed';
  mood: 'calm' | 'thinking' | 'waiting' | 'proud' | 'growing';
}
