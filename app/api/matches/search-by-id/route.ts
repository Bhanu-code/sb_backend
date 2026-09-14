// app/api/matches/search-by-id/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { parseProfileId } from '@/lib/profileId'

function calculateAge(dob: Date): number {
  return Math.floor((Date.now() - dob.getTime()) / (365.25 * 24 * 60 * 60 * 1000))
}

export async function GET(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id')
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const rawId = searchParams.get('profileId')
    if (!rawId) {
      return NextResponse.json({ error: 'Profile ID is required' }, { status: 400 })
    }

    const profileNumber = parseProfileId(rawId)
    if (profileNumber === null) {
      return NextResponse.json({ error: 'Invalid Profile ID format' }, { status: 400 })
    }

    const blocks = await prisma.block.findMany({
      where: { OR: [{ blockerId: userId }, { blockedId: userId }] },
      select: { blockerId: true, blockedId: true },
    })
    const blockedIds = new Set(blocks.flatMap((b) => [b.blockerId, b.blockedId]))

    const target = await prisma.user.findUnique({
      where: { profileNumber },
      include: { profile: true },
    })

    if (!target || target.id === userId || blockedIds.has(target.id) || !target.profileComplete || !target.profile?.matrimonyVisible) {
      return NextResponse.json({ profile: null })
    }

    if (!target.dateOfBirth) {
      return NextResponse.json({ profile: null })
    }

    return NextResponse.json({
      profile: {
        id: target.id,
        profileId: `SB${target.profileNumber.toString().padStart(6, '0')}`,
        name: target.fullName ?? 'Unknown',
        age: calculateAge(target.dateOfBirth),
        profession: target.profile?.occupation ?? null,
        location: [target.profile?.district, target.profile?.state].filter(Boolean).join(', ') || null,
        religion: target.profile?.religion ?? null,
        caste: target.profile?.caste ?? null,
        height: target.profile?.height ?? null,
        education: target.profile?.education ?? null,
        image: target.profile?.avatarUrl ?? null,
      },
    })
  } catch (err) {
    console.error('Search by ID error:', err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}