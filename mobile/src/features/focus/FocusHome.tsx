import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { AppScreen } from '@/components/AppScreen';
import { AppCard } from '@/components/AppCard';
import { CompanionGrowthCard } from './CompanionGrowthCard';
import { JournalCard } from './JournalCard';
import { createTextStyle, Spacing, Radius } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { apiFetchHistory } from '@/services/api/focus';
import type { FocusSession, FocusGrowth } from '@/services/api/focus';

export function FocusHome() {
  const theme = useTheme();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [sessions, setSessions] = useState<FocusSession[]>([]);
  const [growth, setGrowth] = useState<FocusGrowth>({ stage: 'seed', mood: 'calm' });

  async function load(isRefresh = false) {
    if (isRefresh) setRefreshing(true);
    try {
      const data = await apiFetchHistory();
      setSessions(data.sessions);
      setGrowth(data.growth);
    } catch {
      // silently fail — user sees empty state
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => { void load(); }, []);

  const latestSession = sessions[0];
  const latestJournal = sessions.find((s) => s.journal)?.journal ?? null;

  return (
    <AppScreen>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} />}
      >
        <Text style={[styles.heading, { color: theme.text }]}>Focus</Text>
        <Text style={[styles.subheading, { color: theme.textSecondary }]}>
          Every session shapes who you're becoming.
        </Text>

        {loading ? (
          <ActivityIndicator size="large" color={theme.primary} style={{ marginTop: Spacing.xxxl }} />
        ) : (
          <>
            <CompanionGrowthCard growth={growth} />

            {latestSession ? (
              <AppCard style={styles.lastSessionCard}>
                <Text style={[styles.lastSessionLabel, { color: theme.textMuted }]}>Last Session</Text>
                <Text style={[styles.lastSessionTopic, { color: theme.text }]} numberOfLines={1}>
                  {latestSession.topic}
                </Text>
                <Text style={[styles.lastSessionDur, { color: theme.textSecondary }]}>
                  {latestSession.actualDuration
                    ? `${Math.round(latestSession.actualDuration / 60)}m focused`
                    : `${latestSession.plannedDuration}m planned`}
                </Text>
              </AppCard>
            ) : null}

            {latestJournal ? <JournalCard journal={latestJournal} /> : null}
          </>
        )}

        <TouchableOpacity
          onPress={() => router.push('/focus/setup')}
          style={[styles.startBtn, { backgroundColor: theme.primary }]}
          accessibilityRole="button"
          accessibilityLabel="Start a new focus session"
        >
          <Text style={[styles.startText, { color: theme.white }]}>Start Focus Session</Text>
        </TouchableOpacity>
      </ScrollView>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.xxl,
    paddingBottom: Spacing.massive,
    gap: Spacing.md,
  },
  heading: {
    ...createTextStyle('xxxl', 'bold'),
  },
  subheading: {
    ...createTextStyle('sm', 'regular'),
    marginBottom: Spacing.xl,
    lineHeight: 22,
  },
  lastSessionCard: {
    marginBottom: Spacing.xs,
  },
  lastSessionLabel: {
    ...createTextStyle('xs', 'medium'),
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: Spacing.xs,
  },
  lastSessionTopic: {
    ...createTextStyle('md', 'semiBold'),
    marginBottom: 2,
  },
  lastSessionDur: {
    ...createTextStyle('sm', 'regular'),
  },
  startBtn: {
    borderRadius: Radius.button,
    padding: Spacing.lg,
    alignItems: 'center',
    marginTop: Spacing.lg,
  },
  startText: {
    ...createTextStyle('lg', 'bold'),
  },
});
