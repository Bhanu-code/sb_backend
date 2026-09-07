// app/(web)/reset-password/page.tsx
import { redirect } from 'next/navigation'
import { verifyOtp, generateOtp, saveOtpForReset } from '@/lib/otp'
import { sendOtpEmail } from '@/lib/mailer'
import { hashPassword } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

async function resetPasswordAction(formData: FormData) {
  'use server'

  const email = formData.get('email') as string
  const otp = formData.get('otp') as string
  const newPassword = formData.get('newPassword') as string
  const confirmPassword = formData.get('confirmPassword') as string

  if (!otp || otp.length !== 6) {
    redirect(`/reset-password?email=${encodeURIComponent(email)}&error=${encodeURIComponent('Please enter the full code')}`)
  }
  if (newPassword.length < 8) {
    redirect(`/reset-password?email=${encodeURIComponent(email)}&error=${encodeURIComponent('Password must be at least 8 characters')}`)
  }
  if (newPassword !== confirmPassword) {
    redirect(`/reset-password?email=${encodeURIComponent(email)}&error=${encodeURIComponent('Passwords do not match')}`)
  }

  const result = await verifyOtp(email, otp)

  if (!result.valid || !result.userId) {
    redirect(`/reset-password?email=${encodeURIComponent(email)}&error=${encodeURIComponent('Invalid or expired code')}`)
  }

  const passwordHash = await hashPassword(newPassword)
  await prisma.user.update({ where: { id: result.userId! }, data: { passwordHash } })

  redirect('/login?reset=1')
}

async function resendResetOtpAction(formData: FormData) {
  'use server'
  const email = formData.get('email') as string
  const otp = generateOtp()
  await saveOtpForReset(email, otp)
  await sendOtpEmail(email, otp)
  redirect(`/reset-password?email=${encodeURIComponent(email)}`)
}

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string; error?: string }>
}) {
  const { email, error } = await searchParams

  if (!email) {
    return <p>Missing email. Please start over.</p>
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Enter reset code</h1>
        <p style={styles.subtitle}>
          We've sent a 6-digit code to <strong>{email}</strong>
        </p>

        <form action={resetPasswordAction} style={styles.form}>
          <input type="hidden" name="email" value={email} />

          <label style={styles.label}>Verification Code</label>
          <input
            name="otp"
            type="text"
            maxLength={6}
            inputMode="numeric"
            required
            style={{ ...styles.input, letterSpacing: 6, textAlign: 'center', fontSize: 20 }}
            placeholder="000000"
          />

          <label style={styles.label}>New Password</label>
          <input name="newPassword" type="password" required style={styles.input} />

          <label style={styles.label}>Confirm Password</label>
          <input name="confirmPassword" type="password" required style={styles.input} />

          {error && <p style={styles.error}>{error}</p>}

          <button type="submit" style={styles.button}>Reset Password</button>
        </form>

        <form action={resendResetOtpAction}>
          <input type="hidden" name="email" value={email} />
          <button type="submit" style={styles.resendButton}>Resend code</button>
        </form>
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
    textAlign: 'center',
  },
  title: { color: '#d6336c', fontSize: 22, fontWeight: 700, margin: 0 },
  subtitle: { color: '#a56478', fontSize: 14, marginTop: 10 },
  form: { display: 'flex', flexDirection: 'column', gap: 4, marginTop: 20, textAlign: 'left', color: '#a5486a', },
  label: { fontSize: 13, fontWeight: 600, color: '#a5486a', marginTop: 14 },
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
  resendButton: {
    marginTop: 14,
    background: 'none',
    border: 'none',
    color: '#d6336c',
    fontWeight: 700,
    fontSize: 13,
    cursor: 'pointer',
  },
}