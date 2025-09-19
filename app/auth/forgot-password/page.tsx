import { Metadata } from 'next'
import { ForgotPassword } from '@/components/auth/ForgotPassword'

export const metadata: Metadata = {
  title: 'Reset Password - CreatorBrief AI',
  description: 'Reset your CreatorBrief AI password',
}

export default function ForgotPasswordPage() {
  return <ForgotPassword />
}