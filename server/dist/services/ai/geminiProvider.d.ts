import type { AIProvider, AIResponse } from './aiProvider';
export declare class GeminiProvider implements AIProvider {
    private readonly apiKey;
    constructor();
    generateResponse(prompt: string): Promise<AIResponse>;
}
//# sourceMappingURL=geminiProvider.d.ts.map