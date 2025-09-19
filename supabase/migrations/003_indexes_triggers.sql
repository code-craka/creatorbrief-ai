-- Indexes for performance optimization
CREATE INDEX idx_profiles_company_name ON public.profiles(company_name);
CREATE INDEX idx_profiles_role ON public.profiles(role);

CREATE INDEX idx_projects_user_id ON public.projects(user_id);
CREATE INDEX idx_projects_status ON public.projects(status);

CREATE INDEX idx_campaigns_user_id ON public.campaigns(user_id);
CREATE INDEX idx_campaigns_project_id ON public.campaigns(project_id);
CREATE INDEX idx_campaigns_status ON public.campaigns(status);
CREATE INDEX idx_campaigns_start_date ON public.campaigns(start_date);
CREATE INDEX idx_campaigns_platforms ON public.campaigns USING GIN(platforms);

CREATE INDEX idx_briefs_campaign_id ON public.briefs(campaign_id);
CREATE INDEX idx_briefs_status ON public.briefs(status);
CREATE INDEX idx_briefs_created_at ON public.briefs(created_at);

CREATE INDEX idx_brief_versions_brief_id ON public.brief_versions(brief_id);
CREATE INDEX idx_brief_versions_version ON public.brief_versions(brief_id, version);

CREATE INDEX idx_content_ideas_brief_id ON public.content_ideas(brief_id);
CREATE INDEX idx_content_ideas_platform ON public.content_ideas(platform);
CREATE INDEX idx_content_ideas_content_type ON public.content_ideas(content_type);
CREATE INDEX idx_content_ideas_tags ON public.content_ideas USING GIN(tags);

CREATE INDEX idx_creators_platform ON public.creators(platform);
CREATE INDEX idx_creators_niche ON public.creators USING GIN(niche);
CREATE INDEX idx_creators_followers_count ON public.creators(followers_count);
CREATE INDEX idx_creators_engagement_rate ON public.creators(engagement_rate);
CREATE INDEX idx_creators_verified ON public.creators(verified);

CREATE INDEX idx_creator_metrics_creator_id ON public.creator_metrics(creator_id);
CREATE INDEX idx_creator_metrics_date ON public.creator_metrics(metric_date);

CREATE INDEX idx_campaign_creators_campaign_id ON public.campaign_creators(campaign_id);
CREATE INDEX idx_campaign_creators_creator_id ON public.campaign_creators(creator_id);
CREATE INDEX idx_campaign_creators_status ON public.campaign_creators(status);

CREATE INDEX idx_analytics_events_campaign_id ON public.analytics_events(campaign_id);
CREATE INDEX idx_analytics_events_type ON public.analytics_events(event_type);
CREATE INDEX idx_analytics_events_created_at ON public.analytics_events(created_at);

CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_read ON public.notifications(read);
CREATE INDEX idx_notifications_type ON public.notifications(type);
CREATE INDEX idx_notifications_created_at ON public.notifications(created_at);

CREATE INDEX idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX idx_subscriptions_stripe_customer_id ON public.subscriptions(stripe_customer_id);
CREATE INDEX idx_subscriptions_status ON public.subscriptions(status);

CREATE INDEX idx_usage_tracking_user_id ON public.usage_tracking(user_id);
CREATE INDEX idx_usage_tracking_resource_type ON public.usage_tracking(resource_type);
CREATE INDEX idx_usage_tracking_period ON public.usage_tracking(period_start, period_end);

CREATE INDEX idx_team_members_team_owner_id ON public.team_members(team_owner_id);
CREATE INDEX idx_team_members_member_id ON public.team_members(member_id);
CREATE INDEX idx_team_members_role ON public.team_members(role);

CREATE INDEX idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON public.audit_logs(action);
CREATE INDEX idx_audit_logs_resource_type ON public.audit_logs(resource_type);
CREATE INDEX idx_audit_logs_created_at ON public.audit_logs(created_at);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at timestamps
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_campaigns_updated_at BEFORE UPDATE ON public.campaigns
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_briefs_updated_at BEFORE UPDATE ON public.briefs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_creators_updated_at BEFORE UPDATE ON public.creators
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_campaign_creators_updated_at BEFORE UPDATE ON public.campaign_creators
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON public.subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, company_name, role)
  VALUES (NEW.id, '', 'editor');
  
  -- Create initial subscription record
  INSERT INTO public.subscriptions (user_id, plan_type, status)
  VALUES (NEW.id, 'free', 'active');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to log audit events
CREATE OR REPLACE FUNCTION public.log_audit_event()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.audit_logs (
    user_id,
    action,
    resource_type,
    resource_id,
    old_values,
    new_values
  ) VALUES (
    auth.uid(),
    TG_OP,
    TG_TABLE_NAME,
    COALESCE(NEW.id::text, OLD.id::text),
    CASE WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD) ELSE NULL END,
    CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN to_jsonb(NEW) ELSE NULL END
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Audit triggers for important tables
CREATE TRIGGER audit_campaigns AFTER INSERT OR UPDATE OR DELETE ON public.campaigns
    FOR EACH ROW EXECUTE FUNCTION public.log_audit_event();

CREATE TRIGGER audit_briefs AFTER INSERT OR UPDATE OR DELETE ON public.briefs
    FOR EACH ROW EXECUTE FUNCTION public.log_audit_event();

CREATE TRIGGER audit_profiles AFTER UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.log_audit_event();