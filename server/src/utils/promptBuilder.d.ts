export declare function getMentorSystemPrompt(mentorId: string): string;
export interface ConversationMessage {
    role: 'user' | 'assistant';
    content: string;
    timestamp?: string;
}
export declare function buildPrompt(mentorId: string, conversationHistory: ConversationMessage[], currentMessage: string): string;
//# sourceMappingURL=promptBuilder.d.ts.map