import React, { memo } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { Spacing, createTextStyle } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export interface LoadingSpinnerProps {
  message?: string;
  size?: 'small' | 'large';
}

function LoadingSpinnerComponent({ message, size = 'large' }: LoadingSpinnerProps) {
  const theme = useTheme();

  return (
    <View style={styles.container} accessibilityRole="progressbar" accessibilityLabel={message ?? 'Loading'}>
      <ActivityIndicator size={size} color={theme.primary} />
      {message ? (
        <Text style={[createTextStyle('md'), styles.message, { color: theme.textSecondary }]}>
          {message}
        </Text>
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
  message: {
    marginTop: Spacing.lg,
    textAlign: 'center',
  },
});

export const LoadingSpinner = memo(LoadingSpinnerComponent);
