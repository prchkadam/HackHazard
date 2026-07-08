import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { BookOpen, Target, Timer } from 'lucide-react-native';
import { Spacing, createTextStyle } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { AppScreen } from '@/components/AppScreen';
import { AppCard } from '@/components/AppCard';
import { AppButton } from '@/components/AppButton';
import { CompanionCard } from '@/components/CompanionCard';
import { SectionHeader } from '@/components/SectionHeader';
import { useAuth } from '@/hooks/useAuth';
import { MENTOR_OPTIONS } from '@/constants/mentors';

export default function HomeScreen() {
  const theme = useTheme();
  const { user, loading } = useAuth();
  const router = useRouter();

  const mentor = MENTOR_OPTIONS.find((m) => m.id === user?.mentorId);
  const greeting = getGreeting();

  if (loading) {
    return <AppScreen state="loading" loadingMessage="Loading your space..." scrollable={false} />;
  }

  return (
    <AppScreen>
      <CompanionCard stage="seed" mood="calm" />

      <AppCard style={styles.greetingCard}>
        <Text style={[createTextStyle('sm', 'medium'), { color: theme.textSecondary }]}>
          {mentor?.name ?? 'Your mentor'}
        </Text>
        <Text style={[createTextStyle('lg', 'semiBold'), { color: theme.text, marginTop: Spacing.xs }]}>
          {greeting}, {user?.name?.split(' ')[0] ?? 'friend'}
        </Text>
        <Text style={[createTextStyle('md'), { color: theme.textSecondary, marginTop: Spacing.sm }]}>
          {mentor
            ? `Ready to learn together? I'm here whenever you need me.`
            : `Welcome. Let's begin. What would you like to accomplish today?`}
        </Text>
      </AppCard>

      <SectionHeader title="Continue Journey" subtitle="Pick up where you left off" />
      <AppCard style={styles.sectionCard}>
        <Text style={[createTextStyle('md'), { color: theme.textSecondary }]}>
          Your journey timeline will appear here as you learn and reflect.
        </Text>
      </AppCard>

      <SectionHeader title="Today's Mission" />
      <AppCard style={styles.sectionCard}>
        <Text style={[createTextStyle('md', 'medium'), { color: theme.text }]}>
          No mission yet
        </Text>
        <Text style={[createTextStyle('sm'), { color: theme.textSecondary, marginTop: Spacing.sm }]}>
          Create a mission to give your day gentle direction.
        </Text>
      </AppCard>

      <SectionHeader title="Quick Actions" />
      <View style={styles.actions}>
        <AppCard style={styles.actionCard}>
          <BookOpen size={24} color={theme.primary} />
          <Text style={[createTextStyle('md', 'semiBold'), styles.actionTitle, { color: theme.text }]}>
            Learn Something
          </Text>
          <Text style={[createTextStyle('sm'), { color: theme.textSecondary }]}>
            Explore a topic with your mentor
          </Text>
          <View style={styles.actionButton}>
            <AppButton label="Learn" variant="outline" disabled fullWidth />
          </View>
        </AppCard>

        <AppCard style={styles.actionCard}>
          <Timer size={24} color={theme.secondary} />
          <Text style={[createTextStyle('md', 'semiBold'), styles.actionTitle, { color: theme.text }]}>
            Start Focus Session
          </Text>
          <Text style={[createTextStyle('sm'), { color: theme.textSecondary }]}>
            Deep work without distractions
          </Text>
          <View style={styles.actionButton}>
            <AppButton label="Focus" variant="outline" fullWidth onPress={() => router.push('/focus' as any)} />
          </View>
        </AppCard>

        <AppCard style={styles.actionCard}>
          <Target size={24} color={theme.accent} />
          <Text style={[createTextStyle('md', 'semiBold'), styles.actionTitle, { color: theme.text }]}>
            Create Mission
          </Text>
          <Text style={[createTextStyle('sm'), { color: theme.textSecondary }]}>
            Set a gentle goal for today
          </Text>
          <View style={styles.actionButton}>
            <AppButton label="Create" variant="outline" disabled fullWidth />
          </View>
        </AppCard>
      </View>
    </AppScreen>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

const styles = StyleSheet.create({
  greetingCard: {
    marginBottom: Spacing.xxl,
  },
  sectionCard: {
    marginBottom: Spacing.xxxl,
  },
  actions: {
    gap: Spacing.lg,
  },
  actionCard: {
    marginBottom: Spacing.lg,
  },
  actionTitle: {
    marginTop: Spacing.md,
    marginBottom: Spacing.xs,
  },
  actionButton: {
    marginTop: Spacing.lg,
  },
});
