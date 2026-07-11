import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, TextInput, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { AppScreen } from '@/components/AppScreen';
import { AppButton } from '@/components/AppButton';
import { useAuth } from '@/hooks/useAuth';
import { MENTOR_OPTIONS } from '@/constants/mentors';
import { POPULAR_SUBJECTS } from '@/types/learn';
import { useLearnHistory } from './hooks/useLearnHistory';
import { SubjectCard } from './components/SubjectCard';
import { TopicCard } from './components/TopicCard';
import { Spacing, createTextStyle, Radius } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export function LearnScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { user } = useAuth();
  const { conversations, createConversation } = useLearnHistory();
  const [query, setQuery] = useState('');

  const mentor = MENTOR_OPTIONS.find((m) => m.id === user?.mentorId) || MENTOR_OPTIONS[0];

  const handleStartChat = async (initialQuery: string) => {
    if (!initialQuery.trim()) return;
    const conversationId = await createConversation(mentor.id as any, initialQuery.trim());
    setQuery('');
    router.push({
      pathname: '/learn/chat',
      params: { conversationId, initialMessage: initialQuery.trim() },
    });
  };

  const handleResumeChat = (conversationId: string) => {
    router.push({
      pathname: '/learn/chat',
      params: { conversationId },
    });
  };

  return (
    <AppScreen style={styles.screen}>
      <View style={styles.header}>
        <Text style={[createTextStyle('lg', 'medium'), { color: theme.textSecondary }]}>
          Hello!
        </Text>
        <Text style={[createTextStyle('xxxl', 'bold'), { color: theme.text }]}>
          I'm {mentor.name}.
        </Text>
        <Text style={[createTextStyle('md'), styles.welcomeText, { color: theme.textSecondary }]}>
          {mentor.description}
        </Text>
      </View>

      <View style={styles.avatarSection}>
        <View style={[styles.avatarCircle, { backgroundColor: mentor.accentColor }]}>
          <Text style={[createTextStyle('xxxl', 'bold'), { color: theme.white }]}>
            {mentor.name[0]}
          </Text>
        </View>
        <Text style={[createTextStyle('md', 'semiBold'), styles.askPrompt, { color: theme.text }]}>
          What would you like to learn today?
        </Text>
      </View>

      {/* Ask Anything Input */}
      <View style={[styles.inputContainer, { borderColor: theme.borderLight, backgroundColor: theme.backgroundElement }]}>
        <TextInput
          placeholder="Ask me anything..."
          placeholderTextColor={theme.textMuted}
          style={[createTextStyle('md'), styles.input, { color: theme.text }]}
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={() => handleStartChat(query)}
        />
        <Pressable
          style={[styles.sendButton, { backgroundColor: theme.primary }]}
          onPress={() => handleStartChat(query)}
          accessibilityRole="button"
        >
          <Text style={[createTextStyle('xs', 'bold'), { color: theme.white }]}>Ask</Text>
        </Pressable>
      </View>

      {/* Popular Subjects */}
      <View style={styles.section}>
        <Text style={[createTextStyle('md', 'bold'), styles.sectionTitle, { color: theme.text }]}>
          Popular Subjects
        </Text>
        <View style={styles.subjectsGrid}>
          {POPULAR_SUBJECTS.map((subject) => (
            <SubjectCard
              key={subject.id}
              subject={subject}
              onPress={() => handleStartChat(`Let's learn about ${subject.title}`)}
            />
          ))}
        </View>
      </View>

      {/* Continue Learning */}
      {conversations.length > 0 && (
        <View style={styles.section}>
          <Text style={[createTextStyle('md', 'bold'), styles.sectionTitle, { color: theme.text }]}>
            Continue Learning
          </Text>
          {conversations.slice(0, 5).map((conv) => (
            <TopicCard
              key={conv.id}
              conversation={conv}
              onPress={() => handleResumeChat(conv.id)}
            />
          ))}
        </View>
      )}
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingBottom: Spacing.huge,
  },
  header: {
    marginTop: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  welcomeText: {
    marginTop: Spacing.xs,
    lineHeight: 20,
  },
  avatarSection: {
    alignItems: 'center',
    marginVertical: Spacing.lg,
  },
  avatarCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  askPrompt: {
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: Radius.input,
    paddingLeft: Spacing.md,
    paddingRight: Spacing.xs,
    height: 48,
    marginBottom: Spacing.xl,
  },
  input: {
    flex: 1,
    paddingVertical: 8,
  },
  sendButton: {
    paddingHorizontal: Spacing.md,
    height: 36,
    borderRadius: Radius.button,
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    marginBottom: Spacing.sm,
  },
  subjectsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: Spacing.xs,
  },
});
