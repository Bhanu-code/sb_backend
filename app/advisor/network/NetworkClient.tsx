// app/advisor/network/NetworkClient.tsx
'use client'

import { useEffect, useState } from 'react'

type DownlineUser = {
  id: string
  name: string
  email: string | null
  joinedAt: string
  profileComplete: boolean
  role: string
  commissionAmount: number | null
  commissionStatus: string | null
}

type Downline = { level1: DownlineUser[]; level2: DownlineUser[]; level3: DownlineUser[]; level4: DownlineUser[] }

const LEVEL_LABELS: Record<number, string> = { 1: 'Direct', 2: 'Level 2', 3: 'Level 3', 4: 'Level 4' }

export default function NetworkClient() {
  const [downline, setDownline] = useState<Downline | null>(null)
  const [activeLevel, setActiveLevel] = useState<1 | 2 | 3 | 4>(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/advisor/downline')
      .then((res) => {
        if (!res.ok) throw new Error()
        return res.json()
      })
      .then(setDownline)
      .catch(() => setError('Failed to load network'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <div style={styles.loadingContainer}><p style={styles.statusText}>Loading...</p></div>
  }

  if (error || !downline) {
    return <div style={styles.loadingContainer}><p style={styles.statusText}>{error || 'Something went wrong'}</p></div>
  }

  const levelData: Record<number, DownlineUser[]> = {
    1: downline.level1, 2: downline.level2, 3: downline.level3, 4: downline.level4,
  }
  const currentList = levelData[activeLevel]

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>My Network</h1>

        <div style={styles.tabsRow}>
          {[1, 2, 3, 4].map((level) => (
            <button
              key={level}
              onClick={() => setActiveLevel(level as 1 | 2 | 3 | 4)}
              style={activeLevel === level ? styles.tabActive : styles.tab}
            >
              {LEVEL_LABELS[level]} <span style={styles.tabBadge}>{levelData[level].length}</span>
            </button>
          ))}
        </div>

        {currentList.length === 0 ? (
          <p style={styles.statusText}>No one at this level yet</p>
        ) : (
          <div style={styles.list}>
            {currentList.map((item) => (
              <div key={item.id} style={styles.row}>
                <div style={styles.avatarPlaceholder}>👤</div>
                <div style={styles.rowInfo}>
                  <div style={styles.rowNameLine}>
                    <p style={styles.rowName}>{item.name}</p>
                    {item.role !== 'customer' && (
                      <span style={styles.roleBadge}>{item.role === 'master_agent' ? 'MA' : 'Advisor'}</span>
                    )}
                  </div>
                  <p style={styles.rowMeta}>
                    Joined {new Date(item.joinedAt).toLocaleDateString()}
                    {!item.profileComplete && ' · Onboarding not finished'}
                  </p>
                </div>
                {item.commissionAmount !== null ? (
                  <span style={styles.commissionBadge}>₹{item.commissionAmount}</span>
                ) : (
                  <span style={styles.pendingBadge}>Pending</span>
                )}
              </div>
            ))}
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
  tabsRow: { display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' },
  tab: { padding: '9px 16px', borderRadius: 20, border: '1px solid #f6c6d4', backgroundColor: '#ffffff', color: '#a5486a', fontWeight: 600, fontSize: 13, cursor: 'pointer' },
  tabActive: { padding: '9px 16px', borderRadius: 20, border: '1px solid #d6336c', backgroundColor: '#d6336c', color: '#ffffff', fontWeight: 600, fontSize: 13, cursor: 'pointer' },
  tabBadge: { marginLeft: 4, fontSize: 11, opacity: 0.8 },
  list: { display: 'flex', flexDirection: 'column', gap: 10 },
  row: { display: 'flex', alignItems: 'center', gap: 12, backgroundColor: '#ffffff', borderRadius: 14, padding: 14 },
  avatarPlaceholder: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#fce8ee', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 },
  rowInfo: { flex: 1 },
  rowNameLine: { display: 'flex', alignItems: 'center', gap: 6 },
  rowName: { fontSize: 14, fontWeight: 700, color: '#5c2a3a', margin: 0 },
  roleBadge: { fontSize: 9, fontWeight: 700, color: '#ffffff', backgroundColor: '#d6336c', borderRadius: 6, padding: '2px 6px' },
  rowMeta: { fontSize: 12, color: '#a5486a', margin: '2px 0 0' },
  commissionBadge: { fontSize: 12, fontWeight: 700, color: '#d6336c', backgroundColor: '#fce8ee', borderRadius: 8, padding: '5px 10px' },
  pendingBadge: { fontSize: 11, fontWeight: 700, color: '#8a6d00', backgroundColor: '#fff3cd', borderRadius: 8, padding: '5px 10px' },
}