// app/api/advisor/referrals/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id')
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const referrals = await prisma.user.findMany({
      where: { referredById: userId, profileComplete: true },
      select: {
        id: true,
        fullName: true,
        email: true,
        createdAt: true,
        commissionsTriggered: {
          where: { beneficiaryId: userId },
          select: { amount: true, status: true, type: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({
      referrals: referrals.map((r) => ({
        id: r.id,
        name: r.fullName ?? 'Unknown',
        email: r.email,
        joinedAt: r.createdAt,
        commission: r.commissionsTriggered[0] ?? null,
      })),
    })
  } catch (err) {
    console.error('Advisor referrals error:', err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}