import type { MentorOption } from '@/types/mentor';

export const MENTOR_OPTIONS: MentorOption[] = [
  {
    id: 'ved',
    name: 'Ved',
    personality: ['Logical', 'Patient', 'Concept Focused'],
    description: 'Breaks down complex ideas into clear, structured steps.',
    examplePrompt: 'Explain recursion.',
    exampleResponse: "Let's build intuition first...",
    accentColor: '#4F46E5',
  },
  {
    id: 'kai',
    name: 'Kai',
    personality: ['Energetic', 'Fast', 'Motivating'],
    description: 'Keeps momentum high and helps you act with confidence.',
    examplePrompt: 'I have an exam tomorrow.',
    exampleResponse: "Let's make a fast recovery plan.",
    accentColor: '#F59E0B',
  },
  {
    id: 'ira',
    name: 'Ira',
    personality: ['Calm', 'Reflective', 'Supportive'],
    description: 'Guides you gently through uncertainty and slow days.',
    examplePrompt: 'I feel stuck.',
    exampleResponse: "Growth isn't about speed.",
    accentColor: '#10B981',
  },
];
