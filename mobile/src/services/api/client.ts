import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL } from '@/constants/env';
import { getAuthToken, clearAuthToken, clearAuthTokenCache } from '@/services/auth/tokenStorage';
import type { ApiErrorResponse } from '@/types/api';
import { getHumanErrorMessage } from '@/utils/errors';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const token = await getAuthToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let onUnauthorized: (() => void) | null = null;

export function setUnauthorizedHandler(handler: () => void): void {
  onUnauthorized = handler;
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorResponse>) => {
    if (error.response?.status === 401) {
      await clearAuthToken();
      clearAuthTokenCache();
      onUnauthorized?.();
    }

    const message =
      error.response?.data?.message ??
      (error.code === 'ERR_NETWORK'
        ? getHumanErrorMessage('NETWORK_ERROR')
        : getHumanErrorMessage('UNKNOWN_ERROR'));

    return Promise.reject(new Error(message));
  },
);

export function extractData<T>(response: { data: { success: boolean; data?: T; message?: string } }): T {
  if (!response.data.success || response.data.data === undefined) {
    throw new Error(response.data.message ?? getHumanErrorMessage('UNKNOWN_ERROR'));
  }
  return response.data.data;
}
