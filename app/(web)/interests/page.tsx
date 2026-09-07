// app/(web)/interests/page.tsx
import { redirect } from 'next/navigation'
import { getWebSessionUser } from '@/lib/webSession'
import InterestsClient from './InterestsClient'

export default async function InterestsPage() {
  const user = await getWebSessionUser()
  if (!user) redirect('/login')
  if (!user.profileComplete) redirect('/onboarding')

  return <InterestsClient />
}