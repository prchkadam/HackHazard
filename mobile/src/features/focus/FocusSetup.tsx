import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { AppScreen } from '@/components/AppScreen';
import { DurationPicker } from './DurationPicker';
import { createTextStyle, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { apiStartSession } from '@/services/api/focus';

export function FocusSetup() {
  const theme = useTheme();
  const router = useRouter();
  const [topic, setTopic] = useState('');
  const [duration, setDuration] = useState(25);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const canStart = topic.trim().length > 0 && !loading;

  const finishTime = new Date(Date.now() + duration * 60 * 1000).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  async function handleStart() {
    if (!canStart) return;
    setLoading(true);
    setError('');
    try {
      const result = await apiStartSession(topic.trim(), duration);
      router.push({
        pathname: '/focus/timer',
        params: {
          sessionId: result.sessionId,
          topic: topic.trim(),
          plannedDuration: String(duration),
          startedAt: result.startedAt,
        },
      });
    } catch {
      setError("Couldn't start your session. Please try again.");
      setLoading(false);
    }
  }

  return (
    <AppScreen>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <TouchableOpacity onPress={() => router.back()} style={styles.back}>
            <Text style={[styles.backText, { color: theme.textSecondary }]}>← Back</Text>
          </TouchableOpacity>

          <Text style={[styles.heading, { color: theme.text }]}>Set your intention</Text>
          <Text style={[styles.subheading, { color: theme.textSecondary }]}>
            What will you focus on today?
          </Text>

          <View style={styles.section}>
            <Text style={[styles.label, { color: theme.textSecondary }]}>Topic</Text>
            <TextInput
              autoFocus
              value={topic}
              onChangeText={setTopic}
              placeholder="e.g., Chapter 5 — Algebra"
              placeholderTextColor={theme.textMuted}
              style={[
                styles.input,
                {
                  backgroundColor: theme.backgroundElement,
                  borderColor: topic ? theme.primary : theme.border,
                  color: theme.text,
                },
              ]}
              maxLength={200}
            />
          </View>

          <View style={styles.section}>
            <DurationPicker value={duration} onChange={setDuration} />
          </View>

          <View style={[styles.finishRow, { backgroundColor: theme.primaryLight }]}>
            <Text style={[styles.finishLabel, { color: theme.primary }]}>
              You'll finish around <Text style={styles.finishTime}>{finishTime}</Text>
            </Text>
          </View>

          {error ? (
            <Text style={[styles.errorText, { color: theme.error }]}>{error}</Text>
          ) : null}

          <TouchableOpacity
            onPress={handleStart}
            disabled={!canStart}
            style={[
              styles.startBtn,
              { backgroundColor: canStart ? theme.primary : theme.border },
            ]}
          >
            {loading ? (
              <ActivityIndicator size="small" color={theme.white} />
            ) : (
              <Text style={[styles.startText, { color: theme.white }]}>Begin Focus</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.xxl,
    paddingBottom: Spacing.massive,
  },
  back: {
    marginBottom: Spacing.xl,
  },
  backText: {
    ...createTextStyle('sm', 'medium'),
  },
  heading: {
    ...createTextStyle('xxxl', 'bold'),
    marginBottom: Spacing.xs,
  },
  subheading: {
    ...createTextStyle('md', 'regular'),
    marginBottom: Spacing.xxxl,
  },
  section: {
    marginBottom: Spacing.xxl,
  },
  label: {
    ...createTextStyle('sm', 'medium'),
    marginBottom: Spacing.sm,
  },
  input: {
    borderWidth: 1.5,
    borderRadius: Radius.input,
    padding: Spacing.lg,
    ...createTextStyle('md', 'regular'),
  },
  finishRow: {
    borderRadius: Radius.card,
    padding: Spacing.md,
    alignItems: 'center',
    marginBottom: Spacing.xxl,
  },
  finishLabel: {
    ...createTextStyle('sm', 'medium'),
  },
  finishTime: {
    fontWeight: '700',
  },
  errorText: {
    ...createTextStyle('sm', 'regular'),
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  startBtn: {
    borderRadius: Radius.button,
    padding: Spacing.lg,
    alignItems: 'center',
  },
  startText: {
    ...createTextStyle('lg', 'bold'),
  },
});
