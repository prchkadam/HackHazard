import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AppCard } from '@/components/AppCard';
import { Spacing, createTextStyle } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { Subject } from '@/types/learn';

interface SubjectCardProps {
  subject: Subject;
  onPress: () => void;
}

function SubjectCardComponent({ subject, onPress }: SubjectCardProps) {
  const theme = useTheme();

  return (
    <AppCard onPress={onPress} style={styles.card}>
      <View style={[styles.emojiContainer, { backgroundColor: subject.color + '15' }]}>
        <Text style={styles.emoji}>{subject.emoji}</Text>
      </View>
      <Text
        style={[createTextStyle('sm', 'semiBold'), styles.title, { color: theme.text }]}
        numberOfLines={2}
      >
        {subject.title}
      </Text>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: Spacing.xs,
    padding: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 100,
    aspectRatio: 1,
  },
  emojiContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  emoji: {
    fontSize: 24,
  },
  title: {
    textAlign: 'center',
  },
});

export const SubjectCard = memo(SubjectCardComponent);
