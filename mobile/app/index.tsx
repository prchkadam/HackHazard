import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { router } from 'expo-router';
import { Animation, Spacing, createTextStyle } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useAuth } from '@/hooks/useAuth';
import { Routes } from '@/constants/routes';
import {
  getSelectedMentorId,
  isCompanionBirthComplete,
  isOnboardingComplete,
} from '@/services/auth/guestAuth';
import { getAuthToken } from '@/services/auth/tokenStorage';

function getPostAuthRoute(
  mentorId: string | null,
  onboardingDone: boolean,
  birthDone: boolean,
): string {
  if (!mentorId || !onboardingDone) {
    return Routes.mentorOnboarding;
  }
  if (!birthDone) {
    return Routes.companionBirth;
  }
  return Routes.home;
}

export default function SplashScreen() {
  const theme = useTheme();
  const { user, loading, restoreSession } = useAuth();
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: Animation.fast });
  }, [opacity]);

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  useEffect(() => {
    if (loading) return;

    const navigate = async () => {
      const token = await getAuthToken();
      const hasSession = Boolean(user) || Boolean(token);

      if (!hasSession) {
        router.replace(Routes.login as never);
        return;
      }

      const mentorId = user?.mentorId ?? (await getSelectedMentorId());
      const onboardingDone = user?.onboardingComplete || (await isOnboardingComplete());
      const birthDone = await isCompanionBirthComplete();

      router.replace(getPostAuthRoute(mentorId, onboardingDone, birthDone) as never);
    };

    const timer = setTimeout(navigate, Animation.normal);
    return () => clearTimeout(timer);
  }, [loading, user]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Animated.View style={[styles.content, animatedStyle]}>
        <View
          style={[styles.logo, { backgroundColor: theme.primaryLight }]}
          accessibilityLabel="Avati logo"
        >
          <Text style={[createTextStyle('display', 'bold'), { color: theme.primary }]}>✦</Text>
        </View>

        <Text style={[createTextStyle('xxxl', 'bold'), styles.brand, { color: theme.text }]}>
          AVATI
        </Text>

        <Text style={[createTextStyle('md'), styles.quote, { color: theme.textSecondary }]}>
          Every expert was once a beginner.
        </Text>

        <View style={styles.loader}>
          <LoadingSpinner size="small" />
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    padding: Spacing.xxxl,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xxl,
  },
  brand: {
    letterSpacing: 4,
    marginBottom: Spacing.lg,
  },
  quote: {
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: Spacing.xxxl,
  },
  loader: {
    marginTop: Spacing.lg,
  },
});
