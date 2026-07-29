// app/api/admin/commissions/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdminRole } from '@/lib/requireAdminRole'

export async function GET(req: NextRequest) {
  const { error } = await requireAdminRole(req)
  if (error) return error

  const commissions = await prisma.commission.findMany({
    where: { status: 'pending' },
    include: {
      beneficiary: { select: { fullName: true, email: true } },
      sourceUser: { select: { fullName: true, email: true } },
    },
    orderBy: { createdAt: 'asc' },
  })

  return NextResponse.json({
    commissions: commissions.map((c) => ({
      id: c.id,
      beneficiaryName: c.beneficiary.fullName ?? c.beneficiary.email,
      sourceName: c.sourceUser.fullName ?? c.sourceUser.email,
      level: c.level,
      amount: c.amount,
      type: c.type,
      createdAt: c.createdAt,
    })),
  })
}