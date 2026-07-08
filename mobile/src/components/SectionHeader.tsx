import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Spacing, createTextStyle } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

function SectionHeaderComponent({ title, subtitle, action }: SectionHeaderProps) {
  const theme = useTheme();

  return (
    <View style={styles.container} accessibilityRole="header">
      <View style={styles.textContainer}>
        <Text style={[createTextStyle('lg', 'semiBold'), { color: theme.text }]}>{title}</Text>
        {subtitle ? (
          <Text style={[createTextStyle('sm'), { color: theme.textSecondary, marginTop: Spacing.xs }]}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {action}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  textContainer: {
    flex: 1,
  },
});

export const SectionHeader = memo(SectionHeaderComponent);
