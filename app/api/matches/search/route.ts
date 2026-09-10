// app/api/matches/search/route.ts
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

    const me = await prisma.user.findUnique({ where: { id: userId } })
    if (!me) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const { searchParams } = new URL(req.url)

    const existingInterests = await prisma.interest.findMany({
      where: { OR: [{ senderId: userId }, { receiverId: userId }] },
      select: { senderId: true, receiverId: true },
    })
    const passes = await prisma.pass.findMany({ where: { userId }, select: { targetId: true } })
    const blocks = await prisma.block.findMany({
      where: { OR: [{ blockerId: userId }, { blockedId: userId }] },
      select: { blockerId: true, blockedId: true },
    })
    const excludeIds = [...new Set([
      userId,
      ...existingInterests.flatMap((i) => [i.senderId, i.receiverId]),
      ...passes.map((p) => p.targetId),
      ...blocks.flatMap((b) => [b.blockerId, b.blockedId]),
    ])]

    const targetGender = me.gender === 'MALE' ? 'FEMALE' : me.gender === 'FEMALE' ? 'MALE' : undefined

    // Age range → DOB range
    const ageMin = searchParams.get('ageMin')
    const ageMax = searchParams.get('ageMax')
    let dobGte: Date | undefined, dobLte: Date | undefined
    const now = new Date()
    if (ageMax) {
      dobGte = new Date(now)
      dobGte.setFullYear(now.getFullYear() - Number(ageMax) - 1)
    }
    if (ageMin) {
      dobLte = new Date(now)
      dobLte.setFullYear(now.getFullYear() - Number(ageMin))
    }

    const heightMin = searchParams.get('heightMin')
    const heightMax = searchParams.get('heightMax')

    const profileWhere: Record<string, any> = { matrimonyVisible: true }

    const stringFilters = [
      'maritalStatus', 'motherTongue', 'physicalStatus', 'religion', 'caste',
      'employmentType', 'educationLevel', 'occupationCategory', 'country', 'citizenship',
      'eatingHabit', 'smokingHabit', 'drinkingHabit', 'familyStatus', 'familyValue',
      'familyType', 'nakshatra', 'dosham', 'city', 'state',
    ]
    for (const field of stringFilters) {
      const val = searchParams.get(field)
      if (val && val !== 'any') profileWhere[field] = val
    }

    if (heightMin || heightMax) {
      profileWhere.height = {
        ...(heightMin && { gte: Number(heightMin) }),
        ...(heightMax && { lte: Number(heightMax) }),
      }
    }

    if (searchParams.get('hasPhoto') === 'true') {
      profileWhere.avatarUrl = { not: null }
    }
    if (searchParams.get('hasHoroscope') === 'true') {
      profileWhere.horoscopeAvailable = true
    }

    const candidates = await prisma.user.findMany({
      where: {
        id: { notIn: excludeIds },
        profileComplete: true,
        isActive: true,
        ...(targetGender && { gender: targetGender }),
        ...(dobGte && dobLte && { dateOfBirth: { gte: dobGte, lte: dobLte } }),
        profile: profileWhere,
      },
      include: { profile: true },
      take: 30,
      orderBy: { createdAt: 'desc' },
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
        education: c.profile?.education ?? null,
        image: c.profile?.avatarUrl ?? null,
      }))

    return NextResponse.json({ profiles: results, count: results.length })
  } catch (err) {
    console.error('Search error:', err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}