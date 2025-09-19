// lib/ai-service.ts
import { OpenAI } from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Configuration
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

export interface AIServiceConfig {
    provider: 'openai' | 'anthropic' | 'gemini';
    model?: string;
    maxTokens?: number;
    temperature?: number;
}

export class AIService {
    private config: AIServiceConfig;

    constructor(config: AIServiceConfig = { provider: 'openai' }) {
        let defaultModel: string;
        switch (config.provider) {
            case 'openai':
                defaultModel = 'gpt-4o';
                break;
            case 'anthropic':
                defaultModel = 'claude-3-5-sonnet-20241022';
                break;
            case 'gemini':
                defaultModel = 'gemini-2.5-pro';
                break;
            default:
                defaultModel = 'gpt-4o';
        }

        this.config = {
            model: defaultModel,
            maxTokens: 4000,
            temperature: 0.7,
            ...config,
        };
    }

    async generateCompletion(prompt: string): Promise<string> {
        try {
            switch (this.config.provider) {
                case 'openai':
                    return await this.generateOpenAICompletion(prompt);
                case 'anthropic':
                    return await this.generateAnthropicCompletion(prompt);
                case 'gemini':
                    return await this.generateGeminiCompletion(prompt);
                default:
                    throw new Error(`Unsupported AI provider: ${this.config.provider}`);
            }
        } catch (error) {
            console.error('AI Service Error:', error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            throw new Error(`AI service failed: ${errorMessage}`);
        }
    }

    private async generateOpenAICompletion(prompt: string): Promise<string> {
        const response = await openai.chat.completions.create({
            model: this.config.model!,
            messages: [
                {
                    role: 'system',
                    content: 'You are a professional marketing strategist. Always respond with valid JSON only, no additional formatting or text.',
                },
                {
                    role: 'user',
                    content: prompt,
                },
            ],
            max_tokens: this.config.maxTokens,
            temperature: this.config.temperature,
        });

        const content = response.choices[0]?.message?.content;
        if (!content) {
            throw new Error('No response generated from OpenAI');
        }

        return content.trim();
    }

    private async generateAnthropicCompletion(prompt: string): Promise<string> {
        const response = await anthropic.messages.create({
            model: this.config.model!,
            max_tokens: this.config.maxTokens!,
            temperature: this.config.temperature,
            messages: [
                {
                    role: 'user',
                    content: prompt,
                },
            ],
        });

        const content = response.content[0];
        if (content.type !== 'text') {
            throw new Error('Unexpected response type from Anthropic');
        }

        return content.text.trim();
    }

    private async generateGeminiCompletion(prompt: string): Promise<string> {
        const model = genAI.getGenerativeModel({ 
            model: this.config.model!,
            generationConfig: {
                maxOutputTokens: this.config.maxTokens,
                temperature: this.config.temperature,
            },
        });

        const systemPrompt = 'You are a professional marketing strategist. Always respond with valid JSON only, no additional formatting or text.';
        const fullPrompt = `${systemPrompt}\n\n${prompt}`;

        const result = await model.generateContent(fullPrompt);
        const response = await result.response;
        const content = response.text();

        if (!content) {
            throw new Error('No response generated from Gemini');
        }

        return content.trim();
    }
}

// Singleton instance
export const aiService = new AIService({
    provider: process.env.AI_PROVIDER as 'openai' | 'anthropic' | 'gemini' || 'openai',
});

// Rate limiting and caching utilities
export class AIServiceWithCache extends AIService {
    private cache = new Map<string, { data: string; timestamp: number }>();
    private rateLimiter = new Map<string, number[]>();

    constructor(config: AIServiceConfig = { provider: 'openai' }) {
        super(config);
    }

    async generateCompletionWithCache(
        prompt: string,
        cacheKey?: string,
        rateLimitKey?: string
    ): Promise<string> {
        // Check cache first
        if (cacheKey && this.isCacheValid(cacheKey)) {
            return this.cache.get(cacheKey)!.data;
        }

        // Check rate limits
        if (rateLimitKey && this.isRateLimited(rateLimitKey)) {
            throw new Error('Rate limit exceeded. Please try again later.');
        }

        // Generate new completion
        const result = await this.generateCompletion(prompt);

        // Update cache and rate limiter
        if (cacheKey) {
            this.cache.set(cacheKey, { data: result, timestamp: Date.now() });
        }
        if (rateLimitKey) {
            this.updateRateLimit(rateLimitKey);
        }

        return result;
    }

    private isCacheValid(key: string): boolean {
        const cached = this.cache.get(key);
        if (!cached) return false;

        // Cache valid for 1 hour
        return Date.now() - cached.timestamp < 3600000;
    }

    private isRateLimited(key: string): boolean {
        const requests = this.rateLimiter.get(key) || [];
        const now = Date.now();
        const oneHourAgo = now - 3600000;

        // Keep only requests from the last hour
        const recentRequests = requests.filter(timestamp => timestamp > oneHourAgo);

        // Allow max 10 requests per hour per key
        return recentRequests.length >= 10;
    }

    private updateRateLimit(key: string): void {
        const requests = this.rateLimiter.get(key) || [];
        requests.push(Date.now());
        this.rateLimiter.set(key, requests);
    }
}