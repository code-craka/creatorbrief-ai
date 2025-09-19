import { Metadata } from 'next'
import { SignIn } from '@/components/auth/SignIn'

export const metadata: Metadata = {
  title: 'Sign In - CreatorBrief AI',
  description: 'Sign in to your CreatorBrief AI account',
}

export default function LoginPage() {
  return <SignIn />
}