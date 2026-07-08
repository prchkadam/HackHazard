import { Platform, TextStyle, ViewStyle } from 'react-native';

export const Colors = {
  light: {
    text: '#1A1A2E',
    textSecondary: '#6B7280',
    textMuted: '#9CA3AF',
    background: '#FAFAFA',
    backgroundSecondary: '#F3F4F6',
    backgroundElement: '#FFFFFF',
    backgroundSelected: '#E5E7EB',
    primary: '#4F46E5',
    primaryLight: '#EEF2FF',
    primaryDark: '#3730A3',
    secondary: '#10B981',
    secondaryLight: '#D1FAE5',
    accent: '#F59E0B',
    border: '#E5E7EB',
    borderLight: '#F3F4F6',
    error: '#EF4444',
    errorLight: '#FEE2E2',
    success: '#10B981',
    warning: '#F59E0B',
    overlay: 'rgba(0, 0, 0, 0.5)',
    companionGlow: 'rgba(79, 70, 229, 0.3)',
    birthBackground: '#0F0F1A',
    white: '#FFFFFF',
    black: '#000000',
  },
  dark: {
    text: '#F9FAFB',
    textSecondary: '#9CA3AF',
    textMuted: '#6B7280',
    background: '#0F0F1A',
    backgroundSecondary: '#1A1A2E',
    backgroundElement: '#252538',
    backgroundSelected: '#2E2E42',
    primary: '#818CF8',
    primaryLight: '#312E81',
    primaryDark: '#6366F1',
    secondary: '#34D399',
    secondaryLight: '#064E3B',
    accent: '#FBBF24',
    border: '#374151',
    borderLight: '#1F2937',
    error: '#F87171',
    errorLight: '#450A0A',
    success: '#34D399',
    warning: '#FBBF24',
    overlay: 'rgba(0, 0, 0, 0.7)',
    companionGlow: 'rgba(129, 140, 248, 0.4)',
    birthBackground: '#0A0A12',
    white: '#FFFFFF',
    black: '#000000',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;
export type ColorScheme = keyof typeof Colors;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 40,
  massive: 48,
  giant: 64,
} as const;

export const Radius = {
  input: 16,
  button: 18,
  card: 24,
  dialog: 28,
  bottomSheet: 32,
  full: 9999,
} as const;

export const Typography = {
  fontFamily: {
    regular: 'Manrope_400Regular',
    medium: 'Manrope_500Medium',
    semiBold: 'Manrope_600SemiBold',
    bold: 'Manrope_700Bold',
    fallback: Platform.select({ ios: 'System', android: 'sans-serif', default: 'System' }),
  },
  size: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
    display: 40,
  },
  lineHeight: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 28,
    xl: 32,
    xxl: 36,
    xxxl: 40,
    display: 48,
  },
} as const;

export const Shadow = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
  },
} as const;

export const Animation = {
  fast: 200,
  normal: 250,
  slow: 500,
  birthDuration: 5000,
} as const;

export const TouchTarget = {
  min: 48,
} as const;

export const MaxContentWidth = 800;
export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;

export const Fonts = Platform.select({
  ios: {
    sans: 'System',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export function createTextStyle(
  size: keyof typeof Typography.size,
  weight: keyof typeof Typography.fontFamily = 'regular',
): TextStyle {
  return {
    fontFamily: Typography.fontFamily[weight],
    fontSize: Typography.size[size],
    lineHeight: Typography.lineHeight[size],
  };
}

export function createCardStyle(scheme: ColorScheme): ViewStyle {
  return {
    backgroundColor: Colors[scheme].backgroundElement,
    borderRadius: Radius.card,
    ...Shadow.md,
  };
}
