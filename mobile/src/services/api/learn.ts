import { apiClient, extractData } from '@/services/api/client';
import type { ChatResponse } from '@/types/learn';

export async function sendChatMessage(payload: {
  mentorId: string;
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>;
  currentMessage: string;
}): Promise<ChatResponse> {
  const response = await apiClient.post<{ success: boolean; data: ChatResponse }>(
    '/api/chat',
    payload,
  );
  return extractData(response);
}
