// app/api/profile/update/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id')
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const {
      fullName,
      gender,
      dateOfBirth,
      bio,
      height,
      religion,
      caste,
      motherTongue,
      education,
      educationLevel,
      occupation,
      occupationCategory,
      annualIncome,
      city,
      state,
      partnerAgeMin,
      partnerAgeMax,
      partnerReligion,
      partnerCaste,
      avatarUrl,
      coverUrl,
    } = body

    const [updatedUser] = await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: {
          ...(fullName !== undefined && { fullName }),
          ...(gender !== undefined && { gender }),
          ...(dateOfBirth !== undefined && { dateOfBirth: new Date(dateOfBirth) }),
        },
      }),
      prisma.profile.upsert({
        where: { userId },
        create: {
          userId,
          bio,
          height,
          religion,
          caste,
          motherTongue,
          education,
          educationLevel,
          occupation,
          occupationCategory,
          annualIncome,
          city,
          state,
          partnerAgeMin,
          partnerAgeMax,
          partnerReligion,
          partnerCaste,
          avatarUrl,
          coverUrl,
        },
        update: {
          ...(bio !== undefined && { bio }),
          ...(height !== undefined && { height }),
          ...(religion !== undefined && { religion }),
          ...(caste !== undefined && { caste }),
          ...(motherTongue !== undefined && { motherTongue }),
          ...(education !== undefined && { education }),
          ...(educationLevel !== undefined && { educationLevel }),
          ...(occupation !== undefined && { occupation }),
          ...(occupationCategory !== undefined && { occupationCategory }),
          ...(annualIncome !== undefined && { annualIncome }),
          ...(city !== undefined && { city }),
          ...(state !== undefined && { state }),
          ...(partnerAgeMin !== undefined && { partnerAgeMin }),
          ...(partnerAgeMax !== undefined && { partnerAgeMax }),
          ...(partnerReligion !== undefined && { partnerReligion }),
          ...(partnerCaste !== undefined && { partnerCaste }),
          ...(avatarUrl !== undefined && { avatarUrl }),
          ...(coverUrl !== undefined && { coverUrl }),
        },
      }),
    ])

    return NextResponse.json({ message: 'Profile updated' })
  } catch (err) {
    console.error('Update profile error:', err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}