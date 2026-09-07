// app/api/matches/pass/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id')
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { targetId } = await req.json()
    if (!targetId) {
      return NextResponse.json({ error: 'targetId is required' }, { status: 400 })
    }

    await prisma.pass.upsert({
      where: { userId_targetId: { userId, targetId } },
      create: { userId, targetId },
      update: {}, // already passed — no-op, not an error
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Pass error:', err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}