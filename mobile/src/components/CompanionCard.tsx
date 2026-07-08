import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Radius, Shadow, Spacing, createTextStyle } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { CompanionStage, CompanionMood } from '@/types/companion';

export interface CompanionCardProps {
  stage?: CompanionStage;
  mood?: CompanionMood;
  compact?: boolean;
}

const STAGE_LABELS: Record<CompanionStage, string> = {
  seed: 'A tiny seed of potential',
  growing: 'Growing steadily',
  bloomed: 'In full bloom',
};

function CompanionCardComponent({
  stage = 'seed',
  mood = 'calm',
  compact = false,
}: CompanionCardProps) {
  const theme = useTheme();

  const size = compact ? 64 : 120;
  const glowSize = compact ? 80 : 140;

  return (
    <View
      style={[styles.container, compact && styles.compactContainer]}
      accessibilityLabel={`Your companion, currently ${STAGE_LABELS[stage]}, feeling ${mood}`}
    >
      <View
        style={[
          styles.glow,
          {
            width: glowSize,
            height: glowSize,
            borderRadius: glowSize / 2,
            backgroundColor: theme.companionGlow,
          },
        ]}
      />
      <View
        style={[
          styles.companion,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: theme.primary,
          },
          Shadow.lg,
        ]}
      >
        <Text style={[createTextStyle(compact ? 'lg' : 'xxl', 'bold'), { color: theme.white }]}>
          ✦
        </Text>
      </View>
      {!compact ? (
        <Text style={[createTextStyle('sm'), styles.label, { color: theme.textSecondary }]}>
          {STAGE_LABELS[stage]}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxl,
  },
  compactContainer: {
    paddingVertical: Spacing.lg,
  },
  glow: {
    position: 'absolute',
  },
  companion: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.full,
  },
  label: {
    marginTop: Spacing.lg,
    textAlign: 'center',
  },
});

export const CompanionCard = memo(CompanionCardComponent);
