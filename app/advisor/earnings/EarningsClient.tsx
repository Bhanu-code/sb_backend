// app/advisor/earnings/EarningsClient.tsx
'use client'

import { useEffect, useState } from 'react'

type Commission = {
  id: string
  amount: string | number
  type: 'joining' | 'subscription'
  status: 'pending' | 'paid' | 'failed'
  level: number
  createdAt: string
  sourceUserName: string
}

type LevelBreakdown = { level: number; count: number; total: number }

const STATUS_COLORS: Record<Commission['status'], { bg: string; text: string }> = {
  pending: { bg: '#fff3cd', text: '#8a6d00' },
  paid: { bg: '#d4f4dd', text: '#1a7a3d' },
  failed: { bg: '#fce8e8', text: '#c0392b' },
}

const LEVEL_LABELS: Record<number, string> = { 1: 'Direct', 2: 'Level 2', 3: 'Level 3', 4: 'Level 4' }

export default function EarningsClient() {
  const [commissions, setCommissions] = useState<Commission[]>([])
  const [byLevel, setByLevel] = useState<LevelBreakdown[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/advisor/commissions')
      .then((res) => {
        if (!res.ok) throw new Error()
        return res.json()
      })
      .then((data) => {
        setCommissions(data.commissions ?? [])
        setByLevel(data.byLevel ?? [])
      })
      .catch(() => setError('Failed to load earnings'))
      .finally(() => setLoading(false))
  }, [])

  const totalPending = commissions.filter((c) => c.status === 'pending').reduce((sum, c) => sum + Number(c.amount), 0)
  const totalPaid = commissions.filter((c) => c.status === 'paid').reduce((sum, c) => sum + Number(c.amount), 0)

  if (loading) {
    return <div style={styles.loadingContainer}><p style={styles.statusText}>Loading...</p></div>
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>Earnings</h1>

        <div style={styles.summaryRow}>
          <div style={styles.summaryCard}>
            <p style={styles.summaryValue}>₹{totalPending}</p>
            <p style={styles.summaryLabel}>Pending</p>
          </div>
          <div style={styles.summaryCard}>
            <p style={styles.summaryValue}>₹{totalPaid}</p>
            <p style={styles.summaryLabel}>Paid</p>
          </div>
        </div>

        {byLevel.some((l) => l.count > 0) && (
          <div style={styles.levelCard}>
            <p style={styles.levelCardTitle}>Earnings by Level</p>
            {byLevel.map((l) => (
              <div key={l.level} style={styles.levelRow}>
                <p style={styles.levelRowLabel}>{LEVEL_LABELS[l.level]} · {l.count} {l.count === 1 ? 'referral' : 'referrals'}</p>
                <p style={styles.levelRowAmount}>₹{l.total}</p>
              </div>
            ))}
          </div>
        )}

        {error ? (
          <p style={styles.statusText}>{error}</p>
        ) : commissions.length === 0 ? (
          <p style={styles.statusText}>No commissions yet</p>
        ) : (
          <div style={styles.list}>
            {commissions.map((c) => {
              const colors = STATUS_COLORS[c.status]
              return (
                <div key={c.id} style={styles.row}>
                  <div style={styles.rowInfo}>
                    <div style={styles.rowNameLine}>
                      <p style={styles.rowName}>{c.sourceUserName}</p>
                      <span style={styles.levelBadge}>{LEVEL_LABELS[c.level]}</span>
                    </div>
                    <p style={styles.rowMeta}>
                      {c.type === 'joining' ? 'Signup bonus' : 'Subscription'} · {new Date(c.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div style={styles.rowRight}>
                    <p style={styles.rowAmount}>₹{c.amount}</p>
                    <span style={{ ...styles.statusBadge, backgroundColor: colors.bg, color: colors.text }}>{c.status}</span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: '100vh', backgroundColor: '#fff0f3', fontFamily: 'system-ui, sans-serif' },
  loadingContainer: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff0f3' },
  statusText: { color: '#a5486a', fontSize: 14, textAlign: 'center' },
  container: { maxWidth: 720, margin: '0 auto', padding: '32px 24px' },
  title: { fontSize: 24, fontWeight: 700, color: '#5c2a3a', margin: '0 0 20px' },
  summaryRow: { display: 'flex', gap: 14, marginBottom: 16 },
  summaryCard: { flex: 1, backgroundColor: '#ffffff', borderRadius: 16, padding: 20, textAlign: 'center' },
  summaryValue: { fontSize: 22, fontWeight: 700, color: '#5c2a3a', margin: 0 },
  summaryLabel: { fontSize: 12, color: '#a5486a', margin: '4px 0 0' },
  levelCard: { backgroundColor: '#ffffff', borderRadius: 16, padding: 20, marginBottom: 20 },
  levelCardTitle: { fontSize: 14, fontWeight: 700, color: '#5c2a3a', margin: '0 0 12px' },
  levelRow: { display: 'flex', justifyContent: 'space-between', padding: '6px 0' },
  levelRowLabel: { fontSize: 13, color: '#a5486a', margin: 0 },
  levelRowAmount: { fontSize: 13, fontWeight: 700, color: '#5c2a3a', margin: 0 },
  list: { display: 'flex', flexDirection: 'column', gap: 10 },
  row: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#ffffff', borderRadius: 14, padding: 16 },
  rowInfo: { flex: 1 },
  rowNameLine: { display: 'flex', alignItems: 'center', gap: 8 },
  rowName: { fontSize: 14, fontWeight: 700, color: '#5c2a3a', margin: 0 },
  levelBadge: { fontSize: 10, fontWeight: 700, color: '#d6336c', backgroundColor: '#fce8ee', borderRadius: 6, padding: '2px 6px' },
  rowMeta: { fontSize: 12, color: '#a5486a', margin: '4px 0 0' },
  rowRight: { textAlign: 'right' },
  rowAmount: { fontSize: 15, fontWeight: 700, color: '#5c2a3a', margin: 0 },
  statusBadge: { fontSize: 10, fontWeight: 700, borderRadius: 8, padding: '3px 8px', textTransform: 'capitalize', display: 'inline-block', marginTop: 6 },
}