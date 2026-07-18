// app/api/onboarding/complete/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id')
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const {
      gender,
      dateOfBirth,
      heightCm,
      religion,
      caste,
      motherTongue,
      education,
      occupation,
      annualIncome,
      city,
      state,
      bio,
      photos,
      partnerAgeMin,
      partnerAgeMax,
      partnerReligion,
      partnerCaste,
    } = body

    if (!photos || photos.length === 0) {
      return NextResponse.json({ error: 'At least 1 photo is required' }, { status: 400 })
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        gender,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
        profileComplete: true,
      },
    })

    await prisma.profile.upsert({
      where: { userId },
      create: {
        userId,
        height: heightCm,
        religion,
        caste,
        motherTongue,
        education,
        occupation,
        annualIncome,
        city,
        state,
        bio,
        photos,
        partnerAgeMin,
        partnerAgeMax,
        partnerReligion,
        partnerCaste,
      },
      update: {
        height: heightCm,
        religion,
        caste,
        motherTongue,
        education,
        occupation,
        annualIncome,
        city,
        state,
        bio,
        photos,
        partnerAgeMin,
        partnerAgeMax,
        partnerReligion,
        partnerCaste,
      },
    })

    return NextResponse.json({ message: 'Onboarding complete' })
  } catch (err) {
    console.error('Onboarding complete error:', err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}