import React, { memo } from 'react';
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { Radius, Shadow, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export interface AppCardProps {
  children: React.ReactNode;
  onPress?: () => void;
  selected?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
}

function AppCardComponent({
  children,
  onPress,
  selected = false,
  style,
  accessibilityLabel,
}: AppCardProps) {
  const theme = useTheme();

  const cardStyle = [
    styles.card,
    Shadow.md,
    {
      backgroundColor: theme.backgroundElement,
      borderColor: selected ? theme.primary : theme.borderLight,
      borderWidth: selected ? 2 : 1,
    },
    style,
  ];

  if (onPress) {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        onPress={onPress}
        style={({ pressed }) => [...cardStyle, { opacity: pressed ? 0.92 : 1 }]}
      >
        {children}
      </Pressable>
    );
  }

  return <View style={cardStyle}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.card,
    padding: Spacing.xxl,
  },
});

export const AppCard = memo(AppCardComponent);
