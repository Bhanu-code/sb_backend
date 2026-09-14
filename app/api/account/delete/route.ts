// app/api/account/delete/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { comparePassword } from '@/lib/auth'
import { clearWebSession } from '@/lib/webSession'

export async function DELETE(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id')
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { password } = await req.json()
    if (!password) {
      return NextResponse.json({ error: 'Password is required' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user || !user.passwordHash) {
      return NextResponse.json({ error: 'Unable to verify account' }, { status: 400 })
    }

    const validPassword = await comparePassword(password, user.passwordHash)
    if (!validPassword) {
      return NextResponse.json({ error: 'Incorrect password' }, { status: 401 })
    }

    // Cascading deletes on every FK pointing at User clean up everything else.
    await prisma.user.delete({ where: { id: userId } })

    await clearWebSession()

    return NextResponse.json({ message: 'Account deleted' })
  } catch (err) {
    console.error('Delete account error:', err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}