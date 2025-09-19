import { createClient } from '@/lib/supabase/server';
import {
  Campaign,
  CampaignsResponse
} from '@/types/project';
import { 
  CreateCampaignData, 
  UpdateCampaignData, 
  CampaignQuery 
} from '@/lib/validations/project';

export class CampaignService {
  private async getSupabase() {
    return await createClient();
  }

  /**
   * Create a new campaign
   */
  async createCampaign(userId: string, data: CreateCampaignData): Promise<Campaign> {
    const supabase = await this.getSupabase();
    const { data: campaign, error } = await supabase
      .from('campaigns')
      .insert({
        user_id: userId,
        project_id: data.project_id,
        title: data.title,
        objectives: data.objectives,
        target_audience: data.target_audience,
        budget_range: data.budget_range,
        platforms: data.platforms,
        start_date: data.start_date,
        end_date: data.end_date,
        status: data.status,
      })
      .select('*')
      .single();

    if (error) {
      throw new Error(`Failed to create campaign: ${error.message}`);
    }

    return campaign;
  }

  /**
   * Get campaigns for a user with pagination and filtering
   */
  async getCampaigns(userId: string, query: CampaignQuery): Promise<CampaignsResponse> {
    const supabase = await this.getSupabase();
    let queryBuilder = supabase
      .from('campaigns')
      .select(`
        *,
        project:projects(id, name),
        briefs!briefs_campaign_id_fkey(count)
      `)
      .eq('user_id', userId);

    // Apply filters
    if (query.status) {
      queryBuilder = queryBuilder.eq('status', query.status);
    }

    if (query.project_id) {
      queryBuilder = queryBuilder.eq('project_id', query.project_id);
    }

    if (query.platforms && query.platforms.length > 0) {
      queryBuilder = queryBuilder.overlaps('platforms', query.platforms);
    }

    if (query.search) {
      queryBuilder = queryBuilder.or(`title.ilike.%${query.search}%,target_audience.ilike.%${query.search}%`);
    }

    // Apply sorting
    queryBuilder = queryBuilder.order(query.sort_field, { ascending: query.sort_direction === 'asc' });

    // Apply pagination
    const from = (query.page - 1) * query.limit;
    const to = from + query.limit - 1;
    queryBuilder = queryBuilder.range(from, to);

    const { data: campaigns, error, count } = await queryBuilder;

    if (error) {
      throw new Error(`Failed to fetch campaigns: ${error.message}`);
    }

    // Transform data to include brief count
    const transformedCampaigns = campaigns?.map(campaign => ({
      ...campaign,
      brief_count: campaign.briefs?.[0]?.count || 0,
      briefs: undefined, // Remove the briefs array since we only need the count
    })) || [];

    return {
      campaigns: transformedCampaigns,
      total: count || 0,
      page: query.page,
      limit: query.limit,
    };
  }

  /**
   * Get campaigns for a specific project
   */
  async getProjectCampaigns(userId: string, projectId: number, query: Partial<CampaignQuery> = {}): Promise<Campaign[]> {
    const supabase = await this.getSupabase();
    const { data: campaigns, error } = await supabase
      .from('campaigns')
      .select(`
        *,
        briefs!briefs_campaign_id_fkey(count)
      `)
      .eq('user_id', userId)
      .eq('project_id', projectId)
      .order(query.sort_field || 'created_at', { ascending: query.sort_direction === 'asc' });

    if (error) {
      throw new Error(`Failed to fetch project campaigns: ${error.message}`);
    }

    return campaigns?.map(campaign => ({
      ...campaign,
      brief_count: campaign.briefs?.[0]?.count || 0,
      briefs: undefined,
    })) || [];
  }

  /**
   * Get a single campaign by ID
   */
  async getCampaign(userId: string, campaignId: number): Promise<Campaign> {
    const supabase = await this.getSupabase();
    const { data: campaign, error } = await supabase
      .from('campaigns')
      .select(`
        *,
        project:projects(id, name, description),
        briefs!briefs_campaign_id_fkey(
          id,
          title,
          status,
          version,
          created_at,
          updated_at
        )
      `)
      .eq('id', campaignId)
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        throw new Error('Campaign not found');
      }
      throw new Error(`Failed to fetch campaign: ${error.message}`);
    }

    return {
      ...campaign,
      brief_count: campaign.briefs?.length || 0,
    };
  }

  /**
   * Update a campaign
   */
  async updateCampaign(userId: string, campaignId: number, data: UpdateCampaignData): Promise<Campaign> {
    const supabase = await this.getSupabase();
    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (data.title !== undefined) updateData.title = data.title;
    if (data.project_id !== undefined) updateData.project_id = data.project_id;
    if (data.objectives !== undefined) updateData.objectives = data.objectives;
    if (data.target_audience !== undefined) updateData.target_audience = data.target_audience;
    if (data.budget_range !== undefined) updateData.budget_range = data.budget_range;
    if (data.platforms !== undefined) updateData.platforms = data.platforms;
    if (data.start_date !== undefined) updateData.start_date = data.start_date;
    if (data.end_date !== undefined) updateData.end_date = data.end_date;
    if (data.status !== undefined) updateData.status = data.status;

    const { data: campaign, error } = await supabase
      .from('campaigns')
      .update(updateData)
      .eq('id', campaignId)
      .eq('user_id', userId)
      .select('*')
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        throw new Error('Campaign not found');
      }
      throw new Error(`Failed to update campaign: ${error.message}`);
    }

    return campaign;
  }

  /**
   * Delete a campaign
   */
  async deleteCampaign(userId: string, campaignId: number): Promise<void> {
    const supabase = await this.getSupabase();
    const { error } = await supabase
      .from('campaigns')
      .delete()
      .eq('id', campaignId)
      .eq('user_id', userId);

    if (error) {
      throw new Error(`Failed to delete campaign: ${error.message}`);
    }
  }

  /**
   * Update campaign status
   */
  async updateCampaignStatus(userId: string, campaignId: number, status: 'draft' | 'active' | 'paused' | 'completed'): Promise<Campaign> {
    const supabase = await this.getSupabase();
    const { data: campaign, error } = await supabase
      .from('campaigns')
      .update({ 
        status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', campaignId)
      .eq('user_id', userId)
      .select('*')
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        throw new Error('Campaign not found');
      }
      throw new Error(`Failed to update campaign status: ${error.message}`);
    }

    return campaign;
  }

  /**
   * Check if user owns campaign
   */
  async checkCampaignOwnership(userId: string, campaignId: number): Promise<boolean> {
    const supabase = await this.getSupabase();
    const { data, error } = await supabase
      .from('campaigns')
      .select('id')
      .eq('id', campaignId)
      .eq('user_id', userId)
      .single();

    return !error && !!data;
  }

  /**
   * Get campaigns by status for dashboard
   */
  async getCampaignsByStatus(userId: string): Promise<Record<string, number>> {
    const supabase = await this.getSupabase();
    const { data: campaigns, error } = await supabase
      .from('campaigns')
      .select('status')
      .eq('user_id', userId);

    if (error) {
      throw new Error(`Failed to fetch campaign status counts: ${error.message}`);
    }

    const statusCounts = {
      draft: 0,
      active: 0,
      paused: 0,
      completed: 0,
    };

    campaigns?.forEach(campaign => {
      if (campaign.status in statusCounts) {
        statusCounts[campaign.status as keyof typeof statusCounts]++;
      }
    });

    return statusCounts;
  }
}