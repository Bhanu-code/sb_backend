// app/api/chat/conversations/route.ts — list all conversations for the sidebar/inbox
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// This queries your Interest table (accepted matches) rather than DynamoDB,
// since "who can I chat with" is governed by your matrimony matching logic,
// not chat history itself.
export async function GET(req: NextRequest) {
  const userId = req.headers.get('x-user-id')
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const accepted = await prisma.interest.findMany({
    where: { status: 'accepted', OR: [{ senderId: userId }, { receiverId: userId }] },
    include: {
      sender: { select: { id: true, fullName: true, profile: { select: { avatarUrl: true } } } },
      receiver: { select: { id: true, fullName: true, profile: { select: { avatarUrl: true } } } },
    },
  })

  const conversations = accepted.map((interest) => {
    const other = interest.senderId === userId ? interest.receiver : interest.sender
    return {
      userId: other.id,
      name: other.fullName ?? 'Unknown',
      avatarUrl: other.profile?.avatarUrl ?? null,
    }
  })

  return NextResponse.json({ conversations })
}