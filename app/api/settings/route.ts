// app/api/settings/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const userId = req.headers.get('x-user-id')
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { notificationsEnabled: true, locationSharingEnabled: true },
  })

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  return NextResponse.json({
    notificationsEnabled: user.notificationsEnabled,
    locationSharingEnabled: user.locationSharingEnabled,
  })
}

export async function PATCH(req: NextRequest) {
  const userId = req.headers.get('x-user-id')
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { notificationsEnabled, locationSharingEnabled } = await req.json()

  await prisma.user.update({
    where: { id: userId },
    data: {
      ...(notificationsEnabled !== undefined && { notificationsEnabled }),
      ...(locationSharingEnabled !== undefined && { locationSharingEnabled }),
    },
  })

  return NextResponse.json({ message: 'Settings updated' })
}