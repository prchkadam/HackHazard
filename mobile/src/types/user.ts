export interface User {
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

export interface UpdateProfilePayload {
  name?: string;
  college?: string;
  semester?: string;
}
