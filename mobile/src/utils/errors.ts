import type { ErrorCode } from '@/types/api';

const ERROR_MESSAGES: Record<ErrorCode, string> = {
  AUTH_REQUIRED: 'Please sign in to continue.',
  TOKEN_INVALID: 'Your session has expired. Please sign in again.',
  USER_NOT_FOUND: "We couldn't find your account. Please try signing in again.",
  MENTOR_NOT_FOUND: "We couldn't find that mentor. Please try again.",
  MISSION_NOT_FOUND: "We couldn't find that mission.",
  SERVER_ERROR: "We're having trouble connecting right now. Please try again.",
  DATABASE_ERROR: "We're having trouble connecting right now. Please try again.",
  NETWORK_ERROR: "We couldn't reach the server. Check your connection and try again.",
  UNKNOWN_ERROR: 'Something went wrong. Please try again.',
};

export function getHumanErrorMessage(code?: string, fallback?: string): string {
  if (code && code in ERROR_MESSAGES) {
    return ERROR_MESSAGES[code as ErrorCode];
  }
  return fallback ?? ERROR_MESSAGES.UNKNOWN_ERROR;
}

export function isNetworkError(error: unknown): boolean {
  if (error instanceof Error) {
    return error.message.includes('Network') || error.message.includes('network');
  }
  return false;
}
