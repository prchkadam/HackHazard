import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AppCard } from '@/components/AppCard';
import { Spacing, createTextStyle } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { MENTOR_OPTIONS } from '@/constants/mentors';
import type { Conversation } from '@/types/learn';

interface TopicCardProps {
  conversation: Conversation;
  onPress: () => void;
}

function TopicCardComponent({ conversation, onPress }: TopicCardProps) {
  const theme = useTheme();
  const mentor = MENTOR_OPTIONS.find((m) => m.id === conversation.mentorId);

  const formattedDate = new Date(conversation.updatedAt).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <AppCard onPress={onPress} style={styles.card}>
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text style={[createTextStyle('md', 'semiBold'), { color: theme.text }]} numberOfLines={1}>
            {conversation.title || 'Untitled Session'}
          </Text>
          <Text style={[createTextStyle('xs'), styles.subtitle, { color: theme.textSecondary }]}>
            with {mentor?.name ?? 'Mentor'} • {formattedDate}
          </Text>
        </View>
        <View style={[styles.badge, { backgroundColor: theme.backgroundSelected }]}>
          <Text style={[createTextStyle('xs', 'medium'), { color: theme.primary }]}>
            {conversation.messages.length} messages
          </Text>
        </View>
      </View>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: Spacing.sm,
    padding: Spacing.lg,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textContainer: {
    flex: 1,
    marginRight: Spacing.md,
  },
  subtitle: {
    marginTop: Spacing.xs,
  },
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs / 2,
    borderRadius: 8,
  },
});

export const TopicCard = memo(TopicCardComponent);
