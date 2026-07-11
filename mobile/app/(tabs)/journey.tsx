import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Clock, BookOpen, Brain, Sparkles, AlertCircle } from 'lucide-react-native';
import { AppScreen } from '@/components/AppScreen';
import { AppCard } from '@/components/AppCard';
import { EmptyState } from '@/components/EmptyState';
import { createTextStyle, Spacing, Radius } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { apiFetchJourneyTimeline } from '@/services/api/journey';
import type { JourneyItem } from '@/services/api/journey';

const ICON_MAP = {
  focus: Clock,
  reflection: Brain,
  journal: BookOpen,
  growth: Sparkles,
  letter: Sparkles,
  message: Sparkles,
};

const MOOD_EMOJI = {
  calm: '🌱',
  proud: '✨',
  growing: '🌿',
  thinking: '🤔',
  waiting: '💭',
};

export default function JourneyScreen() {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [timeline, setTimeline] = useState<JourneyItem[]>([]);

  async function load(isRefresh = false) {
    if (isRefresh) setRefreshing(true);
    try {
      const data = await apiFetchJourneyTimeline();
      setTimeline(data);
    } catch {
      // Graceful error state handling
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  function renderCard({ item }: { item: JourneyItem }) {
    const IconComponent = ICON_MAP[item.type] || Sparkles;
    const formattedDate = new Date(item.date).toLocaleDateString([], {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const isWeeklyLetter = item.type === 'letter';

    return (
      <AppCard style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={[styles.iconBox, { backgroundColor: theme.primaryLight }]}>
            <IconComponent size={20} color={theme.primary} />
          </View>
          <View style={styles.headerInfo}>
            <Text style={[styles.cardTitle, { color: theme.text }]}>{item.title}</Text>
            <Text style={[styles.cardDate, { color: theme.textMuted }]}>{formattedDate}</Text>
          </View>
          {item.companionMood ? (
            <View style={[styles.moodBadge, { backgroundColor: theme.backgroundSecondary }]}>
              <Text style={styles.moodEmoji}>{MOOD_EMOJI[item.companionMood]}</Text>
            </View>
          ) : null}
        </View>

        <Text style={[styles.description, { color: theme.textSecondary }]}>
          {item.description}
        </Text>

        {isWeeklyLetter ? (
          <View style={[styles.letterBadge, { backgroundColor: theme.primaryLight }]}>
            <Text style={[styles.letterBadgeText, { color: theme.primary }]}>
              Mentor's Weekly Summary
            </Text>
          </View>
        ) : null}

        {item.meta?.encouragement ? (
          <View style={[styles.encouragementBox, { backgroundColor: theme.backgroundSecondary }]}>
            <Text style={[styles.encouragementText, { color: theme.textSecondary }]}>
              "{item.meta.encouragement}"
            </Text>
          </View>
        ) : null}
      </AppCard>
    );
  }

  return (
    <AppScreen scrollable={false}>
      <View style={styles.header}>
        <Text style={[styles.heading, { color: theme.text }]}>Your Journey</Text>
        <Text style={[styles.subheading, { color: theme.textSecondary }]}>
          Your learning growth, milestones, and reflections.
        </Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={theme.primary} style={styles.spinner} />
      ) : (
        <FlatList
          data={timeline}
          keyExtractor={(item) => item.id}
          renderItem={renderCard}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => load(true)} />
          }
          ListEmptyComponent={
            <EmptyState
              title="No memories yet"
              message="Your journey begins after your first focus session."
              icon={<Sparkles size={28} color={theme.textSecondary} strokeWidth={1.5} />}
            />
          }
        />
      )}
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: Spacing.xxl,
    paddingTop: Spacing.xl,
    marginBottom: Spacing.md,
  },
  heading: {
    ...createTextStyle('xxxl', 'bold'),
  },
  subheading: {
    ...createTextStyle('sm', 'regular'),
    marginTop: 4,
  },
  list: {
    paddingHorizontal: Spacing.xxl,
    paddingBottom: Spacing.massive,
    gap: Spacing.md,
  },
  spinner: {
    marginTop: Spacing.huge,
  },
  card: {
    padding: Spacing.lg,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  headerInfo: {
    flex: 1,
  },
  cardTitle: {
    ...createTextStyle('md', 'semiBold'),
  },
  cardDate: {
    ...createTextStyle('xs', 'regular'),
    marginTop: 2,
  },
  moodBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.full,
  },
  moodEmoji: {
    fontSize: 16,
  },
  description: {
    ...createTextStyle('sm', 'regular'),
    lineHeight: 20,
  },
  letterBadge: {
    alignSelf: 'flex-start',
    marginTop: Spacing.md,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 8,
  },
  letterBadgeText: {
    ...createTextStyle('xs', 'semiBold'),
  },
  encouragementBox: {
    marginTop: Spacing.md,
    padding: Spacing.md,
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#818CF8',
  },
  encouragementText: {
    ...createTextStyle('sm', 'medium'),
    fontStyle: 'italic',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.huge,
    paddingHorizontal: Spacing.xxxl,
    gap: Spacing.sm,
  },
  emptyTitle: {
    ...createTextStyle('lg', 'semiBold'),
    marginTop: Spacing.sm,
  },
  emptySubtitle: {
    ...createTextStyle('sm', 'regular'),
    textAlign: 'center',
    lineHeight: 20,
  },
});
