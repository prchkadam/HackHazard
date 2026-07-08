import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { AppScreen } from '@/components/AppScreen';
import { SessionSummary } from './SessionSummary';
import { JournalCard } from './JournalCard';
import { CompanionGrowthCard } from './CompanionGrowthCard';
import { ReflectionSheet } from './ReflectionSheet';
import { createTextStyle, Spacing, Radius } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { apiSubmitReflection } from '@/services/api/focus';
import type { FocusJournal, FocusGrowth, ReflectionInput } from '@/services/api/focus';

export function FocusComplete() {
  const theme = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams<{
    sessionId: string;
    topic: string;
    plannedDuration: string;
    actualDuration: string;
  }>();

  const [showReflection, setShowReflection] = useState(true);
  const [journal, setJournal] = useState<FocusJournal | null>(null);
  const [growth, setGrowth] = useState<FocusGrowth | null>(null);

  async function handleReflectionSubmit(data: ReflectionInput) {
    const result = await apiSubmitReflection(params.sessionId, data);
    setJournal(result.journal);
    setGrowth(result.growth);
    setShowReflection(false);
  }

  function handleSkip() {
    setShowReflection(false);
  }

  return (
    <AppScreen>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={[styles.heading, { color: theme.text }]}>Session Complete 🎉</Text>
        <Text style={[styles.subheading, { color: theme.textSecondary }]}>
          Every focused minute shapes who you're becoming.
        </Text>

        <SessionSummary
          topic={params.topic}
          plannedDuration={Number(params.plannedDuration)}
          actualDuration={Number(params.actualDuration)}
        />

        {growth ? <CompanionGrowthCard growth={growth} /> : null}
        {journal ? <JournalCard journal={journal} /> : null}

        {!journal && !showReflection ? (
          <TouchableOpacity
            onPress={() => setShowReflection(true)}
            style={[styles.reflectBtn, { borderColor: theme.primary }]}
          >
            <Text style={[styles.reflectText, { color: theme.primary }]}>Add Reflection</Text>
          </TouchableOpacity>
        ) : null}

        <TouchableOpacity
          onPress={() => router.replace('/(tabs)/home')}
          style={[styles.homeBtn, { backgroundColor: theme.primary }]}
        >
          <Text style={[styles.homeBtnText, { color: theme.white }]}>Return Home</Text>
        </TouchableOpacity>
      </ScrollView>

      <ReflectionSheet
        visible={showReflection}
        topic={params.topic}
        onSubmit={handleReflectionSubmit}
        onSkip={handleSkip}
      />
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
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  subheading: {
    ...createTextStyle('sm', 'regular'),
    textAlign: 'center',
    marginBottom: Spacing.xl,
    lineHeight: 22,
  },
  reflectBtn: {
    borderRadius: Radius.button,
    borderWidth: 1.5,
    padding: Spacing.md,
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  reflectText: {
    ...createTextStyle('md', 'semiBold'),
  },
  homeBtn: {
    borderRadius: Radius.button,
    padding: Spacing.lg,
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  homeBtnText: {
    ...createTextStyle('lg', 'bold'),
  },
});
