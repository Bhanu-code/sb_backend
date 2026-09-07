// lib/useWebSocketChat.ts
'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

type ChatMessage = {
  conversationId: string
  createdAt: string
  senderId: string
  receiverId: string
  content: string
  read: boolean
}

const WS_URL = process.env.NEXT_PUBLIC_CHAT_WS_URL! // e.g. wss://xxxxx.execute-api.region.amazonaws.com/prod

export function useWebSocketChat(token: string | null, onMessage: (msg: ChatMessage) => void) {
  const wsRef = useRef<WebSocket | null>(null)
  const [connected, setConnected] = useState(false)
  const reconnectTimeout = useRef<NodeJS.Timeout | null>(null)
  const onMessageRef = useRef(onMessage)
  onMessageRef.current = onMessage

  const connect = useCallback(() => {
    if (!token) return

    const ws = new WebSocket(`${WS_URL}?token=${encodeURIComponent(token)}`)

    ws.onopen = () => {
      setConnected(true)
    }

    ws.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data)
        if (parsed.type === 'message') {
          onMessageRef.current(parsed.data)
        }
      } catch (err) {
        console.error('Failed to parse WS message:', err)
      }
    }

    ws.onclose = () => {
      setConnected(false)
      // Reconnect after a short delay — handles the connection dropping
      // due to network blips or the API Gateway's ~10min idle timeout
      reconnectTimeout.current = setTimeout(connect, 2000)
    }

    ws.onerror = () => {
      ws.close()
    }

    wsRef.current = ws
  }, [token])

  useEffect(() => {
    connect()
    return () => {
      if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current)
      wsRef.current?.close()
    }
  }, [connect])

  const sendMessage = useCallback((receiverId: string, content: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({ action: 'sendMessage', data: { receiverId, content } })
      )
    }
  }, [])

  return { connected, sendMessage }
}