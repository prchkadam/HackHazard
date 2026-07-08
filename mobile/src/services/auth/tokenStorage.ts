import { StorageKeys } from '@/constants/storage';
import { deleteSecureItem, getSecureItem, setSecureItem } from '@/services/storage/secureStorage';

let cachedToken: string | null = null;

export async function getAuthToken(): Promise<string | null> {
  if (cachedToken) {
    return cachedToken;
  }
  cachedToken = await getSecureItem(StorageKeys.jwtToken);
  return cachedToken;
}

export async function setAuthToken(token: string): Promise<void> {
  cachedToken = token;
  await setSecureItem(StorageKeys.jwtToken, token);
}

export async function clearAuthToken(): Promise<void> {
  cachedToken = null;
  await deleteSecureItem(StorageKeys.jwtToken);
}

export function clearAuthTokenCache(): void {
  cachedToken = null;
}
