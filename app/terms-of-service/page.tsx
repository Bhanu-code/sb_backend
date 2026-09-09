// app/(web)/terms-of-service/page.tsx
'use client'

import { useState } from 'react'

type Tab = 'customer' | 'advisor' | 'manager' | 'general'

export default function TermsOfServicePage() {
  const [activeTab, setActiveTab] = useState<Tab>('customer')

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>Terms of Service</h1>
        <p style={styles.companyLine}><Highlight>Subhobibaho.com Private Limited</Highlight></p>
        <p style={styles.metaLine}>CIN: <Highlight>U93290WR2026PTC292647</Highlight></p>
        <p style={styles.metaLine}>
          Registered Office: H.No.582/B/537, Ward No.35, Talbagicha, Kharagpur, West Midnapore - 721306, West Bengal, India
        </p>

        <div style={styles.tabsRow}>
          <TabButton active={activeTab === 'customer'} onClick={() => setActiveTab('customer')}>Customer</TabButton>
          <TabButton active={activeTab === 'advisor'} onClick={() => setActiveTab('advisor')}>Advisor</TabButton>
          <TabButton active={activeTab === 'manager'} onClick={() => setActiveTab('manager')}>Manager</TabButton>
          <TabButton active={activeTab === 'general'} onClick={() => setActiveTab('general')}>General & Legal</TabButton>
        </div>

        {activeTab === 'customer' && <CustomerTerms />}
        {activeTab === 'advisor' && <AdvisorTerms />}
        {activeTab === 'manager' && <ManagerTerms />}
        {activeTab === 'general' && <GeneralTerms />}
      </div>
    </div>
  )
}

function CustomerTerms() {
  return (
    <Section number={1} title="Customer (User) Terms of Service">
      <SubHeading>Acceptance & Legal Compliance</SubHeading>
      <p style={styles.paragraph}>
        By registering, accessing, or using Subhobibaho.com, you agree to these legally binding Terms.
      </p>
      <p style={styles.paragraph}>
        This document is published in compliance with the{' '}
        <Highlight>Information Technology Act, 2000 and Intermediary Guidelines</Highlight>.
      </p>
      <p style={styles.paragraph}>
        The platform functions strictly as an <Highlight>Intermediary</Highlight> providing matchmaking
        and advertising services.
      </p>

      <SubHeading>Eligibility Criteria</SubHeading>
      <BulletItem
        label="Age Requirements"
        text={<><Highlight>18 years for females and 21 years for males</Highlight> is the minimum age for registration.</>}
      />
      <BulletItem
        label="Marital Status"
        text={
          <>
            You must be legally single, widowed, or judicially divorced. If a divorce is pending, the
            user must explicitly list their status as <Highlight>"Awaiting Divorce"</Highlight>.
          </>
        }
      />

      <SubHeading>Account Security & Verification</SubHeading>
      <p style={styles.paragraph}>
        Users must provide accurate, current, and verifiable information during registration.
      </p>
      <p style={styles.paragraph}>
        You are solely responsible for maintaining the confidentiality of your login credentials.
      </p>
      <p style={styles.paragraph}>
        The platform reserves the right to request official identification documents (
        <Highlight>Aadhar, PAN, Passport</Highlight>) for profile verification.
      </p>

      <SubHeading>Code of Conduct & Safety Guidelines</SubHeading>
      <BulletItem
        label="No Financial Transactions"
        text={<><Highlight>Customers are strictly prohibited from entering into financial transactions or sending money</Highlight> to other members.</>}
      />
      <BulletItem
        label="Profile Authenticity"
        text={
          <>
            Uploaded photographs must be recent (<Highlight>less than 3 months old</Highlight>) and
            genuine. <Highlight>AI-generated or modified images are strictly prohibited.</Highlight>
          </>
        }
      />
      <BulletItem
        label="Prohibited Behaviour"
        text={
          <>
            Misusing the site for dating, flirting, commercial exploitation, harassment, or using
            abusive language will lead to an <Highlight>immediate ban</Highlight>.
          </>
        }
      />
      <BulletItem
        label="Credential Verification"
        text="Customers are solely responsible for verifying the background, character, and claims of prospective matches before entering into a marriage alliance."
      />

      <SubHeading>Payments, Renewals, & Refunds</SubHeading>
      <p style={styles.paragraph}>
        All subscription, premium package, and registration fees paid to the platform are{' '}
        <Highlight>non-refundable</Highlight>.
      </p>
      <p style={styles.paragraph}>
        Packages cannot be transferred, assigned, or adjusted against other services.
      </p>
    </Section>
  )
}

function AdvisorTerms() {
  return (
    <Section number={2} title="Advisor (Matchmaker/Consultant) Terms of Service">
      <SubHeading>Scope of Engagement</SubHeading>
      <p style={styles.paragraph}>
        Advisors function as <Highlight>independent contractors</Highlight> or designated service
        professionals assisting customers in finding appropriate matches.
      </p>
      <p style={styles.paragraph}>
        Access to the Advisor Dashboard is limited strictly to facilitating legitimate matrimonial
        match-making services.
      </p>

      <SubHeading>Confidentiality & Data Privacy</SubHeading>
      <p style={styles.paragraph}>
        Advisors will have access to sensitive customer data, including contact information,
        horoscopes, family backgrounds, and photographs.
      </p>
      <BulletItem
        label="Non-Disclosure"
        text={<><Highlight>Advisors must not download, screenshot, leak, or share customer data</Highlight> outside the platform ecosystem.</>}
      />
      <p style={styles.paragraph}>
        Breach of user privacy will result in{' '}
        <Highlight>immediate termination of the Advisor's service contract and potential legal action under the IT Act, 2000</Highlight>.
      </p>

      <SubHeading>Code of Professional Conduct</SubHeading>
      <p style={styles.paragraph}>
        Advisors must maintain absolute neutrality, professionalism, and integrity while dealing with clients.
      </p>
      <BulletItem
        label="Anti-Bribery & Private Fees"
        text={
          <>
            Advisors are <Highlight>strictly prohibited from soliciting or accepting private commissions, gifts, or direct payments</Highlight> from
            customers. All monetary charges must process exclusively through Subhobibaho.com channels.
          </>
        }
      />
      <p style={styles.paragraph}>
        Advisors must report any fraudulent, abusive, or suspicious customer profiles to the platform's
        Management team immediately.
      </p>
    </Section>
  )
}

function ManagerTerms() {
  return (
    <Section number={3} title="Manager (Administrator) Terms of Service">
      <SubHeading>Roles & Administrative Authorities</SubHeading>
      <p style={styles.paragraph}>
        Managers are authorized representatives of Subhobibaho.com Private Limited tasked with platform
        upkeep, quality control, and safety monitoring.
      </p>
      <p style={styles.paragraph}>
        Managers hold the authority to{' '}
        <Highlight>approve, hold, reject, or terminate any Customer or Advisor account</Highlight> found
        in violation of company policies.
      </p>

      <SubHeading>Profile Moderation & Data Auditing</SubHeading>
      <p style={styles.paragraph}>
        Managers must ensure that all user-reported content, fake profiles, and objectionable data are
        reviewed and actioned within the{' '}
        <Highlight>timelines mandated under Indian Intermediary Guidelines</Highlight>.
      </p>
      <p style={styles.paragraph}>
        Managers must maintain{' '}
        <Highlight>secure audit logs of system activities, payment confirmations, and backend data access records</Highlight>.
      </p>

      <SubHeading>Dispute Resolution & Grievance Officer Escalations</SubHeading>
      <p style={styles.paragraph}>
        Managers will oversee client dispute resolution and support tickets.
      </p>
      <p style={styles.paragraph}>
        A designated Manager will step into the role of the{' '}
        <Highlight>Grievance Officer</Highlight> to handle external legal escalations, police inquiries,
        and cyber-cell coordination.
      </p>
    </Section>
  )
}

function GeneralTerms() {
  return (
    <Section number={4} title="General & Legal Clauses">
      <SubHeading>Limitation of Liability</SubHeading>
      <p style={styles.paragraph}>
        Subhobibaho.com Private Limited{' '}
        <Highlight>does not guarantee a successful matrimonial alliance</Highlight> for any user.
      </p>
      <p style={styles.paragraph}>
        The company is <Highlight>not liable for any misrepresentation, emotional distress, physical harm, or financial fraud</Highlight> committed
        by one user against another.
      </p>

      <SubHeading>Termination of Services</SubHeading>
      <p style={styles.paragraph}>
        The company reserves the{' '}
        <Highlight>absolute right to suspend or permanently block access</Highlight> to any customer,
        advisor, or manager without prior notice if a breach of policy is discovered.
      </p>

      <SubHeading>Governing Law and Jurisdiction</SubHeading>
      <p style={styles.paragraph}>
        These Terms shall be governed by and interpreted in accordance with the laws of India.
      </p>
      <p style={styles.paragraph}>
        Any legal disputes or claims arising out of platform usage shall be subject to the exclusive
        jurisdiction of the{' '}
        <Highlight>courts in Paschim Medinipur District Court, West Bengal</Highlight>.
      </p>
    </Section>
  )
}

function Highlight({ children }: { children: React.ReactNode }) {
  return <span style={styles.highlight}>{children}</span>
}

function Section({ number, title, children }: { number: number; title: string; children: React.ReactNode }) {
  return (
    <section style={styles.section}>
      <h2 style={styles.sectionTitle}>Part {number}: {title}</h2>
      {children}
    </section>
  )
}

function SubHeading({ children }: { children: React.ReactNode }) {
  return <h3 style={styles.subHeading}>{children}</h3>
}

function BulletItem({ label, text }: { label: string; text: React.ReactNode }) {
  return (
    <div style={styles.bulletItem}>
      <p style={styles.bulletLabel}>{label}</p>
      <p style={styles.bulletText}>{text}</p>
    </div>
  )
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} style={active ? styles.tabActive : styles.tab}>
      {children}
    </button>
  )
}

const styles: Record<string, React.CSSProperties> = {
  page: { backgroundColor: '#fff0f3', fontFamily: 'system-ui, sans-serif', minHeight: '100vh', padding: '50px 24px' },
  container: { maxWidth: 800, margin: '0 auto', backgroundColor: '#ffffff', borderRadius: 20, padding: '44px 40px', boxShadow: '0 4px 20px rgba(214,51,108,0.08)' },
  title: { fontSize: 30, fontWeight: 800, color: '#5c2a3a', margin: '0 0 16px' },
  companyLine: { fontSize: 15, color: '#5c2a3a', margin: '0 0 4px' },
  metaLine: { fontSize: 13, color: '#8a5464', margin: '2px 0' },
  tabsRow: { display: 'flex', gap: 8, marginTop: 28, marginBottom: 32, flexWrap: 'wrap' as const },
  tab: {
    padding: '9px 18px', borderRadius: 20, border: '1px solid #f6c6d4',
    backgroundColor: '#ffffff', color: '#a5486a', fontWeight: 600, fontSize: 13, cursor: 'pointer',
  },
  tabActive: {
    padding: '9px 18px', borderRadius: 20, border: '1px solid #d6336c',
    backgroundColor: '#d6336c', color: '#ffffff', fontWeight: 600, fontSize: 13, cursor: 'pointer',
  },
  section: { marginBottom: 12 },
  sectionTitle: { fontSize: 19, fontWeight: 700, color: '#d6336c', margin: '0 0 16px', borderBottom: '2px solid #f6c6d4', paddingBottom: 10 },
  subHeading: { fontSize: 15, fontWeight: 700, color: '#5c2a3a', margin: '18px 0 8px' },
  paragraph: { fontSize: 14, color: '#5c2a3a', lineHeight: 1.7, margin: '0 0 10px' },
  bulletItem: { marginBottom: 12, paddingLeft: 16, borderLeft: '3px solid #fce8ee' },
  bulletLabel: { fontSize: 13, fontWeight: 700, color: '#5c2a3a', margin: '0 0 3px' },
  bulletText: { fontSize: 13, color: '#5c2a3a', lineHeight: 1.6, margin: 0 },
  highlight: { backgroundColor: '#fce8ee', color: '#d6336c', fontWeight: 700, padding: '1px 5px', borderRadius: 4 },
}