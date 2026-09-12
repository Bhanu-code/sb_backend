// lib/useWebSocketChat.ts
'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

type ChatMessage = {
  conversationId: string
  createdAt: string
  senderId: string
  receiverId: string
  content: string | null
  mediaUrl: string | null
  mediaType: 'image' | 'file' | null
  read: boolean
}

const WS_URL = process.env.NEXT_PUBLIC_CHAT_WS_URL!

export function useWebSocketChat(
  token: string | null,
  onMessage: (msg: ChatMessage) => void,
  onTyping: (senderId: string, isTyping: boolean) => void
) {
  const wsRef = useRef<WebSocket | null>(null)
  const [connected, setConnected] = useState(false)
  const reconnectTimeout = useRef<NodeJS.Timeout | null>(null)
  const onMessageRef = useRef(onMessage)
  const onTypingRef = useRef(onTyping)
  onMessageRef.current = onMessage
  onTypingRef.current = onTyping

  const connect = useCallback(() => {
    if (!token) return

    const ws = new WebSocket(`${WS_URL}?token=${encodeURIComponent(token)}`)

    ws.onopen = () => setConnected(true)

    ws.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data)
        if (parsed.type === 'message') {
          onMessageRef.current(parsed.data)
        } else if (parsed.type === 'typing') {
          onTypingRef.current(parsed.data.senderId, parsed.data.isTyping)
        }
      } catch (err) {
        console.error('Failed to parse WS message:', err)
      }
    }

    ws.onclose = () => {
      setConnected(false)
      reconnectTimeout.current = setTimeout(connect, 2000)
    }

    ws.onerror = () => ws.close()

    wsRef.current = ws
  }, [token])

  useEffect(() => {
    connect()
    return () => {
      if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current)
      wsRef.current?.close()
    }
  }, [connect])

  const sendMessage = useCallback((receiverId: string, content: string, mediaUrl?: string, mediaType?: 'image' | 'file') => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({ action: 'sendMessage', data: { receiverId, content, mediaUrl, mediaType } })
      )
    }
  }, [])

  const sendTyping = useCallback((receiverId: string, isTyping: boolean) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ action: 'typing', data: { receiverId, isTyping } }))
    }
  }, [])

  return { connected, sendMessage, sendTyping }
}