// app/advisor/verify-otp/actions.ts
'use server'

import { redirect } from 'next/navigation'
import { verifyOtp, generateOtp, saveOtp } from '@/lib/otp'
import { sendOtpEmail } from '@/lib/mailer'
import { createWebSession } from '@/lib/webSession'

export async function verifyOtpAction(formData: FormData) {
  const email = formData.get('email') as string
  const otp = formData.get('otp') as string

  const result = await verifyOtp(email, otp)

  if (!result.valid || !result.userId) {
    redirect(`/advisor/verify-otp?email=${encodeURIComponent(email)}&error=${encodeURIComponent('Invalid or expired code')}`)
  }

  await createWebSession(result.userId)

  redirect(result.isNewUser ? '/advisor/set-password' : '/advisor/dashboard')
}

export async function resendOtpAction(formData: FormData) {
  const email = formData.get('email') as string
  const otp = generateOtp()
  await saveOtp(email, otp)
  await sendOtpEmail(email, otp)
  redirect(`/advisor/verify-otp?email=${encodeURIComponent(email)}`)
}