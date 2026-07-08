import React, { memo, useCallback } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { Animation, Radius, TouchTarget, Typography, createTextStyle } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type AppButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type AppButtonSize = 'sm' | 'md' | 'lg';

export interface AppButtonProps extends Omit<PressableProps, 'children'> {
  label: string;
  variant?: AppButtonVariant;
  size?: AppButtonSize;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

function AppButtonComponent({
  label,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = true,
  icon,
  style,
  accessibilityLabel,
  ...rest
}: AppButtonProps) {
  const theme = useTheme();
  const isDisabled = disabled || loading;

  const getBackgroundColor = useCallback(() => {
    if (isDisabled) return theme.backgroundSelected;
    switch (variant) {
      case 'primary':
        return theme.primary;
      case 'secondary':
        return theme.secondary;
      case 'outline':
      case 'ghost':
        return 'transparent';
      default:
        return theme.primary;
    }
  }, [isDisabled, theme, variant]);

  const getTextColor = useCallback(() => {
    if (isDisabled) return theme.textMuted;
    switch (variant) {
      case 'primary':
      case 'secondary':
        return theme.white;
      case 'outline':
      case 'ghost':
        return theme.primary;
      default:
        return theme.white;
    }
  }, [isDisabled, theme, variant]);

  const getBorderColor = useCallback(() => {
    if (variant === 'outline') {
      return isDisabled ? theme.border : theme.primary;
    }
    return 'transparent';
  }, [isDisabled, theme, variant]);

  const sizeStyles = SIZE_STYLES[size];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        sizeStyles,
        {
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
          opacity: pressed && !isDisabled ? 0.85 : 1,
          width: fullWidth ? '100%' : undefined,
        },
        style,
      ]}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} size="small" />
      ) : (
        <View style={styles.content}>
          {icon}
          <Text
            style={[
              createTextStyle(size === 'sm' ? 'sm' : 'md', 'semiBold'),
              { color: getTextColor(), marginLeft: icon ? 8 : 0 },
            ]}
          >
            {label}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

const SIZE_STYLES = StyleSheet.create({
  sm: {
    minHeight: TouchTarget.min,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: Radius.button,
  },
  md: {
    minHeight: TouchTarget.min,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: Radius.button,
  },
  lg: {
    minHeight: TouchTarget.min + 4,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: Radius.button,
  },
});

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export const AppButton = memo(AppButtonComponent);
