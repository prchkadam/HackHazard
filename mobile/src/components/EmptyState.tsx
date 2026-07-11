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
      <View style={[styles.iconWrapper, { backgroundColor: theme.backgroundSecondary }]}>
        {icon ?? <Inbox size={28} color={theme.textSecondary} strokeWidth={1.5} />}
      </View>
      <Text style={[createTextStyle('md', 'semiBold'), styles.title, { color: theme.text }]}>
        {title}
      </Text>
      <Text style={[createTextStyle('sm'), styles.message, { color: theme.textSecondary }]}>
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
    paddingVertical: Spacing.xxxl,
    paddingHorizontal: Spacing.lg,
  },
  iconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  title: {
    textAlign: 'center',
  },
  message: {
    marginTop: Spacing.xs,
    textAlign: 'center',
    lineHeight: 18,
  },
});

export const EmptyState = memo(EmptyStateComponent);
