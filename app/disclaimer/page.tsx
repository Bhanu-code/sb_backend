// app/(web)/disclaimer/page.tsx

export default function DisclaimerPage() {
  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>Disclaimer of Authenticity & Liability</h1>
        <p style={styles.companyLine}><Highlight>Subhobibaho.com Private Limited</Highlight></p>
        <p style={styles.metaLine}>CIN: <Highlight>U93290WR2026PTC292647</Highlight></p>
        <p style={styles.metaLine}>
          Registered Office: H.No.582/B/537, Ward No.35, Talbagicha, Kharagpur, West Midnapore - 721306, West Bengal, India
        </p>

        <Section number={1} title="Status as an Intermediary">
          <p style={styles.paragraph}>
            Subhobibaho.com operates strictly as an online platform and{' '}
            <Highlight>intermediary under Section 2(1)(w) of the Information Technology Act, 2000</Highlight>.
            We provide an advertising and matchmaking venue for Users (Customers) to display their
            profiles to other prospective members.{' '}
            <Highlight>We do not act as an agent, matchmaker with legal accountability, or broker</Highlight>{' '}
            for any user alliance.
          </p>
        </Section>

        <Section number={2} title="No Guarantee of Profile Authenticity">
          <BulletItem
            label="User-Generated Content"
            text="All information, text, photographs, career details, family backgrounds, and horoscopes displayed on profiles are uploaded directly by the users themselves."
          />
          <BulletItem
            label="Limited Screening"
            text={<>While Subhobibaho.com employs internal moderation filters and verification badges (e.g., identity checks by Managers or Advisors), <Highlight>the company does not explicitly guarantee, warrant, or endorse the absolute truth, accuracy, or completeness of any user credentials</Highlight>.</>}
          />
          <BulletItem
            label="Independent Verification Mandatory"
            text={<>It is the <Highlight>sole responsibility of the Customer and their family</Highlight> to independently verify, audit, and investigate the background, character, medical status, marital history, and financial standing of any prospective match before entering into a marriage alliance.</>}
          />
        </Section>

        <Section number={3} title="Exclusions of Liability">
          <p style={styles.paragraph}>
            Subhobibaho.com Private Limited, its directors, employees, Managers, and Advisors{' '}
            <Highlight>shall not be held liable or legally responsible</Highlight> for:
          </p>

          <div style={styles.exclusionGrid}>
            <ExclusionCard
              title="Misrepresentation"
              text="Any false information, fake profiles, or fraudulent claims made by a member regarding their age, income, education, or marital status."
            />
            <ExclusionCard
              title="Financial Fraud"
              text={<>Any monetary loss resulting from users entering into private financial transactions, loans, or transfers with other members. <em>(The platform strictly prohibits giving or receiving money from other users.)</em></>}
            />
            <ExclusionCard
              title="Interpersonal Conflicts"
              text="Any emotional distress, physical harm, character defamation, or post-marriage disputes arising from interactions or marriages arranged through the platform."
            />
            <ExclusionCard
              title="Technical Disruptions"
              text="Any data loss, service downtime, or temporary platform unavailability caused by server maintenance or cyber-attacks."
            />
          </div>
        </Section>

        <Section number={4} title="Advisor and Consultation Disclaimer">
          <p style={styles.paragraph}>
            Any advice, compatibility analysis, or match suggestions provided by assigned Advisors
            (Matchmakers) are <Highlight>purely subjective opinions intended as secondary
            recommendations</Highlight>. Customers are not bound to follow Advisor suggestions, and{' '}
            <Highlight>the company is not responsible for the outcome of any match recommended by an
            Advisor</Highlight>.
          </p>
        </Section>

        <Section number={5} title="Third-Party Links and Services">
          <p style={styles.paragraph}>
            The platform may feature external links to third-party services (such as background check
            agencies, astrologers, or wedding vendors).{' '}
            <Highlight>Subhobibaho.com does not control or endorse these third parties and holds no
            liability for services purchased from them.</Highlight>
          </p>
        </Section>

        <Section number={6} title="Legal Jurisdiction">
          <p style={styles.paragraph}>
            By accessing or registering on Subhobibaho.com, you explicitly agree that any legal
            recourse, claims, or lawsuits against the company regarding the authenticity of profiles
            or operational liabilities shall be strictly subject to the exclusive jurisdiction of the{' '}
            <Highlight>courts located in Paschim Medinipur District Court, West Bengal, India</Highlight>.
          </p>
        </Section>
      </div>
    </div>
  )
}

function Highlight({ children }: { children: React.ReactNode }) {
  return <span style={styles.highlight}>{children}</span>
}

function Section({ number, title, children }: { number: number; title: string; children: React.ReactNode }) {
  return (
    <section style={styles.section}>
      <h2 style={styles.sectionTitle}>{number}. {title}</h2>
      {children}
    </section>
  )
}

function BulletItem({ label, text }: { label: string; text: React.ReactNode }) {
  return (
    <div style={styles.bulletItem}>
      <p style={styles.bulletLabel}>{label}</p>
      <p style={styles.bulletText}>{text}</p>
    </div>
  )
}

function ExclusionCard({ title, text }: { title: string; text: React.ReactNode }) {
  return (
    <div style={styles.exclusionCard}>
      <p style={styles.exclusionTitle}>{title}</p>
      <p style={styles.exclusionText}>{text}</p>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  page: { backgroundColor: '#fff0f3', fontFamily: 'system-ui, sans-serif', minHeight: '100vh', padding: '50px 24px' },
  container: { maxWidth: 800, margin: '0 auto', backgroundColor: '#ffffff', borderRadius: 20, padding: '44px 40px', boxShadow: '0 4px 20px rgba(214,51,108,0.08)' },
  title: { fontSize: 26, fontWeight: 800, color: '#5c2a3a', margin: '0 0 16px' },
  companyLine: { fontSize: 15, color: '#5c2a3a', margin: '0 0 4px' },
  metaLine: { fontSize: 13, color: '#8a5464', margin: '2px 0' },
  section: { marginTop: 32, marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: 700, color: '#d6336c', margin: '0 0 14px', borderBottom: '2px solid #f6c6d4', paddingBottom: 10 },
  paragraph: { fontSize: 14, color: '#5c2a3a', lineHeight: 1.7, margin: '0 0 10px' },
  bulletItem: { marginBottom: 12, paddingLeft: 16, borderLeft: '3px solid #fce8ee' },
  bulletLabel: { fontSize: 13, fontWeight: 700, color: '#5c2a3a', margin: '0 0 3px' },
  bulletText: { fontSize: 13, color: '#5c2a3a', lineHeight: 1.6, margin: 0 },
  highlight: { backgroundColor: '#fce8ee', color: '#d6336c', fontWeight: 700, padding: '1px 5px', borderRadius: 4 },
  exclusionGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, marginTop: 16 },
  exclusionCard: { backgroundColor: '#fce8e8', borderRadius: 14, padding: '16px 18px', borderLeft: '4px solid #e03131' },
  exclusionTitle: { fontSize: 13, fontWeight: 800, color: '#c0392b', margin: '0 0 6px' },
  exclusionText: { fontSize: 12, color: '#5c2a3a', lineHeight: 1.6, margin: 0 },
}