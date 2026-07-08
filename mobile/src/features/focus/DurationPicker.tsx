import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { createTextStyle, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const PRESETS = [15, 25, 45, 60, 90];

interface DurationPickerProps {
  value: number;
  onChange: (minutes: number) => void;
}

export function DurationPicker({ value, onChange }: DurationPickerProps) {
  const theme = useTheme();

  return (
    <View>
      <Text style={[styles.label, { color: theme.textSecondary }]}>Duration (minutes)</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {PRESETS.map((mins) => {
          const selected = value === mins;
          return (
            <TouchableOpacity
              key={mins}
              accessibilityRole="button"
              accessibilityLabel={`${mins} minutes`}
              onPress={() => onChange(mins)}
              style={[
                styles.chip,
                {
                  backgroundColor: selected ? theme.primary : theme.backgroundElement,
                  borderColor: selected ? theme.primary : theme.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.chipText,
                  { color: selected ? theme.white : theme.text },
                ]}
              >
                {mins}m
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    ...createTextStyle('sm', 'medium'),
    marginBottom: Spacing.sm,
  },
  row: {
    gap: Spacing.sm,
    paddingBottom: Spacing.xs,
  },
  chip: {
    borderRadius: Radius.full,
    borderWidth: 1.5,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  chipText: {
    ...createTextStyle('sm', 'semiBold'),
  },
});
