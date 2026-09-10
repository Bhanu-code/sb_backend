// app/(web)/search/page.tsx
import { redirect } from 'next/navigation'
import { getWebSessionUser } from '@/lib/webSession'
import SearchClient from './SearchClient'

export default async function SearchPage() {
  const user = await getWebSessionUser()
  if (!user) redirect('/login')
  if (!user.profileComplete) redirect('/onboarding')

  return <SearchClient />
}