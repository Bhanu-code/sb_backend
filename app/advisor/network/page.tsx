// app/advisor/network/page.tsx
import { redirect } from 'next/navigation'
import { getWebSessionUser } from '@/lib/webSession'
import NetworkClient from './NetworkClient'

export default async function AdvisorNetworkPage() {
  const user = await getWebSessionUser()
  if (!user) redirect('/advisor/login')
  if (user.role !== 'advisor' && user.role !== 'master_agent') redirect('/advisor/login')

  return <NetworkClient />
}