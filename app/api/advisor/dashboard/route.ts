// app/api/advisor/dashboard/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id')
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({ where: { id: userId } })

    if (!user || (user.role !== 'advisor' && user.role !== 'master_agent')) {
      return NextResponse.json({ error: 'Not an advisor account' }, { status: 403 })
    }

    const [pendingAgg, paidAgg, masterAgentRequest] = await Promise.all([
      prisma.commission.aggregate({
        where: { beneficiaryId: userId, status: 'pending' },
        _sum: { amount: true },
        _count: true,
      }),
      prisma.commission.aggregate({
        where: { beneficiaryId: userId, status: 'paid' },
        _sum: { amount: true },
        _count: true,
      }),
      prisma.masterAgentRequest.findUnique({ where: { userId } }),
    ])

    return NextResponse.json({
      referralCode: user.referralCode,
      referralCount: user.referralCount,
      role: user.role,
      pendingCommission: pendingAgg._sum.amount ?? 0,
      pendingCount: pendingAgg._count,
      paidCommission: paidAgg._sum.amount ?? 0,
      paidCount: paidAgg._count,
      masterAgentEligible: user.referralCount >= 100 && user.role === 'advisor',
      masterAgentRequestStatus: masterAgentRequest?.status ?? null,
    })
  } catch (err) {
    console.error('Advisor dashboard error:', err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}