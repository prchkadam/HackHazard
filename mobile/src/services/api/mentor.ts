import { apiClient, extractData } from '@/services/api/client';
import type { Mentor, SelectMentorPayload } from '@/types/mentor';

export async function fetchMentors(): Promise<Mentor[]> {
  const response = await apiClient.get<{ success: boolean; data: Mentor[] }>('/mentors');
  return extractData(response);
}

export async function selectMentor(payload: SelectMentorPayload): Promise<void> {
  await apiClient.post('/mentor/select', payload);
}
