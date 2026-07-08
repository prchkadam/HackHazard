import React, { memo } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  type ScrollViewProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';

export type ScreenState = 'loading' | 'empty' | 'error' | 'success' | 'offline';

export interface AppScreenProps extends ScrollViewProps {
  children?: React.ReactNode;
  state?: ScreenState;
  loadingMessage?: string;
  emptyTitle?: string;
  emptyMessage?: string;
  errorMessage?: string;
  onRetry?: () => void;
  scrollable?: boolean;
  padded?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
}

function AppScreenComponent({
  children,
  state = 'success',
  loadingMessage,
  emptyTitle,
  emptyMessage,
  errorMessage,
  onRetry,
  scrollable = true,
  padded = true,
  contentStyle,
  style,
  ...rest
}: AppScreenProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const renderContent = () => {
    switch (state) {
      case 'loading':
        return <LoadingSpinner message={loadingMessage} />;
      case 'empty':
        return <EmptyState title={emptyTitle} message={emptyMessage} />;
      case 'error':
      case 'offline':
        return (
          <ErrorState
            message={errorMessage}
            offline={state === 'offline'}
            onRetry={onRetry}
          />
        );
      default:
        return children;
    }
  };

  const containerStyle = [
    styles.container,
    {
      backgroundColor: theme.background,
      paddingTop: insets.top,
      paddingBottom: insets.bottom,
    },
    style,
  ];

  const innerStyle = [
    padded && styles.padded,
    contentStyle,
  ];

  if (scrollable && state === 'success') {
    return (
      <ScrollView
        style={containerStyle}
        contentContainerStyle={[innerStyle, styles.scrollContent]}
        showsVerticalScrollIndicator={false}
        {...rest}
      >
        {renderContent()}
      </ScrollView>
    );
  }

  return (
    <View style={containerStyle}>
      <View style={[styles.flex, innerStyle]}>{renderContent()}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  padded: {
    paddingHorizontal: Spacing.xxl,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: Spacing.xxxl,
  },
});

export const AppScreen = memo(AppScreenComponent);
