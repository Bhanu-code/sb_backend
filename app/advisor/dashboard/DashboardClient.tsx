// app/advisor/dashboard/DashboardClient.tsx
'use client'

import { useEffect, useState } from 'react'

type Dashboard = {
  referralCode: string
  referralCount: number
  role: string
  pendingCommission: number
  pendingCount: number
  paidCommission: number
  paidCount: number
  masterAgentEligible: boolean
  masterAgentRequestStatus: 'pending' | 'approved' | 'rejected' | null
}

export default function DashboardClient() {
  const [data, setData] = useState<Dashboard | null>(null)
  const [loading, setLoading] = useState(true)
  const [applying, setApplying] = useState(false)
  const [copied, setCopied] = useState(false)

  const fetchDashboard = async () => {
    try {
      const res = await fetch('/api/advisor/dashboard')
      if (res.ok) setData(await res.json())
    } catch {
      // keep previous state
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboard()
  }, [])

  const copyReferralCode = () => {
    if (!data) return
    navigator.clipboard.writeText(data.referralCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const applyForMasterAgent = async () => {
    setApplying(true)
    try {
      const res = await fetch('/api/advisor/master-agent-request', { method: 'POST' })
      const result = await res.json()
      if (!res.ok) {
        alert(result.error || 'Failed to submit application')
      } else {
        alert('Your Master Agent application is under review.')
        fetchDashboard()
      }
    } catch {
      alert('Network error. Please try again.')
    } finally {
      setApplying(false)
    }
  }

  if (loading || !data) {
    return (
      <div style={styles.loadingContainer}>
        <p style={styles.statusText}>Loading...</p>
      </div>
    )
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>Dashboard</h1>

        <div style={styles.codeCard}>
          <p style={styles.codeLabel}>Your Referral Code</p>
          <p style={styles.codeValue}>{data.referralCode}</p>
          <button onClick={copyReferralCode} style={styles.copyButton}>
            {copied ? 'Copied!' : 'Copy Code'}
          </button>
        </div>

        <div style={styles.statsRow}>
          <div style={styles.statCard}>
            <p style={styles.statNumber}>{data.referralCount}</p>
            <p style={styles.statLabel}>Direct Referrals</p>
          </div>
          <div style={styles.statCard}>
            <p style={styles.statNumber}>₹{data.pendingCommission}</p>
            <p style={styles.statLabel}>Pending</p>
          </div>
          <div style={styles.statCard}>
            <p style={styles.statNumber}>₹{data.paidCommission}</p>
            <p style={styles.statLabel}>Paid Out</p>
          </div>
        </div>

        <div style={styles.roleCard}>
          <p style={styles.roleLabel}>Current Role</p>
          <p style={styles.roleValue}>{data.role === 'master_agent' ? 'Master Agent' : 'Advisor'}</p>
        </div>

        {data.role === 'advisor' && (
          <div style={styles.masterAgentCard}>
            {data.masterAgentRequestStatus === 'pending' ? (
              <p style={styles.masterAgentStatusText}>Your Master Agent application is under review.</p>
            ) : data.masterAgentRequestStatus === 'rejected' ? (
              <p style={styles.masterAgentStatusText}>Your previous application was not approved.</p>
            ) : data.masterAgentEligible ? (
              <>
                <p style={styles.masterAgentTitle}>You're eligible for Master Agent!</p>
                <p style={styles.masterAgentSubtitle}>
                  You've referred {data.referralCount} customers — apply now to take a franchise.
                </p>
                <button onClick={applyForMasterAgent} disabled={applying} style={styles.applyButton}>
                  {applying ? 'Submitting...' : 'Apply for Master Agent'}
                </button>
              </>
            ) : (
              <p style={styles.masterAgentStatusText}>
                Refer {100 - data.referralCount} more customers to unlock Master Agent eligibility.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: '100vh', backgroundColor: '#fff0f3', fontFamily: 'system-ui, sans-serif' },
  loadingContainer: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff0f3' },
  statusText: { color: '#a5486a', fontSize: 14 },
  container: { maxWidth: 720, margin: '0 auto', padding: '32px 24px' },
  title: { fontSize: 24, fontWeight: 700, color: '#5c2a3a', margin: '0 0 20px' },
  codeCard: {
    backgroundColor: '#d6336c', borderRadius: 18, padding: 26, textAlign: 'center', marginBottom: 20,
  },
  codeLabel: { color: '#ffe3ec', fontSize: 13, fontWeight: 600, margin: 0 },
  codeValue: { color: '#ffffff', fontSize: 30, fontWeight: 800, letterSpacing: 3, margin: '8px 0 16px' },
  copyButton: {
    backgroundColor: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: 10,
    padding: '9px 20px', color: '#ffffff', fontWeight: 700, fontSize: 13, cursor: 'pointer',
  },
  statsRow: { display: 'flex', gap: 14, marginBottom: 20 },
  statCard: { flex: 1, backgroundColor: '#ffffff', borderRadius: 16, padding: 20, textAlign: 'center' },
  statNumber: { fontSize: 22, fontWeight: 700, color: '#5c2a3a', margin: 0 },
  statLabel: { fontSize: 12, color: '#a5486a', margin: '4px 0 0' },
  roleCard: { backgroundColor: '#ffffff', borderRadius: 16, padding: 18, marginBottom: 20 },
  roleLabel: { fontSize: 12, color: '#a5486a', fontWeight: 600, margin: 0 },
  roleValue: { fontSize: 18, color: '#5c2a3a', fontWeight: 700, margin: '4px 0 0' },
  masterAgentCard: { backgroundColor: '#ffffff', borderRadius: 16, padding: 22 },
  masterAgentTitle: { fontSize: 16, fontWeight: 700, color: '#5c2a3a', margin: 0 },
  masterAgentSubtitle: { fontSize: 13, color: '#a5486a', marginTop: 8, lineHeight: 1.5 },
  masterAgentStatusText: { fontSize: 13, color: '#a5486a', lineHeight: 1.5, margin: 0 },
  applyButton: {
    backgroundColor: '#d6336c', border: 'none', borderRadius: 12,
    padding: 13, color: '#ffffff', fontWeight: 700, fontSize: 14, cursor: 'pointer',
    marginTop: 16, width: '100%',
  },
}