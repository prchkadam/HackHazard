import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { WifiOff, AlertCircle } from 'lucide-react-native';
import { Spacing, createTextStyle } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { AppButton } from '@/components/AppButton';
import { getHumanErrorMessage } from '@/utils/errors';

export interface ErrorStateProps {
  message?: string;
  offline?: boolean;
  onRetry?: () => void;
}

function ErrorStateComponent({
  message,
  offline = false,
  onRetry,
}: ErrorStateProps) {
  const theme = useTheme();

  const displayMessage = offline
    ? getHumanErrorMessage('NETWORK_ERROR')
    : message ?? getHumanErrorMessage('UNKNOWN_ERROR');

  const Icon = offline ? WifiOff : AlertCircle;

  return (
    <View style={styles.container} accessibilityRole="alert">
      <Icon size={48} color={theme.error} strokeWidth={1.5} />
      <Text style={[createTextStyle('lg', 'semiBold'), styles.title, { color: theme.text }]}>
        {offline ? "You're offline" : 'Something went wrong'}
      </Text>
      <Text style={[createTextStyle('md'), styles.message, { color: theme.textSecondary }]}>
        {displayMessage}
      </Text>
      {onRetry ? (
        <View style={styles.button}>
          <AppButton label="Try Again" variant="outline" onPress={onRetry} fullWidth={false} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xxxl,
  },
  title: {
    marginTop: Spacing.lg,
    textAlign: 'center',
  },
  message: {
    marginTop: Spacing.sm,
    textAlign: 'center',
  },
  button: {
    marginTop: Spacing.xxl,
  },
});

export const ErrorState = memo(ErrorStateComponent);
