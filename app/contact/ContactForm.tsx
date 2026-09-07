// app/(web)/contact/ContactForm.tsx
'use client'

import { useState } from 'react'

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setSending(true)

    const formData = new FormData(e.currentTarget)

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.get('name'),
          email: formData.get('email'),
          message: formData.get('message'),
        }),
      })

      if (!res.ok) throw new Error()
      setSubmitted(true)
    } catch {
      setError('Something went wrong. Please try again or email us directly.')
    } finally {
      setSending(false)
    }
  }

  if (submitted) {
    return (
      <div style={styles.successCard}>
        <h3 style={styles.successTitle}>Message sent!</h3>
        <p style={styles.successText}>Thanks for reaching out — we'll get back to you within 1-2 business days.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} style={styles.card}>
      <label style={styles.label}>Name</label>
      <input name="name" type="text" required style={styles.input} />

      <label style={styles.label}>Email</label>
      <input name="email" type="email" required style={styles.input} />

      <label style={styles.label}>Message</label>
      <textarea name="message" required style={{ ...styles.input, height: 120, resize: 'vertical' as const }} />

      {error && <p style={styles.error}>{error}</p>}

      <button type="submit" disabled={sending} style={styles.button}>
        {sending ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  )
}

const styles: Record<string, React.CSSProperties> = {
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 28,
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    boxShadow: '0 4px 16px rgba(214,51,108,0.06)',
  },
  label: { fontSize: 13, fontWeight: 600, color: '#a5486a', marginTop: 12 },
  input: {
    padding: '10px 12px',
    borderRadius: 10,
    border: '1px solid #f6c6d4',
    fontSize: 14,
    marginTop: 4,
  },
  error: { color: '#e03131', fontSize: 13, marginTop: 12 },
  button: {
    marginTop: 20,
    padding: 13,
    borderRadius: 12,
    border: 'none',
    backgroundColor: '#d6336c',
    color: '#fff',
    fontWeight: 700,
    fontSize: 15,
    cursor: 'pointer',
  },
  successCard: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 36,
    textAlign: 'center',
    boxShadow: '0 4px 16px rgba(214,51,108,0.06)',
  },
  successTitle: { fontSize: 18, fontWeight: 700, color: '#5c2a3a', margin: '0 0 8px' },
  successText: { fontSize: 14, color: '#8a5464', lineHeight: 1.5, margin: 0 },
}