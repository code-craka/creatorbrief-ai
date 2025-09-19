import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { CommentService } from '@/lib/services/comment-service';
import { ActivityService } from '@/lib/services/activity-service';
import { z } from 'zod';

interface RouteParams {
  params: Promise<{ id: string }>;
}

const createCommentSchema = z.object({
  content: z.string().min(1, 'Comment content is required'),
  parent_id: z.number().optional(),
});

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const briefId = parseInt(id);

    if (isNaN(briefId)) {
      return NextResponse.json(
        { error: 'Invalid brief ID' },
        { status: 400 }
      );
    }

    const commentService = new CommentService();
    const comments = await commentService.getBriefComments(briefId);

    return NextResponse.json({ comments });
  } catch (error) {
    console.error('Error fetching comments:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const briefId = parseInt(id);

    if (isNaN(briefId)) {
      return NextResponse.json(
        { error: 'Invalid brief ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validatedData = createCommentSchema.parse(body);

    const commentService = new CommentService();
    const comment = await commentService.createComment(user.id, {
      brief_id: briefId,
      content: validatedData.content,
      parent_id: validatedData.parent_id,
    });

    // Log activity
    const activityService = new ActivityService();
    await activityService.logActivity(user.id, {
      action: 'comment',
      resource_type: 'brief',
      resource_id: briefId.toString(),
      new_values: { comment_id: comment.id, content: validatedData.content },
    });

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error('Error creating comment:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}