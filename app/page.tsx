// app/(web)/page.tsx
import { redirect } from 'next/navigation'
import { getWebSessionUser } from '@/lib/webSession'
import {
  Sparkles,
  ShieldCheck,
  MessageCircle,
  Target,
  Star,
  
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

const TESTIMONIALS = [
  {
    name: 'Priya & Arjun',
    location: 'Kolkata',
    quote:
      'We found each other through Subhobibaho\'s education-based matching. Six months later, we\'re getting married.',
  },
  {
    name: 'Ritika & Debashish',
    location: 'Mumbai',
    quote:
      'The verified profiles gave our families real confidence. What started as a chat turned into a lifelong partnership.',
  },
  {
    name: 'Sneha & Rohan',
    location: 'Bangalore',
    quote:
      'I loved being able to filter by profession and community. It made the search feel personal, not overwhelming.',
  },
]

export default async function LandingPage() {
  const user = await getWebSessionUser()
  if (user) {
    redirect(user.profileComplete ? '/matches' : '/onboarding')
  }

  return (
    <div style={styles.page}>
      <nav style={styles.nav}>
        {/* <span style={styles.brand}>Subhobibaho</span> */}
        <div className="flex items-center justify-center mb-4">
          <Link href="/" style={styles.brand}>
            <Image src="/logo.jpeg" alt="Subhobibaho" width={160} height={50} />
          </Link>
        </div>
        <div style={styles.navLinks}>
          <a href="/login" style={styles.navLink}>Log In</a>
          <a href="/register" style={styles.navCta}>Sign Up</a>
        </div>
      </nav>

      {/* Hero */}
      <section style={styles.hero}>
        <div className="flex items-center justify-center mb-4">
          <Link href="/" style={styles.brand}>
            <Image src="/logo.jpeg" alt="Subhobibaho" width={300} height={100} />
          </Link>
        </div>
        <h1 style={styles.heroTitle}>Find your perfect life partner</h1>
        <p style={styles.heroSubtitle}>
          Join thousands of families who trust Subhobibaho to find meaningful,
          lasting matches — verified profiles, real matching, real connections.
        </p>
        <div style={styles.heroButtons}>
          <a href="/register" style={styles.primaryButton}>Get Started Free</a>
          <a href="/login" style={styles.secondaryButton}>I already have an account</a>
        </div>
      </section>

      {/* Why Us */}
      <section style={styles.features}>
        <h2 style={styles.sectionTitle}>Why Subhobibaho</h2>
        <p style={styles.sectionSubtitle}>
          Built for people who want a serious, safe, and thoughtful way to find a partner.
        </p>
        <div style={styles.featureGrid}>
          <FeatureCard
            icon={<Sparkles size={26} color="#d6336c" />}
            title="Smart Matching"
            description="Discover matches by education, profession, location, or community — not just endless swiping."
          />
          <FeatureCard
            icon={<ShieldCheck size={26} color="#d6336c" />}
            title="Verified Profiles"
            description="Email verification and profile completeness checks help keep the community genuine."
          />
          <FeatureCard
            icon={<MessageCircle size={26} color="#d6336c" />}
            title="Real Conversations"
            description="Once you're matched, chat directly — no games, no guesswork."
          />
          <FeatureCard
            icon={<Target size={26} color="#d6336c" />}
            title="Your Preferences First"
            description="Set your partner preferences during onboarding and we'll surface matches that fit."
          />
        </div>
      </section>

      {/* How it works */}
      <section style={styles.howItWorks}>
        <h2 style={styles.sectionTitle}>How it works</h2>
        <div style={styles.stepsRow}>
          <Step number={1} title="Create your profile" description="Tell us about yourself and what you're looking for." />
          <Step number={2} title="Discover matches" description="Browse profiles by category, or let us recommend for you." />
          <Step number={3} title="Send interest" description="Show interest in profiles you like — they'll be notified." />
          <Step number={4} title="Start chatting" description="Once matched, connect directly and get to know each other." />
        </div>
      </section>

      {/* Testimonials */}
      <section style={styles.testimonials}>
        <h2 style={styles.sectionTitle}>Real stories, real matches</h2>
        <p style={styles.sectionSubtitle}>Couples who found each other on Subhobibaho</p>
        <div style={styles.testimonialGrid}>
          {TESTIMONIALS.map((t, i) => (
            <div key={i} style={styles.testimonialCard}>
              <div style={styles.starsRow}>
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} size={16} color="#d6336c" fill="#d6336c" />
                ))}
              </div>
              <p style={styles.testimonialQuote}>"{t.quote}"</p>
              <p style={styles.testimonialName}>{t.name}</p>
              <p style={styles.testimonialLocation}>{t.location}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section style={styles.finalCta}>
        <h2 style={styles.finalCtaTitle}>Ready to begin your journey?</h2>
        <a href="/register" style={styles.primaryButton}>Create Your Free Profile</a>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerTop}>
          <div style={styles.footerBrandCol}>
            <span style={styles.footerBrand}>Subhobibaho</span>
            <p style={styles.footerTagline}>Helping families find meaningful matches since day one.</p>
            <div style={styles.socialRow}>
              {/* <a href="#" aria-label="Facebook" style={styles.socialIcon}><Facebook size={18} /></a>
              <a href="#" aria-label="Instagram" style={styles.socialIcon}><Instagram size={18} /></a>
              <a href="#" aria-label="Twitter" style={styles.socialIcon}><Twitter size={18} /></a>
              <a href="#" aria-label="YouTube" style={styles.socialIcon}><Youtube size={18} /></a> */}
            </div>
          </div>

          <div style={styles.footerCol}>
            <p style={styles.footerColTitle}>Company</p>
            <a href="/about" style={styles.footerLink}>About Us</a>
            <a href="/contact" style={styles.footerLink}>Contact</a>
            <a href="/careers" style={styles.footerLink}>Careers</a>
          </div>

          <div style={styles.footerCol}>
            <p style={styles.footerColTitle}>Account</p>
            <a href="/login" style={styles.footerLink}>Log In</a>
            <a href="/register" style={styles.footerLink}>Sign Up</a>
            <a href="/forgot-password" style={styles.footerLink}>Forgot Password</a>
          </div>

          <div style={styles.footerCol}>
            <p style={styles.footerColTitle}>Legal</p>
            <a href="#" style={styles.footerLink}>Privacy Policy</a>
            <a href="#" style={styles.footerLink}>Terms of Service</a>
          </div>
        </div>

        <div style={styles.footerBottom}>
          <p style={styles.footerCopyright}>© {new Date().getFullYear()} Subhobibaho. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div style={styles.featureCard}>
      <div style={styles.featureIconWrap}>{icon}</div>
      <h3 style={styles.featureTitle}>{title}</h3>
      <p style={styles.featureDescription}>{description}</p>
    </div>
  )
}

function Step({ number, title, description }: { number: number; title: string; description: string }) {
  return (
    <div style={styles.step}>
      <div style={styles.stepNumber}>{number}</div>
      <h3 style={styles.stepTitle}>{title}</h3>
      <p style={styles.stepDescription}>{description}</p>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  page: { backgroundColor: '#fff0f3', fontFamily: 'system-ui, sans-serif', minHeight: '100vh' },
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '18px 40px',
  },
  brand: { color: '#d6336c', fontWeight: 800, fontSize: 22, letterSpacing: 0.3 },
  navLinks: { display: 'flex', alignItems: 'center', gap: 16 },
  navLink: { color: '#5c2a3a', fontWeight: 600, fontSize: 14, textDecoration: 'none' },
  navCta: {
    padding: '9px 20px',
    borderRadius: 10,
    backgroundColor: '#d6336c',
    color: '#ffffff',
    fontWeight: 700,
    fontSize: 14,
    textDecoration: 'none',
  },
  hero: {
    textAlign: 'center',
    padding: '80px 24px 60px',
    maxWidth: 720,
    margin: '0 auto',
  },
  heroTitle: { fontSize: 42, fontWeight: 800, color: '#5c2a3a', margin: '0 0 18px', lineHeight: 1.2 },
  heroSubtitle: { fontSize: 17, color: '#8a5464', lineHeight: 1.6, margin: '0 0 32px' },
  heroButtons: { display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' as const },
  primaryButton: {
    padding: '14px 30px',
    borderRadius: 14,
    backgroundColor: '#d6336c',
    color: '#ffffff',
    fontWeight: 700,
    fontSize: 15,
    textDecoration: 'none',
    boxShadow: '0 8px 20px rgba(214,51,108,0.25)',
  },
  secondaryButton: {
    padding: '14px 30px',
    borderRadius: 14,
    backgroundColor: '#ffffff',
    color: '#a5486a',
    fontWeight: 600,
    fontSize: 15,
    textDecoration: 'none',
    border: '1px solid #f6c6d4',
  },
  features: { padding: '50px 24px 60px', maxWidth: 1100, margin: '0 auto' },
  sectionTitle: { fontSize: 28, fontWeight: 800, color: '#5c2a3a', textAlign: 'center', margin: '0 0 8px' },
  sectionSubtitle: { fontSize: 14, color: '#a5486a', textAlign: 'center', margin: '0 0 36px' },
  featureGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: 24,
  },
  featureCard: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 28,
    textAlign: 'center',
    boxShadow: '0 4px 16px rgba(214,51,108,0.06)',
  },
  featureIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#fce8ee',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 16px',
  },
  featureTitle: { fontSize: 16, fontWeight: 700, color: '#5c2a3a', margin: '0 0 8px' },
  featureDescription: { fontSize: 13, color: '#8a5464', lineHeight: 1.5, margin: 0 },
  howItWorks: { padding: '60px 24px', backgroundColor: '#ffffff' },
  stepsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: 28,
    maxWidth: 1100,
    margin: '0 auto',
  },
  step: { textAlign: 'center' },
  stepNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#d6336c',
    color: '#ffffff',
    fontWeight: 800,
    fontSize: 16,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 14px',
  },
  stepTitle: { fontSize: 15, fontWeight: 700, color: '#5c2a3a', margin: '0 0 6px' },
  stepDescription: { fontSize: 13, color: '#8a5464', lineHeight: 1.5, margin: 0 },
  testimonials: { padding: '60px 24px', maxWidth: 1100, margin: '0 auto' },
  testimonialGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: 24,
  },
  testimonialCard: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 26,
    boxShadow: '0 4px 16px rgba(214,51,108,0.06)',
  },
  starsRow: { display: 'flex', gap: 3, marginBottom: 14 },
  testimonialQuote: { fontSize: 14, color: '#5c2a3a', lineHeight: 1.6, margin: '0 0 18px', fontStyle: 'italic' },
  testimonialName: { fontSize: 14, fontWeight: 700, color: '#5c2a3a', margin: 0 },
  testimonialLocation: { fontSize: 12, color: '#a5486a', margin: '2px 0 0' },
  finalCta: { textAlign: 'center', padding: '70px 24px' },
  finalCtaTitle: { fontSize: 26, fontWeight: 800, color: '#5c2a3a', marginBottom: 24 },
  footer: { backgroundColor: '#ffffff', borderTop: '1px solid #f6c6d4', padding: '48px 40px 24px' },
  footerTop: {
    display: 'grid',
    gridTemplateColumns: 'minmax(220px, 1.5fr) repeat(3, 1fr)',
    gap: 32,
    maxWidth: 1100,
    margin: '0 auto',
    paddingBottom: 32,
  },
  footerBrandCol: { display: 'flex', flexDirection: 'column' as const, gap: 10 },
  footerBrand: { color: '#d6336c', fontWeight: 800, fontSize: 18 },
  footerTagline: { fontSize: 13, color: '#8a5464', lineHeight: 1.5, margin: 0, maxWidth: 240 },
  socialRow: { display: 'flex', gap: 10, marginTop: 8 },
  socialIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#fce8ee',
    color: '#d6336c',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textDecoration: 'none',
  },
  footerCol: { display: 'flex', flexDirection: 'column' as const, gap: 10 },
  footerColTitle: { fontSize: 13, fontWeight: 700, color: '#5c2a3a', margin: '0 0 4px' },
  footerLink: { fontSize: 13, color: '#8a5464', textDecoration: 'none' },
  footerBottom: {
    borderTop: '1px solid #f6c6d4',
    paddingTop: 20,
    maxWidth: 1100,
    margin: '0 auto',
  },
  footerCopyright: { fontSize: 12, color: '#a5486a', margin: 0, textAlign: 'center' },
}