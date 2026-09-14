// app/api/settings/deactivate/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const userId = req.headers.get('x-user-id')
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({ where: { id: userId }, select: { isActive: true } })
  return NextResponse.json({ isActive: user?.isActive ?? true })
}

export async function PATCH(req: NextRequest) {
  const userId = req.headers.get('x-user-id')
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { isActive } = await req.json()
  if (typeof isActive !== 'boolean') {
    return NextResponse.json({ error: 'isActive must be a boolean' }, { status: 400 })
  }

  await prisma.user.update({ where: { id: userId }, data: { isActive } })

  return NextResponse.json({ message: isActive ? 'Profile reactivated' : 'Profile deactivated' })
}