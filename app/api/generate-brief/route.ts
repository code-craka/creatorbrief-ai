// app/api/generate-brief/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { generateCreatorBrief, CreatorBriefInput } from '@/workflows/generate-brief';
import { headers } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    // Get request body
    const body: CreatorBriefInput = await request.json();
    
    // Get user identifier for rate limiting (could be IP, user ID, etc.)
    const headersList = await headers();
    const userId = headersList.get('x-user-id') || 
                   headersList.get('x-forwarded-for') || 
                   headersList.get('x-real-ip') ||
                   'anonymous';

    console.log('Generating brief for user:', userId);
    
    // Add user ID to the request for rate limiting
    const briefInput: CreatorBriefInput = {
      ...body,
      userId
    };

    // Generate the creator brief
    const brief = await generateCreatorBrief(briefInput);

    return NextResponse.json({
      success: true,
      data: brief,
      message: 'Creator brief generated successfully'
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

    if (errorMessage.includes('required')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation error',
          message: errorMessage,
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
          message: 'Unable to process your request at the moment. Please try again.',
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
    message: 'Creator Brief API',
    version: '1.0.0',
    endpoints: {
      'POST /api/generate-brief': 'Generate a creator campaign brief'
    }
  });
}

// Optional: Add CORS headers if needed
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}