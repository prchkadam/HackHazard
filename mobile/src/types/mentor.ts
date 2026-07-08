export interface Mentor {
  id: string;
  name: string;
  personality: string;
  welcomeMessage: string;
  avatar: string | null;
}

export interface MentorOption {
  id: string;
  name: string;
  personality: string[];
  description: string;
  examplePrompt: string;
  exampleResponse: string;
  accentColor: string;
}

export interface SelectMentorPayload {
  mentorId: string;
}
