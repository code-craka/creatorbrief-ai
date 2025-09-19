import { Metadata } from 'next'
import { ProfileSettings } from '@/components/profile/ProfileSettings'

export const metadata: Metadata = {
  title: 'Profile Settings - CreatorBrief AI',
  description: 'Manage your CreatorBrief AI profile and preferences',
}

export default function ProfilePage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Profile Settings</h1>
          <p className="text-muted-foreground mt-2">
            Manage your account settings and preferences
          </p>
        </div>
        
        <ProfileSettings />
      </div>
    </div>
  )
}