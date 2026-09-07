// app/(web)/onboarding/page.tsx
import { redirect } from 'next/navigation'
import { getWebSessionUser } from '@/lib/webSession'
import OnboardingWizard from './OnboardingWizard'

export default async function OnboardingPage() {
  const user = await getWebSessionUser()
  if (!user) redirect('/login')
  if (user.profileComplete) redirect('/matches')

  return <OnboardingWizard />
}