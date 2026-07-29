// app/api/posts/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id')
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { content, imageUrl, mediaType } = await req.json()

    if (!content?.trim() && !imageUrl) {
      return NextResponse.json(
        { error: 'Post must have content or media' },
        { status: 400 }
      )
    }

    const post = await prisma.post.create({
      data: {
        authorId: userId,
        content: content?.trim() || null,
        imageUrl,
        mediaType: imageUrl ? (mediaType === 'video' ? 'video' : 'image') : null,
      },
    })

    return NextResponse.json({ post }, { status: 201 })
  } catch (err) {
    console.error('Create post error:', err)
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

    const posts = await prisma.post.findMany({
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

    const results = posts.map((p) => ({
      id: p.id,
      content: p.content,
      imageUrl: p.imageUrl,
      mediaType: p.mediaType,
      createdAt: p.createdAt,
      author: {
        id: p.author.id,
        name: p.author.fullName ?? 'Unknown',
        avatarUrl: p.author.profile?.avatarUrl ?? null,
      },
      likeCount: p._count.likes,
      commentCount: p._count.comments,
      likedByMe: p.likes.length > 0,
    }))

    const nextCursor = posts.length === take ? posts[posts.length - 1].id : null

    return NextResponse.json({ posts: results, nextCursor })
  } catch (err) {
    console.error('Get feed error:', err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}


export async function DELETE(
  req: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    const userId = req.headers.get('x-user-id')
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { postId } = await params;

    console.log("postId", postId)

    const post = await prisma.post.findUnique({ where: { id: postId } })

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    if (post.authorId !== userId) {
      return NextResponse.json({ error: 'You can only delete your own posts' }, { status: 403 })
    }

    // Delete dependents first — no cascade configured on these relations
    await prisma.$transaction([
      prisma.like.deleteMany({ where: { postId: postId } }),
      prisma.comment.deleteMany({ where: { postId: postId } }),
      prisma.post.delete({ where: { id: postId } }),
    ])

    return NextResponse.json({ message: 'Post deleted' })
  } catch (err) {
    console.error('Delete post error:', err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}