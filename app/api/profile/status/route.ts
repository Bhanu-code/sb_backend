// app/api/profile/status/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { calculateProfileCompleteness } from '@/lib/profileCompleteness'

export async function GET(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id')
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const profileCompleteness = calculateProfileCompleteness(user.profile, user.idVerified)

    return NextResponse.json({
      profileCompleteness,
      idVerified: user.idVerified,
      idVerificationStatus: user.profile?.idVerificationStatus ?? 'none',
    })
  } catch (err) {
    console.error('Get profile status error:', err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}