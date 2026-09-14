// app/api/settings/blocked/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const userId = req.headers.get('x-user-id')
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const blocks = await prisma.block.findMany({
    where: { blockerId: userId },
    include: {
      blocked: {
        select: { id: true, fullName: true, profile: { select: { avatarUrl: true, occupation: true } } },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json({
    blocked: blocks.map((b) => ({
      id: b.blocked.id,
      name: b.blocked.fullName ?? 'Unknown',
      avatarUrl: b.blocked.profile?.avatarUrl ?? null,
      profession: b.blocked.profile?.occupation ?? null,
    })),
  })
}