// app/advisor/verify-otp/VerifyOtpForm.tsx
'use client'

import { useState } from 'react'
import { verifyOtpAction, resendOtpAction } from './actions'

export default function VerifyOtpForm({ email, error }: { email: string; error?: string }) {
  const [otp, setOtp] = useState('')
  const [pending, setPending] = useState(false)

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Verify your email</h1>
        <p style={styles.subtitle}>We've sent a 6-digit code to <strong>{email}</strong></p>

        <form
          action={async (formData) => {
            setPending(true)
            await verifyOtpAction(formData)
          }}
          style={styles.form}
        >
          <input type="hidden" name="email" value={email} />
          <input
            name="otp"
            type="text"
            maxLength={6}
            inputMode="numeric"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
            style={styles.otpInput}
            placeholder="000000"
          />

          {error && <p style={styles.error}>{error}</p>}

          <button type="submit" disabled={otp.length !== 6 || pending} style={styles.button}>
            {pending ? 'Verifying...' : 'Verify'}
          </button>
        </form>

        <form action={resendOtpAction}>
          <input type="hidden" name="email" value={email} />
          <button type="submit" style={styles.resendButton}>Resend code</button>
        </form>
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff0f3', fontFamily: 'system-ui, sans-serif',  backgroundImage: 'url("/redbg.jpg")', backgroundSize: 'cover', backgroundPosition: 'center'    },
  card: { backgroundColor: '#ffffff', borderRadius: 20, padding: 32, width: 380, boxShadow: '0 8px 24px rgba(214,51,108,0.1)', textAlign: 'center' },
  title: { color: '#d6336c', fontSize: 22, fontWeight: 700, margin: 0 },
  subtitle: { color: '#a56478', fontSize: 14, marginTop: 10 },
  form: { display: 'flex', flexDirection: 'column', gap: 12, marginTop: 20, color: '#a5486a' },
  otpInput: { padding: '14px', borderRadius: 12, border: '1px solid #f6c6d4', fontSize: 24, letterSpacing: 8, textAlign: 'center' },
  error: { color: '#e03131', fontSize: 13 },
  button: { padding: 13, borderRadius: 12, border: 'none', backgroundColor: '#d6336c', color: '#fff', fontWeight: 700, fontSize: 15, cursor: 'pointer' },
  resendButton: { marginTop: 14, background: 'none', border: 'none', color: '#d6336c', fontWeight: 700, fontSize: 13, cursor: 'pointer' },
}