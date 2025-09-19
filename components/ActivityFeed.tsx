'use client';

import { useState, useEffect, useCallback } from 'react';
import { Clock, User, MessageSquare, CheckCircle, XCircle, Edit, Trash2, Plus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

interface ActivityItem {
  id: number;
  user_id: string | null;
  action: string;
  resource_type: string;
  resource_id: string;
  old_values: Record<string, unknown> | null;
  new_values: Record<string, unknown> | null;
  created_at: string;
  formatted_message: string;
  user_profile?: {
    id: string;
    company_name: string | null;
    role: string;
  };
}

interface ActivityFeedProps {
  limit?: number;
  showFilters?: boolean;
}

export function ActivityFeed({ limit = 50, showFilters = true }: ActivityFeedProps) {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedType, setFeedType] = useState<'team' | 'user'>('team');
  const [actionFilter, setActionFilter] = useState<string>('all');

  // Fetch activity feed
  const fetchActivities = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/activity/feed?type=${feedType}&limit=${limit}`);
      if (response.ok) {
        const data = await response.json();
        setActivities(data.activities);
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  }, [feedType, limit]);

  useEffect(() => {
    fetchActivities();
  }, [feedType, limit, fetchActivities]);

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'create':
        return <Plus className="h-4 w-4 text-green-600" />;
      case 'update':
        return <Edit className="h-4 w-4 text-blue-600" />;
      case 'delete':
        return <Trash2 className="h-4 w-4 text-red-600" />;
      case 'comment':
        return <MessageSquare className="h-4 w-4 text-purple-600" />;
      case 'approve':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'reject':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'create':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'update':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'delete':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'comment':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'approve':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'reject':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
      });
    }
  };

  // Filter activities based on action filter
  const filteredActivities = activities.filter(activity => 
    actionFilter === 'all' || activity.action === actionFilter
  );

  // Get unique actions for filter dropdown
  const uniqueActions = Array.from(new Set(activities.map(a => a.action)));

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Activity Feed</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-muted-foreground">Loading activities...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Activity Feed</CardTitle>
            <CardDescription>
              Recent activity from your team and projects
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={fetchActivities}>
            Refresh
          </Button>
        </div>
        
        {showFilters && (
          <div className="flex gap-2 mt-4">
            <Select value={feedType} onValueChange={(value) => setFeedType(value as 'team' | 'user')}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="team">Team</SelectItem>
                <SelectItem value="user">My Activity</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                {uniqueActions.map(action => (
                  <SelectItem key={action} value={action}>
                    {action.charAt(0).toUpperCase() + action.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredActivities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex-shrink-0 mt-1">
                {getActionIcon(activity.action)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-medium truncate">
                    {activity.formatted_message}
                  </p>
                  <Badge className={getActionColor(activity.action)} variant="outline">
                    {activity.action}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <User className="h-3 w-3" />
                  <span>
                    {activity.user_profile?.company_name || 'Unknown User'}
                  </span>
                  <span>•</span>
                  <Clock className="h-3 w-3" />
                  <span>{formatTimeAgo(activity.created_at)}</span>
                </div>
                
                {/* Show additional details for certain actions */}
                {activity.action === 'update' && activity.old_values && activity.new_values && (
                  <div className="mt-2 text-xs text-muted-foreground">
                    <details className="cursor-pointer">
                      <summary>View changes</summary>
                      <div className="mt-1 p-2 bg-muted rounded text-xs">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <strong>Before:</strong>
                            <pre className="mt-1 text-xs overflow-x-auto">
                              {JSON.stringify(activity.old_values, null, 2)}
                            </pre>
                          </div>
                          <div>
                            <strong>After:</strong>
                            <pre className="mt-1 text-xs overflow-x-auto">
                              {JSON.stringify(activity.new_values, null, 2)}
                            </pre>
                          </div>
                        </div>
                      </div>
                    </details>
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {filteredActivities.length === 0 && (
            <div className="text-center py-8">
              <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No activities found</p>
              <p className="text-sm text-muted-foreground mt-1">
                Activities will appear here as your team works on projects
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}