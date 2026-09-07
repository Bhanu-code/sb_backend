// app/api/contact/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { sendOtpEmail } from '@/lib/mailer' // reuse transporter — see note below

export async function POST(req: NextRequest) {
  try {
    const { name, email, message } = await req.json()

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    // Reusing your existing Nodemailer transporter setup rather than
    // sendOtpEmail specifically — see note below, this needs its own function.
    // Placeholder call shown for structure; replace with a real sendContactEmail.

    return NextResponse.json({ message: 'Message received' })
  } catch (err) {
    console.error('Contact form error:', err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}