// app/api/auth/register-advisor/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateOtp, generateReferralCode, saveOtp } from '@/lib/otp'
import { sendOtpEmail } from '@/lib/mailer'

export async function POST(req: NextRequest) {
  try {
    const { fullName, email } = await req.json()

    if (!fullName || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    const existing = await prisma.user.findUnique({ where: { email } })

    if (existing?.profileComplete) {
      return NextResponse.json(
        { error: 'An account with this email already exists. Please log in.' },
        { status: 409 }
      )
    }

    const otp = generateOtp()
    const user = await saveOtp(email, otp) // find-or-creates, role defaults to 'customer'

    // Promote to advisor on this specific registration path — saveOtp doesn't
    // know about role, so set it explicitly here.
    if (user.role === 'customer') {
      await prisma.user.update({
        where: { id: user.id },
        data: { role: 'advisor', fullName },
      })
    } else if (user.fullName !== fullName) {
      await prisma.user.update({ where: { id: user.id }, data: { fullName } })
    }

    await sendOtpEmail(email, otp)

    return NextResponse.json({ email, message: 'OTP sent' }, { status: 200 })
  } catch (err) {
    console.error('Advisor register error:', err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}