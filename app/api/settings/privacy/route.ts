// app/api/settings/privacy/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const userId = req.headers.get('x-user-id')
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      locationSharingEnabled: true,
      mobilePrivacyEnabled: true,
      profile: {
        select: {
          matrimonyVisible: true,
          profileVisibility: true,
          photoVisibility: true,
          horoscopeVisibility: true,
        },
      },
    },
  })

  return NextResponse.json({
    locationSharingEnabled: user?.locationSharingEnabled ?? false,
    mobilePrivacyEnabled: user?.mobilePrivacyEnabled ?? true,
    matrimonyVisible: user?.profile?.matrimonyVisible ?? true,
    profileVisibility: user?.profile?.profileVisibility ?? 'visible_to_all',
    photoVisibility: user?.profile?.photoVisibility ?? 'visible_to_all',
    horoscopeVisibility: user?.profile?.horoscopeVisibility ?? 'visible_to_all',
  })
}

export async function PATCH(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id')
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const {
      locationSharingEnabled,
      mobilePrivacyEnabled,
      matrimonyVisible,
      profileVisibility,
      photoVisibility,
      horoscopeVisibility,
    } = await req.json()

    const userUpdates: Record<string, any> = {}
    if (locationSharingEnabled !== undefined) userUpdates.locationSharingEnabled = locationSharingEnabled
    if (mobilePrivacyEnabled !== undefined) userUpdates.mobilePrivacyEnabled = mobilePrivacyEnabled

    const profileUpdates: Record<string, any> = {}
    if (matrimonyVisible !== undefined) profileUpdates.matrimonyVisible = matrimonyVisible
    if (profileVisibility !== undefined) profileUpdates.profileVisibility = profileVisibility
    if (photoVisibility !== undefined) profileUpdates.photoVisibility = photoVisibility
    if (horoscopeVisibility !== undefined) profileUpdates.horoscopeVisibility = horoscopeVisibility

    await prisma.$transaction([
      ...(Object.keys(userUpdates).length > 0
        ? [prisma.user.update({ where: { id: userId }, data: userUpdates })]
        : []),
      ...(Object.keys(profileUpdates).length > 0
        ? [prisma.profile.update({ where: { userId }, data: profileUpdates })]
        : []),
    ])

    return NextResponse.json({ message: 'Privacy settings updated' })
  } catch (err) {
    console.error('Update privacy error:', err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}