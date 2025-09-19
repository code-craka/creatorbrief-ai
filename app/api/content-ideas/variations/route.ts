import { NextRequest, NextResponse } from 'next/server';
import { AIServiceWithCache } from '@/lib/ai-service';
import { createClient } from '@/lib/supabase/server';
import { headers } from 'next/headers';
import { z } from 'zod';
import { ContentIdea } from '@/types/brief';

const variationRequestSchema = z.object({
  original_idea: z.object({
    id: z.string(),
    title: z.string(),
    platform: z.string(),
    content_type: z.string(),
    hook: z.string(),
    concept: z.string(),
    cta: z.string(),
    creative_details: z.object({
      visual_style: z.string(),
      tone_of_voice: z.string(),
      key_elements: z.array(z.string())
    }),
    trending_elements: z.object({
      hashtags: z.array(z.any()),
      visual_trends: z.array(z.any()),
      platform_features: z.array(z.any())
    })
  }),
  variation_type: z.enum(['hook', 'visual', 'cta', 'platform_adaptation']),
  count: z.number().min(1).max(10).optional().default(3),
  target_platform: z.string().optional()
});

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = variationRequestSchema.parse(body);

    // Get user identifier for rate limiting
    const headersList = await headers();
    const userId = headersList.get('x-user-id') || user.id;

    console.log('Generating content variations for user:', userId);

    // Initialize AI service with caching
    const aiService = new AIServiceWithCache({
      provider: process.env.AI_PROVIDER as 'openai' | 'anthropic' | 'gemini' || 'gemini',
    });

    // Generate content variations
    const variations = await aiService.generateContentVariations(
      validatedData.original_idea as ContentIdea,
      validatedData.variation_type,
      validatedData.count
    );

    // Log activity for audit trail
    await supabase
      .from('audit_logs')
      .insert({
        user_id: user.id,
        action: 'variations_generated',
        resource_type: 'content_idea',
        resource_id: validatedData.original_idea.id,
        new_values: {
          variation_type: validatedData.variation_type,
          variation_count: variations.length
        }
      });

    return NextResponse.json({
      success: true,
      data: variations,
      message: 'Content variations generated successfully',
      metadata: {
        original_idea_id: validatedData.original_idea.id,
        variation_type: validatedData.variation_type,
        variation_count: variations.length
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
          message: 'Unable to generate variations at the moment. Please try again.',
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
    message: 'Content Variations API',
    version: '1.0.0',
    endpoint: 'POST /api/content-ideas/variations',
    description: 'Generate variations of existing content ideas',
    variation_types: {
      hook: 'Generate different opening hooks to grab attention',
      visual: 'Modify visual elements and presentation style',
      cta: 'Change call-to-action approaches and messaging',
      platform_adaptation: 'Adapt content for different platform requirements'
    },
    usage: {
      rate_limit: '10 requests per hour per user',
      max_variations_per_request: 10,
      supported_platforms: ['Instagram', 'TikTok', 'YouTube', 'LinkedIn', 'Twitter']
    }
  });
}