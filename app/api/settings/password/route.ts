// app/api/settings/password/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { comparePassword, hashPassword } from '@/lib/auth'

export async function PATCH(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id')
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { currentPassword, newPassword } = await req.json()

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: 'Both current and new password are required' }, { status: 400 })
    }
    if (newPassword.length < 8) {
      return NextResponse.json({ error: 'New password must be at least 8 characters' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user || !user.passwordHash) {
      return NextResponse.json({ error: 'Unable to verify account' }, { status: 400 })
    }

    const validPassword = await comparePassword(currentPassword, user.passwordHash)
    if (!validPassword) {
      return NextResponse.json({ error: 'Current password is incorrect' }, { status: 401 })
    }

    const newHash = await hashPassword(newPassword)
    await prisma.user.update({ where: { id: userId }, data: { passwordHash: newHash } })

    return NextResponse.json({ message: 'Password updated' })
  } catch (err) {
    console.error('Change password error:', err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}