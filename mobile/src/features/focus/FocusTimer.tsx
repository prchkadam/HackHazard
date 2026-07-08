import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { AppScreen } from '@/components/AppScreen';
import { createTextStyle, Spacing, Radius } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { apiFinishSession } from '@/services/api/focus';

function pad(n: number) {
  return String(n).padStart(2, '0');
}

export function FocusTimer() {
  const theme = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams<{
    sessionId: string;
    topic: string;
    plannedDuration: string;
    startedAt: string;
  }>();

  const totalSeconds = Number(params.plannedDuration) * 60;

  const startMs = useRef(Date.now());
  const [elapsed, setElapsed] = useState(0);
  const [paused, setPaused] = useState(false);
  const [finishing, setFinishing] = useState(false);
  const pauseStart = useRef<number | null>(null);
  const pausedTotal = useRef(0);

  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.04, duration: 4000, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 4000, useNativeDriver: true }),
      ]),
    ).start();
  }, [pulse]);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      const now = Date.now();
      const actual = Math.floor((now - startMs.current - pausedTotal.current) / 1000);
      setElapsed(actual);
    }, 1000);
    return () => clearInterval(id);
  }, [paused]);

  const remaining = Math.max(0, totalSeconds - elapsed);
  const mm = Math.floor(remaining / 60);
  const ss = remaining % 60;
  const progress = elapsed / totalSeconds;

  function handlePause() {
    if (paused) {
      pausedTotal.current += Date.now() - (pauseStart.current ?? Date.now());
      pauseStart.current = null;
    } else {
      pauseStart.current = Date.now();
    }
    setPaused((p) => !p);
  }

  const handleFinish = useCallback(async () => {
    if (finishing) return;
    setFinishing(true);
    try {
      await apiFinishSession(params.sessionId, elapsed);
      router.push({
        pathname: '/focus/complete',
        params: {
          sessionId: params.sessionId,
          topic: params.topic,
          plannedDuration: params.plannedDuration,
          actualDuration: String(elapsed),
        },
      });
    } catch {
      Alert.alert('Error', "Couldn't save your session. Please try again.");
      setFinishing(false);
    }
  }, [elapsed, finishing, params, router]);

  // Auto-finish when timer hits 0
  useEffect(() => {
    if (remaining === 0 && !finishing) {
      void handleFinish();
    }
  }, [remaining, finishing, handleFinish]);

  const circumference = 2 * Math.PI * 120;
  const strokeDash = circumference * (1 - progress);

  return (
    <AppScreen scrollable={false} padded={false}>
      <View style={styles.container}>
        <Text style={[styles.topic, { color: theme.textSecondary }]} numberOfLines={2}>
          {params.topic}
        </Text>

        <Animated.View style={[styles.ringWrapper, { transform: [{ scale: pulse }] }]}>
          {/* SVG-like ring using border */}
          <View
            style={[
              styles.ring,
              {
                borderColor: theme.primary,
                borderTopColor: theme.borderLight,
              },
            ]}
          />
          <View style={styles.timerCenter}>
            <Text style={[styles.timerText, { color: theme.text }]}>
              {pad(mm)}:{pad(ss)}
            </Text>
            <Text style={[styles.timerLabel, { color: theme.textMuted }]}>
              {paused ? 'Paused' : 'Remaining'}
            </Text>
          </View>
        </Animated.View>

        <Text style={[styles.progressLabel, { color: theme.textMuted }]}>
          {Math.round(progress * 100)}% complete
        </Text>

        <View style={styles.actions}>
          <TouchableOpacity
            onPress={handlePause}
            style={[styles.actionBtn, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}
          >
            <Text style={[styles.actionText, { color: theme.text }]}>
              {paused ? '▶ Resume' : '⏸ Pause'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleFinish}
            disabled={finishing}
            style={[styles.finishBtn, { backgroundColor: theme.primary }]}
          >
            <Text style={[styles.finishText, { color: theme.white }]}>
              {finishing ? 'Saving…' : 'Finish Early'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xxl,
    gap: Spacing.xl,
  },
  topic: {
    ...createTextStyle('md', 'medium'),
    textAlign: 'center',
  },
  ringWrapper: {
    width: 260,
    height: 260,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    borderWidth: 8,
  },
  timerCenter: {
    alignItems: 'center',
  },
  timerText: {
    ...createTextStyle('display', 'bold'),
    fontSize: 56,
    lineHeight: 64,
  },
  timerLabel: {
    ...createTextStyle('sm', 'regular'),
    marginTop: 4,
  },
  progressLabel: {
    ...createTextStyle('sm', 'medium'),
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.lg,
  },
  actionBtn: {
    flex: 1,
    borderRadius: Radius.button,
    borderWidth: 1,
    padding: Spacing.md,
    alignItems: 'center',
  },
  actionText: {
    ...createTextStyle('md', 'semiBold'),
  },
  finishBtn: {
    flex: 1,
    borderRadius: Radius.button,
    padding: Spacing.md,
    alignItems: 'center',
  },
  finishText: {
    ...createTextStyle('md', 'semiBold'),
  },
});
