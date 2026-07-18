// app/api/account/delete/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function DELETE(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id')
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Delete dependent records first — no cascading deletes configured in schema,
    // so this must be done explicitly and in the right order to avoid FK violations.
    await prisma.$transaction([
      prisma.like.deleteMany({ where: { userId } }),
      prisma.comment.deleteMany({ where: { authorId: userId } }),
      prisma.notification.deleteMany({ where: { userId } }),
      prisma.block.deleteMany({ where: { OR: [{ blockerId: userId }, { blockedId: userId }] } }),
      prisma.report.deleteMany({ where: { OR: [{ reporterId: userId }, { reportedId: userId }] } }),
      prisma.message.deleteMany({ where: { OR: [{ senderId: userId }, { receiverId: userId }] } }),
      prisma.interest.deleteMany({ where: { OR: [{ senderId: userId }, { receiverId: userId }] } }),
      prisma.otpToken.deleteMany({ where: { userId } }),
      prisma.session.deleteMany({ where: { userId } }),
      prisma.reel.deleteMany({ where: { authorId: userId } }),
      prisma.post.deleteMany({ where: { authorId: userId } }),
      prisma.profile.deleteMany({ where: { userId } }),
      prisma.user.delete({ where: { id: userId } }),
    ])

    return NextResponse.json({ message: 'Account deleted' })
  } catch (err) {
    console.error('Delete account error:', err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}