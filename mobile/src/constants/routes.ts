export const Routes = {
  splash: '/',
  login: '/login',
  mentorOnboarding: '/onboarding/mentor',
  companionBirth: '/onboarding/birth',
  home: '/(tabs)/home',
  learn: '/(tabs)/learn',
  journey: '/(tabs)/journey',
  profile: '/(tabs)/profile',
} as const;

export type RouteKey = keyof typeof Routes;
