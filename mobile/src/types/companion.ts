export type CompanionStage = 'seed' | 'growing' | 'bloomed';
export type CompanionMood = 'calm' | 'thinking' | 'waiting' | 'proud' | 'growing';

export interface Companion {
  id: string;
  stage: CompanionStage;
  mood: CompanionMood;
}
