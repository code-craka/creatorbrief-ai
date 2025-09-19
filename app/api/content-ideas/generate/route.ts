import { NextRequest, NextResponse } from 'next/server';
import { AIServiceWithCache } from '@/lib/ai-service';
import { headers } from 'next/headers';
import { z } from 'zod';

const contentIdeaRequestSchema = z.object({
  brief_data: z.object({
    productDescription: z.string().min(1),
    targetAudience: z.string().min(1),
    campaignGoals: z.string(),
    budget: z.string(),
    platforms: z.array(z.string()),
    timeframe: z.string()
  }),
  idea_count: z.number().min(1).max(20).optional().default(5),
  platforms: z.array(z.string()).optional(),
  content_types: z.array(z.string()).optional(),
  creativity_level: z.enum(['conservative', 'balanced', 'experimental']).optional().default('balanced'),
  trend_integration: z.boolean().optional().default(true),
  user_preferences: z.object({
    preferred_content_types: z.array(z.string()),
    avoided_elements: z.array(z.string()),
    brand_voice_keywords: z.array(z.string())
  }).optional()
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = contentIdeaRequestSchema.parse(body);

    // Get user identifier for rate limiting
    const headersList = await headers();
    const userId = headersList.get('x-user-id') ||
                   headersList.get('x-forwarded-for') ||
                   headersList.get('x-real-ip') ||
                   'anonymous';

    console.log('Generating content ideas for user:', userId);

    // Initialize AI service with caching
    const aiService = new AIServiceWithCache({
      provider: process.env.AI_PROVIDER as 'openai' | 'anthropic' | 'gemini' || 'gemini',
    });

    // Generate content ideas
    const contentIdeas = await aiService.generateContentIdeas(validatedData);

    return NextResponse.json({
      success: true,
      data: contentIdeas,
      message: 'Content ideas generated successfully',
      metadata: {
        idea_count: contentIdeas.length,
        platforms: validatedData.platforms || validatedData.brief_data.platforms,
        creativity_level: validatedData.creativity_level
      }
    });

  } catch (error) {
    console.error('API Error:', error);

    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

    // Handle different types of errors
    if (errorMessage.includes('Rate limit exceeded')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Rate limit exceeded',
          message: 'Too many requests. Please try again in an hour.',
          code: 'RATE_LIMIT_EXCEEDED'
        },
        { status: 429 }
      );
    }

    if (errorMessage.includes('validation') || error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation error',
          message: error instanceof z.ZodError ? error.issues : errorMessage,
          code: 'VALIDATION_ERROR'
        },
        { status: 400 }
      );
    }

    if (errorMessage.includes('AI service failed')) {
      return NextResponse.json(
        {
          success: false,
          error: 'AI service error',
          message: 'Unable to generate content ideas at the moment. Please try again.',
          code: 'AI_SERVICE_ERROR'
        },
        { status: 503 }
      );
    }

    // Generic error response
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: 'An unexpected error occurred. Please try again.',
        code: 'INTERNAL_ERROR'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Content Ideas Generation API',
    version: '1.0.0',
    endpoints: {
      'POST /api/content-ideas/generate': 'Generate AI-powered content ideas',
      'POST /api/content-ideas/feedback': 'Submit feedback for content ideas',
      'POST /api/content-ideas/variations': 'Generate variations of existing ideas'
    },
    usage: {
      rate_limit: '10 requests per hour per user',
      max_ideas_per_request: 20,
      supported_platforms: ['Instagram', 'TikTok', 'YouTube', 'LinkedIn', 'Twitter'],
      supported_content_types: ['video', 'carousel', 'story', 'reel', 'post', 'short', 'live']
    }
  });
}