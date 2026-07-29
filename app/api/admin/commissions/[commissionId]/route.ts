// app/api/admin/commissions/[commissionId]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdminRole } from '@/lib/requireAdminRole'

export async function PATCH(
  req: NextRequest,
  { params }: { params: { commissionId: string } }
) {
  const { error } = await requireAdminRole(req)
  if (error) return error

  const { status } = await req.json()
  if (status !== 'paid' && status !== 'failed') {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  }

  await prisma.commission.update({
    where: { id: params.commissionId },
    data: { status },
  })

  return NextResponse.json({ message: 'Updated' })
}