import { z } from 'zod';

// Campaign objective schema
export const campaignObjectiveSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Objective title is required'),
  description: z.string().min(1, 'Objective description is required'),
  target_value: z.number().optional(),
  current_value: z.number().optional(),
  unit: z.string().optional(),
  priority: z.enum(['high', 'medium', 'low']).default('medium'),
});

// Project validation schemas
export const createProjectSchema = z.object({
  name: z.string().min(1, 'Project name is required').max(100, 'Project name must be less than 100 characters'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  status: z.enum(['active', 'paused', 'completed', 'archived']).default('active'),
});

export const updateProjectSchema = z.object({
  name: z.string().min(1, 'Project name is required').max(100, 'Project name must be less than 100 characters').optional(),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  status: z.enum(['active', 'paused', 'completed', 'archived']).optional(),
});

// Campaign validation schemas
export const createCampaignSchema = z.object({
  title: z.string().min(1, 'Campaign title is required').max(100, 'Campaign title must be less than 100 characters'),
  project_id: z.number().positive().optional(),
  objectives: z.array(campaignObjectiveSchema).default([]),
  target_audience: z.string().max(500, 'Target audience must be less than 500 characters').optional(),
  budget_range: z.string().max(50, 'Budget range must be less than 50 characters').optional(),
  platforms: z.array(z.string()).default([]),
  start_date: z.string().datetime().optional(),
  end_date: z.string().datetime().optional(),
  status: z.enum(['draft', 'active', 'paused', 'completed']).default('draft'),
});

export const updateCampaignSchema = z.object({
  title: z.string().min(1, 'Campaign title is required').max(100, 'Campaign title must be less than 100 characters').optional(),
  project_id: z.number().positive().optional(),
  objectives: z.array(campaignObjectiveSchema).optional(),
  target_audience: z.string().max(500, 'Target audience must be less than 500 characters').optional(),
  budget_range: z.string().max(50, 'Budget range must be less than 50 characters').optional(),
  platforms: z.array(z.string()).optional(),
  start_date: z.string().datetime().optional(),
  end_date: z.string().datetime().optional(),
  status: z.enum(['draft', 'active', 'paused', 'completed']).optional(),
});

// Query parameter schemas
export const projectQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  status: z.enum(['active', 'paused', 'completed', 'archived']).optional(),
  search: z.string().optional(),
  sort_field: z.string().default('created_at'),
  sort_direction: z.enum(['asc', 'desc']).default('desc'),
});

export const campaignQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  status: z.enum(['draft', 'active', 'paused', 'completed']).optional(),
  project_id: z.coerce.number().positive().optional(),
  platforms: z.string().transform((val) => val.split(',')).optional(),
  search: z.string().optional(),
  sort_field: z.string().default('created_at'),
  sort_direction: z.enum(['asc', 'desc']).default('desc'),
});

// Export types
export type CreateProjectData = z.infer<typeof createProjectSchema>;
export type UpdateProjectData = z.infer<typeof updateProjectSchema>;
export type CreateCampaignData = z.infer<typeof createCampaignSchema>;
export type UpdateCampaignData = z.infer<typeof updateCampaignSchema>;
export type ProjectQuery = z.infer<typeof projectQuerySchema>;
export type CampaignQuery = z.infer<typeof campaignQuerySchema>;
export type CampaignObjective = z.infer<typeof campaignObjectiveSchema>;