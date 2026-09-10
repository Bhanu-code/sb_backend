// app/api/profile/verify-id/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id')
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { documentType, documentUrl } = await req.json()

    if (!documentType || !['aadhar', 'pan'].includes(documentType)) {
      return NextResponse.json({ error: 'Invalid document type' }, { status: 400 })
    }
    if (!documentUrl) {
      return NextResponse.json({ error: 'Document is required' }, { status: 400 })
    }

    await prisma.profile.update({
      where: { userId },
      data: {
        idDocumentType: documentType,
        verificationDocUrl: documentUrl,
        idVerificationStatus: 'pending',
        idVerificationSubmittedAt: new Date(),
        idVerificationRejectionReason: null,
      },
    })

    return NextResponse.json({ message: 'Document submitted for review' })
  } catch (err) {
    console.error('Submit ID verification error:', err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}