// lib/ai-service.ts
import { OpenAI } from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';
import {
    ContentIdea,
    ContentIdeaGenerationRequest,
    TrendingHashtag,
    UserContentPreferences,
    ContentFeedback
} from '@/types/brief';

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
                defaultModel = 'gemini-2.0-flash-exp';
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

    // Enhanced Content Ideation Methods for Task 3

    /**
     * Generate enhanced content ideas with trending elements and visual mockups
     */
    async generateContentIdeas(request: ContentIdeaGenerationRequest): Promise<ContentIdea[]> {
        const prompt = this.buildContentIdeationPrompt(request);
        const cacheKey = this.generateCacheKey('content_ideas', request);

        try {
            const response = await this.generateCompletionWithCache(prompt, cacheKey);
            const contentIdeas = this.parseContentIdeasResponse(response);

            // Enhance with trending elements
            for (const idea of contentIdeas) {
                idea.trending_elements = await this.generateTrendingElements(idea.platform, request.brief_data);
                idea.performance_prediction = await this.predictPerformance(idea, request.brief_data);
            }

            return contentIdeas;
        } catch (error) {
            console.error('Error generating content ideas:', error);
            throw new Error(`Failed to generate content ideas: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Generate trending hashtags for a specific platform and content
     */
    async generateTrendingHashtags(platform: string, content: string, niche: string): Promise<TrendingHashtag[]> {
        const prompt = `
<task>
Generate trending hashtags for ${platform} content about "${content}" in the ${niche} niche.
</task>

<output_format>
Return ONLY a valid JSON array of hashtag objects with this structure:
[
  {
    "hashtag": "#example",
    "trend_score": 85,
    "reach_potential": "high",
    "competition_level": "medium",
    "relevance_score": 90
  }
]
</output_format>

<guidelines>
- Include 10-15 hashtags with varying popularity levels
- Mix trending, niche-specific, and evergreen hashtags
- Ensure hashtags are relevant to the content and platform
- Provide realistic trend and relevance scores (1-100)
- Consider current social media trends
</guidelines>
        `;

        try {
            const response = await this.generateCompletion(prompt);
            return this.parseTrendingHashtagsResponse(response);
        } catch (error) {
            console.error('Error generating trending hashtags:', error);
            return this.getFallbackHashtags(platform, niche);
        }
    }

    /**
     * Learn from user feedback to improve future content suggestions
     */
    async learnFromFeedback(feedback: ContentFeedback[], userPreferences: UserContentPreferences): Promise<UserContentPreferences> {
        const prompt = `
<task>
Analyze user feedback and update content preferences for better future recommendations.
</task>

<feedback_data>
${JSON.stringify(feedback)}
</feedback_data>

<current_preferences>
${JSON.stringify(userPreferences)}
</current_preferences>

<output_format>
Return ONLY a valid JSON object with updated preferences:
{
  "preferred_content_types": ["video", "carousel"],
  "avoided_elements": ["overly_promotional", "long_text"],
  "brand_voice_keywords": ["authentic", "relatable", "educational"],
  "learning_insights": ["User prefers visual content", "Short-form performs better"]
}
</output_format>
        `;

        try {
            const response = await this.generateCompletion(prompt);
            return this.parsePreferencesResponse(response);
        } catch (error) {
            console.error('Error learning from feedback:', error);
            return userPreferences; // Return existing preferences if learning fails
        }
    }

    /**
     * Generate content variations for A/B testing
     */
    async generateContentVariations(originalIdea: ContentIdea, variationType: 'hook' | 'visual' | 'cta' | 'platform_adaptation', count: number = 3): Promise<ContentIdea[]> {
        const prompt = `
<task>
Create ${count} variations of the content idea focusing on ${variationType} optimization.
</task>

<original_idea>
${JSON.stringify(originalIdea)}
</original_idea>

<variation_focus>
${variationType === 'hook' ? 'Create different opening hooks to grab attention' :
  variationType === 'visual' ? 'Modify visual elements and presentation style' :
  variationType === 'cta' ? 'Change call-to-action approaches and messaging' :
  'Adapt content for different platform requirements'}
</variation_focus>

<output_format>
Return ONLY a valid JSON array of ContentIdea objects with variations.
</output_format>
        `;

        try {
            const response = await this.generateCompletion(prompt);
            return this.parseContentIdeasResponse(response);
        } catch (error) {
            console.error('Error generating content variations:', error);
            throw new Error(`Failed to generate content variations: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    // Private helper methods

    private buildContentIdeationPrompt(request: ContentIdeaGenerationRequest): string {
        const { brief_data, idea_count = 5, platforms = [], creativity_level = 'balanced' } = request;

        return `
<persona>
You are an expert content strategist and viral marketing specialist with deep knowledge of social media trends, platform algorithms, and content creation best practices across all major platforms.
</persona>

<task>
Generate ${idea_count} detailed content ideas based on the campaign brief, incorporating current trends, platform-specific optimizations, and creative visual concepts.
</task>

<campaign_brief>
Product: ${brief_data.productDescription}
Audience: ${brief_data.targetAudience}
Goals: ${brief_data.campaignGoals}
Budget: ${brief_data.budget}
Platforms: ${platforms.length > 0 ? platforms.join(', ') : brief_data.platforms.join(', ')}
Timeframe: ${brief_data.timeframe}
</campaign_brief>

<creativity_level>
${creativity_level === 'conservative' ? 'Focus on proven, safe content formats with predictable performance' :
  creativity_level === 'experimental' ? 'Push creative boundaries with innovative formats and emerging trends' :
  'Balance creativity with proven performance, incorporating some trending elements'}
</creativity_level>

<output_format>
Return ONLY a valid JSON array of ContentIdea objects with this exact structure:
[
  {
    "id": "unique_id",
    "title": "Content Title",
    "platform": "Instagram",
    "content_type": "video",
    "hook": "Attention-grabbing opening",
    "concept": "Detailed content concept",
    "cta": "Clear call to action",
    "duration": "30-60 seconds",
    "creative_details": {
      "visual_style": "Clean, minimal aesthetic",
      "tone_of_voice": "Conversational and authentic",
      "key_elements": ["product showcase", "lifestyle integration"],
      "color_palette": ["#FF6B6B", "#4ECDC4", "#45B7D1"],
      "shot_types": ["close-up", "wide shot", "over-shoulder"],
      "editing_style": "Quick cuts with smooth transitions",
      "music_mood": "Upbeat and energetic",
      "text_overlay_suggestions": ["Key benefits", "Statistics", "Call to action"]
    },
    "visual_mockup": {
      "thumbnail_description": "Eye-catching thumbnail concept",
      "scene_breakdown": [
        {
          "scene_number": 1,
          "duration": "0-3 seconds",
          "description": "Opening hook scene",
          "visual_elements": ["product", "person"],
          "text_overlay": "Problem statement",
          "voiceover": "Did you know...",
          "transitions": "Quick zoom in"
        }
      ],
      "brand_integration_points": ["Natural product placement", "Logo visibility"],
      "accessibility_notes": ["Captions included", "High contrast text"]
    },
    "trending_elements": {
      "hashtags": [],
      "visual_trends": [],
      "platform_features": [],
      "seasonal_relevance": null
    },
    "tags": ["educational", "product-demo", "lifestyle"],
    "created_at": "${new Date().toISOString()}"
  }
]
</output_format>

<guidelines>
- Focus on platform-specific best practices and algorithm optimization
- Include detailed visual mockups with scene-by-scene breakdowns
- Ensure content aligns with campaign goals and target audience
- Incorporate current social media trends and features
- Provide actionable creative direction for content creators
- Consider accessibility and inclusivity in content design
- Balance entertainment value with marketing objectives
</guidelines>
        `;
    }

    private async generateTrendingElements(platform: string, briefData: unknown) {
        // This would integrate with trend APIs in a real implementation
        return {
            hashtags: await this.generateTrendingHashtags(platform, JSON.stringify(briefData), 'general'),
            visual_trends: [
                {
                    trend_name: "Transition effects",
                    description: "Quick transition between scenes",
                    trend_score: 85,
                    difficulty_level: "medium" as const
                }
            ],
            platform_features: [
                {
                    feature_name: platform === "Instagram" ? "Reels" : platform === "TikTok" ? "Effects" : "Shorts",
                    platform: platform,
                    description: "Platform-specific feature to boost engagement",
                    engagement_boost: 25,
                    implementation_tips: ["Use trending audio", "Add captions", "Optimal timing"]
                }
            ]
        };
    }

    private async predictPerformance(_idea: ContentIdea, _briefData: unknown) {
        // This would use ML models in a real implementation
        return {
            engagement_rate_prediction: {
                low: 2.5,
                medium: 5.2,
                high: 8.7
            },
            reach_potential: {
                organic: 10000,
                paid: 50000
            },
            viral_potential_score: 65,
            confidence_level: 75,
            key_success_factors: ["Strong hook", "Trending audio", "Clear CTA"],
            optimization_suggestions: ["Post during peak hours", "Use platform-specific features", "Engage with comments quickly"]
        };
    }

    private parseContentIdeasResponse(response: string): ContentIdea[] {
        try {
            const cleanResponse = response.trim()
                .replace(/^```json\s*/i, '')
                .replace(/\s*```$/, '')
                .replace(/^```\s*/, '')
                .trim();

            const ideas = JSON.parse(cleanResponse);

            if (!Array.isArray(ideas)) {
                throw new Error('Response must be an array of content ideas');
            }

            return ideas.map((idea: unknown, index: number) => ({
                ...idea as ContentIdea,
                id: (idea as ContentIdea).id || `idea_${Date.now()}_${index}`,
                created_at: (idea as ContentIdea).created_at || new Date().toISOString(),
                trending_elements: (idea as ContentIdea).trending_elements || { hashtags: [], visual_trends: [], platform_features: [] },
                tags: (idea as ContentIdea).tags || []
            }));
        } catch (error) {
            console.error('Error parsing content ideas response:', error);
            throw new Error('Failed to parse AI response for content ideas');
        }
    }

    private parseTrendingHashtagsResponse(response: string): TrendingHashtag[] {
        try {
            const cleanResponse = response.trim()
                .replace(/^```json\s*/i, '')
                .replace(/\s*```$/, '')
                .trim();

            const hashtags = JSON.parse(cleanResponse);

            if (!Array.isArray(hashtags)) {
                throw new Error('Response must be an array of hashtags');
            }

            return hashtags;
        } catch (error) {
            console.error('Error parsing hashtags response:', error);
            return this.getFallbackHashtags('', '');
        }
    }

    private parsePreferencesResponse(response: string): UserContentPreferences {
        try {
            const cleanResponse = response.trim()
                .replace(/^```json\s*/i, '')
                .replace(/\s*```$/, '')
                .trim();

            return JSON.parse(cleanResponse);
        } catch (error) {
            console.error('Error parsing preferences response:', error);
            return {
                preferred_content_types: [],
                avoided_elements: [],
                brand_voice_keywords: []
            };
        }
    }

    private getFallbackHashtags(platform: string, _niche: string): TrendingHashtag[] {
        return [
            {
                hashtag: `#${platform.toLowerCase()}`,
                trend_score: 70,
                reach_potential: 'medium',
                competition_level: 'high',
                relevance_score: 80
            },
            {
                hashtag: '#contentcreator',
                trend_score: 65,
                reach_potential: 'medium',
                competition_level: 'medium',
                relevance_score: 75
            }
        ];
    }

    private generateCacheKey(type: string, data: unknown): string {
        const keyData = JSON.stringify({ type, data });
        let hash = 0;
        for (let i = 0; i < keyData.length; i++) {
            const char = keyData.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return `${type}_${Math.abs(hash)}`;
    }
}