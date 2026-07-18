// app/api/settings/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
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

    return NextResponse.json(user)
  } catch (err) {
    console.error('Get settings error:', err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id')
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { notificationsEnabled, locationSharingEnabled } = await req.json()

    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(notificationsEnabled !== undefined && { notificationsEnabled }),
        ...(locationSharingEnabled !== undefined && { locationSharingEnabled }),
      },
      select: { notificationsEnabled: true, locationSharingEnabled: true },
    })

    return NextResponse.json(updated)
  } catch (err) {
    console.error('Update settings error:', err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}