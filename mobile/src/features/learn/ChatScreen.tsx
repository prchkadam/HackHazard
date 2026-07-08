import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/use-theme';
import { useLearnHistory } from './hooks/useLearnHistory';
import { sendChatMessage } from '@/services/api/learn';
import { MentorHeader } from './components/MentorHeader';
import { MessageBubble } from './components/MessageBubble';
import { UserBubble } from './components/UserBubble';
import { QuizView } from './components/QuizView';
import { PracticeView } from './components/PracticeView';
import { TypingIndicator } from './components/TypingIndicator';
import { Spacing, createTextStyle } from '@/constants/theme';
import type { MentorId, QuickActionType } from '@/types/learn';
import { QUICK_ACTION_PROMPTS } from '@/types/learn';

export function ChatScreen() {
  const theme = useTheme();
  const params = useLocalSearchParams<{ conversationId: string; initialMessage?: string }>();
  const flatListRef = useRef<FlatList>(null);

  const {
    getConversation,
    addMessageToConversation,
    updateConversationTitle,
  } = useLearnHistory();

  const conversation = useMemo(() => {
    return getConversation(params.conversationId);
  }, [getConversation, params.conversationId]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const activeMentorId = (conversation?.mentorId ?? 'ved') as MentorId;

  // Auto-send initial message if conversation is empty
  useEffect(() => {
    if (params.initialMessage && conversation && conversation.messages.length === 0) {
      handleSendMessage(params.initialMessage);
    }
  }, [params.initialMessage, conversation]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || loading) return;
    setInput('');
    setError(null);
    setLoading(true);

    try {
      // 1. Add User Message
      await addMessageToConversation(params.conversationId, {
        role: 'user',
        content: text.trim(),
      });

      // 2. Format history for backend API request
      const history = (conversation?.messages ?? []).map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      // 3. Request AI Response
      const response = await sendChatMessage({
        mentorId: activeMentorId,
        conversationHistory: history,
        currentMessage: text.trim(),
      });

      // 4. Update Title if it was empty / untitled
      if (conversation && (!conversation.title || conversation.title.startsWith("Let's learn"))) {
        await updateConversationTitle(params.conversationId, response.title);
      }

      // 5. Add Mentor Response with optional quiz / practice / suggestedQuestions
      await addMessageToConversation(params.conversationId, {
        role: 'assistant',
        content: response.message,
        quiz: response.quiz,
        practice: response.practice,
        suggestedQuestions: response.suggestedQuestions,
      });

      // Scroll to bottom
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (err) {
      setError("I'm having a little trouble connecting right now. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = (actionType: QuickActionType) => {
    const prompt = QUICK_ACTION_PROMPTS[actionType];
    handleSendMessage(prompt);
  };

  // Get suggested follow-up questions from the last assistant message
  const suggestedFollowUps = useMemo(() => {
    if (!conversation || conversation.messages.length === 0 || loading) return [];
    const lastMsg = conversation.messages[conversation.messages.length - 1];
    if (lastMsg.role === 'assistant' && lastMsg.suggestedQuestions) {
      return lastMsg.suggestedQuestions;
    }
    return [];
  }, [conversation, loading]);

  const renderItem = ({ item }: { item: any }) => {
    if (item.role === 'user') {
      return <UserBubble message={item} />;
    }

    return (
      <View style={styles.assistantMessageContainer}>
        <MessageBubble message={item} />
        {item.quiz && item.quiz.length > 0 && <QuizView quiz={item.quiz} />}
        {item.practice && item.practice.length > 0 && <PracticeView practice={item.practice} />}
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top', 'bottom']}>
      <MentorHeader mentorId={activeMentorId} />

      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={conversation?.messages ?? []}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.messageList}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />

        {loading && (
          <View style={styles.loadingContainer}>
            <TypingIndicator />
          </View>
        )}

        {error && (
          <View style={styles.errorContainer}>
            <Text style={[createTextStyle('sm'), { color: theme.error }]}>{error}</Text>
            <Pressable
              onPress={() => {
                const lastUserMsg = conversation?.messages
                  .filter((m) => m.role === 'user')
                  .pop();
                if (lastUserMsg) {
                  handleSendMessage(lastUserMsg.content);
                }
              }}
              style={[styles.retryButton, { borderColor: theme.error }]}
            >
              <Text style={[createTextStyle('xs', 'semiBold'), { color: theme.error }]}>Retry</Text>
            </Pressable>
          </View>
        )}

        {/* Suggested Actions (explain, quiz, practice, etc.) */}
        {!loading && !error && conversation && conversation.messages.length > 0 && (
          <View style={styles.actionsWrapper}>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={[
                { type: 'explain_simpler', label: 'Explain Simpler' },
                { type: 'give_example', label: 'Give Example' },
                { type: 'quiz_me', label: 'Quiz Me' },
                { type: 'practice', label: 'Practice' },
                { type: 'summarize', label: 'Summarize' },
              ]}
              keyExtractor={(item) => item.type}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => handleQuickAction(item.type as QuickActionType)}
                  style={[styles.actionPill, { borderColor: theme.borderLight, backgroundColor: theme.backgroundElement }]}
                >
                  <Text style={[createTextStyle('xs', 'medium'), { color: theme.textSecondary }]}>
                    {item.label}
                  </Text>
                </Pressable>
              )}
              contentContainerStyle={styles.actionsList}
            />
          </View>
        )}

        {/* Suggested Follow-up chips */}
        {suggestedFollowUps.length > 0 && (
          <View style={styles.followUpsWrapper}>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={suggestedFollowUps}
              keyExtractor={(item, index) => `${item}-${index}`}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => handleSendMessage(item)}
                  style={[styles.followUpChip, { backgroundColor: theme.backgroundSelected }]}
                >
                  <Text style={[createTextStyle('xs', 'medium'), { color: theme.primary }]} numberOfLines={1}>
                    {item}
                  </Text>
                </Pressable>
              )}
              contentContainerStyle={styles.followUpsList}
            />
          </View>
        )}

        {/* Chat Input Bar */}
        <View style={[styles.inputBar, { borderTopColor: theme.borderLight, backgroundColor: theme.background }]}>
          <TextInput
            placeholder="Type a message..."
            placeholderTextColor={theme.textMuted}
            style={[createTextStyle('md'), styles.textInput, { color: theme.text }]}
            value={input}
            onChangeText={setInput}
            onSubmitEditing={() => handleSendMessage(input)}
            editable={!loading}
          />
          <Pressable
            onPress={() => handleSendMessage(input)}
            disabled={!input.trim() || loading}
            style={[
              styles.sendButton,
              {
                backgroundColor: input.trim() && !loading ? theme.primary : theme.border,
              },
            ]}
            accessibilityRole="button"
          >
            <Text style={[createTextStyle('xs', 'bold'), { color: theme.white }]}>Send</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardContainer: {
    flex: 1,
  },
  messageList: {
    padding: Spacing.md,
    paddingBottom: Spacing.lg,
  },
  assistantMessageContainer: {
    marginVertical: Spacing.xs,
  },
  loadingContainer: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
    marginHorizontal: Spacing.md,
    borderRadius: 8,
    backgroundColor: '#FDF2F2',
    marginBottom: Spacing.sm,
  },
  retryButton: {
    borderWidth: 1.5,
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
    borderRadius: 14,
  },
  actionsWrapper: {
    height: 48,
    justifyContent: 'center',
  },
  actionsList: {
    paddingHorizontal: Spacing.md,
    gap: Spacing.xs,
    alignItems: 'center',
  },
  actionPill: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  followUpsWrapper: {
    height: 44,
    justifyContent: 'center',
  },
  followUpsList: {
    paddingHorizontal: Spacing.md,
    gap: Spacing.xs,
    alignItems: 'center',
  },
  followUpChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: 16,
    maxWidth: 240,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderTopWidth: 1,
    height: 64,
  },
  textInput: {
    flex: 1,
    height: 40,
    paddingHorizontal: Spacing.md,
    borderRadius: 20,
    borderWidth: 0,
  },
  sendButton: {
    paddingHorizontal: Spacing.lg,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Spacing.sm,
  },
});
