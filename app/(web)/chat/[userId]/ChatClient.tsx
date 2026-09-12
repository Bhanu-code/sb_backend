'use client'

import { useEffect, useRef, useState } from 'react'
import { useWebSocketChat } from '@/lib/useWebSocketChat'

type Message = {
  conversationId: string
  createdAt: string
  senderId: string
  receiverId: string
  content: string | null
  mediaUrl: string | null
  mediaType: 'image' | 'file' | null
  read: boolean
}

function formatLastSeen(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diffMs / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  return new Date(iso).toLocaleDateString()
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
  const [otherTyping, setOtherTyping] = useState(false)
  const [presence, setPresence] = useState<{ online: boolean; lastSeenAt: string | null } | null>(null)
  const [uploadingMedia, setUploadingMedia] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const wasTypingRef = useRef(false)

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

  // Poll presence every 15s while this chat is open
  useEffect(() => {
    const checkPresence = async () => {
      try {
        const res = await fetch(`/api/chat/presence/${otherUser.id}`)
        if (res.ok) setPresence(await res.json())
      } catch {
        // silent
      }
    }
    checkPresence()
    const interval = setInterval(checkPresence, 15000)
    return () => clearInterval(interval)
  }, [otherUser.id])

  const { connected, sendMessage, sendTyping } = useWebSocketChat(
    token,
    (msg) => {
      if (
        (msg.senderId === currentUserId && msg.receiverId === otherUser.id) ||
        (msg.senderId === otherUser.id && msg.receiverId === currentUserId)
      ) {
        setMessages((prev) => [...prev, msg])
        if (msg.senderId === otherUser.id) setOtherTyping(false)
      }
    },
    (senderId, isTyping) => {
      if (senderId === otherUser.id) setOtherTyping(isTyping)
    }
  )

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, otherTyping])

  const handleInputChange = (value: string) => {
    setInput(value)

    if (!wasTypingRef.current && value.trim()) {
      wasTypingRef.current = true
      sendTyping(otherUser.id, true)
    }

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
    typingTimeoutRef.current = setTimeout(() => {
      wasTypingRef.current = false
      sendTyping(otherUser.id, false)
    }, 2000)
  }

  const handleSend = () => {
    if (!input.trim()) return
    sendMessage(otherUser.id, input.trim())
    setInput('')
    wasTypingRef.current = false
    sendTyping(otherUser.id, false)
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
  }

  const handleMediaUpload = async (file: File) => {
    setUploadingMedia(true)
    try {
      const isImage = file.type.startsWith('image/')
      const presignRes = await fetch('/api/upload/presign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contentType: file.type, folder: 'chat-media' }),
      })
      if (!presignRes.ok) throw new Error()
      const { uploadUrl, publicUrl } = await presignRes.json()

      const uploadRes = await fetch(uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
      })
      if (!uploadRes.ok) throw new Error()

      sendMessage(otherUser.id, '', publicUrl, isImage ? 'image' : 'file')
    } catch {
      alert('Failed to upload file')
    } finally {
      setUploadingMedia(false)
    }
  }

  const statusText = presence?.online
    ? '● Online'
    : presence?.lastSeenAt
      ? `Last seen ${formatLastSeen(presence.lastSeenAt)}`
      : connected ? '' : 'Connecting...'

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
          <p style={styles.status}>{otherTyping ? 'typing...' : statusText}</p>
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
                  {msg.mediaType === 'image' && msg.mediaUrl ? (
                    <img src={msg.mediaUrl} alt="Shared media" style={styles.bubbleImage} />
                  ) : msg.mediaType === 'file' && msg.mediaUrl ? (
                    <a href={msg.mediaUrl} target="_blank" rel="noopener noreferrer" style={styles.bubbleFileLink}>
                      📎 Attachment
                    </a>
                  ) : null}
                  {msg.content && <p style={styles.bubbleText}>{msg.content}</p>}
                  <p style={styles.bubbleTime}>
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            )
          })
        )}
        {otherTyping && (
          <div style={{ ...styles.bubbleRow, justifyContent: 'flex-start' }}>
            <div style={styles.typingBubble}>
              <span style={styles.typingDot} />
              <span style={styles.typingDot} />
              <span style={styles.typingDot} />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div style={styles.inputRow}>
        <label style={styles.attachButton}>
          {uploadingMedia ? '...' : '📎'}
          <input
            type="file"
            accept="image/*,.pdf,.doc,.docx"
            style={{ display: 'none' }}
            onChange={(e) => e.target.files?.[0] && handleMediaUpload(e.target.files[0])}
            disabled={uploadingMedia}
          />
        </label>
        <input
          type="text"
          value={input}
          onChange={(e) => handleInputChange(e.target.value)}
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
  page: { display: 'flex', flexDirection: 'column', height: 'calc(100vh - 65px)', backgroundColor: '#fff0f3', fontFamily: 'system-ui, sans-serif' },
  header: { display: 'flex', alignItems: 'center', gap: 12, padding: '14px 24px', backgroundColor: '#ffffff', borderBottom: '1px solid #f6c6d4' },
  avatar: { width: 40, height: 40, borderRadius: 20, objectFit: 'cover' },
  avatarPlaceholder: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#fce8ee', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 },
  name: { fontSize: 15, fontWeight: 700, color: '#5c2a3a', margin: 0 },
  status: { fontSize: 11, color: '#a5486a', margin: 0, minHeight: 14 },
  messagesArea: { flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 10 },
  statusText: { color: '#a5486a', fontSize: 13, textAlign: 'center', marginTop: 40 },
  bubbleRow: { display: 'flex' },
  bubbleMine: { backgroundColor: '#d6336c', color: '#fff', borderRadius: '16px 16px 4px 16px', padding: '10px 14px', maxWidth: '65%' },
  bubbleOther: { backgroundColor: '#ffffff', color: '#5c2a3a', borderRadius: '16px 16px 16px 4px', padding: '10px 14px', maxWidth: '65%' },
  bubbleImage: { maxWidth: '100%', borderRadius: 10, marginBottom: 6, display: 'block' },
  bubbleFileLink: { color: 'inherit', fontSize: 13, fontWeight: 600, textDecoration: 'underline', display: 'block', marginBottom: 6 },
  bubbleText: { fontSize: 14, margin: 0, lineHeight: 1.4 },
  bubbleTime: { fontSize: 10, opacity: 0.7, margin: '4px 0 0', textAlign: 'right' },
  typingBubble: { backgroundColor: '#ffffff', borderRadius: '16px 16px 16px 4px', padding: '12px 16px', display: 'flex', gap: 4 },
  typingDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#c98ba0', display: 'inline-block' },
  inputRow: { display: 'flex', gap: 10, padding: '14px 24px', backgroundColor: '#ffffff', borderTop: '1px solid #f6c6d4', alignItems: 'center' },
  attachButton: { fontSize: 20, cursor: 'pointer', padding: 4 },
  input: { flex: 1, padding: '11px 14px', borderRadius: 20, border: '1px solid #f6c6d4', fontSize: 14 },
  sendButton: { padding: '11px 22px', borderRadius: 20, border: 'none', backgroundColor: '#d6336c', color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer' },
}