import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ActivityService } from '@/lib/services/activity-service';

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

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const type = searchParams.get('type') || 'team'; // 'user' or 'team'

    const activityService = new ActivityService();
    
    let activities;
    if (type === 'user') {
      activities = await activityService.getUserActivity(user.id, limit);
    } else {
      activities = await activityService.getTeamActivity(user.id, limit);
    }

    // Format activities for display
    const formattedActivities = activities.map(activity => ({
      ...activity,
      formatted_message: activityService.formatActivityMessage(activity),
    }));

    return NextResponse.json({ activities: formattedActivities });
  } catch (error) {
    console.error('Error fetching activity feed:', error);
    
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