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
      occupation,
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

    const existingProfile = await prisma.profile.findUnique({ where: { userId } })
    const photos = [...(existingProfile?.photos ?? [])]

    if (avatarUrl) photos[0] = avatarUrl
    if (coverUrl) photos[1] = coverUrl

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
          occupation,
          annualIncome,
          city,
          state,
          partnerAgeMin,
          partnerAgeMax,
          partnerReligion,
          partnerCaste,
          photos,
        },
        update: {
          ...(bio !== undefined && { bio }),
          ...(height !== undefined && { height }),
          ...(religion !== undefined && { religion }),
          ...(caste !== undefined && { caste }),
          ...(motherTongue !== undefined && { motherTongue }),
          ...(education !== undefined && { education }),
          ...(occupation !== undefined && { occupation }),
          ...(annualIncome !== undefined && { annualIncome }),
          ...(city !== undefined && { city }),
          ...(state !== undefined && { state }),
          ...(partnerAgeMin !== undefined && { partnerAgeMin }),
          ...(partnerAgeMax !== undefined && { partnerAgeMax }),
          ...(partnerReligion !== undefined && { partnerReligion }),
          ...(partnerCaste !== undefined && { partnerCaste }),
          ...((avatarUrl || coverUrl) && { photos }),
        },
      }),
    ])

    return NextResponse.json({ message: 'Profile updated' })
  } catch (err) {
    console.error('Update profile error:', err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}