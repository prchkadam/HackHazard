import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Spacing, createTextStyle } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { AppCard } from '@/components/AppCard';
import { AppButton } from '@/components/AppButton';
import type { MentorOption } from '@/types/mentor';

export interface MentorCardProps {
  mentor: MentorOption;
  selected?: boolean;
  onSelect: (mentorId: string) => void;
  loading?: boolean;
}

function MentorCardComponent({ mentor, selected = false, onSelect, loading = false }: MentorCardProps) {
  const theme = useTheme();

  return (
    <AppCard
      selected={selected}
      style={styles.card}
      accessibilityLabel={`Select mentor ${mentor.name}`}
    >
      <View style={styles.headerRow}>
        <View
          style={[styles.illustration, { backgroundColor: `${mentor.accentColor}15` }]}
          accessibilityLabel={`${mentor.name} illustration placeholder`}
        >
          <Text style={[createTextStyle('lg', 'bold'), { color: mentor.accentColor }]}>
            {mentor.name[0]}
          </Text>
        </View>
        <View style={styles.headerText}>
          <Text style={[createTextStyle('md', 'bold'), { color: theme.text }]}>
            {mentor.name}
          </Text>
          <Text style={[createTextStyle('xs'), { color: theme.textSecondary, marginTop: 2 }]}>
            {mentor.personality.join(' · ')}
          </Text>
        </View>
      </View>

      <Text style={[createTextStyle('sm'), styles.description, { color: theme.textSecondary }]}>
        {mentor.description}
      </Text>

      <View style={[styles.conversation, { backgroundColor: theme.backgroundSecondary }]}>
        <Text style={[createTextStyle('xs', 'medium'), { color: theme.text }]} numberOfLines={1}>
          "{mentor.examplePrompt}"
        </Text>
        <Text style={[createTextStyle('xs'), styles.response, { color: theme.textSecondary }]} numberOfLines={1}>
          → "{mentor.exampleResponse}"
        </Text>
      </View>

      <AppButton
        label={selected ? 'Selected' : 'Select'}
        variant={selected ? 'secondary' : 'primary'}
        size="sm"
        onPress={() => onSelect(mentor.id)}
        loading={loading && selected}
        disabled={loading}
        accessibilityLabel={`Select ${mentor.name} as your mentor`}
      />
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: Spacing.md,
    padding: Spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  illustration: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  headerText: {
    flex: 1,
    justifyContent: 'center',
  },
  description: {
    marginBottom: Spacing.sm,
    lineHeight: 18,
  },
  conversation: {
    borderRadius: 8,
    padding: Spacing.sm,
    marginBottom: Spacing.md,
  },
  response: {
    marginTop: 4,
  },
});

export const MentorCard = memo(MentorCardComponent);
