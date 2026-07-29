// app/api/advisor/downline/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

type DownlineUser = {
  id: string
  name: string
  email: string | null
  joinedAt: Date
  profileComplete: boolean
  role: string
  commissionAmount: number | null
  commissionStatus: string | null
}

export async function GET(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id')
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const levels: DownlineUser[][] = [[], [], [], []]
    let currentLevelParentIds = [userId]

    for (let level = 1; level <= 4; level++) {
      if (currentLevelParentIds.length === 0) break

      const users = await prisma.user.findMany({
        where: { referredById: { in: currentLevelParentIds } },
        select: {
          id: true,
          fullName: true,
          email: true,
          createdAt: true,
          profileComplete: true,
          role: true,
        },
        orderBy: { createdAt: 'desc' },
      })

      if (users.length === 0) break

      const userIds = users.map((u) => u.id)
      const commissions = await prisma.commission.findMany({
        where: {
          beneficiaryId: userId,
          sourceUserId: { in: userIds },
          level,
        },
        select: { sourceUserId: true, amount: true, status: true },
      })

      const commissionMap = new Map(commissions.map((c) => [c.sourceUserId, c]))

      levels[level - 1] = users.map((u) => {
        const commission = commissionMap.get(u.id)
        return {
          id: u.id,
          name: u.fullName ?? 'Unknown',
          email: u.email,
          joinedAt: u.createdAt,
          profileComplete: u.profileComplete,
          role: u.role,
          commissionAmount: commission ? Number(commission.amount) : null,
          commissionStatus: commission?.status ?? null,
        }
      })

      currentLevelParentIds = userIds
    }

    return NextResponse.json({
      level1: levels[0],
      level2: levels[1],
      level3: levels[2],
      level4: levels[3],
    })
  } catch (err) {
    console.error('Get downline error:', err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}