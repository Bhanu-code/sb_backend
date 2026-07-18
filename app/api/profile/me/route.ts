// app/api/profile/me/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

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

    const age = user.dateOfBirth
      ? Math.floor(
          (Date.now() - new Date(user.dateOfBirth).getTime()) /
            (365.25 * 24 * 60 * 60 * 1000)
        )
      : null

    return NextResponse.json({
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      emailVerified: user.emailVerified,
      gender: user.gender,
      dateOfBirth: user.dateOfBirth,
      age,
      profile: user.profile
        ? {
            bio: user.profile.bio,
            avatarUrl: user.profile.photos?.[0] ?? null,
            coverUrl: user.profile.photos?.[1] ?? null,
            height: user.profile.height,
            religion: user.profile.religion,
            caste: user.profile.caste,
            motherTongue: user.profile.motherTongue,
            education: user.profile.education,
            occupation: user.profile.occupation,
            annualIncome: user.profile.annualIncome,
            city: user.profile.city,
            state: user.profile.state,
            partnerAgeMin: user.profile.partnerAgeMin,
            partnerAgeMax: user.profile.partnerAgeMax,
            partnerReligion: user.profile.partnerReligion,
            partnerCaste: user.profile.partnerCaste,
          }
        : null,
    })
  } catch (err) {
    console.error('Get profile error:', err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}