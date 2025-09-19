import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ProjectService } from '@/lib/services/project-service';
import { CampaignService } from '@/lib/services/campaign-service';

export async function GET(_request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const projectService = new ProjectService();
    const campaignService = new CampaignService();

    // Get project stats and campaign status breakdown
    const [projectStats, campaignStatusCounts] = await Promise.all([
      projectService.getProjectStats(user.id),
      campaignService.getCampaignsByStatus(user.id),
    ]);

    const stats = {
      ...projectStats,
      campaign_status_counts: campaignStatusCounts,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    
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