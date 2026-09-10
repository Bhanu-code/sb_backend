// app/api/admin/id-verifications/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdminRole } from '@/lib/requireAdminRole'

export async function GET(req: NextRequest) {
  const { error } = await requireAdminRole(req)
  if (error) return error

  const profiles = await prisma.profile.findMany({
    where: { idVerificationStatus: 'pending' },
    include: { user: { select: { id: true, fullName: true, email: true } } },
    orderBy: { idVerificationSubmittedAt: 'asc' },
  })

  return NextResponse.json({
    verifications: profiles.map((p) => ({
      userId: p.userId,
      name: p.user.fullName,
      email: p.user.email,
      documentType: p.idDocumentType,
      documentUrl: p.verificationDocUrl,
      submittedAt: p.idVerificationSubmittedAt,
    })),
  })
}