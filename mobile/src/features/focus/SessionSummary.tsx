import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AppCard } from '@/components/AppCard';
import { createTextStyle, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

interface SessionSummaryProps {
  topic: string;
  plannedDuration: number;
  actualDuration: number;
}

function formatMinutes(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  if (m === 0) return `${s}s`;
  if (s === 0) return `${m}m`;
  return `${m}m ${s}s`;
}

export function SessionSummary({ topic, plannedDuration, actualDuration }: SessionSummaryProps) {
  const theme = useTheme();

  return (
    <AppCard style={styles.card}>
      <Text style={[styles.topic, { color: theme.text }]}>{topic}</Text>

      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={[styles.statValue, { color: theme.primary }]}>
            {formatMinutes(actualDuration)}
          </Text>
          <Text style={[styles.statLabel, { color: theme.textMuted }]}>Focused for</Text>
        </View>
        <View style={[styles.divider, { backgroundColor: theme.borderLight }]} />
        <View style={styles.stat}>
          <Text style={[styles.statValue, { color: theme.textSecondary }]}>
            {plannedDuration}m
          </Text>
          <Text style={[styles.statLabel, { color: theme.textMuted }]}>Planned</Text>
        </View>
      </View>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: Spacing.md,
  },
  topic: {
    ...createTextStyle('md', 'semiBold'),
    marginBottom: Spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    ...createTextStyle('xxl', 'bold'),
  },
  statLabel: {
    ...createTextStyle('xs', 'medium'),
    marginTop: 2,
  },
  divider: {
    width: 1,
    height: 40,
  },
});
