import { createClient } from '@/lib/supabase/server';
import {
  Project,
  ProjectStats,
  ProjectsResponse
} from '@/types/project';
import { 
  CreateProjectData, 
  UpdateProjectData, 
  ProjectQuery 
} from '@/lib/validations/project';

export class ProjectService {
  private async getSupabase() {
    return await createClient();
  }

  /**
   * Create a new project
   */
  async createProject(userId: string, data: CreateProjectData): Promise<Project> {
    const supabase = await this.getSupabase();
    const { data: project, error } = await supabase
      .from('projects')
      .insert({
        user_id: userId,
        name: data.name,
        description: data.description,
        status: data.status,
      })
      .select('*')
      .single();

    if (error) {
      throw new Error(`Failed to create project: ${error.message}`);
    }

    return project;
  }

  /**
   * Get projects for a user with pagination and filtering
   */
  async getProjects(userId: string, query: ProjectQuery): Promise<ProjectsResponse> {
    const supabase = await this.getSupabase();
    let queryBuilder = supabase
      .from('projects')
      .select(`
        *,
        campaigns!campaigns_project_id_fkey(count)
      `)
      .eq('user_id', userId);

    // Apply filters
    if (query.status) {
      queryBuilder = queryBuilder.eq('status', query.status);
    }

    if (query.search) {
      queryBuilder = queryBuilder.or(`name.ilike.%${query.search}%,description.ilike.%${query.search}%`);
    }

    // Apply sorting
    queryBuilder = queryBuilder.order(query.sort_field, { ascending: query.sort_direction === 'asc' });

    // Apply pagination
    const from = (query.page - 1) * query.limit;
    const to = from + query.limit - 1;
    queryBuilder = queryBuilder.range(from, to);

    const { data: projects, error, count } = await queryBuilder;

    if (error) {
      throw new Error(`Failed to fetch projects: ${error.message}`);
    }

    // Transform data to include campaign count
    const transformedProjects = projects?.map(project => ({
      ...project,
      campaign_count: project.campaigns?.[0]?.count || 0,
      campaigns: undefined, // Remove the campaigns array since we only need the count
    })) || [];

    return {
      projects: transformedProjects,
      total: count || 0,
      page: query.page,
      limit: query.limit,
    };
  }

  /**
   * Get a single project by ID
   */
  async getProject(userId: string, projectId: number): Promise<Project> {
    const supabase = await this.getSupabase();
    const { data: project, error } = await supabase
      .from('projects')
      .select(`
        *,
        campaigns!campaigns_project_id_fkey(
          id,
          title,
          status,
          created_at,
          updated_at
        )
      `)
      .eq('id', projectId)
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        throw new Error('Project not found');
      }
      throw new Error(`Failed to fetch project: ${error.message}`);
    }

    return {
      ...project,
      campaign_count: project.campaigns?.length || 0,
    };
  }

  /**
   * Update a project
   */
  async updateProject(userId: string, projectId: number, data: UpdateProjectData): Promise<Project> {
    const supabase = await this.getSupabase();
    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.status !== undefined) updateData.status = data.status;

    const { data: project, error } = await supabase
      .from('projects')
      .update(updateData)
      .eq('id', projectId)
      .eq('user_id', userId)
      .select('*')
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        throw new Error('Project not found');
      }
      throw new Error(`Failed to update project: ${error.message}`);
    }

    return project;
  }

  /**
   * Delete a project
   */
  async deleteProject(userId: string, projectId: number): Promise<void> {
    const supabase = await this.getSupabase();
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId)
      .eq('user_id', userId);

    if (error) {
      throw new Error(`Failed to delete project: ${error.message}`);
    }
  }

  /**
   * Get project statistics for dashboard
   */
  async getProjectStats(userId: string): Promise<ProjectStats> {
    const supabase = await this.getSupabase();
    // Get project counts by status
    const { data: projectStats, error: projectError } = await supabase
      .from('projects')
      .select('status')
      .eq('user_id', userId);

    if (projectError) {
      throw new Error(`Failed to fetch project stats: ${projectError.message}`);
    }

    // Get campaign counts
    const { data: campaignStats, error: campaignError } = await supabase
      .from('campaigns')
      .select('status')
      .eq('user_id', userId);

    if (campaignError) {
      throw new Error(`Failed to fetch campaign stats: ${campaignError.message}`);
    }

    const stats = {
      total_projects: projectStats?.length || 0,
      active_projects: projectStats?.filter(p => p.status === 'active').length || 0,
      completed_projects: projectStats?.filter(p => p.status === 'completed').length || 0,
      total_campaigns: campaignStats?.length || 0,
      active_campaigns: campaignStats?.filter(c => c.status === 'active').length || 0,
    };

    return stats;
  }

  /**
   * Check if user owns project
   */
  async checkProjectOwnership(userId: string, projectId: number): Promise<boolean> {
    const supabase = await this.getSupabase();
    const { data, error } = await supabase
      .from('projects')
      .select('id')
      .eq('id', projectId)
      .eq('user_id', userId)
      .single();

    return !error && !!data;
  }
}