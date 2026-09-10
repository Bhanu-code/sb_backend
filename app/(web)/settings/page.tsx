// app/(web)/settings/page.tsx
import { redirect } from 'next/navigation'
import { getWebSessionUser } from '@/lib/webSession'
import SettingsClient from './SettingsClient'

export default async function SettingsPage() {
  const user = await getWebSessionUser()
  if (!user) redirect('/login')

  return <SettingsClient email={user.email} />
}