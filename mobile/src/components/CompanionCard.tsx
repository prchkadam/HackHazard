import React, { memo, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, Animated, Easing } from 'react-native';
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
  const glowSize1 = compact ? 80 : 160;
  const glowSize2 = compact ? 96 : 200;

  // Animation values
  const pulseAnim1 = useRef(new Animated.Value(1)).current;
  const pulseAnim2 = useRef(new Animated.Value(1)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Primary breathing pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim1, {
          toValue: 1.1,
          duration: 2500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim1, {
          toValue: 0.95,
          duration: 2500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Out-of-phase secondary pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim2, {
          toValue: 0.9,
          duration: 3000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim2, {
          toValue: 1.15,
          duration: 3000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Gentle float loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -8,
          duration: 3500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 3500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <View
      style={[styles.container, compact && styles.compactContainer]}
      accessibilityLabel={`Your companion, currently ${STAGE_LABELS[stage]}, feeling ${mood}`}
    >
      {/* Outer Glow Ring */}
      <Animated.View
        style={[
          styles.glow,
          {
            width: glowSize2,
            height: glowSize2,
            borderRadius: glowSize2 / 2,
            backgroundColor: theme.companionGlow,
            opacity: 0.25,
            transform: [{ scale: pulseAnim2 }],
          },
        ]}
      />
      
      {/* Inner Glow Ring */}
      <Animated.View
        style={[
          styles.glow,
          {
            width: glowSize1,
            height: glowSize1,
            borderRadius: glowSize1 / 2,
            backgroundColor: theme.companionGlow,
            opacity: 0.5,
            transform: [{ scale: pulseAnim1 }],
          },
        ]}
      />

      {/* Companion Body */}
      <Animated.View
        style={[
          styles.companion,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: theme.primary,
            transform: [{ translateY: floatAnim }],
          },
          Shadow.lg,
        ]}
      >
        <Text style={[createTextStyle(compact ? 'lg' : 'xxl', 'bold'), { color: theme.white }]}>
          ✦
        </Text>
      </Animated.View>

      {!compact ? (
        <Text style={[createTextStyle('sm', 'medium'), styles.label, { color: theme.textSecondary }]}>
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
    paddingVertical: Spacing.xxxl,
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
    marginTop: Spacing.xxl,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
});

export const CompanionCard = memo(CompanionCardComponent);
