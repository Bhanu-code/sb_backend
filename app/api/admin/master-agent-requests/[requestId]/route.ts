// app/api/admin/master-agent-requests/[requestId]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdminRole } from '@/lib/requireAdminRole'

export async function PATCH(
  req: NextRequest,
  { params }: { params: { requestId: string } }
) {
  const { error, user: admin } = await requireAdminRole(req)
  if (error) return error

  const { action } = await req.json()
  if (action !== 'approve' && action !== 'reject') {
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  }

  const request = await prisma.masterAgentRequest.findUnique({ where: { id: params.requestId } })
  if (!request || request.status !== 'pending') {
    return NextResponse.json({ error: 'Request not found or already resolved' }, { status: 404 })
  }

  if (action === 'approve') {
    await prisma.$transaction([
      prisma.masterAgentRequest.update({
        where: { id: params.requestId },
        data: { status: 'approved', reviewedAt: new Date(), reviewedBy: admin!.id },
      }),
      prisma.user.update({
        where: { id: request.userId },
        data: { role: 'master_agent' },
      }),
    ])
  } else {
    await prisma.masterAgentRequest.update({
      where: { id: params.requestId },
      data: { status: 'rejected', reviewedAt: new Date(), reviewedBy: admin!.id },
    })
  }

  return NextResponse.json({ message: 'Updated' })
}