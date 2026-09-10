// app/api/onboarding/complete/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const LEVEL_AMOUNTS: Record<number, number> = {
  1: Number(process.env.LEVEL_1_COMMISSION ?? 1000),
  2: Number(process.env.LEVEL_2_COMMISSION ?? 200),
  3: Number(process.env.LEVEL_3_COMMISSION ?? 100),
  4: Number(process.env.LEVEL_4_COMMISSION ?? 50),
}

async function payReferralCommissions(newUserId: string, directReferrerId: string) {
  const commissionsToCreate: {
    beneficiaryId: string
    sourceUserId: string
    level: number
    amount: number
  }[] = []

  let currentUserId: string | null = directReferrerId
  let level = 1

  while (currentUserId && level <= 4) {
    const currentUser: { id: string; role: string; referredById: string | null } | null =
      await prisma.user.findUnique({
        where: { id: currentUserId },
        select: { id: true, role: true, referredById: true },
      })

    if (!currentUser) break

    if (level === 4 && currentUser.role !== 'master_agent') {
      break
    }

    commissionsToCreate.push({
      beneficiaryId: currentUser.id,
      sourceUserId: newUserId,
      level,
      amount: LEVEL_AMOUNTS[level],
    })

    currentUserId = currentUser.referredById
    level += 1
  }

  if (commissionsToCreate.length === 0) return

  await prisma.$transaction([
    ...commissionsToCreate.map((c) =>
      prisma.commission.create({
        data: {
          beneficiaryId: c.beneficiaryId,
          sourceUserId: c.sourceUserId,
          level: c.level,
          amount: c.amount,
          type: 'joining',
          status: 'pending',
        },
      })
    ),
    prisma.user.update({
      where: { id: directReferrerId },
      data: { referralCount: { increment: 1 } },
    }),
  ])
}

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
      educationLevel,
      occupation,
      occupationCategory,
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

    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const alreadyComplete = user.profileComplete

    // The first uploaded photo becomes the profile avatar; the second (if
    // present) becomes the cover photo. This is a convention, not something
    // the user explicitly chooses during onboarding — they can change either
    // later via Edit Profile.
    const avatarUrl = photos[0] ?? undefined
    const coverUrl = photos[1] ?? undefined

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
        educationLevel,
        occupation,
        occupationCategory,
        annualIncome,
        city,
        state,
        bio,
        photos,
        avatarUrl,
        coverUrl,
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
        educationLevel,
        occupation,
        occupationCategory,
        annualIncome,
        city,
        state,
        bio,
        photos,
        ...(avatarUrl && { avatarUrl }),
        ...(coverUrl && { coverUrl }),
        partnerAgeMin,
        partnerAgeMax,
        partnerReligion,
        partnerCaste,
      },
    })

    if (!alreadyComplete && user.referredById) {
      await payReferralCommissions(user.id, user.referredById)
    }

    return NextResponse.json({ message: 'Onboarding complete' })
  } catch (err) {
    console.error('Onboarding complete error:', err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}