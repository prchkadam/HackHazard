import { apiClient, extractData } from './client';

export interface FocusSession {
  id: string;
  userId: string;
  topic: string;
  plannedDuration: number;
  actualDuration: number | null;
  startedAt: string;
  endedAt: string | null;
  status: 'pending' | 'running' | 'completed';
  reflectionDone: boolean;
  journal: FocusJournal | null;
  growth: FocusGrowth;
}

export interface FocusJournal {
  summary: string;
  reflection: string;
  encouragement: string;
  createdAt: string;
}

export interface FocusGrowth {
  stage: 'seed' | 'growing' | 'bloomed';
  mood: 'calm' | 'proud' | 'growing' | 'thinking' | 'waiting';
}

export interface ReflectionInput {
  topic: string;
  learned: string;
  difficult: string;
  nextSteps: string;
}

export async function apiStartSession(
  topic: string,
  plannedDuration: number,
): Promise<{ sessionId: string; startedAt: string }> {
  const res = await apiClient.post('/focus/session', { topic, plannedDuration });
  return extractData(res);
}

export async function apiFinishSession(
  sessionId: string,
  actualDuration: number,
): Promise<{ updated: boolean }> {
  const res = await apiClient.patch(`/focus/session/${sessionId}`, {
    actualDuration,
    status: 'completed',
  });
  return extractData(res);
}

export async function apiSubmitReflection(
  sessionId: string,
  data: ReflectionInput,
): Promise<{ journal: FocusJournal; growth: FocusGrowth }> {
  const res = await apiClient.post(`/focus/session/${sessionId}/reflection`, data);
  return extractData(res);
}

export async function apiFetchHistory(): Promise<{
  sessions: FocusSession[];
  growth: FocusGrowth;
}> {
  const res = await apiClient.get('/focus/history');
  return extractData(res);
}
