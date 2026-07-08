import React, { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Radius, Spacing, TouchTarget, createTextStyle } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
}

function ChipComponent({ label, selected = false, onPress }: ChipProps) {
  const theme = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        {
          backgroundColor: selected ? theme.primaryLight : theme.backgroundSecondary,
          borderColor: selected ? theme.primary : theme.border,
          opacity: pressed ? 0.85 : 1,
        },
      ]}
    >
      <Text
        style={[
          createTextStyle('sm', selected ? 'semiBold' : 'medium'),
          { color: selected ? theme.primary : theme.textSecondary },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
    borderWidth: 1,
    minHeight: TouchTarget.min / 2,
    justifyContent: 'center',
  },
});

export const Chip = memo(ChipComponent);
