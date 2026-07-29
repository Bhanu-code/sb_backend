// app/api/admin/create/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const { email, password, fullName, setupSecret } = await req.json()

    // Gate this endpoint behind a secret only you know — without this,
    // anyone who discovers the route could create their own admin account.
    if (!process.env.ADMIN_SETUP_SECRET || setupSecret !== process.env.ADMIN_SETUP_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      )
    }

    const passwordHash = await hashPassword(password)

    const user = await prisma.user.upsert({
      where: { email },
      create: {
        email,
        fullName: fullName || 'Admin',
        passwordHash,
        role: 'admin',
        referralCode: Math.random().toString(36).slice(2, 10).toUpperCase(),
        emailVerified: true,
        profileComplete: true,
      },
      update: {
        role: 'admin',
        passwordHash,
        ...(fullName && { fullName }),
      },
    })

    return NextResponse.json({
      message: 'Admin created',
      user: { id: user.id, email: user.email, role: user.role },
    })
  } catch (err) {
    console.error('Create admin error:', err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}