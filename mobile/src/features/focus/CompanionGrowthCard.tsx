import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AppCard } from '@/components/AppCard';
import { MoodAnimation } from './MoodAnimation';
import { createTextStyle, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { FocusGrowth } from '@/services/api/focus';

const STAGE_LABEL: Record<FocusGrowth['stage'], string> = {
  seed: 'Just Planted',
  growing: 'Growing',
  bloomed: 'Fully Bloomed',
};

const MOOD_LABEL: Record<FocusGrowth['mood'], string> = {
  calm: 'Calm & ready',
  thinking: 'Deep in thought',
  waiting: 'Patiently waiting',
  proud: 'Feeling proud',
  growing: 'Actively growing',
};

interface CompanionGrowthCardProps {
  growth: FocusGrowth;
}

export function CompanionGrowthCard({ growth }: CompanionGrowthCardProps) {
  const theme = useTheme();

  return (
    <AppCard style={styles.card}>
      <View style={styles.row}>
        <MoodAnimation growth={growth} size="md" />
        <View style={styles.info}>
          <Text style={[styles.stageName, { color: theme.text }]}>{STAGE_LABEL[growth.stage]}</Text>
          <Text style={[styles.moodText, { color: theme.textSecondary }]}>{MOOD_LABEL[growth.mood]}</Text>
        </View>
      </View>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: Spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
  },
  info: {
    flex: 1,
  },
  stageName: {
    ...createTextStyle('lg', 'semiBold'),
    marginBottom: 4,
  },
  moodText: {
    ...createTextStyle('sm', 'regular'),
  },
});
