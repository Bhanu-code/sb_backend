'use client'

import { useEffect, useRef, useState } from 'react'
import { useWebSocketChat } from '@/lib/useWebSocketChat'

type Message = {
  conversationId: string
  createdAt: string
  senderId: string
  receiverId: string
  content: string
  read: boolean
}

export default function ChatClient({
  currentUserId,
  otherUser,
}: {
  currentUserId: string
  otherUser: { id: string; name: string; avatarUrl: string | null }
}) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const bottomRef = useRef<HTMLDivElement>(null)

  // Load history + get a WS token on mount
  useEffect(() => {
    const load = async () => {
      const [historyRes, tokenRes] = await Promise.all([
        fetch(`/api/chat/${otherUser.id}`),
        fetch('/api/chat/ws-token'),
      ])
      const historyData = await historyRes.json()
      const tokenData = await tokenRes.json()

      setMessages(historyData.messages ?? [])
      setToken(tokenData.token ?? null)
      setLoading(false)
    }
    load()
  }, [otherUser.id])

  const { connected, sendMessage } = useWebSocketChat(token, (msg) => {
    // Only append if it belongs to this conversation
    if (
      (msg.senderId === currentUserId && msg.receiverId === otherUser.id) ||
      (msg.senderId === otherUser.id && msg.receiverId === currentUserId)
    ) {
      setMessages((prev) => [...prev, msg])
    }
  })

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = () => {
    if (!input.trim()) return
    sendMessage(otherUser.id, input.trim())
    setInput('')
  }

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        {otherUser.avatarUrl ? (
          <img src={otherUser.avatarUrl} alt="" style={styles.avatar} />
        ) : (
          <div style={styles.avatarPlaceholder}>👤</div>
        )}
        <div>
          <p style={styles.name}>{otherUser.name}</p>
          <p style={styles.status}>{connected ? '● Online' : 'Connecting...'}</p>
        </div>
      </div>

      <div style={styles.messagesArea}>
        {loading ? (
          <p style={styles.statusText}>Loading messages...</p>
        ) : messages.length === 0 ? (
          <p style={styles.statusText}>Say hello to start the conversation!</p>
        ) : (
          messages.map((msg, i) => {
            const mine = msg.senderId === currentUserId
            return (
              <div key={i} style={{ ...styles.bubbleRow, justifyContent: mine ? 'flex-end' : 'flex-start' }}>
                <div style={mine ? styles.bubbleMine : styles.bubbleOther}>
                  <p style={styles.bubbleText}>{msg.content}</p>
                  <p style={styles.bubbleTime}>
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            )
          })
        )}
        <div ref={bottomRef} />
      </div>

      <div style={styles.inputRow}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type a message..."
          style={styles.input}
        />
        <button onClick={handleSend} style={styles.sendButton}>Send</button>
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    display: 'flex',
    flexDirection: 'column',
    height: 'calc(100vh - 65px)', // minus navbar height
    backgroundColor: '#fff0f3',
    fontFamily: 'system-ui, sans-serif',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '14px 24px',
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #f6c6d4',
  },
  avatar: { width: 40, height: 40, borderRadius: 20, objectFit: 'cover' },
  avatarPlaceholder: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: '#fce8ee',
    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
  },
  name: { fontSize: 15, fontWeight: 700, color: '#5c2a3a', margin: 0 },
  status: { fontSize: 11, color: '#a5486a', margin: 0 },
  messagesArea: { flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 10 },
  statusText: { color: '#a5486a', fontSize: 13, textAlign: 'center', marginTop: 40 },
  bubbleRow: { display: 'flex' },
  bubbleMine: {
    backgroundColor: '#d6336c', color: '#fff', borderRadius: '16px 16px 4px 16px',
    padding: '10px 14px', maxWidth: '65%',
  },
  bubbleOther: {
    backgroundColor: '#ffffff', color: '#5c2a3a', borderRadius: '16px 16px 16px 4px',
    padding: '10px 14px', maxWidth: '65%',
  },
  bubbleText: { fontSize: 14, margin: 0, lineHeight: 1.4 },
  bubbleTime: { fontSize: 10, opacity: 0.7, margin: '4px 0 0', textAlign: 'right' },
  inputRow: {
    display: 'flex', gap: 10, padding: '14px 24px', backgroundColor: '#ffffff', borderTop: '1px solid #f6c6d4',
  },
  input: {
    flex: 1, padding: '11px 14px', borderRadius: 20, border: '1px solid #f6c6d4', fontSize: 14,color: '#a5486a', marginTop: 10
  },
  sendButton: {
    padding: '11px 22px', borderRadius: 20, border: 'none', backgroundColor: '#d6336c',
    color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer',
  },
}