// app/api/chat/[otherUserId]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { QueryCommand } from '@aws-sdk/lib-dynamodb'
import { dynamo } from '@/lib/dynamodb'

function getConversationId(a: string, b: string) {
  return [a, b].sort().join('#')
}

export async function GET(
  req: NextRequest,
  { params }: { params: { otherUserId: string } }
) {
  const userId = req.headers.get('x-user-id')
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const {otherUserId} = await params
  if (!otherUserId) {
    return NextResponse.json({ error: 'Bad Request: Missing otherUserId' }, { status: 400 })
  }

  const conversationId = getConversationId(userId, otherUserId)

  console.log('Fetching messages for conversationId:', conversationId)

  const result = await dynamo.send(
    new QueryCommand({
      TableName: 'chat_messages',
      KeyConditionExpression: 'conversationId = :cid',
      ExpressionAttributeValues: { ':cid': conversationId },
      ScanIndexForward: true, // chronological order
    })
  )

  return NextResponse.json({ messages: result.Items ?? [] })
}