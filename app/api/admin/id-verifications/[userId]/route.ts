// app/api/admin/id-verifications/[userId]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdminRole } from '@/lib/requireAdminRole'

export async function PATCH(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  const { error, user: admin } = await requireAdminRole(req)
  if (error) return error

  const { action, rejectionReason } = await req.json()
  if (action !== 'approve' && action !== 'reject') {
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  }

  await prisma.$transaction([
    prisma.profile.update({
      where: { userId: params.userId },
      data: {
        idVerificationStatus: action === 'approve' ? 'approved' : 'rejected',
        idVerificationReviewedAt: new Date(),
        idVerificationReviewedBy: admin!.id,
        ...(action === 'reject' && { idVerificationRejectionReason: rejectionReason ?? 'Document unclear or invalid' }),
      },
    }),
    ...(action === 'approve'
      ? [prisma.user.update({ where: { id: params.userId }, data: { idVerified: true } })]
      : []),
  ])

  return NextResponse.json({ message: 'Updated' })
}