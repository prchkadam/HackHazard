import { apiClient, extractData } from '@/services/api/client';
import type { User, UpdateProfilePayload } from '@/types/user';
import type { Companion } from '@/types/companion';

export interface UserProfileResponse {
  user: User;
  companion: Companion | null;
}

export async function fetchUserProfile(): Promise<UserProfileResponse> {
  const response = await apiClient.get<{ success: boolean; data: UserProfileResponse }>(
    '/user/profile',
  );
  return extractData(response);
}

export async function updateUserProfile(payload: UpdateProfilePayload): Promise<User> {
  const response = await apiClient.patch<{ success: boolean; data: User }>(
    '/user/profile',
    payload,
  );
  return extractData(response);
}
