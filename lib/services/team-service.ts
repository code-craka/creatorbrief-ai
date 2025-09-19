import { createClient } from '@/lib/supabase/server';

export interface TeamMember {
  id: number;
  team_owner_id: string;
  member_id: string;
  role: 'admin' | 'manager' | 'editor' | 'viewer';
  invited_at: string;
  accepted_at: string | null;
  created_at: string;
  member_profile?: {
    id: string;
    company_name: string | null;
    role: string;
  };
}

export interface TeamInvitation {
  email: string;
  role: 'admin' | 'manager' | 'editor' | 'viewer';
  message?: string;
}

export class TeamService {
  private async getSupabase() {
    return await createClient();
  }

  /**
   * Invite a team member
   */
  async inviteTeamMember(ownerId: string, invitation: TeamInvitation): Promise<void> {
    const supabase = await this.getSupabase();
    
    // First, check if user exists with this email
    const { data: existingUser, error: userError } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', invitation.email)
      .single();

    if (userError && userError.code !== 'PGRST116') {
      throw new Error(`Failed to check user existence: ${userError.message}`);
    }

    if (existingUser) {
      // User exists, create team member record
      const { error: teamError } = await supabase
        .from('team_members')
        .insert({
          team_owner_id: ownerId,
          member_id: existingUser.id,
          role: invitation.role,
        });

      if (teamError) {
        if (teamError.code === '23505') {
          throw new Error('User is already a team member');
        }
        throw new Error(`Failed to add team member: ${teamError.message}`);
      }
    } else {
      // User doesn't exist, send invitation email
      // This would typically integrate with an email service
      // For now, we'll just log the invitation
      console.log('Invitation sent to:', invitation.email, 'with role:', invitation.role);
      throw new Error('User invitation system not implemented yet');
    }
  }

  /**
   * Get team members for a user
   */
  async getTeamMembers(ownerId: string): Promise<TeamMember[]> {
    const supabase = await this.getSupabase();
    
    const { data: teamMembers, error } = await supabase
      .from('team_members')
      .select(`
        *,
        member_profile:profiles!team_members_member_id_fkey(
          id,
          company_name,
          role
        )
      `)
      .eq('team_owner_id', ownerId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch team members: ${error.message}`);
    }

    return teamMembers || [];
  }

  /**
   * Update team member role
   */
  async updateTeamMemberRole(
    ownerId: string, 
    memberId: string, 
    newRole: 'admin' | 'manager' | 'editor' | 'viewer'
  ): Promise<void> {
    const supabase = await this.getSupabase();
    
    const { error } = await supabase
      .from('team_members')
      .update({ role: newRole })
      .eq('team_owner_id', ownerId)
      .eq('member_id', memberId);

    if (error) {
      throw new Error(`Failed to update team member role: ${error.message}`);
    }
  }

  /**
   * Remove team member
   */
  async removeTeamMember(ownerId: string, memberId: string): Promise<void> {
    const supabase = await this.getSupabase();
    
    const { error } = await supabase
      .from('team_members')
      .delete()
      .eq('team_owner_id', ownerId)
      .eq('member_id', memberId);

    if (error) {
      throw new Error(`Failed to remove team member: ${error.message}`);
    }
  }

  /**
   * Check if user has permission for a resource
   */
  async checkPermission(
    userId: string, 
    resourceOwnerId: string, 
    requiredRole: 'admin' | 'manager' | 'editor' | 'viewer'
  ): Promise<boolean> {
    // Owner always has full permissions
    if (userId === resourceOwnerId) {
      return true;
    }

    const supabase = await this.getSupabase();
    
    const { data: teamMember, error } = await supabase
      .from('team_members')
      .select('role')
      .eq('team_owner_id', resourceOwnerId)
      .eq('member_id', userId)
      .single();

    if (error || !teamMember) {
      return false;
    }

    // Role hierarchy: admin > manager > editor > viewer
    const roleHierarchy = {
      'admin': 4,
      'manager': 3,
      'editor': 2,
      'viewer': 1,
    };

    return roleHierarchy[teamMember.role as keyof typeof roleHierarchy] >= roleHierarchy[requiredRole];
  }
}