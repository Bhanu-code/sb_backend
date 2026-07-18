// app/api/reels/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id')
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { videoUrl, caption, thumbnailUrl } = await req.json()

    if (!videoUrl) {
      return NextResponse.json({ error: 'Video is required' }, { status: 400 })
    }

    const reel = await prisma.reel.create({
      data: {
        authorId: userId,
        videoUrl,
        caption: caption?.trim() || null,
        thumbnailUrl: thumbnailUrl || null,
      },
    })

    return NextResponse.json({ reel }, { status: 201 })
  } catch (err) {
    console.error('Create reel error:', err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id')
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const cursor = searchParams.get('cursor')
    const take = 10

    const reels = await prisma.reel.findMany({
      take,
      ...(cursor && { skip: 1, cursor: { id: cursor } }),
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: { id: true, fullName: true, profile: { select: { avatarUrl: true } } },
        },
        likes: { where: { userId }, select: { id: true } },
        _count: { select: { likes: true, comments: true } },
      },
    })

    const results = reels.map((r) => ({
      id: r.id,
      videoUrl: r.videoUrl,
      thumbnailUrl: r.thumbnailUrl,
      caption: r.caption,
      views: r.views,
      createdAt: r.createdAt,
      author: {
        id: r.author.id,
        name: r.author.fullName ?? 'Unknown',
        avatarUrl: r.author.profile?.avatarUrl ?? null,
      },
      likeCount: r._count.likes,
      commentCount: r._count.comments,
      likedByMe: r.likes.length > 0,
    }))

    const nextCursor = reels.length === take ? reels[reels.length - 1].id : null

    return NextResponse.json({ reels: results, nextCursor })
  } catch (err) {
    console.error('Get reels feed error:', err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}