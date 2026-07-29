// app/api/admin/login/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { comparePassword } from '@/lib/auth'
import { SignJWT } from 'jose'

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!)

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { email } })

    if (!user || !user.passwordHash || user.role !== 'admin') {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const validPassword = await comparePassword(password, user.passwordHash)
    if (!validPassword) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const token = await new SignJWT({ userId: user.id, email: user.email })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('7d')
      .sign(JWT_SECRET)

    return NextResponse.json({
      token,
      user: { id: user.id, fullName: user.fullName, email: user.email },
    })
  } catch (err) {
    console.error('Admin login error:', err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}