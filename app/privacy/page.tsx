// app/(web)/privacy-policy/page.tsx

export default function PrivacyPolicyPage() {
  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>Privacy Policy</h1>
        <p style={styles.companyLine}>
          <Highlight>Subhobibaho.com Private Limited</Highlight>
        </p>
        <p style={styles.metaLine}>CIN: <Highlight>U93290WR2026PTC292647</Highlight></p>
        <p style={styles.metaLine}>
          Registered Office: H.No.582/B/537, Ward No.35, Talbagicha, Kharagpur, West Midnapore - 721306, West Bengal, India
        </p>
        <p style={styles.metaLine}>Last Updated: <Highlight>August 28, 2026</Highlight></p>

        <p style={styles.intro}>
          This Privacy Policy describes how Subhobibaho.com Private Limited collects, uses, shares,
          and protects the personal information of Customers (Users), Advisors, and Managers. By
          using our website or applications, you consent to the data practices described in this policy.
        </p>

        {/* PART 1 */}
        <Section number={1} title="Data Collection Protocols">
          <SubHeading>Information Collected from Customers (Users)</SubHeading>
          <p style={styles.paragraph}>
            To provide matchmaking services, we collect two categories of information:
          </p>
          <BulletItem
            label="Personally Identifiable Information (PII)"
            text="Name, gender, date of birth, marital status, email address, physical address, and contact number."
          />
          <BulletItem
            label="Matrimonial Profile Data"
            text="Religion, caste/sub-caste, mother tongue, educational qualification, income range, occupation, family values, horoscope details, and personal photographs."
          />
          <BulletItem
            label="Identity Verification Data"
            text={
              <>
                Copies of government-issued IDs (<Highlight>Aadhar, PAN, or Passport</Highlight>) submitted for verification badges.
              </>
            }
          />
          <BulletItem
            label="Financial Data"
            text={
              <>
                Payment details processed through authorized, secure third-party payment gateways.{' '}
                <Highlight>We do not store raw credit/debit card numbers on our servers.</Highlight>
              </>
            }
          />

          <SubHeading>Information Collected from Advisors</SubHeading>
          <p style={styles.paragraph}>
            Full legal name, contact details, permanent address, and <Highlight>bank account details for commission/remuneration payouts</Highlight>.
          </p>
          <p style={styles.paragraph}>
            Professional history, references, and logs of customer profiles accessed or managed.
          </p>

          <SubHeading>Information Collected from Managers</SubHeading>
          <p style={styles.paragraph}>
            Employee/Contractor identification data, official email addresses, log-in credentials, and{' '}
            <Highlight>system action logs (actions taken on user accounts, approvals, or bans)</Highlight>.
          </p>

          <SubHeading>Technical and Automated Data</SubHeading>
          <p style={styles.paragraph}>
            IP addresses, browser types, device information, operating systems, and website usage
            cookies to optimize platform performance and prevent automated scrapers or bots.
          </p>
        </Section>

        {/* PART 2 */}
        <Section number={2} title="How We Use Your Information">
          <p style={styles.paragraph}>
            We process gathered data strictly for legitimate operational purposes:
          </p>
          <BulletItem label="Matchmaking & Discovery" text="To display customer profiles to prospective compatible matches on the platform." />
          <BulletItem label="Verification and Trust" text="To authenticate user identities and prevent catfish, fake, or fraudulent accounts." />
          <BulletItem label="Service Enablement" text="To allow assigned Advisors to filter profiles and present suitable choices to customers." />
          <BulletItem label="Communications" text="To send alerts regarding match recommendations, community updates, subscription renewals, and security warnings." />
          <BulletItem label="Legal Enforcement" text="To detect and investigate platform abuse, financial fraud, or violations of our Terms of Service." />
        </Section>

        {/* PART 3 */}
        <Section number={3} title="Data Sharing and Disclosure">
          <p style={styles.paragraph}>
            Subhobibaho.com Private Limited treats your personal data with strict confidentiality.{' '}
            <Highlight>We do not sell or rent data to third-party marketers.</Highlight> Data is only
            shared under the following conditions:
          </p>
          <BulletItem
            label="Public Platform Visibility"
            text="A customer's matrimonial data (except private contact information) is visible to other registered members of the platform."
          />
          <BulletItem
            label="Internal Stakeholders (Advisors & Managers)"
            text="Assigned Advisors and corporate Managers have access to user records to execute search assistance and manage platform safety."
          />
          <BulletItem
            label="Third-Party Service Providers"
            text="Data may be securely handled by cloud hosting services, SMS gateway providers, and automated verification agencies under strict non-disclosure agreements."
          />
          <BulletItem
            label="Legal Requirements"
            text="We will disclose data to law enforcement agencies, cyber cells, or judicial authorities if required by law or to protect user safety."
          />
        </Section>

        {/* PART 4 */}
        <Section number={4} title="Data Security and Retention">
          <SubHeading>Security Safeguards</SubHeading>
          <p style={styles.paragraph}>
            We implement industry-standard administrative, technical, and physical security measures
            (including <Highlight>SSL encryption</Highlight>) to protect data from unauthorized access or modification.
          </p>

          <SubHeading>Retention Timeline</SubHeading>
          <BulletItem
            label="Active Accounts"
            text="Data is retained as long as the user account remains active or premium subscriptions are valid."
          />
          <BulletItem
            label="Closed Accounts"
            text={
              <>
                If a user deletes their account or matches successfully, profile data is systematically
                scrubbed from public view. However,{' '}
                <Highlight>basic account metadata, financial logs, and verification logs are archived for a legal window</Highlight>{' '}
                to comply with statutory tax laws and police investigation requirements.
              </>
            }
          />
        </Section>

        {/* PART 5 */}
        <Section number={5} title="User Rights and Controls">
          <p style={styles.paragraph}>
            Customers have complete control over their privacy preferences through their settings panel:
          </p>
          <BulletItem label="Access and Correction" text="You can view, edit, or update your personal details and photos at any time." />
          <BulletItem
            label="Photo Privacy Controls"
            text={
              <>
                Customers can restrict photo visibility to{' '}
                <Highlight>"All Members", "Only Premium Members", or "Only Accepted Matches"</Highlight>.
              </>
            }
          />
          <BulletItem
            label="Account Deletion"
            text={<><Highlight>Users can request permanent deletion of their profile data</Highlight> directly from their dashboard.</>}
          />
        </Section>

        {/* PART 6 */}
        <Section number={6} title="Legal Framework & Jurisdiction">
          <p style={styles.paragraph}>
            This policy is drafted in adherence to the Information Technology Rules and applicable
            data protection regulations in India.
          </p>
          <p style={styles.paragraph}>
            Any disputes regarding data privacy are subject to the exclusive jurisdiction of the{' '}
            <Highlight>courts in Paschim Medinipur District Court, West Bengal</Highlight>.
          </p>
        </Section>

        {/* PART 7 */}
        <Section number={7} title="Grievance Redressal">
          <p style={styles.paragraph}>
            In accordance with the Information Technology Act, 2000, if you have any questions or
            complaints regarding this Privacy Policy or your data handling, you may reach out to our
            Grievance Officer:
          </p>
          <div style={styles.grievanceCard}>
            <p style={styles.grievanceLine}><strong>Attn:</strong> <Highlight>SANJOY DEY</Highlight>, Grievance Officer</p>
            <p style={styles.grievanceLine}>Subhobibaho.com Private Limited</p>
            <p style={styles.grievanceLine}>
              Address: H.No.582/B/537, Ward No.35, Talbagicha, Kharagpur, West Midnapore - 721306, West Bengal, India
            </p>
            <p style={styles.grievanceLine}>
              Email: <Highlight>privacy@subhobibaho.com</Highlight>
            </p>
            <p style={styles.grievanceLine}>
              Contact No: <Highlight>+91 9474632300</Highlight>
            </p>
          </div>
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

const styles: Record<string, React.CSSProperties> = {
  page: { backgroundColor: '#fff0f3', fontFamily: 'system-ui, sans-serif', minHeight: '100vh', padding: '50px 24px' },
  container: { maxWidth: 800, margin: '0 auto', backgroundColor: '#ffffff', borderRadius: 20, padding: '44px 40px', boxShadow: '0 4px 20px rgba(214,51,108,0.08)' },
  title: { fontSize: 30, fontWeight: 800, color: '#5c2a3a', margin: '0 0 16px' },
  companyLine: { fontSize: 15, color: '#5c2a3a', margin: '0 0 4px' },
  metaLine: { fontSize: 13, color: '#8a5464', margin: '2px 0' },
  intro: { fontSize: 14, color: '#5c2a3a', lineHeight: 1.7, margin: '20px 0 32px' },
  section: { marginBottom: 32 },
  sectionTitle: { fontSize: 19, fontWeight: 700, color: '#d6336c', margin: '0 0 14px', borderBottom: '2px solid #f6c6d4', paddingBottom: 10 },
  subHeading: { fontSize: 15, fontWeight: 700, color: '#5c2a3a', margin: '18px 0 8px' },
  paragraph: { fontSize: 14, color: '#5c2a3a', lineHeight: 1.7, margin: '0 0 10px' },
  bulletItem: { marginBottom: 12, paddingLeft: 16, borderLeft: '3px solid #fce8ee' },
  bulletLabel: { fontSize: 13, fontWeight: 700, color: '#5c2a3a', margin: '0 0 3px' },
  bulletText: { fontSize: 13, color: '#5c2a3a', lineHeight: 1.6, margin: 0 },
  highlight: { backgroundColor: '#fce8ee', color: '#d6336c', fontWeight: 700, padding: '1px 5px', borderRadius: 4 },
  grievanceCard: { backgroundColor: '#fff5f7', borderRadius: 14, padding: '18px 20px', marginTop: 12 },
  grievanceLine: { fontSize: 13, color: '#5c2a3a', margin: '4px 0' },
}