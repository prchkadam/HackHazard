import React, { memo } from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { Spacing, createTextStyle, Radius } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { Subject } from '@/types/learn';

interface SubjectCardProps {
  subject: Subject;
  onPress: () => void;
}

function SubjectCardComponent({ subject, onPress }: SubjectCardProps) {
  const theme = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        {
          backgroundColor: theme.backgroundElement,
          borderColor: theme.borderLight,
          transform: [{ scale: pressed ? 0.97 : 1 }],
        },
      ]}
    >
      <View style={[styles.emojiContainer, { backgroundColor: subject.color + '15' }]}>
        <Text style={styles.emoji}>{subject.emoji}</Text>
      </View>
      <Text
        style={[createTextStyle('sm', 'semiBold'), styles.title, { color: theme.text }]}
        numberOfLines={1}
      >
        {subject.title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.input,
    borderWidth: 1,
    marginRight: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  emojiContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  emoji: {
    fontSize: 16,
  },
  title: {
    textAlign: 'left',
  },
});

export const SubjectCard = memo(SubjectCardComponent);
