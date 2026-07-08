import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { Text } from 'react-native';
import type { FocusGrowth } from '@/services/api/focus';

const MOOD_EMOJI: Record<FocusGrowth['mood'], string> = {
  calm: '🌱',
  thinking: '🤔',
  waiting: '💭',
  proud: '✨',
  growing: '🌿',
};

const STAGE_EMOJI: Record<FocusGrowth['stage'], string> = {
  seed: '🌱',
  growing: '🌿',
  bloomed: '🌸',
};

interface MoodAnimationProps {
  growth: FocusGrowth;
  size?: 'sm' | 'md' | 'lg';
}

export function MoodAnimation({ growth, size = 'md' }: MoodAnimationProps) {
  const pulse = useRef(new Animated.Value(1)).current;
  const glow = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.08, duration: 1800, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 1800, useNativeDriver: true }),
      ]),
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(glow, { toValue: 1, duration: 2000, useNativeDriver: true }),
        Animated.timing(glow, { toValue: 0, duration: 2000, useNativeDriver: true }),
      ]),
    ).start();
  }, [glow, pulse]);

  const emojiSize = size === 'sm' ? 32 : size === 'lg' ? 72 : 52;
  const containerSize = size === 'sm' ? 56 : size === 'lg' ? 110 : 80;

  const emoji = growth.mood === 'calm' ? STAGE_EMOJI[growth.stage] : MOOD_EMOJI[growth.mood];

  return (
    <View style={[styles.wrapper, { width: containerSize, height: containerSize }]}>
      <Animated.View
        style={[
          styles.glowRing,
          {
            width: containerSize,
            height: containerSize,
            borderRadius: containerSize / 2,
            opacity: glow.interpolate({ inputRange: [0, 1], outputRange: [0.15, 0.4] }),
          },
        ]}
      />
      <Animated.View style={{ transform: [{ scale: pulse }] }}>
        <Text style={{ fontSize: emojiSize }}>{emoji}</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowRing: {
    position: 'absolute',
    backgroundColor: 'rgba(129, 140, 248, 0.3)',
  },
});
