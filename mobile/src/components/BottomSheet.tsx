import React, { memo } from 'react';
import { Modal as RNModal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Radius, Spacing, createTextStyle } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

function BottomSheetComponent({ visible, onClose, title, children }: BottomSheetProps) {
  const theme = useTheme();

  return (
    <RNModal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <Pressable style={[styles.overlay, { backgroundColor: theme.overlay }]} onPress={onClose}>
        <Pressable
          style={[
            styles.sheet,
            {
              backgroundColor: theme.backgroundElement,
              borderTopLeftRadius: Radius.bottomSheet,
              borderTopRightRadius: Radius.bottomSheet,
            },
          ]}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={[styles.handle, { backgroundColor: theme.border }]} />
          {title ? (
            <Text style={[createTextStyle('lg', 'semiBold'), { color: theme.text, marginBottom: Spacing.lg }]}>
              {title}
            </Text>
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
    justifyContent: 'flex-end',
  },
  sheet: {
    padding: Spacing.xxl,
    paddingBottom: Spacing.massive,
    maxHeight: '80%',
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: Spacing.lg,
  },
});

export const BottomSheet = memo(BottomSheetComponent);
