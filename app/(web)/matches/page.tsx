// app/(web)/matches/page.tsx
import { redirect } from 'next/navigation'
import { getWebSessionUser } from '@/lib/webSession'
import MatchesClient from './MatchesClient'

export default async function MatchesPage() {
  const user = await getWebSessionUser()
  if (!user) redirect('/login')
  if (!user.profileComplete) redirect('/onboarding')

  return <MatchesClient />
}