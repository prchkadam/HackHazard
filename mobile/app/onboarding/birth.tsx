import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { router } from 'expo-router';
import { Animation, Spacing, createTextStyle } from '@/constants/theme';
import { Routes } from '@/constants/routes';
import { setCompanionBirthComplete } from '@/services/auth/guestAuth';

export default function CompanionBirthScreen() {
  const scale = useSharedValue(0.3);
  const glowOpacity = useSharedValue(0.3);
  const textOpacity = useSharedValue(0);
  const containerOpacity = useSharedValue(1);

  useEffect(() => {
    scale.value = withTiming(1, { duration: Animation.slow });
    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(0.8, { duration: Animation.slow }),
        withTiming(0.3, { duration: Animation.slow }),
      ),
      -1,
      true,
    );

    const textTimer = setTimeout(() => {
      textOpacity.value = withTiming(1, { duration: Animation.normal });
    }, 1000);

    const fadeTimer = setTimeout(() => {
      containerOpacity.value = withTiming(0, { duration: Animation.normal });
    }, Animation.birthDuration - Animation.normal);

    const navigateTimer = setTimeout(async () => {
      await setCompanionBirthComplete();
      router.replace(Routes.home as never);
    }, Animation.birthDuration);

    return () => {
      clearTimeout(textTimer);
      clearTimeout(fadeTimer);
      clearTimeout(navigateTimer);
    };
  }, [scale, glowOpacity, textOpacity, containerOpacity]);

  const seedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
  }));

  const containerStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
  }));

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      <Animated.View style={[styles.glow, glowStyle]} />
      <Animated.View style={[styles.seed, seedStyle]} accessibilityLabel="Companion seed">
        <Text style={styles.seedIcon}>✦</Text>
      </Animated.View>
      <Animated.Text style={[styles.text, textStyle]}>
        Every journey begins with a single step.
      </Animated.Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F1A',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xxxl,
  },
  glow: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(129, 140, 248, 0.35)',
  },
  seed: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#818CF8',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#818CF8',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 10,
  },
  seedIcon: {
    fontSize: 24,
    color: '#FFFFFF',
  },
  text: {
    ...createTextStyle('lg', 'medium'),
    color: '#F9FAFB',
    textAlign: 'center',
    marginTop: Spacing.giant,
    paddingHorizontal: Spacing.xxxl,
  },
});
