import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { router } from 'expo-router';
import { Routes } from '@/constants/routes';
import { loginWithGoogle, fetchCurrentUser, loginAsGuest } from '@/services/api/auth';
import { selectMentor } from '@/services/api/mentor';
import {
  createGuestUser,
  getStoredUser,
  saveStoredUser,
  clearStoredUser,
  getSelectedMentorId,
  setSelectedMentorId,
  isOnboardingComplete,
  setOnboardingComplete,
  isCompanionBirthComplete,
  clearOnboardingState,
} from '@/services/auth/guestAuth';
import { clearAuthToken, getAuthToken } from '@/services/auth/tokenStorage';
import { setUnauthorizedHandler } from '@/services/api/client';
import { deleteSecureItem } from '@/services/storage/secureStorage';
import { StorageKeys } from '@/constants/storage';
import type { AuthContextValue } from '@/types/auth';
import type { User } from '@/types/user';

export const AuthContext = createContext<AuthContextValue | null>(null);

function getPostAuthRoute(
  mentorId: string | null,
  onboardingDone: boolean,
  birthDone: boolean,
): string {
  if (!mentorId || !onboardingDone) {
    return Routes.mentorOnboarding;
  }
  if (!birthDone) {
    return Routes.companionBirth;
  }
  return Routes.home;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const navigateAfterAuth = useCallback(async (currentUser: User) => {
    const mentorId = currentUser.mentorId ?? (await getSelectedMentorId());
    const onboardingDone = currentUser.onboardingComplete || (await isOnboardingComplete());
    const birthDone = await isCompanionBirthComplete();
    router.replace(getPostAuthRoute(mentorId, onboardingDone, birthDone) as never);
  }, []);

  const restoreSession = useCallback(async () => {
    setLoading(true);
    try {
      const token = await getAuthToken();
      const storedUser = await getStoredUser();

      if (token) {
        try {
          const remoteUser = await fetchCurrentUser();
          setUser(remoteUser);
          await saveStoredUser(remoteUser);
          return;
        } catch {
          await clearAuthToken();
        }
      }

      if (storedUser) {
        setUser(storedUser);
        return;
      }

      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (idToken: string) => {
    setLoading(true);
    try {
      const { user: authUser } = await loginWithGoogle({ idToken });
      setUser(authUser);
      await saveStoredUser(authUser);
      await navigateAfterAuth(authUser);
    } finally {
      setLoading(false);
    }
  }, [navigateAfterAuth]);

  const loginGuest = useCallback(async () => {
    setLoading(true);
    try {
      const { user: guestUser } = await loginAsGuest();
      setUser(guestUser);
      await saveStoredUser(guestUser);
      await navigateAfterAuth(guestUser);
    } finally {
      setLoading(false);
    }
  }, [navigateAfterAuth]);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await clearAuthToken();
      await clearStoredUser();
      await clearOnboardingState();
      await deleteSecureItem(StorageKeys.companionBirthComplete);
      setUser(null);
      router.replace(Routes.login as never);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      setUser(null);
      router.replace(Routes.login as never);
    });
    restoreSession();
  }, [restoreSession]);

  const completeMentorSelection = useCallback(
    async (mentorId: string) => {
      if (!user) return;

      await setSelectedMentorId(mentorId);
      await setOnboardingComplete();

      if (!user.isGuest) {
        await selectMentor({ mentorId });
      }

      const updatedUser: User = {
        ...user,
        mentorId,
        onboardingComplete: true,
      };
      setUser(updatedUser);
      await saveStoredUser(updatedUser);

      const birthDone = await isCompanionBirthComplete();
      router.replace(
        (birthDone ? Routes.home : Routes.companionBirth) as never,
      );
    },
    [user],
  );

  const updateUser = useCallback(
    async (updatedUser: User) => {
      setUser(updatedUser);
      await saveStoredUser(updatedUser);
    },
    [],
  );

  const value = useMemo<AuthContextValue & { completeMentorSelection: typeof completeMentorSelection; updateUser: typeof updateUser }>(
    () => ({
      user,
      loading,
      isAuthenticated: user !== null,
      login,
      loginGuest,
      logout,
      restoreSession,
      completeMentorSelection,
      updateUser,
    }),
    [user, loading, login, loginGuest, logout, restoreSession, completeMentorSelection, updateUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
