'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

type Conversation = {
  userId: string
  name: string
  avatarUrl: string | null
  lastMessageContent: string | null
  lastMessageAt: string
  lastMessageFromMe: boolean
  hasMessages: boolean
}

function formatTimestamp(iso: string): string {
  const date = new Date(iso)
  const now = new Date()
  const isToday = date.toDateString() === now.toDateString()

  if (isToday) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const yesterday = new Date(now)
  yesterday.setDate(now.getDate() - 1)
  if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday'
  }

  return date.toLocaleDateString([], { day: 'numeric', month: 'short' })
}

export default function ChatListClient() {
  const router = useRouter()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/chat/conversations')
      .then((res) => {
        if (!res.ok) throw new Error()
        return res.json()
      })
      .then((data) => setConversations(data.conversations ?? []))
      .catch(() => setError('Failed to load chats'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>Chats</h1>

        {loading ? (
          <p style={styles.statusText}>Loading...</p>
        ) : error ? (
          <p style={styles.statusText}>{error}</p>
        ) : conversations.length === 0 ? (
          <div style={styles.emptyState}>
            <p style={styles.emptyTitle}>No conversations yet</p>
            <p style={styles.emptyText}>
              Once you match with someone through Interests, you'll be able to chat with them here.
            </p>
            <button onClick={() => router.push('/interests')} style={styles.emptyButton}>
              View Interests
            </button>
          </div>
        ) : (
          <div style={styles.list}>
            {conversations.map((c) => (
              <button
                key={c.userId}
                onClick={() => router.push(`/chat/${c.userId}`)}
                style={styles.row}
              >
                {c.avatarUrl ? (
                  <img src={c.avatarUrl} alt="" style={styles.avatar} />
                ) : (
                  <div style={styles.avatarPlaceholder}>👤</div>
                )}
                <div style={styles.rowInfo}>
                  <p style={styles.rowName}>{c.name}</p>
                  <p style={styles.rowPreview}>
                    {c.hasMessages
                      ? `${c.lastMessageFromMe ? 'You: ' : ''}${c.lastMessageContent}`
                      : 'Say hello to start the conversation!'}
                  </p>
                </div>
                <p style={styles.rowTime}>{formatTimestamp(c.lastMessageAt)}</p>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: '100vh', backgroundColor: '#fff0f3', fontFamily: 'system-ui, sans-serif' },
  container: { maxWidth: 640, margin: '0 auto', padding: '32px 24px' },
  title: { fontSize: 24, fontWeight: 700, color: '#5c2a3a', margin: '0 0 20px' },
  statusText: { fontSize: 14, color: '#a5486a', textAlign: 'center' as const, marginTop: 40 },
  emptyState: {
    display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: 10,
    padding: '60px 20px', textAlign: 'center' as const,
  },
  emptyTitle: { fontSize: 16, fontWeight: 700, color: '#5c2a3a', margin: 0 },
  emptyText: { fontSize: 13, color: '#8a5464', margin: 0, maxWidth: 320, lineHeight: 1.5 },
  emptyButton: {
    marginTop: 8, padding: '10px 20px', borderRadius: 12, border: 'none',
    backgroundColor: '#d6336c', color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer',
  },
  list: { display: 'flex', flexDirection: 'column' as const, gap: 8 },
  row: {
    display: 'flex', alignItems: 'center', gap: 12, backgroundColor: '#ffffff',
    borderRadius: 14, padding: 14, border: 'none', cursor: 'pointer', textAlign: 'left' as const,
    width: '100%',
  },
  avatar: { width: 48, height: 48, borderRadius: 24, objectFit: 'cover' as const, flexShrink: 0 },
  avatarPlaceholder: {
    width: 48, height: 48, borderRadius: 24, backgroundColor: '#fce8ee',
    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0,
  },
  rowInfo: { flex: 1, minWidth: 0 },
  rowName: { fontSize: 14, fontWeight: 700, color: '#5c2a3a', margin: '0 0 3px' },
  rowPreview: {
    fontSize: 12, color: '#8a5464', margin: 0, overflow: 'hidden',
    textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const,
  },
  rowTime: { fontSize: 11, color: '#c98ba0', margin: 0, flexShrink: 0 },
}