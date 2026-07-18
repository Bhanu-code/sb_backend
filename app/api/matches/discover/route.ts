// app/api/matches/discover/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

function calculateAge(dob: Date): number {
  return Math.floor((Date.now() - dob.getTime()) / (365.25 * 24 * 60 * 60 * 1000))
}

export async function GET(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id')
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const me = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    })

    if (!me) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Users already interacted with (either direction, any status) — don't resurface
    const existingInterests = await prisma.interest.findMany({
      where: { OR: [{ senderId: userId }, { receiverId: userId }] },
      select: { senderId: true, receiverId: true },
    })
    const interactedIds = new Set(
      existingInterests.flatMap((i) => [i.senderId, i.receiverId])
    )
    interactedIds.add(userId)

    // Users I've blocked or who've blocked me
    const blocks = await prisma.block.findMany({
      where: { OR: [{ blockerId: userId }, { blockedId: userId }] },
      select: { blockerId: true, blockedId: true },
    })
    const blockedIds = new Set(blocks.flatMap((b) => [b.blockerId, b.blockedId]))

    const excludeIds = [...new Set([...interactedIds, ...blockedIds])]

    // Convert my partner age preference into a dateOfBirth range for the query
    const now = new Date()
    let dobGte: Date | undefined
    let dobLte: Date | undefined

    if (me.profile?.partnerAgeMax) {
      dobGte = new Date(now)
      dobGte.setFullYear(now.getFullYear() - me.profile.partnerAgeMax - 1)
    }
    if (me.profile?.partnerAgeMin) {
      dobLte = new Date(now)
      dobLte.setFullYear(now.getFullYear() - me.profile.partnerAgeMin)
    }

    // Default: show the opposite gender (standard matrimony assumption — see note)
    const targetGender = me.gender === 'MALE' ? 'FEMALE' : me.gender === 'FEMALE' ? 'MALE' : undefined

    const candidates = await prisma.user.findMany({
      where: {
        id: { notIn: excludeIds },
        profileComplete: true,
        isActive: true,
        ...(targetGender && { gender: targetGender }),
        ...(dobGte && dobLte && { dateOfBirth: { gte: dobGte, lte: dobLte } }),
        profile: {
          matrimonyVisible: true,
          ...(me.profile?.partnerReligion && { religion: me.profile.partnerReligion }),
        },
      },
      include: { profile: true },
      take: 20,
    })

    const results = candidates
      .filter((c) => c.dateOfBirth && c.profile)
      .map((c) => ({
        id: c.id,
        name: c.fullName ?? 'Unknown',
        age: calculateAge(c.dateOfBirth!),
        profession: c.profile?.occupation ?? null,
        location: [c.profile?.city, c.profile?.state].filter(Boolean).join(', ') || null,
        religion: c.profile?.religion ?? null,
        caste: c.profile?.caste ?? null,
        height: c.profile?.height ?? null,
        image: c.profile?.photos?.[0] ?? null,
      }))

    return NextResponse.json({ profiles: results })
  } catch (err) {
    console.error('Discover matches error:', err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}