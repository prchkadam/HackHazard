import React, { memo, useRef, useEffect } from 'react';
import { Pressable, StyleSheet, View, Animated, type StyleProp, type ViewStyle } from 'react-native';
import { Radius, Shadow, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export interface AppCardProps {
  children: React.ReactNode;
  onPress?: () => void;
  selected?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
  animate?: boolean;
}

function AppCardComponent({
  children,
  onPress,
  selected = false,
  style,
  accessibilityLabel,
  animate = true,
}: AppCardProps) {
  const theme = useTheme();

  const fadeAnim = useRef(new Animated.Value(animate ? 0 : 1)).current;
  const scaleAnim = useRef(new Animated.Value(animate ? 0.97 : 1)).current;

  useEffect(() => {
    if (animate) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [animate]);

  const cardStyle = [
    styles.card,
    Shadow.sm,
    {
      backgroundColor: theme.backgroundElement,
      borderColor: selected ? theme.primary : theme.borderLight,
      borderWidth: selected ? 1.5 : 1,
    },
    style,
  ];

  const content = onPress ? (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={({ pressed }) => [...cardStyle, { opacity: pressed ? 0.92 : 1 }]}
    >
      {children}
    </Pressable>
  ) : (
    <View style={cardStyle}>{children}</View>
  );

  return (
    <Animated.View style={{ opacity: fadeAnim, transform: [{ scale: scaleAnim }] }}>
      {content}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.card,
    padding: Spacing.lg,
  },
});

export const AppCard = memo(AppCardComponent);
