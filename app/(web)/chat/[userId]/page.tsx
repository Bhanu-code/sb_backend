// app/(web)/chat/[userId]/page.tsx
import { redirect } from 'next/navigation'
import { getWebSessionUser } from '@/lib/webSession'
import { prisma } from '@/lib/prisma'
import ChatClient from './ChatClient'

export default async function ChatPage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId: otherUserId } = await params
  const me = await getWebSessionUser()
  if (!me) redirect('/login')

  // Guard: only allow chat between users with an accepted interest
  const interest = await prisma.interest.findFirst({
    where: {
      status: 'accepted',
      OR: [
        { senderId: me.id, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: me.id },
      ],
    },
  })

  if (!interest) redirect('/interests')

  const otherUser = await prisma.user.findUnique({
    where: { id: otherUserId },
    include: { profile: true },
  })

  if (!otherUser) redirect('/interests')

  return (
    <ChatClient
      currentUserId={me.id}
      otherUser={{
        id: otherUser.id,
        name: otherUser.fullName ?? 'Unknown',
        avatarUrl: otherUser.profile?.avatarUrl ?? null,
      }}
    />
  )
}