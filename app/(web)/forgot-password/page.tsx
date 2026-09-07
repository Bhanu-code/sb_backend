// app/(web)/forgot-password/page.tsx
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { generateOtp, saveOtpForReset } from '@/lib/otp'
import { sendOtpEmail } from '@/lib/mailer'

async function requestResetAction(formData: FormData) {
  'use server'

  const email = (formData.get('email') as string)?.trim()

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    redirect(`/forgot-password?error=${encodeURIComponent('Please enter a valid email')}`)
  }

  const user = await prisma.user.findUnique({ where: { email } })

  // Always behave the same way regardless of whether the account exists —
  // prevents this endpoint from being used to enumerate registered emails.
  if (user && user.passwordHash) {
    const otp = generateOtp()
    await saveOtpForReset(email, otp)
    await sendOtpEmail(email, otp)
  }

  redirect(`/reset-password?email=${encodeURIComponent(email)}`)
}

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Reset your password</h1>
        <p style={styles.subtitle}>
          Enter your email and we'll send you a code to reset your password.
        </p>

        <form action={requestResetAction} style={styles.form}>
          <label style={styles.label}>Email</label>
          <input name="email" type="email" required style={styles.input} />

          {error && <p style={styles.error}>{error}</p>}

          <button type="submit" style={styles.button}>Send Reset Code</button>
        </form>

        <p style={styles.footerText}>
          <a href="/login" style={styles.link}>Back to Login</a>
        </p>
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff0f3',
    fontFamily: 'system-ui, sans-serif',
    backgroundImage: "url('/redbg.jpg')",
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 32,
    width: 380,
    boxShadow: '0 8px 24px rgba(214,51,108,0.1)',
  },
  title: { color: '#d6336c', fontSize: 22, fontWeight: 700, textAlign: 'center', margin: 0 },
  subtitle: { color: '#a56478', fontSize: 14, textAlign: 'center', marginTop: 10, lineHeight: 1.5 },
  form: { display: 'flex', flexDirection: 'column', gap: 4, marginTop: 20, color: '#a5486a', },
  label: { fontSize: 13, fontWeight: 600, color: '#a5486a', marginTop: 12 },
  input: {
    padding: '10px 12px',
    borderRadius: 10,
    border: '1px solid #f6c6d4',
    fontSize: 14,
    marginTop: 4,
  },
  error: { color: '#e03131', fontSize: 13, marginTop: 12, textAlign: 'center' },
  button: {
    marginTop: 20,
    padding: 13,
    borderRadius: 12,
    border: 'none',
    backgroundColor: '#d6336c',
    color: '#fff',
    fontWeight: 700,
    fontSize: 15,
    cursor: 'pointer',
  },
  footerText: { textAlign: 'center', fontSize: 13, color: '#8a5464', marginTop: 18 },
  link: { color: '#d6336c', fontWeight: 700, textDecoration: 'none' },
}