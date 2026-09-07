// app/(web)/register/page.tsx
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { generateOtp, saveOtp } from '@/lib/otp'
import { sendOtpEmail } from '@/lib/mailer'
import Link from 'next/link'
import Image from 'next/image'

async function registerAction(formData: FormData) {
  'use server'

  const fullName = (formData.get('fullName') as string)?.trim()
  const email = (formData.get('email') as string)?.trim()
  const referralCode = (formData.get('referralCode') as string)?.trim()

  if (!fullName || !email) {
    redirect(`/register?error=${encodeURIComponent('Name and email are required')}`)
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    redirect(`/register?error=${encodeURIComponent('Invalid email address')}`)
  }

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing?.profileComplete) {
    redirect(`/register?error=${encodeURIComponent('Account already exists. Please log in.')}`)
  }

  const otp = generateOtp()
  const user = await saveOtp(email, otp)

  const updateData: { fullName?: string; referredById?: string } = {}
  if (user.fullName !== fullName) updateData.fullName = fullName

  if (referralCode && !user.referredById) {
    const referrer = await prisma.user.findUnique({ where: { referralCode } })
    if (referrer && (referrer.role === 'advisor' || referrer.role === 'master_agent')) {
      updateData.referredById = referrer.id
    }
  }

  if (Object.keys(updateData).length > 0) {
    await prisma.user.update({ where: { id: user.id }, data: updateData })
  }

  await sendOtpEmail(email, otp)

  redirect(`/verify-otp?email=${encodeURIComponent(email)}`)
}

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* <h1 style={styles.logo}>Subhobibaho</h1> */}
         <div className="flex items-center justify-center mb-4">
          <Link href="/" style={styles.brand}>
            <Image src="/logo.jpeg" alt="Subhobibaho" width={160} height={50} />
          </Link>
        </div>
        <p style={styles.tagline}>Create your account</p>

        <form action={registerAction} style={styles.form}>
          <label style={styles.label}>Full Name</label>
          <input name="fullName" type="text" required style={styles.input} />

          <label style={styles.label}>Email</label>
          <input name="email" type="email" required style={styles.input} />

          <label style={styles.label}>Referral Code (optional)</label>
          <input name="referralCode" type="text" style={{ ...styles.input, textTransform: 'uppercase' }} />

          {error && <p style={styles.error}>{error}</p>}

          <button type="submit" style={styles.button}>Continue</button>
        </form>

        <p style={styles.footerText}>
          Already have an account? <a href="/login" style={styles.link}>Log in</a>
        </p>
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff0f3', fontFamily: 'system-ui, sans-serif', backgroundImage: "url('/redbg.jpg')", },
  card: { backgroundColor: '#ffffff', borderRadius: 20, padding: 32, width: 380, boxShadow: '0 8px 24px rgba(214,51,108,0.1)' },
  logo: { color: '#d6336c', fontSize: 28, fontWeight: 700, textAlign: 'center', margin: 0 },
  tagline: { color: '#a56478', textAlign: 'center', marginTop: 6, marginBottom: 20, fontSize: 14 },
  form: { display: 'flex', flexDirection: 'column', gap: 4, color: '#a5486a', marginTop: 10 },
  label: { fontSize: 13, fontWeight: 600, color: '#a5486a', marginTop: 12 },
  input: { padding: '10px 12px', borderRadius: 10, border: '1px solid #f6c6d4', fontSize: 14, marginTop: 4 },
  error: { color: '#e03131', fontSize: 13, marginTop: 12, textAlign: 'center' },
  button: { marginTop: 20, padding: 13, borderRadius: 12, border: 'none', backgroundColor: '#d6336c', color: '#fff', fontWeight: 700, fontSize: 15, cursor: 'pointer' },
  footerText: { textAlign: 'center', fontSize: 13, color: '#8a5464', marginTop: 18 },
  link: { color: '#d6336c', fontWeight: 700, textDecoration: 'none' },
}