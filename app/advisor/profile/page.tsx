// app/advisor/profile/page.tsx
import { redirect } from 'next/navigation'
import { getWebSessionUser } from '@/lib/webSession'
import ProfileClient from './ProfileClient'

export default async function AdvisorProfilePage() {
  const user = await getWebSessionUser()
  if (!user) redirect('/advisor/login')
  if (user.role !== 'advisor' && user.role !== 'master_agent') redirect('/advisor/login')

  return <ProfileClient />
}