// app/api/matches/interest/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id')
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { receiverId } = await req.json()
    if (!receiverId) {
      return NextResponse.json({ error: 'receiverId is required' }, { status: 400 })
    }

    if (receiverId === userId) {
      return NextResponse.json({ error: 'Cannot send interest to yourself' }, { status: 400 })
    }

    const existing = await prisma.interest.findFirst({
      where: {
        OR: [
          { senderId: userId, receiverId },
          { senderId: receiverId, receiverId: userId },
        ],
      },
    })

    if (existing) {
      return NextResponse.json({ error: 'Interest already exists' }, { status: 409 })
    }

    const interest = await prisma.interest.create({
      data: { senderId: userId, receiverId },
    })

    return NextResponse.json({ interest }, { status: 201 })
  } catch (err) {
    console.error('Send interest error:', err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}