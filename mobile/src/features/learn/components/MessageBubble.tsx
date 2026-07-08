import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import Markdown from 'react-native-markdown-display';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { ConversationMessage } from '@/types/learn';

interface MessageBubbleProps {
  message: ConversationMessage;
}

function MessageBubbleComponent({ message }: MessageBubbleProps) {
  const theme = useTheme();

  const markdownStyles = {
    body: {
      color: theme.text,
      fontSize: 15,
      lineHeight: 22,
    },
    heading1: {
      color: theme.text,
      fontWeight: '700',
      marginTop: Spacing.md,
      marginBottom: Spacing.xs,
    },
    heading2: {
      color: theme.text,
      fontWeight: '600',
      marginTop: Spacing.md,
      marginBottom: Spacing.xs,
    },
    code_inline: {
      backgroundColor: theme.backgroundSelected,
      color: theme.primary,
      paddingHorizontal: 4,
      borderRadius: 4,
      fontFamily: 'monospace',
    },
    code_block: {
      backgroundColor: theme.backgroundSelected,
      color: theme.text,
      padding: Spacing.sm,
      borderRadius: 8,
      fontFamily: 'monospace',
      borderWidth: 1,
      borderColor: theme.borderLight,
      marginVertical: Spacing.xs,
    },
    bullet_list: {
      marginVertical: Spacing.xs,
    },
    ordered_list: {
      marginVertical: Spacing.xs,
    },
    table: {
      borderWidth: 1,
      borderColor: theme.borderLight,
      borderRadius: 4,
      marginVertical: Spacing.md,
    },
    tr: {
      borderBottomWidth: 1,
      borderColor: theme.borderLight,
    },
    th: {
      padding: Spacing.xs,
      fontWeight: '700',
      backgroundColor: theme.backgroundSelected,
    },
    td: {
      padding: Spacing.xs,
    },
  };

  return (
    <View style={styles.container}>
      <View style={[styles.bubble, { backgroundColor: theme.backgroundElement, borderColor: theme.borderLight }]}>
        <Markdown style={markdownStyles as any}>{message.content}</Markdown>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginVertical: Spacing.xs,
    paddingRight: 40,
  },
  bubble: {
    borderRadius: 16,
    borderBottomLeftRadius: 4,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderWidth: 1,
  },
});

export const MessageBubble = memo(MessageBubbleComponent);
