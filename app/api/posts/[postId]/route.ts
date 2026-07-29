// app/api/posts/[postId]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

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