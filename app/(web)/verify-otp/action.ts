// app/(web)/verify-otp/actions.ts
'use server'

import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { verifyOtp, generateOtp, saveOtp } from '@/lib/otp'
import { sendOtpEmail } from '@/lib/mailer'
import { createWebSession } from '@/lib/webSession'

export async function verifyOtpAction(formData: FormData) {
  const email = formData.get('email') as string
  const otp = formData.get('otp') as string

  const result = await verifyOtp(email, otp)

  if (!result.valid || !result.userId) {
    redirect(`/verify-otp?email=${encodeURIComponent(email)}&error=${encodeURIComponent('Invalid or expired code')}`)
  }

  await createWebSession(result.userId)

  if (result.isNewUser) {
    redirect('/set-password')
  } else {
    redirect('/matches')
  }
}

export async function resendOtpAction(formData: FormData) {
  const email = formData.get('email') as string
  const otp = generateOtp()
  await saveOtp(email, otp)
  await sendOtpEmail(email, otp)
  redirect(`/verify-otp?email=${encodeURIComponent(email)}`)
}