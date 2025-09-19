'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProjectCard } from './ProjectCard';
import { CampaignCard } from './CampaignCard';
import { ProjectForm } from './ProjectForm';
import { CampaignForm } from './CampaignForm';
import { Project, Campaign, ProjectStats } from '@/types/project';

interface ProjectDashboardProps {
  initialProjects?: Project[];
  initialCampaigns?: Campaign[];
  initialStats?: ProjectStats;
}

export function ProjectDashboard({ 
  initialProjects = [], 
  initialCampaigns = [],
  initialStats 
}: ProjectDashboardProps) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns);
  const [stats, setStats] = useState<ProjectStats | null>(initialStats || null);
  const [_loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showCampaignForm, setShowCampaignForm] = useState(false);
  const [view, setView] = useState<'overview' | 'projects' | 'campaigns'>('overview');

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [projectsRes, campaignsRes, statsRes] = await Promise.all([
        fetch('/api/projects?limit=10'),
        fetch('/api/campaigns?limit=10'),
        fetch('/api/dashboard/stats')
      ]);

      if (projectsRes.ok) {
        const projectsData = await projectsRes.json();
        setProjects(projectsData.projects);
      }

      if (campaignsRes.ok) {
        const campaignsData = await campaignsRes.json();
        setCampaigns(campaignsData.campaigns);
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!initialProjects.length && !initialCampaigns.length) {
      fetchDashboardData();
    }
  }, [initialProjects.length, initialCampaigns.length]);

  // Filter projects and campaigns based on search
  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCampaigns = campaigns.filter(campaign =>
    campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    campaign.target_audience?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleProjectCreated = (newProject: Project) => {
    setProjects(prev => [newProject, ...prev]);
    setShowProjectForm(false);
    fetchDashboardData(); // Refresh stats
  };

  const handleCampaignCreated = (newCampaign: Campaign) => {
    setCampaigns(prev => [newCampaign, ...prev]);
    setShowCampaignForm(false);
    fetchDashboardData(); // Refresh stats
  };

  const handleProjectUpdated = (updatedProject: Project) => {
    setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
    fetchDashboardData(); // Refresh stats
  };

  const handleCampaignUpdated = (updatedCampaign: Campaign) => {
    setCampaigns(prev => prev.map(c => c.id === updatedCampaign.id ? updatedCampaign : c));
    fetchDashboardData(); // Refresh stats
  };

  const handleProjectDeleted = (projectId: number) => {
    setProjects(prev => prev.filter(p => p.id !== projectId));
    setCampaigns(prev => prev.filter(c => c.project_id !== projectId));
    fetchDashboardData(); // Refresh stats
  };

  const handleCampaignDeleted = (campaignId: number) => {
    setCampaigns(prev => prev.filter(c => c.id !== campaignId));
    fetchDashboardData(); // Refresh stats
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your creator campaigns and projects
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setShowCampaignForm(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            New Campaign
          </Button>
          <Button onClick={() => setShowProjectForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total_projects}</div>
              <p className="text-xs text-muted-foreground">
                {stats.active_projects} active
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total_campaigns}</div>
              <p className="text-xs text-muted-foreground">
                {stats.active_campaigns} active
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completed_projects}</div>
              <p className="text-xs text-muted-foreground">
                {stats.total_projects > 0 
                  ? Math.round((stats.completed_projects / stats.total_projects) * 100)
                  : 0}% completion rate
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Campaign Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                {stats.campaign_status_counts && Object.entries(stats.campaign_status_counts).map(([status, count]) => (
                  <Badge key={status} variant="secondary" className="text-xs">
                    {status}: {count}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-4">
        <Button
          variant={view === 'overview' ? 'default' : 'ghost'}
          onClick={() => setView('overview')}
        >
          Overview
        </Button>
        <Button
          variant={view === 'projects' ? 'default' : 'ghost'}
          onClick={() => setView('projects')}
        >
          Projects ({projects.length})
        </Button>
        <Button
          variant={view === 'campaigns' ? 'default' : 'ghost'}
          onClick={() => setView('campaigns')}
        >
          Campaigns ({campaigns.length})
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search projects and campaigns..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>

      {/* Content based on view */}
      {view === 'overview' && (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Projects */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Projects</CardTitle>
              <CardDescription>Your latest projects</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {filteredProjects.slice(0, 3).map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onUpdate={handleProjectUpdated}
                  onDelete={handleProjectDeleted}
                  compact
                />
              ))}
              {filteredProjects.length === 0 && (
                <p className="text-muted-foreground text-center py-4">
                  No projects found
                </p>
              )}
            </CardContent>
          </Card>

          {/* Recent Campaigns */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Campaigns</CardTitle>
              <CardDescription>Your latest campaigns</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {filteredCampaigns.slice(0, 3).map((campaign) => (
                <CampaignCard
                  key={campaign.id}
                  campaign={campaign}
                  onUpdate={handleCampaignUpdated}
                  onDelete={handleCampaignDeleted}
                  compact
                />
              ))}
              {filteredCampaigns.length === 0 && (
                <p className="text-muted-foreground text-center py-4">
                  No campaigns found
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {view === 'projects' && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onUpdate={handleProjectUpdated}
              onDelete={handleProjectDeleted}
            />
          ))}
          {filteredProjects.length === 0 && (
            <div className="col-span-full text-center py-8">
              <p className="text-muted-foreground">No projects found</p>
              <Button
                onClick={() => setShowProjectForm(true)}
                className="mt-4"
              >
                Create your first project
              </Button>
            </div>
          )}
        </div>
      )}

      {view === 'campaigns' && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredCampaigns.map((campaign) => (
            <CampaignCard
              key={campaign.id}
              campaign={campaign}
              onUpdate={handleCampaignUpdated}
              onDelete={handleCampaignDeleted}
            />
          ))}
          {filteredCampaigns.length === 0 && (
            <div className="col-span-full text-center py-8">
              <p className="text-muted-foreground">No campaigns found</p>
              <Button
                onClick={() => setShowCampaignForm(true)}
                className="mt-4"
              >
                Create your first campaign
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Forms */}
      {showProjectForm && (
        <ProjectForm
          onSuccess={handleProjectCreated}
          onCancel={() => setShowProjectForm(false)}
        />
      )}

      {showCampaignForm && (
        <CampaignForm
          projects={projects}
          onSuccess={handleCampaignCreated}
          onCancel={() => setShowCampaignForm(false)}
        />
      )}
    </div>
  );
}