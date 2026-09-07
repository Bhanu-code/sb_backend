// app/(web)/contact/page.tsx
import { Mail, Phone, MapPin } from 'lucide-react'
import ContactForm from './ContactForm'

export default function ContactPage() {
  return (
    <div style={styles.page}>
      <section style={styles.hero}>
        <h1 style={styles.heroTitle}>Get in Touch</h1>
        <p style={styles.heroSubtitle}>
          Have a question, feedback, or need help with your account? We'd love to hear from you.
        </p>
      </section>

      <section style={styles.contentSection}>
        <div style={styles.infoCol}>
          <ContactInfoRow icon={<Mail size={20} color="#d6336c" />} label="Email" value="support@subhobibaho.com" />
          <ContactInfoRow icon={<Phone size={20} color="#d6336c" />} label="Phone" value="+91 98765 43210" />
          <ContactInfoRow icon={<MapPin size={20} color="#d6336c" />} label="Address" value="Kolkata, West Bengal, India" />
        </div>

        <ContactForm />
      </section>
    </div>
  )
}

function ContactInfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div style={styles.infoRow}>
      <div style={styles.infoIconWrap}>{icon}</div>
      <div>
        <p style={styles.infoLabel}>{label}</p>
        <p style={styles.infoValue}>{value}</p>
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  page: { backgroundColor: '#fff0f3', fontFamily: 'system-ui, sans-serif', minHeight: '100vh' },
  hero: { textAlign: 'center', padding: '70px 24px 40px', maxWidth: 640, margin: '0 auto' },
  heroTitle: { fontSize: 36, fontWeight: 800, color: '#5c2a3a', margin: '0 0 14px' },
  heroSubtitle: { fontSize: 15, color: '#8a5464', lineHeight: 1.6, margin: 0 },
  contentSection: {
    display: 'grid',
    gridTemplateColumns: 'minmax(220px, 1fr) minmax(320px, 1.4fr)',
    gap: 40,
    maxWidth: 1000,
    margin: '0 auto',
    padding: '0 24px 80px',
  },
  infoCol: { display: 'flex', flexDirection: 'column' as const, gap: 24 },
  infoRow: { display: 'flex', alignItems: 'flex-start', gap: 14 },
  infoIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  infoLabel: { fontSize: 12, color: '#a5486a', fontWeight: 600, margin: 0 },
  infoValue: { fontSize: 14, color: '#5c2a3a', fontWeight: 600, margin: '2px 0 0' },
}