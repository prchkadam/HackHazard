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
      <View
        style={[styles.illustration, { backgroundColor: `${mentor.accentColor}20` }]}
        accessibilityLabel={`${mentor.name} illustration placeholder`}
      >
        <Text style={[createTextStyle('xxxl', 'bold'), { color: mentor.accentColor }]}>
          {mentor.name[0]}
        </Text>
      </View>

      <Text style={[createTextStyle('xl', 'bold'), styles.name, { color: theme.text }]}>
        {mentor.name}
      </Text>

      <Text style={[createTextStyle('sm'), { color: theme.textSecondary }]}>
        {mentor.personality.join(' · ')}
      </Text>

      <Text style={[createTextStyle('md'), styles.description, { color: theme.textSecondary }]}>
        {mentor.description}
      </Text>

      <View style={[styles.conversation, { backgroundColor: theme.backgroundSecondary }]}>
        <Text style={[createTextStyle('sm', 'medium'), { color: theme.text }]}>
          "{mentor.examplePrompt}"
        </Text>
        <Text style={[createTextStyle('sm'), styles.response, { color: theme.textSecondary }]}>
          ↓ "{mentor.exampleResponse}"
        </Text>
      </View>

      <AppButton
        label={selected ? 'Selected' : 'Select'}
        variant={selected ? 'secondary' : 'primary'}
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
    marginBottom: Spacing.xxl,
  },
  illustration: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  name: {
    marginBottom: Spacing.xs,
  },
  description: {
    marginTop: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  conversation: {
    borderRadius: Spacing.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  response: {
    marginTop: Spacing.sm,
  },
});

export const MentorCard = memo(MentorCardComponent);
