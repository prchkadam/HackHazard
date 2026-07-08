import { useCallback, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Spacing, createTextStyle } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { AppScreen } from '@/components/AppScreen';
import { MentorCard } from '@/components/MentorCard';
import { MENTOR_OPTIONS } from '@/constants/mentors';
import { useAuth } from '@/hooks/useAuth';
import { getHumanErrorMessage } from '@/utils/errors';

export default function MentorSelectionScreen() {
  const theme = useTheme();
  const { completeMentorSelection } = useAuth();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSelect = useCallback(
    async (mentorId: string) => {
      setSelectedId(mentorId);
      setLoading(true);
      setError(null);
      try {
        await completeMentorSelection(mentorId);
      } catch (err) {
        setError(err instanceof Error ? err.message : getHumanErrorMessage('UNKNOWN_ERROR'));
        setSelectedId(null);
      } finally {
        setLoading(false);
      }
    },
    [completeMentorSelection],
  );

  return (
    <AppScreen>
      <View style={styles.header}>
        <Text style={[createTextStyle('xxl', 'bold'), { color: theme.text }]}>
          Choose your mentor
        </Text>
        <Text style={[createTextStyle('md'), styles.subtitle, { color: theme.textSecondary }]}>
          Each mentor teaches differently. Pick the one that feels right for you.
        </Text>
      </View>

      {error ? (
        <Text
          style={[createTextStyle('sm'), styles.error, { color: theme.error }]}
          accessibilityRole="alert"
        >
          {error}
        </Text>
      ) : null}

      {MENTOR_OPTIONS.map((mentor) => (
        <MentorCard
          key={mentor.id}
          mentor={mentor}
          selected={selectedId === mentor.id}
          onSelect={handleSelect}
          loading={loading}
        />
      ))}
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: Spacing.xxl,
    marginBottom: Spacing.xxl,
  },
  subtitle: {
    marginTop: Spacing.sm,
  },
  error: {
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
});
