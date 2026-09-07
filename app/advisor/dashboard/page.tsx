// app/advisor/dashboard/page.tsx
import { redirect } from 'next/navigation'
import { getWebSessionUser } from '@/lib/webSession'
import DashboardClient from './DashboardClient'

export default async function AdvisorDashboardPage() {
  const user = await getWebSessionUser()
  if (!user) redirect('/advisor/login')
  if (user.role !== 'advisor' && user.role !== 'master_agent') redirect('/advisor/login')
  if (!user.passwordHash) redirect('/advisor/set-password')

  return <DashboardClient />
}