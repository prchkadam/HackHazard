import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PROMPT_DIR = join(__dirname, '../prompts');

const MENTOR_PROMPT_FILES: Record<string, string> = {
  ved: 'ved.txt',
  kai: 'kai.txt',
  ira: 'ira.txt',
};

function loadPrompt(filename: string): string {
  const path = join(PROMPT_DIR, filename);
  return readFileSync(path, 'utf-8').trim();
}

export function getMentorSystemPrompt(mentorId: string): string {
  const file = MENTOR_PROMPT_FILES[mentorId.toLowerCase()];
  if (!file) {
    return loadPrompt('ved.txt');
  }
  return loadPrompt(file);
}

export interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

export function buildPrompt(
  mentorId: string,
  conversationHistory: ConversationMessage[],
  currentMessage: string,
): string {
  const systemPrompt = getMentorSystemPrompt(mentorId);

  const historyText = conversationHistory
    .slice(-10)
    .map((msg) =>
      msg.role === 'user'
        ? `Student: ${msg.content}`
        : `Mentor: ${msg.content}`,
    )
    .join('\n\n');

  const parts = [
    `SYSTEM INSTRUCTIONS:\n${systemPrompt}`,
    historyText ? `CONVERSATION HISTORY:\n${historyText}` : '',
    `Student: ${currentMessage}`,
    `\nRespond as the mentor. Return ONLY valid JSON matching the specified format.`,
  ];

  return parts.filter(Boolean).join('\n\n---\n\n');
}
