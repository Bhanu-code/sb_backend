// app/api/admin/stats/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdminRole } from '@/lib/requireAdminRole'

export async function GET(req: NextRequest) {
  const { error } = await requireAdminRole(req)
  if (error) return error

  const [pendingRequests, pendingCommissions, totalAdvisors] = await Promise.all([
    prisma.masterAgentRequest.count({ where: { status: 'pending' } }),
    prisma.commission.count({ where: { status: 'pending' } }),
    prisma.user.count({ where: { role: { in: ['advisor', 'master_agent'] } } }),
  ])

  return NextResponse.json({ pendingRequests, pendingCommissions, totalAdvisors })
}