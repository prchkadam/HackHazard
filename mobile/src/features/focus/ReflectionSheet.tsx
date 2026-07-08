import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import { createTextStyle, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { ReflectionInput } from '@/services/api/focus';

interface ReflectionSheetProps {
  visible: boolean;
  topic: string;
  onSubmit: (data: ReflectionInput) => Promise<void>;
  onSkip: () => void;
}

const QUESTIONS = [
  { key: 'learned' as const, label: 'What did you learn today?', placeholder: 'Share something new you discovered...' },
  { key: 'difficult' as const, label: 'What felt difficult?', placeholder: "It's okay to struggle — what challenged you?" },
  { key: 'nextSteps' as const, label: "What's your next step?", placeholder: 'What will you do next...' },
];

export function ReflectionSheet({ visible, topic, onSubmit, onSkip }: ReflectionSheetProps) {
  const theme = useTheme();
  const [answers, setAnswers] = useState<ReflectionInput>({
    topic,
    learned: '',
    difficult: '',
    nextSteps: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const canSubmit = answers.learned.trim() && answers.difficult.trim() && answers.nextSteps.trim();

  async function handleSubmit() {
    if (!canSubmit || loading) return;
    setLoading(true);
    setError('');
    try {
      await onSubmit({ ...answers, topic });
    } catch {
      setError('Could not save your reflection. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal visible={visible} animationType="slide" transparent presentationStyle="overFullScreen">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.backdrop}
      >
        <View style={[styles.sheet, { backgroundColor: theme.backgroundElement }]}>
          <View style={[styles.handle, { backgroundColor: theme.border }]} />

          <Text style={[styles.title, { color: theme.text }]}>Take a Moment</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Reflect on your session: <Text style={{ color: theme.primary }}>{topic}</Text>
          </Text>

          <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
            {QUESTIONS.map((q) => (
              <View key={q.key} style={styles.questionBlock}>
                <Text style={[styles.questionLabel, { color: theme.text }]}>{q.label}</Text>
                <TextInput
                  multiline
                  value={answers[q.key]}
                  onChangeText={(t) => setAnswers((prev) => ({ ...prev, [q.key]: t }))}
                  placeholder={q.placeholder}
                  placeholderTextColor={theme.textMuted}
                  style={[
                    styles.input,
                    {
                      backgroundColor: theme.backgroundSecondary,
                      borderColor: theme.border,
                      color: theme.text,
                    },
                  ]}
                />
              </View>
            ))}

            {error ? (
              <Text style={[styles.errorText, { color: theme.error }]}>{error}</Text>
            ) : null}
          </ScrollView>

          <View style={styles.actions}>
            <TouchableOpacity onPress={onSkip} style={styles.skipBtn} disabled={loading}>
              <Text style={[styles.skipText, { color: theme.textMuted }]}>Skip for now</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={!canSubmit || loading}
              style={[
                styles.submitBtn,
                { backgroundColor: canSubmit ? theme.primary : theme.border },
              ]}
            >
              {loading ? (
                <ActivityIndicator size="small" color={theme.white} />
              ) : (
                <Text style={[styles.submitText, { color: theme.white }]}>Save Reflection</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sheet: {
    borderTopLeftRadius: Radius.bottomSheet,
    borderTopRightRadius: Radius.bottomSheet,
    padding: Spacing.xxl,
    paddingBottom: Spacing.massive,
    maxHeight: '90%',
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    marginBottom: Spacing.xl,
  },
  title: {
    ...createTextStyle('xxl', 'bold'),
    marginBottom: Spacing.xs,
  },
  subtitle: {
    ...createTextStyle('sm', 'regular'),
    marginBottom: Spacing.xxl,
  },
  scroll: {
    flexGrow: 0,
  },
  questionBlock: {
    marginBottom: Spacing.xl,
  },
  questionLabel: {
    ...createTextStyle('md', 'semiBold'),
    marginBottom: Spacing.sm,
  },
  input: {
    borderRadius: Radius.input,
    borderWidth: 1,
    minHeight: 80,
    padding: Spacing.md,
    textAlignVertical: 'top',
    ...createTextStyle('sm', 'regular'),
  },
  errorText: {
    ...createTextStyle('sm', 'regular'),
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.xl,
    gap: Spacing.md,
  },
  skipBtn: {
    padding: Spacing.md,
  },
  skipText: {
    ...createTextStyle('sm', 'medium'),
  },
  submitBtn: {
    flex: 1,
    borderRadius: Radius.button,
    padding: Spacing.md,
    alignItems: 'center',
  },
  submitText: {
    ...createTextStyle('md', 'semiBold'),
  },
});
