// app/api/auth/forgot-password/request/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateOtp, saveOtpForReset } from '@/lib/otp'
import { sendOtpEmail } from '@/lib/mailer'

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { email } })

    // Always return the same success response regardless of whether the
    // account exists — prevents using this endpoint to enumerate registered emails.
    if (user && user.passwordHash) {
      const otp = generateOtp()
      await saveOtpForReset(email, otp)
      await sendOtpEmail(email, otp)
    }

    return NextResponse.json({
      message: 'If an account exists for this email, a reset code has been sent.',
    })
  } catch (err) {
    console.error('Forgot password request error:', err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}