// app/api/account/delete/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { clearWebSession } from '@/lib/webSession'

export async function DELETE(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id')
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Thanks to onDelete: Cascade on every FK pointing at User, this single
    // delete now cleans up profile, posts, reels, likes, comments, interests,
    // messages, notifications, blocks, reports, sessions, otp tokens, and
    // the master agent request. referredById on other users is set to null
    // automatically via onDelete: SetNull, not cascaded.
    await prisma.user.delete({ where: { id: userId } })

    // Clears the httpOnly cookie for web sessions. Harmless no-op for
    // mobile requests, which authenticate via Bearer token and never had
    // this cookie set in the first place.
    await clearWebSession()

    return NextResponse.json({ message: 'Account deleted' })
  } catch (err) {
    console.error('Delete account error:', err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}