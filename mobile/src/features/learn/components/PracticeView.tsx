import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AppCard } from '@/components/AppCard';
import { Spacing, createTextStyle } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

interface PracticeQuestion {
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
}

interface PracticeViewProps {
  practice: PracticeQuestion[];
}

export function PracticeView({ practice }: PracticeViewProps) {
  const theme = useTheme();

  const getDifficultyBadge = (diff: 'easy' | 'medium' | 'hard') => {
    switch (diff) {
      case 'easy':
        return { label: 'Easy', bg: '#DEF7EC', text: '#03543F' };
      case 'medium':
        return { label: 'Medium', bg: '#FEF08A', text: '#713F12' };
      case 'hard':
        return { label: 'Hard', bg: '#FDE8E8', text: '#9B1C1C' };
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[createTextStyle('md', 'bold'), styles.header, { color: theme.text }]}>
        Practice Exercises
      </Text>
      {practice.map((item, idx) => {
        const badge = getDifficultyBadge(item.difficulty);

        return (
          <AppCard key={idx} style={styles.card}>
            <View style={styles.row}>
              <View style={[styles.badge, { backgroundColor: badge.bg }]}>
                <Text style={[createTextStyle('xs', 'bold'), { color: badge.text }]}>
                  {badge.label}
                </Text>
              </View>
              <Text style={[createTextStyle('sm', 'bold'), { color: theme.textMuted }]}>
                Exercise {idx + 1}
              </Text>
            </View>
            <Text style={[createTextStyle('sm'), styles.question, { color: theme.text }]}>
              {item.question}
            </Text>
          </AppCard>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: Spacing.md,
  },
  header: {
    marginBottom: Spacing.sm,
    paddingHorizontal: Spacing.xs,
  },
  card: {
    marginBottom: Spacing.md,
    padding: Spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: 6,
  },
  question: {
    lineHeight: 20,
  },
});
