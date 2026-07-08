import React, { memo } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { User } from 'lucide-react-native';
import { Radius, Spacing, createTextStyle } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export interface AvatarProps {
  name?: string;
  imageUrl?: string | null;
  size?: number;
}

function AvatarComponent({ name, imageUrl, size = 48 }: AvatarProps) {
  const theme = useTheme();
  const initials = name
    ? name
        .split(' ')
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : '?';

  if (imageUrl) {
    return (
      <Image
        accessibilityLabel={name ? `${name}'s avatar` : 'User avatar'}
        source={{ uri: imageUrl }}
        style={[
          styles.image,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
          },
        ]}
      />
    );
  }

  return (
    <View
      accessibilityLabel={name ? `${name}'s avatar` : 'User avatar'}
      style={[
        styles.placeholder,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: theme.primaryLight,
        },
      ]}
    >
      {name ? (
        <Text style={[createTextStyle('sm', 'semiBold'), { color: theme.primary }]}>{initials}</Text>
      ) : (
        <User size={size * 0.5} color={theme.primary} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    backgroundColor: '#E5E7EB',
  },
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export const Avatar = memo(AvatarComponent);
