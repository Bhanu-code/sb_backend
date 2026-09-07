// app/advisor/earnings/page.tsx
import { redirect } from 'next/navigation'
import { getWebSessionUser } from '@/lib/webSession'
import EarningsClient from './EarningsClient'

export default async function AdvisorEarningsPage() {
  const user = await getWebSessionUser()
  if (!user) redirect('/advisor/login')
  if (user.role !== 'advisor' && user.role !== 'master_agent') redirect('/advisor/login')

  return <EarningsClient />
}