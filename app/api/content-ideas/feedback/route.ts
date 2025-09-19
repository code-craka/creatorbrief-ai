import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

const feedbackSchema = z.object({
  content_idea_id: z.string().min(1),
  rating: z.number().min(1).max(5),
  feedback_type: z.enum(['positive', 'negative', 'neutral']),
  specific_feedback: z.string().optional(),
  improvement_suggestions: z.array(z.string()).optional()
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
    const validatedData = feedbackSchema.parse(body);

    // Store feedback in database for learning
    const { error: insertError } = await supabase
      .from('content_feedback')
      .insert({
        user_id: user.id,
        content_idea_id: validatedData.content_idea_id,
        rating: validatedData.rating,
        feedback_type: validatedData.feedback_type,
        specific_feedback: validatedData.specific_feedback,
        improvement_suggestions: validatedData.improvement_suggestions,
        timestamp: new Date().toISOString()
      });

    if (insertError) {
      console.error('Database error:', insertError);
      return NextResponse.json(
        { error: 'Failed to store feedback' },
        { status: 500 }
      );
    }

    // Log activity for audit trail
    await supabase
      .from('audit_logs')
      .insert({
        user_id: user.id,
        action: 'feedback_submitted',
        resource_type: 'content_idea',
        resource_id: validatedData.content_idea_id,
        new_values: {
          rating: validatedData.rating,
          feedback_type: validatedData.feedback_type
        }
      });

    return NextResponse.json({
      success: true,
      message: 'Feedback submitted successfully'
    });

  } catch (error) {
    console.error('API Error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation error',
          message: error.issues,
          code: 'VALIDATION_ERROR'
        },
        { status: 400 }
      );
    }

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

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const url = new URL(request.url);
    const contentIdeaId = url.searchParams.get('content_idea_id');

    let query = supabase
      .from('content_feedback')
      .select('*')
      .eq('user_id', user.id)
      .order('timestamp', { ascending: false });

    if (contentIdeaId) {
      query = query.eq('content_idea_id', contentIdeaId);
    }

    const { data: feedback, error } = await query;

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch feedback' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: feedback
    });

  } catch (error) {
    console.error('API Error:', error);
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