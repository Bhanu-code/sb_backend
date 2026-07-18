// app/api/posts/[postId]/like/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  req: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    const userId = req.headers.get('x-user-id')
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { postId } = await params;

    const existing = await prisma.like.findUnique({
      where: { userId_postId: { userId, postId } },
    })

    if (existing) {
      await prisma.like.delete({ where: { id: existing.id } })
      return NextResponse.json({ liked: false })
    }

    await prisma.like.create({ data: { userId, postId } })
    return NextResponse.json({ liked: true })
  } catch (err) {
    console.error('Toggle like error:', err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}