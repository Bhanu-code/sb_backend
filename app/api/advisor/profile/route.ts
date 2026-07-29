// app/api/advisor/profile/route.ts
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
      include: { profile: true },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      referralCode: user.referralCode,
      avatarUrl: user.profile?.avatarUrl ?? null,
      address: user.profile?.address ?? null,
      city: user.profile?.city ?? null,
      state: user.profile?.state ?? null,
      pincode: user.profile?.pincode ?? null,
    })
  } catch (err) {
    console.error('Get advisor profile error:', err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id')
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { fullName, phone, avatarUrl, address, city, state, pincode } = body

    const [updatedUser] = await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: {
          ...(fullName !== undefined && { fullName }),
          ...(phone !== undefined && { phone: phone || null }),
        },
      }),
      prisma.profile.upsert({
        where: { userId },
        create: { userId, avatarUrl, address, city, state, pincode },
        update: {
          ...(avatarUrl !== undefined && { avatarUrl }),
          ...(address !== undefined && { address }),
          ...(city !== undefined && { city }),
          ...(state !== undefined && { state }),
          ...(pincode !== undefined && { pincode }),
        },
      }),
    ])

    return NextResponse.json({ message: 'Profile updated' })
  } catch (err) {
    console.error('Update advisor profile error:', err)

    // Phone has a @unique constraint on User — surface a clear error
    // instead of a generic 500 if someone else already has this number
    if (err && typeof err === 'object' && 'code' in err && err.code === 'P2002') {
      return NextResponse.json(
        { error: 'This phone number is already in use' },
        { status: 409 }
      )
    }

    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}