import React, { memo } from 'react';
import { Modal as RNModal, Pressable, StyleSheet, Text, View } from 'react-native';
import { X } from 'lucide-react-native';
import { Radius, Spacing, TouchTarget, createTextStyle } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export interface AppModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

function AppModalComponent({ visible, onClose, title, children }: AppModalProps) {
  const theme = useTheme();

  return (
    <RNModal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <Pressable style={[styles.overlay, { backgroundColor: theme.overlay }]} onPress={onClose}>
        <Pressable
          style={[
            styles.content,
            {
              backgroundColor: theme.backgroundElement,
              borderRadius: Radius.dialog,
            },
          ]}
          onPress={(e) => e.stopPropagation()}
        >
          {title ? (
            <View style={styles.header}>
              <Text style={[createTextStyle('lg', 'semiBold'), { color: theme.text, flex: 1 }]}>
                {title}
              </Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Close"
                onPress={onClose}
                hitSlop={12}
                style={styles.closeButton}
              >
                <X size={24} color={theme.textSecondary} />
              </Pressable>
            </View>
          ) : null}
          {children}
        </Pressable>
      </Pressable>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xxl,
  },
  content: {
    width: '100%',
    maxWidth: 400,
    padding: Spacing.xxl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  closeButton: {
    minWidth: TouchTarget.min,
    minHeight: TouchTarget.min,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export const AppModal = memo(AppModalComponent);
