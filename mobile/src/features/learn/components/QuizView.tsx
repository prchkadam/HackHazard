import React, { useState } from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { AppCard } from '@/components/AppCard';
import { Spacing, createTextStyle } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

interface QuizViewProps {
  quiz: QuizQuestion[];
}

export function QuizView({ quiz }: QuizViewProps) {
  const theme = useTheme();
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});

  const handleSelectOption = (questionIndex: number, optionIndex: number) => {
    if (selectedAnswers[questionIndex] !== undefined) return; // Prevent changing answer once selected
    setSelectedAnswers((prev) => ({ ...prev, [questionIndex]: optionIndex }));
  };

  return (
    <View style={styles.container}>
      <Text style={[createTextStyle('md', 'bold'), styles.header, { color: theme.text }]}>
        Mentor's Mini Quiz
      </Text>
      {quiz.map((q, qIdx) => {
        const selectedOptionIdx = selectedAnswers[qIdx];
        const isAnswered = selectedOptionIdx !== undefined;

        return (
          <AppCard key={qIdx} style={styles.quizCard}>
            <Text style={[createTextStyle('sm', 'semiBold'), styles.question, { color: theme.text }]}>
              Q{qIdx + 1}: {q.question}
            </Text>

            {q.options.map((opt, oIdx) => {
              const isSelected = selectedOptionIdx === oIdx;
              const isCorrectOption = q.correctAnswerIndex === oIdx;
              
              let backgroundColor: string = theme.backgroundElement;
              let borderColor: string = theme.borderLight;
              let textColor: string = theme.text;

              if (isAnswered) {
                if (isCorrectOption) {
                  backgroundColor = '#DEF7EC'; // soft green
                  borderColor = '#31C48D'; // green border
                  textColor = '#03543F';
                } else if (isSelected) {
                  backgroundColor = '#FDE8E8'; // soft red
                  borderColor = '#F05252'; // red border
                  textColor = '#9B1C1C';
                } else {
                  backgroundColor = theme.backgroundElement;
                  borderColor = theme.borderLight;
                  textColor = theme.textMuted;
                }
              } else if (isSelected) {
                borderColor = theme.primary;
              }

              return (
                <Pressable
                  key={oIdx}
                  onPress={() => handleSelectOption(qIdx, oIdx)}
                  disabled={isAnswered}
                  style={[
                    styles.option,
                    {
                      backgroundColor,
                      borderColor,
                      borderWidth: isSelected || (isAnswered && isCorrectOption) ? 2 : 1,
                    },
                  ]}
                  accessibilityRole="button"
                >
                  <Text style={[createTextStyle('sm'), { color: textColor }]}>
                    {opt}
                  </Text>
                </Pressable>
              );
            })}

            {isAnswered && (
              <View style={[styles.explanationBox, { backgroundColor: theme.backgroundSelected }]}>
                <Text style={[createTextStyle('xs', 'semiBold'), { color: theme.text }]}>
                  {selectedOptionIdx === q.correctAnswerIndex ? '🎉 Correct!' : '👉 Incorrect'}
                </Text>
                <Text style={[createTextStyle('xs'), styles.explanationText, { color: theme.textSecondary }]}>
                  {q.explanation}
                </Text>
              </View>
            )}
          </AppCard>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: Spacing.md,
  },
  header: {
    marginBottom: Spacing.sm,
    paddingHorizontal: Spacing.xs,
  },
  quizCard: {
    marginBottom: Spacing.md,
    padding: Spacing.md,
  },
  question: {
    marginBottom: Spacing.md,
  },
  option: {
    padding: Spacing.md,
    borderRadius: 8,
    marginBottom: Spacing.sm,
    minHeight: 48,
    justifyContent: 'center',
  },
  explanationBox: {
    marginTop: Spacing.sm,
    padding: Spacing.md,
    borderRadius: 8,
  },
  explanationText: {
    marginTop: Spacing.xs,
    lineHeight: 16,
  },
});
