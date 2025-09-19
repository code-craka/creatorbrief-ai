'use client'

import React from 'react'
import { useState, useEffect } from 'react'
import { useAuth } from '@/components/auth/AuthProvider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { Loader2, User, Building, Mail, Bell, Shield, Save } from 'lucide-react'
import { Database } from '@/types/database'

type Profile = Database['public']['Tables']['profiles']['Row']

export function ProfileSettings() {
  const { user, profile, updateProfile, loading: authLoading } = useAuth()
  const [formData, setFormData] = useState({
    company_name: '',
    role: 'editor' as Profile['role'],
  })
  const [notificationPrefs, setNotificationPrefs] = useState({
    email_enabled: true,
    sms_enabled: false,
    in_app_enabled: true,
    campaign_updates: true,
    creator_responses: true,
    performance_alerts: true,
    weekly_reports: false,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    if (profile) {
      setFormData({
        company_name: profile.company_name || '',
        role: profile.role,
      })
      setNotificationPrefs(prev => ({
        ...prev,
        ...profile.notification_preferences,
      }))
    }
  }, [profile])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleRoleChange = (value: Profile['role']) => {
    setFormData(prev => ({
      ...prev,
      role: value
    }))
  }

  const handleNotificationChange = (key: keyof typeof notificationPrefs, value: boolean) => {
    setNotificationPrefs(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleSave = async () => {
    setLoading(true)
    setError(null)
    setSuccess(null)

    const { error } = await updateProfile({
      company_name: formData.company_name,
      role: formData.role,
      notification_preferences: notificationPrefs,
    })

    if (error) {
      setError(error.message)
    } else {
      setSuccess('Profile updated successfully!')
      setTimeout(() => setSuccess(null), 3000)
    }

    setLoading(false)
  }

  if (authLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!user) {
    return (
      <Alert>
        <AlertDescription>Please sign in to access profile settings.</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {/* Profile Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Information
          </CardTitle>
          <CardDescription>
            Update your personal and company information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={user.email || ''}
                  className="pl-10"
                  disabled
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Email cannot be changed. Contact support if needed.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="company_name">Company Name</Label>
              <div className="relative">
                <Building className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="company_name"
                  name="company_name"
                  type="text"
                  placeholder="Enter your company name"
                  value={formData.company_name}
                  onChange={handleInputChange}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select value={formData.role} onValueChange={handleRoleChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="editor">Editor</SelectItem>
                <SelectItem value="viewer">Viewer</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              Your role determines your access level within the platform
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Preferences
          </CardTitle>
          <CardDescription>
            Choose how you want to be notified about platform activities
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-3">Notification Channels</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="email_enabled"
                    checked={notificationPrefs.email_enabled}
                    onCheckedChange={(checked) => 
                      handleNotificationChange('email_enabled', checked as boolean)
                    }
                  />
                  <Label htmlFor="email_enabled">Email notifications</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="sms_enabled"
                    checked={notificationPrefs.sms_enabled}
                    onCheckedChange={(checked) => 
                      handleNotificationChange('sms_enabled', checked as boolean)
                    }
                  />
                  <Label htmlFor="sms_enabled">SMS notifications (coming soon)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="in_app_enabled"
                    checked={notificationPrefs.in_app_enabled}
                    onCheckedChange={(checked) => 
                      handleNotificationChange('in_app_enabled', checked as boolean)
                    }
                  />
                  <Label htmlFor="in_app_enabled">In-app notifications</Label>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="text-sm font-medium mb-3">Notification Types</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="campaign_updates"
                    checked={notificationPrefs.campaign_updates}
                    onCheckedChange={(checked) => 
                      handleNotificationChange('campaign_updates', checked as boolean)
                    }
                  />
                  <Label htmlFor="campaign_updates">Campaign updates and status changes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="creator_responses"
                    checked={notificationPrefs.creator_responses}
                    onCheckedChange={(checked) => 
                      handleNotificationChange('creator_responses', checked as boolean)
                    }
                  />
                  <Label htmlFor="creator_responses">Creator responses and messages</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="performance_alerts"
                    checked={notificationPrefs.performance_alerts}
                    onCheckedChange={(checked) => 
                      handleNotificationChange('performance_alerts', checked as boolean)
                    }
                  />
                  <Label htmlFor="performance_alerts">Performance alerts and insights</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="weekly_reports"
                    checked={notificationPrefs.weekly_reports}
                    onCheckedChange={(checked) => 
                      handleNotificationChange('weekly_reports', checked as boolean)
                    }
                  />
                  <Label htmlFor="weekly_reports">Weekly performance reports</Label>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Settings
          </CardTitle>
          <CardDescription>
            Manage your account security and privacy
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h4 className="text-sm font-medium">Two-Factor Authentication</h4>
              <p className="text-sm text-muted-foreground">
                Add an extra layer of security to your account
              </p>
            </div>
            <Button variant="outline" disabled>
              Coming Soon
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h4 className="text-sm font-medium">Password</h4>
              <p className="text-sm text-muted-foreground">
                Change your account password
              </p>
            </div>
            <Button variant="outline" disabled>
              Change Password
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </div>
  )
}