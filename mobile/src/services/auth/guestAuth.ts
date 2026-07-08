import { StorageKeys } from '@/constants/storage';
import { generateGuestId, generateGuestName } from '@/utils/id';
import type { User } from '@/types/user';
import {
  deleteSecureItem,
  getSecureJson,
  setSecureJson,
} from '@/services/storage/secureStorage';

export async function createGuestUser(): Promise<User> {
  const user: User = {
    id: generateGuestId(),
    name: generateGuestName(),
    email: null,
    photoUrl: null,
    isGuest: true,
    college: null,
    semester: null,
    mentorId: null,
    onboardingComplete: false,
    createdAt: new Date().toISOString(),
  };

  await setSecureJson(StorageKeys.user, user);
  return user;
}

export async function getStoredUser(): Promise<User | null> {
  return getSecureJson<User>(StorageKeys.user);
}

export async function saveStoredUser(user: User): Promise<void> {
  await setSecureJson(StorageKeys.user, user);
}

export async function clearStoredUser(): Promise<void> {
  await deleteSecureItem(StorageKeys.user);
}

export async function getSelectedMentorId(): Promise<string | null> {
  const { getSecureItem } = await import('@/services/storage/secureStorage');
  return getSecureItem(StorageKeys.selectedMentorId);
}

export async function setSelectedMentorId(mentorId: string): Promise<void> {
  const { setSecureItem } = await import('@/services/storage/secureStorage');
  await setSecureItem(StorageKeys.selectedMentorId, mentorId);
}

export async function isOnboardingComplete(): Promise<boolean> {
  const { getSecureItem } = await import('@/services/storage/secureStorage');
  const value = await getSecureItem(StorageKeys.onboardingComplete);
  return value === 'true';
}

export async function setOnboardingComplete(): Promise<void> {
  const { setSecureItem } = await import('@/services/storage/secureStorage');
  await setSecureItem(StorageKeys.onboardingComplete, 'true');
}

export async function isCompanionBirthComplete(): Promise<boolean> {
  const { getSecureItem } = await import('@/services/storage/secureStorage');
  const value = await getSecureItem(StorageKeys.companionBirthComplete);
  return value === 'true';
}

export async function setCompanionBirthComplete(): Promise<void> {
  const { setSecureItem } = await import('@/services/storage/secureStorage');
  await setSecureItem(StorageKeys.companionBirthComplete, 'true');
}

export async function clearOnboardingState(): Promise<void> {
  await deleteSecureItem(StorageKeys.selectedMentorId);
  await deleteSecureItem(StorageKeys.onboardingComplete);
  await deleteSecureItem(StorageKeys.companionBirthComplete);
}
