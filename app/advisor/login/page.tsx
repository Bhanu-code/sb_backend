// app/advisor/login/page.tsx
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { comparePassword } from '@/lib/auth'
import { createWebSession } from '@/lib/webSession'
import Image from 'next/image'
import Link from 'next/link'

async function loginAction(formData: FormData) {
  'use server'

  const email = (formData.get('email') as string)?.trim()
  const password = formData.get('password') as string

  if (!email || !password) {
    redirect(`/advisor/login?error=${encodeURIComponent('Please enter your email and password')}`)
  }

  const user = await prisma.user.findUnique({ where: { email } })

  if (!user || !user.passwordHash) {
    redirect(`/advisor/login?error=${encodeURIComponent('Invalid email or password')}`)
  }

  if (user!.role !== 'advisor' && user!.role !== 'master_agent') {
    redirect(`/advisor/login?error=${encodeURIComponent('This portal is for advisors only')}`)
  }

  const validPassword = await comparePassword(password, user!.passwordHash!)
  if (!validPassword) {
    redirect(`/advisor/login?error=${encodeURIComponent('Invalid email or password')}`)
  }

  await createWebSession(user!.id)
  redirect('/advisor/dashboard')
}

export default async function AdvisorLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* <h1 style={styles.logo}>Subhobibaho Partners</h1> */}
         <div className="flex items-center justify-center mb-4">
            <Link href="/" style={styles.brand}>
              <Image
                src="/logo.jpeg"
                alt="Subhobibaho"
                width={200}
                height={60}
              />
            </Link>
          </div>
        <p style={styles.tagline}>Advisor Portal</p>

        <form action={loginAction} style={styles.form}>
          <label style={styles.label}>Email</label>
          <input name="email" type="email" required style={styles.input} />

          <label style={styles.label}>Password</label>
          <input name="password" type="password" required style={styles.input} />

          {error && <p style={styles.error}>{error}</p>}

          <button type="submit" style={styles.button}>Log In</button>
        </form>

        <p style={styles.footerText}>
          New advisor? <a href="/advisor/register" style={styles.link}>Register</a>
        </p>
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff0f3', fontFamily: 'system-ui, sans-serif', backgroundImage: 'url("/redbg.jpg")', backgroundSize: 'cover', backgroundPosition: 'center'     },
  card: { backgroundColor: '#ffffff', borderRadius: 20, padding: 32, width: 380, boxShadow: '0 8px 24px rgba(214,51,108,0.1)' },
  logo: { color: '#d6336c', fontSize: 24, fontWeight: 700, textAlign: 'center', margin: 0 },
  tagline: { color: '#a56478', textAlign: 'center', marginTop: 6, marginBottom: 20, fontSize: 13 },
  form: { display: 'flex', flexDirection: 'column', gap: 4, color: '#a5486a', marginTop: 10 },
  label: { fontSize: 13, fontWeight: 600, color: '#a5486a', marginTop: 12 },
  input: { padding: '10px 12px', borderRadius: 10, border: '1px solid #f6c6d4', fontSize: 14, marginTop: 4 },
  error: { color: '#e03131', fontSize: 13, marginTop: 12, textAlign: 'center' },
  button: { marginTop: 20, padding: 13, borderRadius: 12, border: 'none', backgroundColor: '#d6336c', color: '#fff', fontWeight: 700, fontSize: 15, cursor: 'pointer' },
  footerText: { textAlign: 'center', fontSize: 13, color: '#8a5464', marginTop: 18 },
  link: { color: '#d6336c', fontWeight: 700, textDecoration: 'none' },
}