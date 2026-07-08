import { useColorScheme } from 'react-native';
import { Colors, ColorScheme } from '@/constants/theme';

export function useTheme() {
  const scheme = useColorScheme();
  const colorScheme: ColorScheme = scheme === 'dark' ? 'dark' : 'light';
  return Colors[colorScheme];
}

export function useColorSchemeName(): ColorScheme {
  const scheme = useColorScheme();
  return scheme === 'dark' ? 'dark' : 'light';
}
