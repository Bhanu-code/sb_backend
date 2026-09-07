// app/(web)/about/page.tsx
import { Heart, Users, ShieldCheck, Sparkles } from 'lucide-react'

export default function AboutPage() {
  return (
    <div style={styles.page}>
      <section style={styles.hero}>
        <h1 style={styles.heroTitle}>About Subhobibaho</h1>
        <p style={styles.heroSubtitle}>
          We believe finding a life partner should feel personal, safe, and meaningful —
          not like scrolling through an endless catalog.
        </p>
      </section>

      <section style={styles.storySection}>
        <h2 style={styles.sectionTitle}>Our Story</h2>
        <p style={styles.bodyText}>
          Subhobibaho was built on a simple idea: matrimony matching should honor both
          tradition and the way people actually connect today. We wanted to create a
          platform where families could trust the process, where profiles are genuine,
          and where the search for a partner feels guided rather than overwhelming.
        </p>
        <p style={styles.bodyText}>
          What started as a small idea has grown into a platform trusted by thousands of
          families across the country, each with their own story of how they found each
          other through thoughtful, values-based matching.
        </p>
      </section>

      <section style={styles.valuesSection}>
        <h2 style={styles.sectionTitle}>What We Stand For</h2>
        <div style={styles.valuesGrid}>
          <ValueCard
            icon={<ShieldCheck size={26} color="#d6336c" />}
            title="Trust & Safety"
            description="Verified profiles and careful moderation so every connection starts on solid ground."
          />
          <ValueCard
            icon={<Heart size={26} color="#d6336c" />}
            title="Genuine Connection"
            description="We prioritize compatibility over quantity — quality matches, not endless options."
          />
          <ValueCard
            icon={<Users size={26} color="#d6336c" />}
            title="Family-Centered"
            description="We understand matrimony is a family journey, not just an individual one."
          />
          <ValueCard
            icon={<Sparkles size={26} color="#d6336c" />}
            title="Thoughtful Technology"
            description="Smart matching by education, profession, and community — built to serve real relationships."
          />
        </div>
      </section>

      <section style={styles.finalCta}>
        <h2 style={styles.finalCtaTitle}>Join our growing community</h2>
        <a href="/register" style={styles.primaryButton}>Create Your Free Profile</a>
      </section>
    </div>
  )
}

function ValueCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div style={styles.valueCard}>
      <div style={styles.valueIconWrap}>{icon}</div>
      <h3 style={styles.valueTitle}>{title}</h3>
      <p style={styles.valueDescription}>{description}</p>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  page: { backgroundColor: '#fff0f3', fontFamily: 'system-ui, sans-serif', minHeight: '100vh' },
  hero: { textAlign: 'center', padding: '70px 24px 50px', maxWidth: 720, margin: '0 auto' },
  heroTitle: { fontSize: 38, fontWeight: 800, color: '#5c2a3a', margin: '0 0 16px' },
  heroSubtitle: { fontSize: 16, color: '#8a5464', lineHeight: 1.6, margin: 0 },
  storySection: { padding: '20px 24px 60px', maxWidth: 720, margin: '0 auto' },
  sectionTitle: { fontSize: 26, fontWeight: 800, color: '#5c2a3a', textAlign: 'center', margin: '0 0 24px' },
  bodyText: { fontSize: 15, color: '#5c2a3a', lineHeight: 1.7, marginBottom: 16 },
  valuesSection: { padding: '50px 24px', backgroundColor: '#ffffff' },
  valuesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: 24,
    maxWidth: 1100,
    margin: '0 auto',
  },
  valueCard: { textAlign: 'center', padding: 20 },
  valueIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#fce8ee',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 16px',
  },
  valueTitle: { fontSize: 16, fontWeight: 700, color: '#5c2a3a', margin: '0 0 8px' },
  valueDescription: { fontSize: 13, color: '#8a5464', lineHeight: 1.5, margin: 0 },
  finalCta: { textAlign: 'center', padding: '70px 24px' },
  finalCtaTitle: { fontSize: 26, fontWeight: 800, color: '#5c2a3a', marginBottom: 24 },
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
}