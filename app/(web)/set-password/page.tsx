// app/(web)/set-password/page.tsx
import { redirect } from 'next/navigation'
import { getWebSessionUser } from '@/lib/webSession'
import { hashPassword } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

async function setPasswordAction(formData: FormData) {
  'use server'

  const user = await getWebSessionUser()
  if (!user) redirect('/login')

  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string

  if (password.length < 8) {
    redirect(`/set-password?error=${encodeURIComponent('Password must be at least 8 characters')}`)
  }
  if (password !== confirmPassword) {
    redirect(`/set-password?error=${encodeURIComponent('Passwords do not match')}`)
  }

  const passwordHash = await hashPassword(password)
  await prisma.user.update({ where: { id: user!.id }, data: { passwordHash } })

  redirect('/onboarding')
}

export default async function SetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Set your password</h1>
        <p style={styles.subtitle}>Almost done! Choose a secure password.</p>

        <form action={setPasswordAction} style={styles.form}>
          <label style={styles.label}>Password</label>
          <input name="password" type="password" required style={styles.input} />

          <label style={styles.label}>Confirm Password</label>
          <input name="confirmPassword" type="password" required style={styles.input} />

          {error && <p style={styles.error}>{error}</p>}

          <button type="submit" style={styles.button}>Continue</button>
        </form>
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff0f3', fontFamily: 'system-ui, sans-serif', backgroundImage: "url('/redbg.jpg')", },
  card: { backgroundColor: '#ffffff', borderRadius: 20, padding: 32, width: 380, boxShadow: '0 8px 24px rgba(214,51,108,0.1)' },
  title: { color: '#d6336c', fontSize: 22, fontWeight: 700, textAlign: 'center', margin: 0 },
  subtitle: { color: '#a56478', fontSize: 14, textAlign: 'center', marginTop: 8 },
  form: { display: 'flex', flexDirection: 'column', gap: 4, marginTop: 20, color: '#a5486a', },
  label: { fontSize: 13, fontWeight: 600, color: '#a5486a', marginTop: 12 },
  input: { padding: '10px 12px', borderRadius: 10, border: '1px solid #f6c6d4', fontSize: 14, marginTop: 4 },
  error: { color: '#e03131', fontSize: 13, marginTop: 12, textAlign: 'center' },
  button: { marginTop: 20, padding: 13, borderRadius: 12, border: 'none', backgroundColor: '#d6336c', color: '#fff', fontWeight: 700, fontSize: 15, cursor: 'pointer' },
}