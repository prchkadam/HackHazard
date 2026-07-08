import React, { memo } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { Radius, Spacing, TouchTarget, Typography, createTextStyle } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export interface AppInputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: StyleProp<ViewStyle>;
}

function AppInputComponent({
  label,
  error,
  containerStyle,
  style,
  accessibilityLabel,
  ...rest
}: AppInputProps) {
  const theme = useTheme();

  return (
    <View style={[styles.container, containerStyle]}>
      {label ? (
        <Text style={[createTextStyle('sm', 'medium'), { color: theme.textSecondary, marginBottom: Spacing.sm }]}>
          {label}
        </Text>
      ) : null}
      <TextInput
        accessibilityLabel={accessibilityLabel ?? label}
        placeholderTextColor={theme.textMuted}
        style={[
          styles.input,
          createTextStyle('md'),
          {
            backgroundColor: theme.backgroundSecondary,
            borderColor: error ? theme.error : theme.border,
            color: theme.text,
          },
          style,
        ]}
        {...rest}
      />
      {error ? (
        <Text style={[createTextStyle('xs'), { color: theme.error, marginTop: Spacing.xs }]}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  input: {
    minHeight: TouchTarget.min,
    borderRadius: Radius.input,
    borderWidth: 1,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    fontFamily: Typography.fontFamily.regular,
  },
});

export const AppInput = memo(AppInputComponent);
