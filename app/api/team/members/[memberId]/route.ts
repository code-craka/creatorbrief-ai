import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { TeamService } from '@/lib/services/team-service';
import { z } from 'zod';

interface RouteParams {
  params: Promise<{ memberId: string }>;
}

const updateRoleSchema = z.object({
  role: z.enum(['admin', 'manager', 'editor', 'viewer']),
});

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { memberId } = await params;
    const body = await request.json();
    const { role } = updateRoleSchema.parse(body);

    const teamService = new TeamService();
    await teamService.updateTeamMemberRole(user.id, memberId, role);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating team member role:', error);
    
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

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { memberId } = await params;

    const teamService = new TeamService();
    await teamService.removeTeamMember(user.id, memberId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing team member:', error);
    
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