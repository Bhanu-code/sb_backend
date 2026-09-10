// app/api/chat/conversations/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { QueryCommand } from '@aws-sdk/lib-dynamodb'
import { dynamo } from '@/lib/dynamodb'

function getConversationId(a: string, b: string) {
  return [a, b].sort().join('#')
}

export async function GET(req: NextRequest) {
  const userId = req.headers.get('x-user-id')
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const accepted = await prisma.interest.findMany({
      where: { status: 'accepted', OR: [{ senderId: userId }, { receiverId: userId }] },
      include: {
        sender: { select: { id: true, fullName: true, profile: { select: { avatarUrl: true } } } },
        receiver: { select: { id: true, fullName: true, profile: { select: { avatarUrl: true } } } },
      },
    })

    const conversations = await Promise.all(
      accepted.map(async (interest) => {
        const other = interest.senderId === userId ? interest.receiver : interest.sender
        const conversationId = getConversationId(userId, other.id)

        // Fetch the single most recent message for this conversation, if any
        const result = await dynamo.send(
          new QueryCommand({
            TableName: 'chat_messages',
            KeyConditionExpression: 'conversationId = :cid',
            ExpressionAttributeValues: { ':cid': conversationId },
            ScanIndexForward: false, // newest first
            Limit: 1,
          })
        )

        const lastMessage = result.Items?.[0] ?? null

        return {
          userId: other.id,
          name: other.fullName ?? 'Unknown',
          avatarUrl: other.profile?.avatarUrl ?? null,
          lastMessageContent: lastMessage?.content ?? null,
          lastMessageAt: lastMessage?.createdAt ?? interest.updatedAt.toISOString(),
          lastMessageFromMe: lastMessage?.senderId === userId,
          hasMessages: !!lastMessage,
        }
      })
    )

    // Most recently active conversations first
    conversations.sort(
      (a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()
    )

    return NextResponse.json({ conversations })
  } catch (err) {
    console.error('Get conversations error:', err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}