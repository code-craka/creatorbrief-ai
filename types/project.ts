import { Database } from './database';

// Base types from database
export type ProjectRow = Database['public']['Tables']['projects']['Row'];
export type ProjectInsert = Database['public']['Tables']['projects']['Insert'];
export type ProjectUpdate = Database['public']['Tables']['projects']['Update'];

export type CampaignRow = Database['public']['Tables']['campaigns']['Row'];
export type CampaignInsert = Database['public']['Tables']['campaigns']['Insert'];
export type CampaignUpdate = Database['public']['Tables']['campaigns']['Update'];

// Enhanced interfaces with relationships
export interface Project extends ProjectRow {
  campaigns?: Campaign[];
  campaign_count?: number;
}

export interface Campaign extends CampaignRow {
  project?: Project;
  briefs?: Brief[];
  brief_count?: number;
}

export interface Brief {
  id: number;
  campaign_id: number;
  title: string;
  form_data: Record<string, unknown>;
  ai_output: Record<string, unknown> | null;
  status: 'draft' | 'generated' | 'approved' | 'sent';
  version: number;
  created_at: string;
  updated_at: string;
}

// Campaign objective interface
export interface CampaignObjective {
  id: string;
  title: string;
  description: string;
  target_value?: number;
  current_value?: number;
  unit?: string;
  priority: 'high' | 'medium' | 'low';
}

// Form data interfaces
export interface ProjectFormData {
  name: string;
  description?: string;
  status?: 'active' | 'paused' | 'completed' | 'archived';
}

export interface CampaignFormData {
  title: string;
  project_id?: number;
  objectives: CampaignObjective[];
  target_audience?: string;
  budget_range?: string;
  platforms: string[];
  start_date?: string;
  end_date?: string;
  status?: 'draft' | 'active' | 'paused' | 'completed';
}

// API response interfaces
export interface ProjectsResponse {
  projects: Project[];
  total: number;
  page: number;
  limit: number;
}

export interface CampaignsResponse {
  campaigns: Campaign[];
  total: number;
  page: number;
  limit: number;
}

// Filter and sort interfaces
export interface ProjectFilters {
  status?: 'active' | 'paused' | 'completed' | 'archived';
  search?: string;
}

export interface CampaignFilters {
  status?: 'draft' | 'active' | 'paused' | 'completed';
  project_id?: number;
  platforms?: string[];
  search?: string;
}

export interface SortOptions {
  field: string;
  direction: 'asc' | 'desc';
}

// Dashboard statistics
export interface ProjectStats {
  total_projects: number;
  active_projects: number;
  completed_projects: number;
  total_campaigns: number;
  active_campaigns: number;
  campaign_status_counts?: Record<string, number>;
}