import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { BookOpen, Target, Timer, ChevronRight } from 'lucide-react-native';
import { Spacing, createTextStyle } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { AppScreen } from '@/components/AppScreen';
import { AppCard } from '@/components/AppCard';
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

      <AppCard style={styles.greetingCard} animate={false}>
        <Text style={[createTextStyle('xs', 'bold'), { color: theme.primary, letterSpacing: 0.8, textTransform: 'uppercase' }]}>
          {mentor?.name ?? 'Your mentor'}
        </Text>
        <Text style={[createTextStyle('lg', 'bold'), { color: theme.text, marginTop: Spacing.xs }]}>
          {greeting}, {user?.name?.split(' ')[0] ?? 'friend'}
        </Text>
        <Text style={[createTextStyle('sm'), { color: theme.textSecondary, marginTop: Spacing.sm, lineHeight: 20 }]}>
          {mentor
            ? `Ready to learn together? I'm here whenever you need me.`
            : `Welcome. Let's begin. What would you like to accomplish today?`}
        </Text>
      </AppCard>

      <SectionHeader title="Continue Journey" subtitle="Pick up where you left off" />
      <AppCard style={styles.sectionCard} animate={false}>
        <Text style={[createTextStyle('sm'), { color: theme.textSecondary, lineHeight: 20 }]}>
          Your journey timeline will appear here as you learn and reflect.
        </Text>
      </AppCard>

      <SectionHeader title="Today's Mission" />
      <AppCard style={styles.sectionCard} animate={false}>
        <Text style={[createTextStyle('sm', 'bold'), { color: theme.text }]}>
          No mission yet
        </Text>
        <Text style={[createTextStyle('xs'), { color: theme.textSecondary, marginTop: Spacing.xs, lineHeight: 16 }]}>
          Create a mission to give your day gentle direction.
        </Text>
      </AppCard>

      <SectionHeader title="Quick Actions" />
      <View style={styles.actions}>
        {/* Learn Action */}
        <AppCard
          style={[styles.actionRow, { opacity: 0.5 }]}
          animate={false}
        >
          <View style={[styles.iconWrapper, { backgroundColor: theme.primaryLight }]}>
            <BookOpen size={20} color={theme.primary} />
          </View>
          <View style={styles.actionText}>
            <Text style={[createTextStyle('sm', 'bold'), { color: theme.text }]}>
              Learn Something
            </Text>
            <Text style={[createTextStyle('xs'), { color: theme.textSecondary, marginTop: 2 }]}>
              Explore a topic with your mentor
            </Text>
          </View>
          <Text style={[createTextStyle('xs', 'bold'), { color: theme.textMuted }]}>Soon</Text>
        </AppCard>

        {/* Start Focus Action */}
        <AppCard
          onPress={() => router.push('/focus' as any)}
          style={styles.actionRow}
          animate={false}
        >
          <View style={[styles.iconWrapper, { backgroundColor: theme.secondaryLight }]}>
            <Timer size={20} color={theme.secondary} />
          </View>
          <View style={styles.actionText}>
            <Text style={[createTextStyle('sm', 'bold'), { color: theme.text }]}>
              Start Focus Session
            </Text>
            <Text style={[createTextStyle('xs'), { color: theme.textSecondary, marginTop: 2 }]}>
              Deep work without distractions
            </Text>
          </View>
          <ChevronRight size={18} color={theme.textMuted} />
        </AppCard>

        {/* Create Mission Action */}
        <AppCard
          style={[styles.actionRow, { opacity: 0.5 }]}
          animate={false}
        >
          <View style={[styles.iconWrapper, { backgroundColor: theme.errorLight || '#FEE2E2' }]}>
            <Target size={20} color={theme.error} />
          </View>
          <View style={styles.actionText}>
            <Text style={[createTextStyle('sm', 'bold'), { color: theme.text }]}>
              Create Mission
            </Text>
            <Text style={[createTextStyle('xs'), { color: theme.textSecondary, marginTop: 2 }]}>
              Set a gentle goal for today
            </Text>
          </View>
          <Text style={[createTextStyle('xs', 'bold'), { color: theme.textMuted }]}>Soon</Text>
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
    marginBottom: Spacing.xl,
    padding: Spacing.lg,
  },
  sectionCard: {
    marginBottom: Spacing.xl,
    padding: Spacing.lg,
  },
  actions: {
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: 16,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  actionText: {
    flex: 1,
  },
});
