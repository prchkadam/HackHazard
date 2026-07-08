import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Spacing, createTextStyle } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { ConversationMessage } from '@/types/learn';

interface UserBubbleProps {
  message: ConversationMessage;
}

function UserBubbleComponent({ message }: UserBubbleProps) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <View style={[styles.bubble, { backgroundColor: theme.primary }]}>
        <Text style={[createTextStyle('md'), { color: theme.white }]}>
          {message.content}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginVertical: Spacing.xs,
    paddingLeft: 40,
  },
  bubble: {
    borderRadius: 16,
    borderBottomRightRadius: 4,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    maxWidth: '100%',
  },
});

export const UserBubble = memo(UserBubbleComponent);
