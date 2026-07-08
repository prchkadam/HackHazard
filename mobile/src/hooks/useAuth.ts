import { useContext } from 'react';
import { AuthContext } from '@/contexts/AuthContext';
import type { AuthContextValue } from '@/types/auth';
import type { User } from '@/types/user';

interface ExtendedAuthContextValue extends AuthContextValue {
  completeMentorSelection: (mentorId: string) => Promise<void>;
  updateUser: (user: User) => Promise<void>;
}

export function useAuth(): ExtendedAuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context as ExtendedAuthContextValue;
}
