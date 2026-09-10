'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SettingsClient({ email }: { email: string | null }) {
  const router = useRouter()
  const [confirmText, setConfirmText] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')
  const [showConfirm, setShowConfirm] = useState(false)

  const handleDelete = async () => {
    setError('')
    setDeleting(true)
    try {
      const res = await fetch('/api/account/delete', { method: 'DELETE' })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Failed to delete account')
        setDeleting(false)
        return
      }
      router.push('/')
    } catch {
      setError('Network error. Please try again.')
      setDeleting(false)
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>Settings</h1>

        <div style={styles.dangerZone}>
          <h2 style={styles.dangerTitle}>Delete Account</h2>
          <p style={styles.dangerText}>
            This will permanently delete your account, profile, photos, posts, matches,
            conversations, and all related data for <strong>{email}</strong>. This action
            cannot be undone.
          </p>

          {!showConfirm ? (
            <button onClick={() => setShowConfirm(true)} style={styles.deleteButton}>
              Delete My Account
            </button>
          ) : (
            <div style={styles.confirmBox}>
              <p style={styles.confirmLabel}>
                Type <strong>DELETE</strong> to confirm
              </p>
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                style={styles.confirmInput}
                placeholder="DELETE"
              />

              {error && <p style={styles.error}>{error}</p>}

              <div style={styles.confirmActions}>
                <button
                  onClick={() => {
                    setShowConfirm(false)
                    setConfirmText('')
                    setError('')
                  }}
                  style={styles.cancelButton}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={confirmText !== 'DELETE' || deleting}
                  style={styles.confirmDeleteButton}
                >
                  {deleting ? 'Deleting...' : 'Permanently Delete'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: '100vh', backgroundColor: '#fff0f3', fontFamily: 'system-ui, sans-serif' },
  container: { maxWidth: 560, margin: '0 auto', padding: '32px 24px' },
  title: { fontSize: 24, fontWeight: 700, color: '#5c2a3a', margin: '0 0 24px' },
  dangerZone: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    border: '1px solid #fce8e8',
  },
  dangerTitle: { fontSize: 16, fontWeight: 700, color: '#c0392b', margin: '0 0 10px' },
  dangerText: { fontSize: 13, color: '#5c2a3a', lineHeight: 1.6, margin: '0 0 18px' },
  deleteButton: {
    padding: '11px 22px',
    borderRadius: 10,
    border: '1px solid #e03131',
    backgroundColor: '#ffffff',
    color: '#e03131',
    fontWeight: 700,
    fontSize: 14,
    cursor: 'pointer',
  },
  confirmBox: { backgroundColor: '#fce8e8', borderRadius: 12, padding: 18, color: '#5c2a3a', marginTop: 12 },
  confirmLabel: { fontSize: 13, color: '#5c2a3a', margin: '0 0 10px' },
  confirmInput: {
    width: '100%',
    padding: '10px 12px',
    borderRadius: 10,
    border: '1px solid #e03131',
    fontSize: 14,
    boxSizing: 'border-box' as const,
    marginBottom: 12,
  },
  error: { color: '#c0392b', fontSize: 13, marginBottom: 12 },
  confirmActions: { display: 'flex', gap: 10 },
  cancelButton: {
    flex: 1,
    padding: 11,
    borderRadius: 10,
    border: '1px solid #f6c6d4',
    backgroundColor: '#ffffff',
    color: '#a5486a',
    fontWeight: 600,
    fontSize: 14,
    cursor: 'pointer',
  },
  confirmDeleteButton: {
    flex: 1,
    padding: 11,
    borderRadius: 10,
    border: 'none',
    backgroundColor: '#e79f9f',
    color: '#dd1313',
    fontWeight: 700,
    fontSize: 14,
    cursor: 'pointer',
  },
}