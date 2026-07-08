export interface AIResponse {
  message: string;
  suggestedQuestions: string[];
  title: string;
  quiz?: Array<{
    question: string;
    options: string[];
    correctAnswerIndex: number;
    explanation: string;
  }> | undefined;
  practice?: Array<{
    difficulty: 'easy' | 'medium' | 'hard';
    question: string;
  }> | undefined;
}

export interface AIProvider {
  generateResponse(prompt: string): Promise<AIResponse>;
}
