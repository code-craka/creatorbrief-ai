export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          company_name: string | null
          role: 'admin' | 'manager' | 'editor' | 'viewer'
          preferences: Record<string, any>
          notification_preferences: {
            email_enabled: boolean
            sms_enabled: boolean
            in_app_enabled: boolean
            campaign_updates: boolean
            creator_responses: boolean
            performance_alerts: boolean
            weekly_reports: boolean
          }
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          company_name?: string | null
          role?: 'admin' | 'manager' | 'editor' | 'viewer'
          preferences?: Record<string, any>
          notification_preferences?: {
            email_enabled?: boolean
            sms_enabled?: boolean
            in_app_enabled?: boolean
            campaign_updates?: boolean
            creator_responses?: boolean
            performance_alerts?: boolean
            weekly_reports?: boolean
          }
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_name?: string | null
          role?: 'admin' | 'manager' | 'editor' | 'viewer'
          preferences?: Record<string, any>
          notification_preferences?: {
            email_enabled?: boolean
            sms_enabled?: boolean
            in_app_enabled?: boolean
            campaign_updates?: boolean
            creator_responses?: boolean
            performance_alerts?: boolean
            weekly_reports?: boolean
          }
          created_at?: string
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: number
          user_id: string
          name: string
          description: string | null
          status: 'active' | 'paused' | 'completed' | 'archived'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          user_id: string
          name: string
          description?: string | null
          status?: 'active' | 'paused' | 'completed' | 'archived'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          name?: string
          description?: string | null
          status?: 'active' | 'paused' | 'completed' | 'archived'
          created_at?: string
          updated_at?: string
        }
      }
      campaigns: {
        Row: {
          id: number
          project_id: number | null
          user_id: string
          title: string
          status: 'draft' | 'active' | 'paused' | 'completed'
          objectives: Record<string, any>[]
          target_audience: string | null
          budget_range: string | null
          platforms: string[]
          start_date: string | null
          end_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          project_id?: number | null
          user_id: string
          title: string
          status?: 'draft' | 'active' | 'paused' | 'completed'
          objectives?: Record<string, any>[]
          target_audience?: string | null
          budget_range?: string | null
          platforms?: string[]
          start_date?: string | null
          end_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          project_id?: number | null
          user_id?: string
          title?: string
          status?: 'draft' | 'active' | 'paused' | 'completed'
          objectives?: Record<string, any>[]
          target_audience?: string | null
          budget_range?: string | null
          platforms?: string[]
          start_date?: string | null
          end_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      briefs: {
        Row: {
          id: number
          campaign_id: number
          title: string
          form_data: Record<string, any>
          ai_output: Record<string, any> | null
          status: 'draft' | 'generated' | 'approved' | 'sent'
          version: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          campaign_id: number
          title: string
          form_data: Record<string, any>
          ai_output?: Record<string, any> | null
          status?: 'draft' | 'generated' | 'approved' | 'sent'
          version?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          campaign_id?: number
          title?: string
          form_data?: Record<string, any>
          ai_output?: Record<string, any> | null
          status?: 'draft' | 'generated' | 'approved' | 'sent'
          version?: number
          created_at?: string
          updated_at?: string
        }
      }
      content_ideas: {
        Row: {
          id: number
          brief_id: number
          title: string
          platform: string
          content_type: 'video' | 'carousel' | 'story' | 'reel' | 'post'
          hook: string | null
          concept: string | null
          cta: string | null
          duration: string | null
          creative_details: Record<string, any>
          tags: string[]
          created_at: string
        }
        Insert: {
          id?: number
          brief_id: number
          title: string
          platform: string
          content_type: 'video' | 'carousel' | 'story' | 'reel' | 'post'
          hook?: string | null
          concept?: string | null
          cta?: string | null
          duration?: string | null
          creative_details?: Record<string, any>
          tags?: string[]
          created_at?: string
        }
        Update: {
          id?: number
          brief_id?: number
          title?: string
          platform?: string
          content_type?: 'video' | 'carousel' | 'story' | 'reel' | 'post'
          hook?: string | null
          concept?: string | null
          cta?: string | null
          duration?: string | null
          creative_details?: Record<string, any>
          tags?: string[]
          created_at?: string
        }
      }
      creators: {
        Row: {
          id: number
          name: string
          platform: string
          niche: string[]
          followers_count: number
          engagement_rate: number
          location: string | null
          metrics: Record<string, any>
          contact_info: Record<string, any>
          sample_content: string[]
          verified: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          name: string
          platform: string
          niche?: string[]
          followers_count?: number
          engagement_rate?: number
          location?: string | null
          metrics?: Record<string, any>
          contact_info?: Record<string, any>
          sample_content?: string[]
          verified?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          name?: string
          platform?: string
          niche?: string[]
          followers_count?: number
          engagement_rate?: number
          location?: string | null
          metrics?: Record<string, any>
          contact_info?: Record<string, any>
          sample_content?: string[]
          verified?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      notifications: {
        Row: {
          id: number
          user_id: string
          type: string
          title: string
          message: string
          read: boolean
          metadata: Record<string, any>
          created_at: string
        }
        Insert: {
          id?: number
          user_id: string
          type: string
          title: string
          message: string
          read?: boolean
          metadata?: Record<string, any>
          created_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          type?: string
          title?: string
          message?: string
          read?: boolean
          metadata?: Record<string, any>
          created_at?: string
        }
      }
      subscriptions: {
        Row: {
          id: number
          user_id: string
          stripe_subscription_id: string | null
          stripe_customer_id: string | null
          plan_type: 'free' | 'pro' | 'enterprise'
          status: 'active' | 'canceled' | 'past_due' | 'unpaid'
          current_period_start: string | null
          current_period_end: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          user_id: string
          stripe_subscription_id?: string | null
          stripe_customer_id?: string | null
          plan_type?: 'free' | 'pro' | 'enterprise'
          status?: 'active' | 'canceled' | 'past_due' | 'unpaid'
          current_period_start?: string | null
          current_period_end?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          stripe_subscription_id?: string | null
          stripe_customer_id?: string | null
          plan_type?: 'free' | 'pro' | 'enterprise'
          status?: 'active' | 'canceled' | 'past_due' | 'unpaid'
          current_period_start?: string | null
          current_period_end?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}