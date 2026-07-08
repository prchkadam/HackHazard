import { useState, useEffect, useCallback } from 'react';
import { getSecureJson, setSecureJson } from '@/services/storage/secureStorage';
import type { Conversation, ConversationMessage, MentorId } from '@/types/learn';

const CONVERSATIONS_KEY = 'avati_learn_conversations';

export function useLearnHistory() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadConversations() {
      try {
        const stored = await getSecureJson<Conversation[]>(CONVERSATIONS_KEY);
        if (stored) {
          setConversations(stored);
        }
      } catch {
        // Fallback gracefully
      } finally {
        setLoading(false);
      }
    }
    loadConversations();
  }, []);

  const saveConversations = useCallback(async (newConversations: Conversation[]) => {
    setConversations(newConversations);
    await setSecureJson(CONVERSATIONS_KEY, newConversations);
  }, []);

  const createConversation = useCallback(
    async (mentorId: MentorId, title: string): Promise<string> => {
      const id = `conv_${Date.now()}`;
      const newConv: Conversation = {
        id,
        title,
        mentorId,
        messages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const updated = [newConv, ...conversations];
      await saveConversations(updated);
      return id;
    },
    [conversations, saveConversations],
  );

  const getConversation = useCallback(
    (id: string): Conversation | undefined => {
      return conversations.find((c) => c.id === id);
    },
    [conversations],
  );

  const addMessageToConversation = useCallback(
    async (
      conversationId: string,
      message: {
        role: 'user' | 'assistant';
        content: string;
        quiz?: any;
        practice?: any;
        suggestedQuestions?: string[];
      },
    ) => {
      const newMessage: ConversationMessage = {
        id: `msg_${Date.now()}`,
        role: message.role,
        content: message.content,
        timestamp: new Date().toISOString(),
        quiz: message.quiz,
        practice: message.practice,
        suggestedQuestions: message.suggestedQuestions,
      };

      const updated = conversations.map((conv) => {
        if (conv.id === conversationId) {
          return {
            ...conv,
            messages: [...conv.messages, newMessage],
            updatedAt: new Date().toISOString(),
          };
        }
        return conv;
      });

      await saveConversations(updated);
    },
    [conversations, saveConversations],
  );

  const updateConversationTitle = useCallback(
    async (conversationId: string, newTitle: string) => {
      const updated = conversations.map((conv) => {
        if (conv.id === conversationId) {
          return {
            ...conv,
            title: newTitle,
            updatedAt: new Date().toISOString(),
          };
        }
        return conv;
      });

      await saveConversations(updated);
    },
    [conversations, saveConversations],
  );

  const deleteConversation = useCallback(
    async (id: string) => {
      const updated = conversations.filter((c) => c.id !== id);
      await saveConversations(updated);
    },
    [conversations, saveConversations],
  );

  return {
    conversations,
    loading,
    createConversation,
    getConversation,
    addMessageToConversation,
    updateConversationTitle,
    deleteConversation,
  };
}
