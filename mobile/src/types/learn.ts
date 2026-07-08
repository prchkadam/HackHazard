export type MentorId = 'ved' | 'kai' | 'ira';

export interface ConversationMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  quiz?: any[];
  practice?: any[];
  suggestedQuestions?: string[];
}

export interface Conversation {
  id: string;
  title: string;
  mentorId: MentorId;
  messages: ConversationMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface ChatResponse {
  message: string;
  suggestedQuestions: string[];
  title: string;
  quiz?: Array<{
    question: string;
    options: string[];
    correctAnswerIndex: number;
    explanation: string;
  }>;
  practice?: Array<{
    difficulty: 'easy' | 'medium' | 'hard';
    question: string;
  }>;
}

export interface QuizOption {
  label: string;
  text: string;
}

export interface QuizQuestion {
  question: string;
  options: QuizOption[];
  correct: string;
  explanation: string;
}

export interface PracticeQuestion {
  difficulty: 'Easy' | 'Medium' | 'Hard';
  question: string;
}

export interface Subject {
  id: string;
  title: string;
  emoji: string;
  color: string;
}

export type QuickActionType =
  | 'explain_simpler'
  | 'give_example'
  | 'quiz_me'
  | 'practice'
  | 'summarize';

export const QUICK_ACTION_PROMPTS: Record<QuickActionType, string> = {
  explain_simpler: 'Can you explain that in simpler terms?',
  give_example: 'Can you give me a concrete example?',
  quiz_me: 'Give me a quiz on this topic with 3 MCQ questions.',
  practice: 'Give me 3 practice questions: one Easy, one Medium, one Hard.',
  summarize: 'Can you summarize the key points from our discussion?',
};

export const POPULAR_SUBJECTS: Subject[] = [
  { id: 'dsa', title: 'Data Structures', emoji: '🌳', color: '#4F7942' },
  { id: 'dbms', title: 'DBMS', emoji: '🗄️', color: '#4A6FA5' },
  { id: 'os', title: 'Operating Systems', emoji: '⚙️', color: '#7B5EA7' },
  { id: 'cn', title: 'Computer Networks', emoji: '🌐', color: '#3A7CA5' },
  { id: 'oop', title: 'OOP', emoji: '📦', color: '#B5632A' },
  { id: 'math', title: 'Mathematics', emoji: '∑', color: '#9B4F96' },
  { id: 'prog', title: 'Programming', emoji: '💻', color: '#2A7A5A' },
  { id: 'algo', title: 'Algorithms', emoji: '⚡', color: '#C47B2A' },
];
