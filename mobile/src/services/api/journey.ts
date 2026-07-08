import { apiClient, extractData } from './client';

export interface JourneyItem {
  id: string;
  type: 'focus' | 'reflection' | 'journal' | 'growth' | 'letter' | 'message';
  title: string;
  description: string;
  date: string;
  companionMood?: 'calm' | 'proud' | 'growing' | 'thinking' | 'waiting';
  meta?: {
    reflection?: string;
    encouragement?: string;
    mentorId?: string;
  };
}

export async function apiFetchJourneyTimeline(): Promise<JourneyItem[]> {
  const res = await apiClient.get('/journey');
  return extractData(res);
}

export async function apiSeedDemoData(): Promise<{ token: string; user: any }> {
  const res = await apiClient.post('/auth/demo/seed');
  return extractData(res);
}
