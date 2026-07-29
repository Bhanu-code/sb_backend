// app/api/admin/master-agent-requests/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdminRole } from '@/lib/requireAdminRole'

export async function GET(req: NextRequest) {
  const { error } = await requireAdminRole(req)
  if (error) return error

  const requests = await prisma.masterAgentRequest.findMany({
    where: { status: 'pending' },
    include: {
      user: { select: { fullName: true, email: true, referralCount: true, createdAt: true } },
    },
    orderBy: { requestedAt: 'asc' },
  })

  return NextResponse.json({
    requests: requests.map((r) => ({
      id: r.id,
      name: r.user.fullName,
      email: r.user.email,
      referralCount: r.user.referralCount,
      requestedAt: r.requestedAt,
    })),
  })
}