'use client';

import { useState } from 'react';
import { MoreHorizontal, Calendar, Target, Trash2, Edit, Eye, Play, Pause, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Campaign } from '@/types/project';
import { CampaignForm } from './CampaignForm';

interface CampaignCardProps {
  campaign: Campaign;
  onUpdate: (campaign: Campaign) => void;
  onDelete: (campaignId: number) => void;
  compact?: boolean;
}

export function CampaignCard({ campaign, onUpdate, onDelete, compact = false }: CampaignCardProps) {
  const [showEditForm, setShowEditForm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this campaign? This will also delete all associated briefs.')) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/campaigns/${campaign.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        onDelete(campaign.id);
      } else {
        const error = await response.json();
        alert(`Failed to delete campaign: ${error.error}`);
      }
    } catch (error) {
      console.error('Error deleting campaign:', error);
      alert('Failed to delete campaign');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleStatusUpdate = async (newStatus: 'draft' | 'active' | 'paused' | 'completed') => {
    setIsUpdatingStatus(true);
    try {
      const response = await fetch(`/api/campaigns/${campaign.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        const updatedCampaign = await response.json();
        onUpdate(updatedCampaign);
      } else {
        const error = await response.json();
        alert(`Failed to update campaign: ${error.error}`);
      }
    } catch (error) {
      console.error('Error updating campaign:', error);
      alert('Failed to update campaign');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Play className="h-3 w-3" />;
      case 'paused':
        return <Pause className="h-3 w-3" />;
      case 'completed':
        return <CheckCircle className="h-3 w-3" />;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getPlatformBadges = (platforms: string[]) => {
    return platforms.slice(0, 3).map((platform) => (
      <Badge key={platform} variant="secondary" className="text-xs">
        {platform}
      </Badge>
    ));
  };

  if (compact) {
    return (
      <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-medium truncate">{campaign.title}</h4>
            <Badge className={getStatusColor(campaign.status)} variant="outline">
              {getStatusIcon(campaign.status)}
              <span className="ml-1">{campaign.status}</span>
            </Badge>
          </div>
          {campaign.target_audience && (
            <p className="text-sm text-muted-foreground truncate mt-1">
              Target: {campaign.target_audience}
            </p>
          )}
          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Target className="h-3 w-3" />
              {campaign.brief_count || 0} briefs
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatDate(campaign.start_date)}
            </span>
          </div>
          {campaign.platforms && campaign.platforms.length > 0 && (
            <div className="flex gap-1 mt-2">
              {getPlatformBadges(campaign.platforms)}
              {campaign.platforms.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{campaign.platforms.length - 3}
                </Badge>
              )}
            </div>
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setShowEditForm(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={handleDelete}
              disabled={isDeleting}
              className="text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {showEditForm && (
          <CampaignForm
            campaign={campaign}
            onSuccess={(updatedCampaign) => {
              onUpdate(updatedCampaign);
              setShowEditForm(false);
            }}
            onCancel={() => setShowEditForm(false)}
          />
        )}
      </div>
    );
  }

  return (
    <>
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg truncate">{campaign.title}</CardTitle>
              <CardDescription className="mt-1">
                {campaign.target_audience || 'No target audience specified'}
              </CardDescription>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setShowEditForm(true)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => handleStatusUpdate('active')} 
                  disabled={campaign.status === 'active' || isUpdatingStatus}
                >
                  <Play className="h-4 w-4 mr-2" />
                  Start Campaign
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => handleStatusUpdate('paused')} 
                  disabled={campaign.status === 'paused' || isUpdatingStatus}
                >
                  <Pause className="h-4 w-4 mr-2" />
                  Pause Campaign
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => handleStatusUpdate('completed')} 
                  disabled={campaign.status === 'completed' || isUpdatingStatus}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark Complete
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Badge className={getStatusColor(campaign.status)} variant="outline">
                {getStatusIcon(campaign.status)}
                <span className="ml-1">{campaign.status}</span>
              </Badge>
              {campaign.budget_range && (
                <span className="text-sm text-muted-foreground">
                  Budget: {campaign.budget_range}
                </span>
              )}
            </div>

            {campaign.platforms && campaign.platforms.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {getPlatformBadges(campaign.platforms)}
                {campaign.platforms.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{campaign.platforms.length - 3} more
                  </Badge>
                )}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Briefs:</span>
                <span className="font-medium">{campaign.brief_count || 0}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Start:</span>
                <span className="font-medium">{formatDate(campaign.start_date)}</span>
              </div>
            </div>

            {campaign.project && (
              <div className="text-sm">
                <span className="text-muted-foreground">Project:</span>
                <span className="font-medium ml-2">{campaign.project.name}</span>
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <Button variant="outline" size="sm" className="flex-1">
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </Button>
              <Button variant="outline" size="sm" onClick={() => setShowEditForm(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {showEditForm && (
        <CampaignForm
          campaign={campaign}
          onSuccess={(updatedCampaign) => {
            onUpdate(updatedCampaign);
            setShowEditForm(false);
          }}
          onCancel={() => setShowEditForm(false)}
        />
      )}
    </>
  );
}