// app/api/settings/ignored/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const userId = req.headers.get('x-user-id')
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const passes = await prisma.pass.findMany({
    where: { userId },
    include: {
      target: {
        select: { id: true, fullName: true, profile: { select: { avatarUrl: true, occupation: true } } },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json({
    ignored: passes.map((p) => ({
      id: p.target.id,
      name: p.target.fullName ?? 'Unknown',
      avatarUrl: p.target.profile?.avatarUrl ?? null,
      profession: p.target.profile?.occupation ?? null,
    })),
  })
}