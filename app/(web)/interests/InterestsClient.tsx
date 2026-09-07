'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

type InterestItem = {
  id: string
  status: 'pending' | 'accepted' | 'declined'
  direction: 'sent' | 'received'
  createdAt: string
  user: {
    id: string
    name: string
    age: number | null
    profession: string | null
    avatarUrl: string | null
  }
}

function timeAgo(dateString: string): string {
  const diffMs = Date.now() - new Date(dateString).getTime()
  const mins = Math.floor(diffMs / 60000)
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}


export default function InterestsClient() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'requests' | 'matches'>('requests')
  const [interests, setInterests] = useState<InterestItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  
  const fetchInterests = useCallback(async () => {
    setError('')
    try {
      const res = await fetch('/api/interests')
      if (!res.ok) throw new Error()
        const data = await res.json()
      setInterests(data.interests ?? [])
    } catch {
      setError('Failed to load interests')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchInterests()
  }, [fetchInterests])

  const receivedPending = interests.filter((i) => i.direction === 'received' && i.status === 'pending')
  const sentPending = interests.filter((i) => i.direction === 'sent' && i.status === 'pending')
  const requestsList = [...receivedPending, ...sentPending]
  const acceptedInterests = interests.filter((i) => i.status === 'accepted')

  const respond = async (interestId: string, action: 'accept' | 'decline') => {
    setInterests((prev) =>
      prev.map((i) =>
        i.id === interestId ? { ...i, status: action === 'accept' ? 'accepted' : 'declined' } : i
      )
    )

    try {
      const res = await fetch(`/api/interests/${interestId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      })
      if (!res.ok) fetchInterests()
    } catch {
      fetchInterests()
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>Interests</h1>

        <div style={styles.tabsRow}>
          <button
            onClick={() => setActiveTab('requests')}
            style={activeTab === 'requests' ? styles.tabActive : styles.tab}
          >
            Requests
            {receivedPending.length > 0 && (
              <span style={styles.tabBadge}>{receivedPending.length}</span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('matches')}
            style={activeTab === 'matches' ? styles.tabActive : styles.tab}
          >
            Matches
          </button>
        </div>

        {loading ? (
          <p style={styles.statusText}>Loading...</p>
        ) : error ? (
          <div style={styles.emptyState}>
            <p style={styles.statusText}>{error}</p>
            <button onClick={fetchInterests} style={styles.retryButton}>Retry</button>
          </div>
        ) : activeTab === 'requests' ? (
          requestsList.length > 0 ? (
            <div style={styles.list}>
              {requestsList.map((item) => (
                <div key={item.id} style={styles.row}>
                  {item.user.avatarUrl ? (
                    <img src={item.user.avatarUrl} alt="" style={styles.avatar} />
                  ) : (
                    <div style={styles.avatarPlaceholder}>👤</div>
                  )}
                  <div style={styles.rowInfo}>
                    <p style={styles.rowName}>
                      {item.user.name}
                      {item.user.age ? `, ${item.user.age}` : ''}
                    </p>
                    {item.user.profession && <p style={styles.rowMeta}>{item.user.profession}</p>}
                    <p style={styles.rowTime}>{timeAgo(item.createdAt)}</p>
                  </div>

                  {item.direction === 'received' ? (
                    <div style={styles.actionButtons}>
                      <button onClick={() => respond(item.id, 'decline')} style={styles.declineButton}>✕</button>
                      <button onClick={() => respond(item.id, 'accept')} style={styles.acceptButton}>✓</button>
                    </div>
                  ) : (
                    <span style={styles.pendingBadge}>Pending</span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div style={styles.emptyState}>
              <p style={styles.statusText}>No pending requests</p>
            </div>
          )
        ) : acceptedInterests.length > 0 ? (
          <div style={styles.list}>
            {acceptedInterests.map((item) => (
              <div key={item.id} style={styles.row} onClick={() => router.push(`/chat/${item.user.id}`)}>
                {item.user.avatarUrl ? (
                  <img src={item.user.avatarUrl} alt="" style={styles.avatar} />
                ) : (
                  <div style={styles.avatarPlaceholder}>👤</div>
                )}
                <div style={styles.rowInfo}>
                  <p style={styles.rowName}>{item.user.name}</p>
                  <p style={styles.rowMeta}>You matched — say hello!</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={styles.emptyState}>
            <p style={styles.statusText}>No matches yet</p>
          </div>
        )}
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: '100vh', backgroundColor: '#fff0f3', fontFamily: 'system-ui, sans-serif', padding: '32px 20px' },
  container: { maxWidth: 560, margin: '0 auto' },
  title: { color: '#5c2a3a', fontSize: 24, fontWeight: 700, marginBottom: 20 },
  tabsRow: { display: 'flex', backgroundColor: '#ffffff', borderRadius: 12, padding: 4, marginBottom: 16, width: 280 },
  tab: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    padding: '9px 0',
    borderRadius: 9,
    border: 'none',
    backgroundColor: 'transparent',
    color: '#a5486a',
    fontWeight: 600,
    fontSize: 13,
    cursor: 'pointer',
  },
  tabActive: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    padding: '9px 0',
    borderRadius: 9,
    border: 'none',
    backgroundColor: '#d6336c',
    color: '#ffffff',
    fontWeight: 600,
    fontSize: 13,
    cursor: 'pointer',
  },
  tabBadge: {
    backgroundColor: '#ffffff',
    color: '#d6336c',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    fontSize: 10,
    fontWeight: 700,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 5px',
  },
  statusText: { color: '#a5486a', fontSize: 14, textAlign: 'center' },
  emptyState: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, paddingTop: 40 },
  retryButton: {
    padding: '8px 20px',
    borderRadius: 10,
    border: 'none',
    backgroundColor: '#d6336c',
    color: '#fff',
    fontWeight: 700,
    fontSize: 13,
    cursor: 'pointer',
  },
  list: { display: 'flex', flexDirection: 'column', gap: 10 },
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
  },
  avatar: { width: 52, height: 52, borderRadius: 26, objectFit: 'cover' },
  avatarPlaceholder: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#fce8ee',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 22,
  },
  rowInfo: { flex: 1 },
  rowName: { fontSize: 14, fontWeight: 700, color: '#5c2a3a', margin: 0 },
  rowMeta: { fontSize: 12, color: '#8a5464', margin: '2px 0 0' },
  rowTime: { fontSize: 11, color: '#c98ba0', margin: '2px 0 0' },
  actionButtons: { display: 'flex', gap: 8 },
  declineButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    border: 'none',
    backgroundColor: '#fce8ee',
    color: '#e03131',
    cursor: 'pointer',
    fontSize: 14,
  },
  acceptButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    border: 'none',
    backgroundColor: '#d6336c',
    color: '#fff',
    cursor: 'pointer',
    fontSize: 14,
  },
  pendingBadge: {
    fontSize: 11,
    fontWeight: 600,
    color: '#a5486a',
    backgroundColor: '#fff5f7',
    border: '1px solid #f6c6d4',
    borderRadius: 8,
    padding: '5px 10px',
  },
}