import { Metadata } from 'next'
import { SignUp } from '@/components/auth/SignUp'

export const metadata: Metadata = {
  title: 'Sign Up - CreatorBrief AI',
  description: 'Create your CreatorBrief AI account',
}

export default function SignUpPage() {
  return <SignUp />
}