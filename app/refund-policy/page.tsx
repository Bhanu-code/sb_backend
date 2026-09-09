// app/(web)/refund-policy/page.tsx

export default function RefundPolicyPage() {
  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>Refund & Cancellation Policy</h1>
        <p style={styles.companyLine}><Highlight>Subhobibaho.com Private Limited</Highlight></p>
        <p style={styles.metaLine}>CIN: <Highlight>U93290WR2026PTC292647</Highlight></p>
        <p style={styles.metaLine}>
          Registered Office: H.No.582/B/537, Ward No.35, Talbagicha, Kharagpur, West Midnapore - 721306, West Bengal, India
        </p>

        <Section number={1} title="General Non-Refundability Policy">
          <BulletItem
            label="All Sales Are Final"
            text={<>All payments made to Subhobibaho.com Private Limited for premium packages, subscription memberships, registration fees, personalized advisor services, or add-on features are <Highlight>100% non-refundable</Highlight>.</>}
          />
          <BulletItem
            label="Immediate Activation"
            text="Since the platform grants immediate access to premium database features, digital search communication tools, and advisor assets upon payment confirmation, the service is deemed entirely consumed at the time of purchase."
          />
        </Section>

        <Section number={2} title="Profile Termination and Misconduct">
          <BulletItem
            label="Policy Violations"
            text={<>If a user account is suspended, restricted, or permanently deleted by platform Managers due to a breach of our Terms of Service (e.g., fake profiles, abusive behaviour, soliciting money, commercial misuse, or misleading claims), the user will <Highlight>forfeit any remaining balance or time on their subscription</Highlight>. No refunds will be issued under these circumstances.</>}
          />
          <BulletItem
            label="Voluntary Deletion"
            text="If a user successfully finds a marital match or voluntarily decides to delete their active profile before their subscription tier expires, the remaining duration cannot be converted into a cash refund or transferred to another individual."
          />
        </Section>

        <Section number={3} title="Non-Transferability of Services">
          <p style={styles.paragraph}>
            Paid memberships, premium packages, and allocated Advisor hours are assigned strictly to
            the registered user profile.
          </p>
          <p style={styles.paragraph}>
            <Highlight>Subscriptions cannot be transferred, assigned, or adjusted</Highlight> to another
            profile, sibling, relative, friend, or external account.
          </p>
        </Section>

        <Section number={4} title="Exceptions and Special Scenarios">
          <div style={styles.exceptionBanner}>
            These are the only circumstances under which money may be returned.
          </div>
          <BulletItem
            label="Technical Double Payments"
            text={<>In rare instances where a technical glitch causes a user to be billed twice for the exact same transaction, <Highlight>the duplicate amount will be refunded</Highlight>.</>}
          />
          <BulletItem
            label="Refund Window"
            text={<>Users must report duplicate transactions via email with proof of payment within <Highlight>48 hours</Highlight> of the charge. Valid duplicate claims will be processed back to the original payment source within <Highlight>7 to 10 business days</Highlight>.</>}
          />
          <BulletItem
            label="Failed Transactions"
            text="If an account is debited but the subscription fails to activate due to payment gateway delays, the system will auto-activate the package upon confirmation, or the banking partner will automatically reverse the amount based on their standard processing timeline."
          />
        </Section>

        <Section number={5} title="Service Disruptions and Match Success Disclaimer">
          <BulletItem
            label="No Match Guarantee"
            text="Subhobibaho.com functions as an intermediary platform. We do not guarantee a successful marriage alliance, a fixed number of profile responses, or specific compatibility results."
          />
          <p style={styles.paragraph}>
            <Highlight>No refund claims will be entertained</Highlight> based on the lack of profile
            responses, personal dissatisfaction with match recommendations, or general lack of usage.
          </p>
        </Section>

        <Section number={6} title="Modifications to Pricing and Policies">
          <p style={styles.paragraph}>
            Subhobibaho.com Private Limited reserves the{' '}
            <Highlight>absolute right to modify subscription fees, introduce promotional discounts,
            or update this Refund & Cancellation Policy</Highlight> at any time without prior
            individual notice. Any changes will be updated live on our platform footer.
          </p>
        </Section>

        <Section number={7} title="Jurisdiction">
          <p style={styles.paragraph}>
            Any disputes, arguments, or legal claims arising from billing, cancellations, or refund
            requests shall be subject exclusively to the jurisdiction of the{' '}
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

const styles: Record<string, React.CSSProperties> = {
  page: { backgroundColor: '#fff0f3', fontFamily: 'system-ui, sans-serif', minHeight: '100vh', padding: '50px 24px' },
  container: { maxWidth: 800, margin: '0 auto', backgroundColor: '#ffffff', borderRadius: 20, padding: '44px 40px', boxShadow: '0 4px 20px rgba(214,51,108,0.08)' },
  title: { fontSize: 28, fontWeight: 800, color: '#5c2a3a', margin: '0 0 16px' },
  companyLine: { fontSize: 15, color: '#5c2a3a', margin: '0 0 4px' },
  metaLine: { fontSize: 13, color: '#8a5464', margin: '2px 0' },
  section: { marginTop: 32, marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: 700, color: '#d6336c', margin: '0 0 14px', borderBottom: '2px solid #f6c6d4', paddingBottom: 10 },
  paragraph: { fontSize: 14, color: '#5c2a3a', lineHeight: 1.7, margin: '0 0 10px' },
  bulletItem: { marginBottom: 12, paddingLeft: 16, borderLeft: '3px solid #fce8ee' },
  bulletLabel: { fontSize: 13, fontWeight: 700, color: '#5c2a3a', margin: '0 0 3px' },
  bulletText: { fontSize: 13, color: '#5c2a3a', lineHeight: 1.6, margin: 0 },
  highlight: { backgroundColor: '#fce8ee', color: '#d6336c', fontWeight: 700, padding: '1px 5px', borderRadius: 4 },
  exceptionBanner: {
    backgroundColor: '#d4f4dd', color: '#1a7a3d', fontWeight: 700, fontSize: 12,
    padding: '10px 16px', borderRadius: 10, marginBottom: 16, textAlign: 'center' as const,
  },
}