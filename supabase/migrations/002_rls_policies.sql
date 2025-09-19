-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.briefs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brief_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creator_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_creators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Projects policies
CREATE POLICY "Users can view own projects" ON public.projects
  FOR SELECT USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM public.team_members 
      WHERE team_owner_id = user_id 
      AND member_id = auth.uid()
      AND accepted_at IS NOT NULL
    )
  );

CREATE POLICY "Users can create projects" ON public.projects
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects" ON public.projects
  FOR UPDATE USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM public.team_members 
      WHERE team_owner_id = user_id 
      AND member_id = auth.uid()
      AND role IN ('admin', 'manager')
      AND accepted_at IS NOT NULL
    )
  );

CREATE POLICY "Users can delete own projects" ON public.projects
  FOR DELETE USING (auth.uid() = user_id);

-- Campaigns policies
CREATE POLICY "Users can view campaigns from accessible projects" ON public.campaigns
  FOR SELECT USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM public.projects p
      LEFT JOIN public.team_members tm ON p.user_id = tm.team_owner_id
      WHERE p.id = campaigns.project_id
      AND (p.user_id = auth.uid() OR (tm.member_id = auth.uid() AND tm.accepted_at IS NOT NULL))
    )
  );

CREATE POLICY "Users can create campaigns" ON public.campaigns
  FOR INSERT WITH CHECK (
    auth.uid() = user_id AND
    (project_id IS NULL OR EXISTS (
      SELECT 1 FROM public.projects 
      WHERE id = project_id 
      AND user_id = auth.uid()
    ))
  );

CREATE POLICY "Users can update own campaigns" ON public.campaigns
  FOR UPDATE USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM public.projects p
      LEFT JOIN public.team_members tm ON p.user_id = tm.team_owner_id
      WHERE p.id = campaigns.project_id
      AND tm.member_id = auth.uid()
      AND tm.role IN ('admin', 'manager', 'editor')
      AND tm.accepted_at IS NOT NULL
    )
  );

-- Briefs policies (inherit from campaigns)
CREATE POLICY "Users can view briefs from accessible campaigns" ON public.briefs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.campaigns c
      WHERE c.id = briefs.campaign_id 
      AND (
        c.user_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM public.projects p
          LEFT JOIN public.team_members tm ON p.user_id = tm.team_owner_id
          WHERE p.id = c.project_id
          AND tm.member_id = auth.uid()
          AND tm.accepted_at IS NOT NULL
        )
      )
    )
  );

CREATE POLICY "Users can create briefs in accessible campaigns" ON public.briefs
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.campaigns c
      WHERE c.id = briefs.campaign_id 
      AND (
        c.user_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM public.projects p
          LEFT JOIN public.team_members tm ON p.user_id = tm.team_owner_id
          WHERE p.id = c.project_id
          AND tm.member_id = auth.uid()
          AND tm.role IN ('admin', 'manager', 'editor')
          AND tm.accepted_at IS NOT NULL
        )
      )
    )
  );

CREATE POLICY "Users can update briefs in accessible campaigns" ON public.briefs
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.campaigns c
      WHERE c.id = briefs.campaign_id 
      AND (
        c.user_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM public.projects p
          LEFT JOIN public.team_members tm ON p.user_id = tm.team_owner_id
          WHERE p.id = c.project_id
          AND tm.member_id = auth.uid()
          AND tm.role IN ('admin', 'manager', 'editor')
          AND tm.accepted_at IS NOT NULL
        )
      )
    )
  );

-- Brief versions policies
CREATE POLICY "Users can view brief versions from accessible briefs" ON public.brief_versions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.briefs b
      JOIN public.campaigns c ON c.id = b.campaign_id
      WHERE b.id = brief_versions.brief_id 
      AND (
        c.user_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM public.projects p
          LEFT JOIN public.team_members tm ON p.user_id = tm.team_owner_id
          WHERE p.id = c.project_id
          AND tm.member_id = auth.uid()
          AND tm.accepted_at IS NOT NULL
        )
      )
    )
  );

-- Content ideas policies
CREATE POLICY "Users can view content ideas from accessible briefs" ON public.content_ideas
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.briefs b
      JOIN public.campaigns c ON c.id = b.campaign_id
      WHERE b.id = content_ideas.brief_id 
      AND (
        c.user_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM public.projects p
          LEFT JOIN public.team_members tm ON p.user_id = tm.team_owner_id
          WHERE p.id = c.project_id
          AND tm.member_id = auth.uid()
          AND tm.accepted_at IS NOT NULL
        )
      )
    )
  );

-- Creators policies (public read, restricted write)
CREATE POLICY "Anyone can view verified creators" ON public.creators
  FOR SELECT USING (verified = true);

CREATE POLICY "Users can view all creators" ON public.creators
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- Campaign creators policies
CREATE POLICY "Users can view campaign creators from accessible campaigns" ON public.campaign_creators
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.campaigns c
      WHERE c.id = campaign_creators.campaign_id 
      AND (
        c.user_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM public.projects p
          LEFT JOIN public.team_members tm ON p.user_id = tm.team_owner_id
          WHERE p.id = c.project_id
          AND tm.member_id = auth.uid()
          AND tm.accepted_at IS NOT NULL
        )
      )
    )
  );

-- Analytics events policies
CREATE POLICY "Users can view analytics from accessible campaigns" ON public.analytics_events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.campaigns c
      WHERE c.id = analytics_events.campaign_id 
      AND (
        c.user_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM public.projects p
          LEFT JOIN public.team_members tm ON p.user_id = tm.team_owner_id
          WHERE p.id = c.project_id
          AND tm.member_id = auth.uid()
          AND tm.accepted_at IS NOT NULL
        )
      )
    )
  );

-- Notifications policies
CREATE POLICY "Users can view own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- Subscriptions policies
CREATE POLICY "Users can view own subscription" ON public.subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own subscription" ON public.subscriptions
  FOR UPDATE USING (auth.uid() = user_id);

-- Usage tracking policies
CREATE POLICY "Users can view own usage" ON public.usage_tracking
  FOR SELECT USING (auth.uid() = user_id);

-- Team members policies
CREATE POLICY "Users can view team memberships they own or are part of" ON public.team_members
  FOR SELECT USING (
    auth.uid() = team_owner_id OR 
    auth.uid() = member_id
  );

CREATE POLICY "Users can invite team members" ON public.team_members
  FOR INSERT WITH CHECK (auth.uid() = team_owner_id);

CREATE POLICY "Users can update team memberships they own" ON public.team_members
  FOR UPDATE USING (auth.uid() = team_owner_id);

CREATE POLICY "Members can accept invitations" ON public.team_members
  FOR UPDATE USING (auth.uid() = member_id AND accepted_at IS NULL);

-- Audit logs policies (admin only for viewing)
CREATE POLICY "Users can view own audit logs" ON public.audit_logs
  FOR SELECT USING (auth.uid() = user_id);