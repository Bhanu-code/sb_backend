// app/api/posts/[postId]/comments/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  req: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    const userId = req.headers.get('x-user-id')
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const comments = await prisma.comment.findMany({
      where: { postId: params.postId },
      orderBy: { createdAt: 'asc' },
      include: {
        author: {
          select: { id: true, fullName: true, profile: { select: { avatarUrl: true } } },
        },
      },
    })

    const results = comments.map((c) => ({
      id: c.id,
      content: c.content,
      createdAt: c.createdAt,
      author: {
        id: c.author.id,
        name: c.author.fullName ?? 'Unknown',
        avatarUrl: c.author.profile?.avatarUrl ?? null,
      },
    }))

    return NextResponse.json({ comments: results })
  } catch (err) {
    console.error('Get comments error:', err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    const userId = req.headers.get('x-user-id')
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { content } = await req.json()
    if (!content?.trim()) {
      return NextResponse.json({ error: 'Comment cannot be empty' }, { status: 400 })
    }

    const comment = await prisma.comment.create({
      data: { authorId: userId, postId: params.postId, content: content.trim() },
      include: {
        author: {
          select: { id: true, fullName: true, profile: { select: { avatarUrl: true } } },
        },
      },
    })

    return NextResponse.json(
      {
        comment: {
          id: comment.id,
          content: comment.content,
          createdAt: comment.createdAt,
          author: {
            id: comment.author.id,
            name: comment.author.fullName ?? 'Unknown',
            avatarUrl: comment.author.profile?.avatarUrl ?? null,
          },
        },
      },
      { status: 201 }
    )
  } catch (err) {
    console.error('Add comment error:', err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}