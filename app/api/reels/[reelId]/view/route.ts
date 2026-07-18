// app/api/reels/[reelId]/view/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  req: NextRequest,
  { params }: { params: { reelId: string } }
) {
  try {
    const userId = req.headers.get('x-user-id')
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await prisma.reel.update({
      where: { id: params.reelId },
      data: { views: { increment: 1 } },
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Increment view error:', err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}