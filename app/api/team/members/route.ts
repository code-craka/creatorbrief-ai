import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { TeamService } from '@/lib/services/team-service';
import { z } from 'zod';

const inviteTeamMemberSchema = z.object({
  email: z.string().email('Invalid email address'),
  role: z.enum(['admin', 'manager', 'editor', 'viewer']),
  message: z.string().optional(),
});

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

    const teamService = new TeamService();
    const teamMembers = await teamService.getTeamMembers(user.id);

    return NextResponse.json({ team_members: teamMembers });
  } catch (error) {
    console.error('Error fetching team members:', error);
    
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
    const validatedData = inviteTeamMemberSchema.parse(body);

    const teamService = new TeamService();
    await teamService.inviteTeamMember(user.id, validatedData);

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error('Error inviting team member:', error);
    
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