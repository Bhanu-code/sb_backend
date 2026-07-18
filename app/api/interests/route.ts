// app/api/interests/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

function calculateAge(dob: Date | null): number | null {
  if (!dob) return null
  return Math.floor((Date.now() - dob.getTime()) / (365.25 * 24 * 60 * 60 * 1000))
}

export async function GET(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id')
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const interests = await prisma.interest.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
      orderBy: { createdAt: 'desc' },
      include: {
        sender: {
          select: {
            id: true,
            fullName: true,
            dateOfBirth: true,
            profile: { select: { avatarUrl: true, occupation: true } },
          },
        },
        receiver: {
          select: {
            id: true,
            fullName: true,
            dateOfBirth: true,
            profile: { select: { avatarUrl: true, occupation: true } },
          },
        },
      },
    })

    const results = interests.map((i) => {
      const isSender = i.senderId === userId
      const other = isSender ? i.receiver : i.sender

      return {
        id: i.id,
        status: i.status,
        direction: isSender ? 'sent' : 'received',
        createdAt: i.createdAt,
        user: {
          id: other.id,
          name: other.fullName ?? 'Unknown',
          age: calculateAge(other.dateOfBirth),
          profession: other.profile?.occupation ?? null,
          avatarUrl: other.profile?.avatarUrl ?? null,
        },
      }
    })

    return NextResponse.json({ interests: results })
  } catch (err) {
    console.error('Get interests error:', err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}