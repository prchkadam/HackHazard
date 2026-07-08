import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Inbox } from 'lucide-react-native';
import { Spacing, createTextStyle } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: React.ReactNode;
}

function EmptyStateComponent({
  title = 'Nothing here yet',
  message = 'Check back soon.',
  icon,
}: EmptyStateProps) {
  const theme = useTheme();

  return (
    <View style={styles.container} accessibilityRole="text">
      {icon ?? <Inbox size={48} color={theme.textMuted} strokeWidth={1.5} />}
      <Text style={[createTextStyle('lg', 'semiBold'), styles.title, { color: theme.text }]}>
        {title}
      </Text>
      <Text style={[createTextStyle('md'), styles.message, { color: theme.textSecondary }]}>
        {message}
      </Text>
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
});

export const EmptyState = memo(EmptyStateComponent);
