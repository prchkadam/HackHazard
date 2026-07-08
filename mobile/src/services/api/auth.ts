import { apiClient, extractData } from '@/services/api/client';
import { setAuthToken } from '@/services/auth/tokenStorage';
import type { AuthResponse, GoogleLoginPayload } from '@/types/auth';
import type { User } from '@/types/user';

export async function loginWithGoogle(payload: GoogleLoginPayload): Promise<AuthResponse> {
  const response = await apiClient.post<{ success: boolean; data: AuthResponse }>(
    '/auth/google',
    payload,
  );
  const data = extractData(response);
  await setAuthToken(data.token);
  return data;
}

export async function fetchCurrentUser(): Promise<User> {
  const response = await apiClient.get<{ success: boolean; data: User }>('/auth/me');
  return extractData(response);
}

export async function logoutFromServer(): Promise<void> {
  await apiClient.post('/auth/logout');
}
