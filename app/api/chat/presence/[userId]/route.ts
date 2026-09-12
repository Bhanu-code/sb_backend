// app/api/chat/presence/[userId]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { QueryCommand, GetCommand } from '@aws-sdk/lib-dynamodb'
import { dynamo } from '@/lib/dynamodb'

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  const requesterId = req.headers.get('x-user-id')
  if (!requesterId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { userId } = await params
  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
  }

  try {
    const connResult = await dynamo.send(
      new QueryCommand({
        TableName: 'chat_connections',
        IndexName: 'userId-index',
        KeyConditionExpression: 'userId = :uid',
        ExpressionAttributeValues: { ':uid': userId },
      })
    )

    const online = (connResult.Items?.length ?? 0) > 0

    if (online) {
      return NextResponse.json({ online: true, lastSeenAt: null })
    }

    const presenceResult = await dynamo.send(
      new GetCommand({
        TableName: 'user_presence',
        Key: { userId: userId },
      })
    )

    return NextResponse.json({
      online: false,
      lastSeenAt: presenceResult.Item?.lastSeenAt ?? null,
    })
  } catch (err) {
    console.error('Presence check error:', err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}