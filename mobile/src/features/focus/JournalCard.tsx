import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AppCard } from '@/components/AppCard';
import { createTextStyle, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { FocusJournal } from '@/services/api/focus';

interface JournalCardProps {
  journal: FocusJournal;
}

export function JournalCard({ journal }: JournalCardProps) {
  const theme = useTheme();

  return (
    <AppCard style={styles.card}>
      <Text style={[styles.heading, { color: theme.primary }]}>📖 Your Journal</Text>

      <View style={styles.section}>
        <Text style={[styles.label, { color: theme.textMuted }]}>Summary</Text>
        <Text style={[styles.body, { color: theme.text }]}>{journal.summary}</Text>
      </View>

      <View style={[styles.divider, { backgroundColor: theme.borderLight }]} />

      <View style={styles.section}>
        <Text style={[styles.label, { color: theme.textMuted }]}>Reflection</Text>
        <Text style={[styles.body, { color: theme.text }]}>{journal.reflection}</Text>
      </View>

      <View style={[styles.divider, { backgroundColor: theme.borderLight }]} />

      <View style={[styles.encouragementBox, { backgroundColor: theme.primaryLight }]}>
        <Text style={[styles.encouragement, { color: theme.primary }]}>
          ✨ {journal.encouragement}
        </Text>
      </View>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: Spacing.md,
  },
  heading: {
    ...createTextStyle('md', 'bold'),
    marginBottom: Spacing.lg,
  },
  section: {
    marginBottom: Spacing.md,
  },
  label: {
    ...createTextStyle('xs', 'medium'),
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: Spacing.xs,
  },
  body: {
    ...createTextStyle('sm', 'regular'),
    lineHeight: 22,
  },
  divider: {
    height: 1,
    marginVertical: Spacing.md,
  },
  encouragementBox: {
    borderRadius: 12,
    padding: Spacing.md,
    marginTop: Spacing.xs,
  },
  encouragement: {
    ...createTextStyle('sm', 'medium'),
    fontStyle: 'italic',
    lineHeight: 22,
  },
});
