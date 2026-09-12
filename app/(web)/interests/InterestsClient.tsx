'use client'

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

type Tab = 'sent' | 'received'
type StatusFilter = 'all' | 'pending' | 'approved' | 'rejected'

function timeAgo(dateString: string): string {
  const diffMs = Date.now() - new Date(dateString).getTime()
  const mins = Math.floor(diffMs / 60000)
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

// Maps the UI's "approved/rejected" filter language onto the backend's
// actual status values ("accepted"/"declined"), since the schema and the
// requested filter labels don't use the same words for the same states.
function matchesStatusFilter(itemStatus: InterestItem['status'], filter: StatusFilter): boolean {
  if (filter === 'all') return true
  if (filter === 'pending') return itemStatus === 'pending'
  if (filter === 'approved') return itemStatus === 'accepted'
  if (filter === 'rejected') return itemStatus === 'declined'
  return true
}

const STATUS_FILTERS: { key: StatusFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'approved', label: 'Approved' },
  { key: 'rejected', label: 'Rejected' },
]

export default function InterestsClient() {
  const [activeTab, setActiveTab] = useState<Tab>('received')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
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

  // Reset the status filter back to "All" when switching between Sent/Received,
  // so a filter chosen in one tab doesn't silently carry over and hide
  // everything in the other tab.
  const switchTab = (tab: Tab) => {
    setActiveTab(tab)
    setStatusFilter('all')
  }

  const tabItems = interests.filter((i) => i.direction === activeTab)
  const visibleItems = tabItems.filter((i) => matchesStatusFilter(i.status, statusFilter))

  const countFor = (filter: StatusFilter) =>
    tabItems.filter((i) => matchesStatusFilter(i.status, filter)).length

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

  const receivedPendingCount = interests.filter(
    (i) => i.direction === 'received' && i.status === 'pending'
  ).length

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>Interests</h1>

        <div style={styles.tabsRow}>
          <button
            onClick={() => switchTab('received')}
            style={activeTab === 'received' ? styles.tabActive : styles.tab}
          >
            Received Interest
            {receivedPendingCount > 0 && <span style={styles.tabBadge}>{receivedPendingCount}</span>}
          </button>
          <button
            onClick={() => switchTab('sent')}
            style={activeTab === 'sent' ? styles.tabActive : styles.tab}
          >
            Send Interest
          </button>
        </div>

        <div style={styles.statusFilterRow}>
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setStatusFilter(f.key)}
              style={statusFilter === f.key ? styles.statusChipActive : styles.statusChip}
            >
              {f.label} <span style={styles.statusChipCount}>{countFor(f.key)}</span>
            </button>
          ))}
        </div>

        {loading ? (
          <p style={styles.statusText}>Loading...</p>
        ) : error ? (
          <div style={styles.emptyState}>
            <p style={styles.statusText}>{error}</p>
            <button onClick={fetchInterests} style={styles.retryButton}>Retry</button>
          </div>
        ) : visibleItems.length === 0 ? (
          <div style={styles.emptyState}>
            <p style={styles.statusText}>
              No {statusFilter !== 'all' ? STATUS_FILTERS.find((f) => f.key === statusFilter)?.label.toLowerCase() : ''}{' '}
              {activeTab === 'received' ? 'received' : 'sent'} interests
            </p>
          </div>
        ) : (
          <div style={styles.list}>
            {visibleItems.map((item) => (
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

                {item.direction === 'received' && item.status === 'pending' ? (
                  <div style={styles.actionButtons}>
                    <button onClick={() => respond(item.id, 'decline')} style={styles.declineButton}>✕</button>
                    <button onClick={() => respond(item.id, 'accept')} style={styles.acceptButton}>✓</button>
                  </div>
                ) : (
                  <StatusBadge status={item.status} />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: InterestItem['status'] }) {
  if (status === 'accepted') {
    return <span style={styles.badgeApproved}>Approved</span>
  }
  if (status === 'declined') {
    return <span style={styles.badgeRejected}>Rejected</span>
  }
  return <span style={styles.badgePending}>Pending</span>
}

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: '100vh', backgroundColor: '#fff0f3', fontFamily: 'system-ui, sans-serif', padding: '32px 20px' },
  container: { maxWidth: 640, margin: '0 auto' },
  title: { color: '#5c2a3a', fontSize: 24, fontWeight: 700, marginBottom: 20 },
  tabsRow: {
    display: 'flex', backgroundColor: '#ffffff', borderRadius: 12, padding: 4,
    marginBottom: 14, maxWidth: 400,
  },
  tab: {
    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
    padding: '9px 0', borderRadius: 9, border: 'none', backgroundColor: 'transparent',
    color: '#a5486a', fontWeight: 600, fontSize: 13, cursor: 'pointer',
  },
  tabActive: {
    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
    padding: '9px 0', borderRadius: 9, border: 'none', backgroundColor: '#d6336c',
    color: '#ffffff', fontWeight: 600, fontSize: 13, cursor: 'pointer',
  },
  tabBadge: {
    backgroundColor: '#ffffff', color: '#d6336c', borderRadius: 10, minWidth: 18, height: 18,
    fontSize: 10, fontWeight: 700, display: 'inline-flex', alignItems: 'center',
    justifyContent: 'center', padding: '0 5px',
  },
  statusFilterRow: { display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' as const },
  statusChip: {
    padding: '7px 14px', borderRadius: 20, border: '1px solid #f6c6d4', backgroundColor: '#ffffff',
    color: '#a5486a', fontWeight: 600, fontSize: 12, cursor: 'pointer',
    display: 'flex', alignItems: 'center', gap: 5,
  },
  statusChipActive: {
    padding: '7px 14px', borderRadius: 20, border: '1px solid #d6336c', backgroundColor: '#d6336c',
    color: '#ffffff', fontWeight: 600, fontSize: 12, cursor: 'pointer',
    display: 'flex', alignItems: 'center', gap: 5,
  },
  statusChipCount: { opacity: 0.75, fontSize: 11 },
  statusText: { color: '#a5486a', fontSize: 14, textAlign: 'center' as const },
  emptyState: { display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: 12, paddingTop: 40 },
  retryButton: {
    padding: '8px 20px', borderRadius: 10, border: 'none', backgroundColor: '#d6336c',
    color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer',
  },
  list: { display: 'flex', flexDirection: 'column' as const, gap: 10 },
  row: {
    display: 'flex', alignItems: 'center', gap: 12, backgroundColor: '#ffffff',
    borderRadius: 14, padding: 14,
  },
  avatar: { width: 52, height: 52, borderRadius: 26, objectFit: 'cover' as const },
  avatarPlaceholder: {
    width: 52, height: 52, borderRadius: 26, backgroundColor: '#fce8ee',
    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
  },
  rowInfo: { flex: 1 },
  rowName: { fontSize: 14, fontWeight: 700, color: '#5c2a3a', margin: 0 },
  rowMeta: { fontSize: 12, color: '#8a5464', margin: '2px 0 0' },
  rowTime: { fontSize: 11, color: '#c98ba0', margin: '2px 0 0' },
  actionButtons: { display: 'flex', gap: 8 },
  declineButton: {
    width: 34, height: 34, borderRadius: 17, border: 'none', backgroundColor: '#fce8ee',
    color: '#e03131', cursor: 'pointer', fontSize: 14,
  },
  acceptButton: {
    width: 34, height: 34, borderRadius: 17, border: 'none', backgroundColor: '#d6336c',
    color: '#fff', cursor: 'pointer', fontSize: 14,
  },
  badgePending: {
    fontSize: 11, fontWeight: 700, color: '#8a6d00', backgroundColor: '#fff3cd',
    borderRadius: 8, padding: '5px 10px',
  },
  badgeApproved: {
    fontSize: 11, fontWeight: 700, color: '#1a7a3d', backgroundColor: '#d4f4dd',
    borderRadius: 8, padding: '5px 10px',
  },
  badgeRejected: {
    fontSize: 11, fontWeight: 700, color: '#c0392b', backgroundColor: '#fce8e8',
    borderRadius: 8, padding: '5px 10px',
  },
}