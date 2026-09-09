// app/(web)/user-policy/page.tsx
'use client'

import { useState } from 'react'

type Tab = 'customer' | 'advisor' | 'manager' | 'grievance' | 'legal'

export default function UserPolicyPage() {
  const [activeTab, setActiveTab] = useState<Tab>('customer')

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>User Policy & Agreement</h1>
        <p style={styles.intro}>
          <Highlight>Subhobibaho.com Private Limited</Highlight> (CIN:{' '}
          <Highlight>U93290WR2026PTC292647</Highlight>) is mandated to establish this user policy
          framework as an online <Highlight>Intermediary under Section 2(1)(w) of the Information
          Technology (IT) Act, 2000</Highlight>. It fully complies with the IT (Intermediary
          Guidelines and Digital Media Ethics Code) Rules, the{' '}
          <Highlight>Digital Personal Data Protection (DPDP) Act</Highlight>, and the Ministry of
          Electronics and Information Technology (MeitY) Matrimonial Advisory.
        </p>
        <p style={styles.intro}>
          All agreements, operations, and disputes are legally bound to the exclusive jurisdiction of
          the <Highlight>Paschim Medinipur District Court, West Bengal, India</Highlight>.
        </p>

        <div style={styles.tabsRow}>
          <TabButton active={activeTab === 'customer'} onClick={() => setActiveTab('customer')}>Customer</TabButton>
          <TabButton active={activeTab === 'advisor'} onClick={() => setActiveTab('advisor')}>Advisor</TabButton>
          <TabButton active={activeTab === 'manager'} onClick={() => setActiveTab('manager')}>Manager</TabButton>
          <TabButton active={activeTab === 'grievance'} onClick={() => setActiveTab('grievance')}>Grievance Redressal</TabButton>
          <TabButton active={activeTab === 'legal'} onClick={() => setActiveTab('legal')}>Legal Framework</TabButton>
        </div>

        {activeTab === 'customer' && <CustomerPolicy />}
        {activeTab === 'advisor' && <AdvisorPolicy />}
        {activeTab === 'manager' && <ManagerPolicy />}
        {activeTab === 'grievance' && <GrievanceSection />}
        {activeTab === 'legal' && <LegalFrameworkSection />}
      </div>
    </div>
  )
}

function CustomerPolicy() {
  return (
    <Section number={1} title="Customer / Member Policy">
      <p style={styles.paragraph}>
        The Customer refers to any registered individual looking for a lawful marriage alliance.
      </p>
      <BulletItem
        label="Matrimonial Intent Declaration"
        text={<>The platform is strictly for lawful matrimonial alliances. <Highlight>Casual dating, romance scams, or commercial activities are completely prohibited.</Highlight></>}
      />
      <BulletItem
        label="Mandatory ID Verification"
        text={<>To comply with government guidelines, users must upload valid government-issued ID and address proof (e.g., <Highlight>Aadhaar, Voter Card</Highlight>) during registration to confirm the authenticity of their account.</>}
      />
      <BulletItem
        label="Age Criteria & Competence"
        text={<>The user warrants they have achieved legal marriageable age in India (<Highlight>18 years for females, 21 years for males</Highlight>) and possess the legal capacity to enter matrimony.</>}
      />
      <BulletItem
        label="Prohibited Activities"
        text="Users shall not upload obscene material, engage in extortion, share deceptive/fake profile information, or misuse intellectual property."
      />
      <BulletItem
        label="Data Deletion & Suspension"
        text={<>Upon finalisation of marriage or written request, users can deactivate or delete their profiles. However, <Highlight>Subhobibaho.com will retain communication logs for mandatory compliance timelines</Highlight>.</>}
      />
      <BulletItem
        label="Liability Disclaimer"
        text={<>The website acts as a neutral venue. Users must manually verify a prospect's credentials. <Highlight>The company holds no financial or emotional liability for user exchanges.</Highlight></>}
      />
    </Section>
  )
}

function AdvisorPolicy() {
  return (
    <Section number={2} title="Advisor / Matchmaker Policy">
      <p style={styles.paragraph}>
        The Advisor refers to customer service representatives, matchmakers, or relationship
        executives assisting customers.
      </p>
      <BulletItem
        label="Confidentiality Safeguards"
        text={<>Advisors handle <Highlight>Sensitive Personal Data or Information (SPDI)</Highlight>. They must not copy, download, transfer, or leak customer records (e.g., phone numbers, addresses, horoscopes) to any unauthorized third party or personal devices.</>}
      />
      <BulletItem
        label="Zero Financial Transactions"
        text={<>Advisors are <Highlight>strictly barred from accepting direct cash, gifts, personal bank transfers, or entering into side-arrangements</Highlight> with customers. All payments must process through the authorized corporate ledger of Subhobibaho.com Private Limited.</>}
      />
      <BulletItem
        label="No Profile Falsification"
        text="Advisors are legally forbidden from fabricating profiles, exaggerating match details, or inputting unverified data to induce paid subscriptions."
      />
      <BulletItem
        label="Acceptable Infrastructure Use"
        text={<>Staff must log in exclusively via authorized company software or terminals. <Highlight>All communication logs (chats, corporate calls) are monitored, time-stamped, and recorded for compliance auditing.</Highlight></>}
      />
    </Section>
  )
}

function ManagerPolicy() {
  return (
    <Section number={3} title="Manager / Management Policy">
      <p style={styles.paragraph}>
        The Manager refers to system administrators, platform operations directors, and data
        protection supervisors.
      </p>
      <BulletItem
        label="Data Security Standards"
        text={<>Managers must enforce "Privacy by Design". This requires maintaining <Highlight>IS/ISO/IEC 27001 standard frameworks</Highlight> for data protection, deploying HTTPS end-to-end security, and implementing cryptographic data encryption at rest.</>}
      />
      <BulletItem
        label="Mandatory Log Retention"
        text={<>In accordance with the IT Act Advisory, system administration must securely store the IP addresses, timestamps, and account logs of all profile creators for <Highlight>at least one year after account deactivation/deletion</Highlight>.</>}
      />

      <SubHeading>Rapid Takedown Mechanism</SubHeading>
      <p style={styles.paragraph}>
        Managers are required to establish an automated or 24/7 rapid response structure to address
        content removal orders:
      </p>
      <div style={styles.slaGrid}>
        <SlaCard time="3 Hours" description="Remove or disable illegal or unauthorized content following a valid court or government order." />
        <SlaCard time="2 Hours" description="Execute emergency removal of non-consensual deepfake nudity or intimate imagery." urgent />
      </div>
    </Section>
  )
}

function GrievanceSection() {
  return (
    <Section number={0} title="Grievance Redressal Mechanism & Statutory Disclosure">
      <p style={styles.paragraph}>
        In accordance with the Information Technology Act, 2000 and the Information Technology
        (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021 framed thereunder, the
        name and contact details of the Grievance Officer of Subhobibaho.com Private Limited are
        published below:
      </p>

      <div style={styles.grievanceCard}>
        <p style={styles.grievanceLine}><strong>Designated Grievance Officer:</strong> <Highlight>SANJOY DEY</Highlight></p>
        <p style={styles.grievanceLine}><strong>CIN:</strong> U93290WR2026PTC292647</p>
        <p style={styles.grievanceLine}>
          <strong>Registered Office:</strong> H.No.582/B/537, Ward No.35, Talbagicha, Kharagpur,
          District: Paschim Medinipur - 721306, West Bengal, India
        </p>
        <p style={styles.grievanceLine}>
          <strong>Email:</strong> <Highlight>grievance@subhobibaho.com</Highlight> (For legal and grievance-related escalations only)
        </p>
        <p style={styles.grievanceLine}><strong>Contact Number:</strong> <Highlight>+91 9474632300</Highlight></p>
        <p style={styles.grievanceLine}>
          <strong>Working Hours:</strong> <Highlight>10:00 AM to 06:00 PM (IST), Monday to Saturday</Highlight> (excluding Public Holidays)
        </p>
      </div>

      <SubHeading>How to Lodge a Grievance</SubHeading>
      <BulletItem label="Written Complaint" text="All grievances must be sent via email or registered post to the details listed above." />
      <BulletItem
        label="Required Details"
        text="Please include your registered User ID, Profile ID, mobile number, a clear description of the violation, and supporting screenshots or links."
      />
      <BulletItem
        label="Impersonation/Intimacy Violations"
        text={<>For complaints regarding identity theft, fake profiles, or the non-consensual sharing of private/intimate images, please use the subject line: <Highlight>"URGENT: SECTION 79 CONTENT TAKEDOWN"</Highlight>.</>}
      />

      <SubHeading>Timeline for Redressal</SubHeading>
      <div style={styles.slaGrid}>
        <SlaCard time="24 Hours" description="Your complaint will be acknowledged with a unique ticket number." />
        <SlaCard time="24–36 Hours" description="Emergency takedowns for non-consensual explicit content or impersonation will be reviewed and acted upon." urgent />
        <SlaCard time="15 Days" description="All other disputes, fake profile reviews, or member harassment reports will be thoroughly investigated and resolved." />
      </div>

      <SubHeading>Legal Jurisdiction</SubHeading>
      <p style={styles.paragraph}>
        Any unresolved disputes arising from the decisions of the Grievance Officer or the use of this
        portal remain subject to the exclusive jurisdiction of the{' '}
        <Highlight>Paschim Medinipur District Court, West Bengal, India</Highlight>.
      </p>
    </Section>
  )
}

function LegalFrameworkSection() {
  const rows = [
    {
      component: 'Primary Legislation',
      detail: 'Information Technology Act, 2000 (Section 2, 43A, 66, 67, 79) & Rules thereunder.',
    },
    {
      component: 'Data Protection',
      detail: 'Digital Personal Data Protection (DPDP) Act (Consent-driven storage and verification frameworks).',
    },
    {
      component: 'Exclusive Jurisdiction',
      detail: 'All legal notices, consumer filings, or statutory suits shall be exclusively instituted before the Paschim Medinipur District Court, West Bengal.',
    },
    {
      component: 'Corporate Presence',
      detail: 'Mailing Address: H.No.582/B/537, Ward No.35, Talbagicha, Kharagpur, West Midnapore - 721306, West Bengal.',
    },
  ]

  return (
    <Section number={4} title="Jurisdiction and Legal Framework">
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Component</th>
            <th style={styles.th}>Legal Provision & Detail</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} style={i % 2 === 0 ? styles.trEven : undefined}>
              <td style={styles.tdLabel}>{row.component}</td>
              <td style={styles.tdDetail}>{row.detail}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Section>
  )
}

function SlaCard({ time, description, urgent }: { time: string; description: string; urgent?: boolean }) {
  return (
    <div style={{ ...styles.slaCard, ...(urgent ? styles.slaCardUrgent : {}) }}>
      <p style={{ ...styles.slaTime, ...(urgent ? styles.slaTimeUrgent : {}) }}>{time}</p>
      <p style={styles.slaDescription}>{description}</p>
    </div>
  )
}

function Highlight({ children }: { children: React.ReactNode }) {
  return <span style={styles.highlight}>{children}</span>
}

function Section({ number, title, children }: { number: number; title: string; children: React.ReactNode }) {
  return (
    <section style={styles.section}>
      <h2 style={styles.sectionTitle}>{number > 0 ? `Part ${number}: ` : ''}{title}</h2>
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
  container: { maxWidth: 840, margin: '0 auto', backgroundColor: '#ffffff', borderRadius: 20, padding: '44px 40px', boxShadow: '0 4px 20px rgba(214,51,108,0.08)' },
  title: { fontSize: 28, fontWeight: 800, color: '#5c2a3a', margin: '0 0 18px' },
  intro: { fontSize: 14, color: '#5c2a3a', lineHeight: 1.7, margin: '0 0 12px' },
  tabsRow: { display: 'flex', gap: 8, marginTop: 24, marginBottom: 32, flexWrap: 'wrap' as const },
  tab: { padding: '9px 16px', borderRadius: 20, border: '1px solid #f6c6d4', backgroundColor: '#ffffff', color: '#a5486a', fontWeight: 600, fontSize: 12, cursor: 'pointer' },
  tabActive: { padding: '9px 16px', borderRadius: 20, border: '1px solid #d6336c', backgroundColor: '#d6336c', color: '#ffffff', fontWeight: 600, fontSize: 12, cursor: 'pointer' },
  section: { marginBottom: 12 },
  sectionTitle: { fontSize: 19, fontWeight: 700, color: '#d6336c', margin: '0 0 16px', borderBottom: '2px solid #f6c6d4', paddingBottom: 10 },
  subHeading: { fontSize: 15, fontWeight: 700, color: '#5c2a3a', margin: '20px 0 8px' },
  paragraph: { fontSize: 14, color: '#5c2a3a', lineHeight: 1.7, margin: '0 0 10px' },
  bulletItem: { marginBottom: 12, paddingLeft: 16, borderLeft: '3px solid #fce8ee' },
  bulletLabel: { fontSize: 13, fontWeight: 700, color: '#5c2a3a', margin: '0 0 3px' },
  bulletText: { fontSize: 13, color: '#5c2a3a', lineHeight: 1.6, margin: 0 },
  highlight: { backgroundColor: '#fce8ee', color: '#d6336c', fontWeight: 700, padding: '1px 5px', borderRadius: 4 },
  grievanceCard: { backgroundColor: '#fff5f7', borderRadius: 14, padding: '18px 20px', margin: '16px 0' },
  grievanceLine: { fontSize: 13, color: '#5c2a3a', margin: '5px 0' },
  slaGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, margin: '14px 0' },
  slaCard: { backgroundColor: '#fff5f7', borderRadius: 12, padding: '16px', borderLeft: '4px solid #d6336c' },
  slaCardUrgent: { backgroundColor: '#fce8e8', borderLeft: '4px solid #e03131' },
  slaTime: { fontSize: 18, fontWeight: 800, color: '#d6336c', margin: '0 0 4px' },
  slaTimeUrgent: { color: '#e03131' },
  slaDescription: { fontSize: 12, color: '#5c2a3a', lineHeight: 1.5, margin: 0 },
  table: { width: '100%', borderCollapse: 'collapse' as const, marginTop: 8 },
  th: { textAlign: 'left' as const, fontSize: 12, fontWeight: 700, color: '#a5486a', padding: '10px 14px', borderBottom: '2px solid #f6c6d4' },
  trEven: { backgroundColor: '#fff5f7' },
  tdLabel: { fontSize: 13, fontWeight: 700, color: '#5c2a3a', padding: '12px 14px', verticalAlign: 'top' as const, width: '30%' },
  tdDetail: { fontSize: 13, color: '#5c2a3a', padding: '12px 14px', lineHeight: 1.6, verticalAlign: 'top' as const },
}