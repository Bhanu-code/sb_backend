// app/api/advisor/commissions/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id')
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const commissions = await prisma.commission.findMany({
      where: { beneficiaryId: userId },
      orderBy: { createdAt: 'desc' },
      include: {
        sourceUser: {
          select: { fullName: true, email: true, role: true },
        },
      },
    })

    const results = commissions.map((c) => ({
      id: c.id,
      amount: c.amount,
      type: c.type,
      status: c.status,
      level: c.level,
      createdAt: c.createdAt,
      sourceUserName: c.sourceUser.fullName ?? c.sourceUser.email ?? 'Unknown',
      sourceUserRole: c.sourceUser.role,
    }))

    // Breakdown by level — useful for the dashboard summary
    const byLevel = [1, 2, 3, 4].map((level) => {
      const levelCommissions = commissions.filter((c) => c.level === level)
      return {
        level,
        count: levelCommissions.length,
        total: levelCommissions.reduce((sum, c) => sum + Number(c.amount), 0),
      }
    })

    return NextResponse.json({ commissions: results, byLevel })
  } catch (err) {
    console.error('Get commissions error:', err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}