import { createClient } from '@/lib/supabase/server';

export interface ActivityLog {
  id: number;
  user_id: string | null;
  action: string;
  resource_type: string;
  resource_id: string;
  old_values: Record<string, unknown> | null;
  new_values: Record<string, unknown> | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
  user_profile?: {
    id: string;
    company_name: string | null;
    role: string;
  };
}

export interface CreateActivityData {
  action: string;
  resource_type: string;
  resource_id: string;
  old_values?: Record<string, unknown>;
  new_values?: Record<string, unknown>;
  ip_address?: string;
  user_agent?: string;
}

export class ActivityService {
  private async getSupabase() {
    return await createClient();
  }

  /**
   * Log an activity
   */
  async logActivity(userId: string | null, data: CreateActivityData): Promise<void> {
    const supabase = await this.getSupabase();
    
    const { error } = await supabase
      .from('audit_logs')
      .insert({
        user_id: userId,
        action: data.action,
        resource_type: data.resource_type,
        resource_id: data.resource_id,
        old_values: data.old_values || null,
        new_values: data.new_values || null,
        ip_address: data.ip_address || null,
        user_agent: data.user_agent || null,
      });

    if (error) {
      console.error('Failed to log activity:', error);
      // Don't throw error for logging failures to avoid breaking main functionality
    }
  }

  /**
   * Get activity logs for a user
   */
  async getUserActivity(userId: string, limit: number = 50): Promise<ActivityLog[]> {
    const supabase = await this.getSupabase();
    
    const { data: activities, error } = await supabase
      .from('audit_logs')
      .select(`
        *,
        user_profile:profiles!audit_logs_user_id_fkey(
          id,
          company_name,
          role
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(`Failed to fetch user activity: ${error.message}`);
    }

    return activities || [];
  }

  /**
   * Get activity logs for a specific resource
   */
  async getResourceActivity(
    resourceType: string, 
    resourceId: string, 
    limit: number = 50
  ): Promise<ActivityLog[]> {
    const supabase = await this.getSupabase();
    
    const { data: activities, error } = await supabase
      .from('audit_logs')
      .select(`
        *,
        user_profile:profiles!audit_logs_user_id_fkey(
          id,
          company_name,
          role
        )
      `)
      .eq('resource_type', resourceType)
      .eq('resource_id', resourceId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(`Failed to fetch resource activity: ${error.message}`);
    }

    return activities || [];
  }

  /**
   * Get team activity feed
   */
  async getTeamActivity(ownerId: string, limit: number = 100): Promise<ActivityLog[]> {
    const supabase = await this.getSupabase();
    
    // Get team member IDs
    const { data: teamMembers, error: teamError } = await supabase
      .from('team_members')
      .select('member_id')
      .eq('team_owner_id', ownerId);

    if (teamError) {
      throw new Error(`Failed to fetch team members: ${teamError.message}`);
    }

    const memberIds = [ownerId, ...(teamMembers?.map(tm => tm.member_id) || [])];

    const { data: activities, error } = await supabase
      .from('audit_logs')
      .select(`
        *,
        user_profile:profiles!audit_logs_user_id_fkey(
          id,
          company_name,
          role
        )
      `)
      .in('user_id', memberIds)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(`Failed to fetch team activity: ${error.message}`);
    }

    return activities || [];
  }

  /**
   * Format activity message for display
   */
  formatActivityMessage(activity: ActivityLog): string {
    const userName = activity.user_profile?.company_name || 'Unknown User';
    
    switch (activity.action) {
      case 'create':
        return `${userName} created ${activity.resource_type} ${activity.resource_id}`;
      case 'update':
        return `${userName} updated ${activity.resource_type} ${activity.resource_id}`;
      case 'delete':
        return `${userName} deleted ${activity.resource_type} ${activity.resource_id}`;
      case 'comment':
        return `${userName} commented on ${activity.resource_type} ${activity.resource_id}`;
      case 'approve':
        return `${userName} approved ${activity.resource_type} ${activity.resource_id}`;
      case 'reject':
        return `${userName} rejected ${activity.resource_type} ${activity.resource_id}`;
      case 'assign':
        return `${userName} assigned ${activity.resource_type} ${activity.resource_id}`;
      default:
        return `${userName} performed ${activity.action} on ${activity.resource_type} ${activity.resource_id}`;
    }
  }

  /**
   * Get activity statistics
   */
  async getActivityStats(userId: string, days: number = 30): Promise<Record<string, number>> {
    const supabase = await this.getSupabase();
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data: activities, error } = await supabase
      .from('audit_logs')
      .select('action')
      .eq('user_id', userId)
      .gte('created_at', startDate.toISOString());

    if (error) {
      throw new Error(`Failed to fetch activity stats: ${error.message}`);
    }

    const stats: Record<string, number> = {};
    activities?.forEach(activity => {
      stats[activity.action] = (stats[activity.action] || 0) + 1;
    });

    return stats;
  }
}