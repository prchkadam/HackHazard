import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { Spacing, createTextStyle } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { MENTOR_OPTIONS } from '@/constants/mentors';
import type { MentorId } from '@/types/learn';

interface MentorHeaderProps {
  mentorId: MentorId;
}

export function MentorHeader({ mentorId }: MentorHeaderProps) {
  const theme = useTheme();
  const router = useRouter();
  const mentor = MENTOR_OPTIONS.find((m) => m.id === mentorId);

  if (!mentor) return null;

  return (
    <View style={[styles.container, { borderBottomColor: theme.borderLight }]}>
      <Pressable
        onPress={() => router.back()}
        style={styles.backButton}
        accessibilityRole="button"
        accessibilityLabel="Go back"
      >
        <SymbolView
          name={{ ios: 'chevron.left', android: 'chevron_left', web: 'chevron_left' }}
          size={24}
          tintColor={theme.text}
        />
      </Pressable>

      <View style={styles.mentorInfo}>
        <View style={[styles.avatar, { backgroundColor: mentor.accentColor }]}>
          <Text style={[createTextStyle('md', 'bold'), { color: theme.white }]}>
            {mentor.name[0]}
          </Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={[createTextStyle('md', 'bold'), { color: theme.text }]}>
            {mentor.name}
          </Text>
          <View style={styles.tagContainer}>
            {mentor.personality.map((tag) => (
              <View key={tag} style={[styles.tag, { backgroundColor: theme.backgroundSelected }]}>
                <Text style={[createTextStyle('xs', 'medium'), { color: theme.textSecondary }]}>
                  {tag}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    height: 64,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  mentorInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  textContainer: {
    flex: 1,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 2,
    gap: Spacing.xs,
  },
  tag: {
    paddingHorizontal: Spacing.xs,
    paddingVertical: 1,
    borderRadius: 4,
  },
});
