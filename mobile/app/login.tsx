import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Spacing, createTextStyle } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { AppScreen } from '@/components/AppScreen';
import { AppButton } from '@/components/AppButton';
import { useAuth } from '@/hooks/useAuth';
import { useGoogleAuth } from '@/services/auth/googleAuth';
import { getHumanErrorMessage } from '@/utils/errors';

export default function LoginScreen() {
  const theme = useTheme();
  const { login, loginGuest, loading, user } = useAuth();
  const { promptAsync, idToken, isReady } = useGoogleAuth();
  const [guestLoading, setGuestLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      router.replace('/');
    }
  }, [user]);

  useEffect(() => {
    if (!idToken) return;

    const handleGoogleLogin = async () => {
      setGoogleLoading(true);
      setError(null);
      try {
        await login(idToken);
      } catch (err) {
        setError(err instanceof Error ? err.message : getHumanErrorMessage('UNKNOWN_ERROR'));
      } finally {
        setGoogleLoading(false);
      }
    };

    handleGoogleLogin();
  }, [idToken, login]);

  const handleGooglePress = useCallback(async () => {
    setError(null);
    if (!isReady) {
      setError('Google sign-in is not configured yet. Please use guest mode.');
      return;
    }
    setGoogleLoading(true);
    try {
      await promptAsync();
    } catch {
      setError(getHumanErrorMessage('UNKNOWN_ERROR'));
    } finally {
      setGoogleLoading(false);
    }
  }, [isReady, promptAsync]);

  const handleGuestPress = useCallback(async () => {
    setGuestLoading(true);
    setError(null);
    try {
      await loginGuest();
    } catch (err) {
      setError(err instanceof Error ? err.message : getHumanErrorMessage('UNKNOWN_ERROR'));
    } finally {
      setGuestLoading(false);
    }
  }, [loginGuest]);

  return (
    <AppScreen scrollable={false} padded>
      <View style={styles.container}>
        <View style={styles.header}>
          <View
            style={[styles.logo, { backgroundColor: theme.primaryLight }]}
            accessibilityLabel="Avati logo"
          >
            <Text style={[createTextStyle('xxl', 'bold'), { color: theme.primary }]}>✦</Text>
          </View>

          <Text style={[createTextStyle('xxxl', 'bold'), styles.title, { color: theme.text }]}>
            Avati
          </Text>

          <Text style={[createTextStyle('md'), styles.tagline, { color: theme.textSecondary }]}>
            Grow together with us.
          </Text>
        </View>

        <View style={styles.actions}>
          {error ? (
            <Text
              style={[createTextStyle('sm'), styles.error, { color: theme.error }]}
              accessibilityRole="alert"
            >
              {error}
            </Text>
          ) : null}

          <AppButton
            label="Continue with Google"
            onPress={handleGooglePress}
            loading={googleLoading}
            disabled={guestLoading}
            accessibilityLabel="Continue with Google"
          />

          <View style={styles.spacer} />

          <AppButton
            label="Continue as Guest"
            variant="outline"
            onPress={handleGuestPress}
            loading={guestLoading}
            disabled={googleLoading || loading}
            accessibilityLabel="Continue as Guest"
          />
        </View>

        <Text style={[createTextStyle('xs'), styles.privacy, { color: theme.textMuted }]}>
          By continuing, you agree to our Terms of Service and Privacy Policy. Your data stays
          private and is never shared without consent.
        </Text>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: Spacing.giant,
  },
  header: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xxl,
  },
  title: {
    marginBottom: Spacing.sm,
  },
  tagline: {
    textAlign: 'center',
  },
  actions: {
    marginBottom: Spacing.xxxl,
  },
  spacer: {
    height: Spacing.lg,
  },
  error: {
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  privacy: {
    textAlign: 'center',
    lineHeight: 18,
  },
});
