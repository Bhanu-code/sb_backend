// app/(web)/chat/page.tsx
import { redirect } from 'next/navigation'
import { getWebSessionUser } from '@/lib/webSession'
import ChatListClient from './ChatListClient'

export default async function ChatListPage() {
  const user = await getWebSessionUser()
  if (!user) redirect('/login')
  if (!user.profileComplete) redirect('/onboarding')

  return <ChatListClient />
}