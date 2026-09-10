'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const DISMISS_KEY = 'sb_profile_banner_dismissed_at'
const DISMISS_DURATION_MS = 24 * 60 * 60 * 1000 // re-show after 24 hours

export default function CompleteProfileBanner() {
  const router = useRouter()
  const [status, setStatus] = useState<{
    profileCompleteness: number
    idVerified: boolean
    idVerificationStatus: string
  } | null>(null)
  const [dismissed, setDismissed] = useState(true) // default hidden until we know it's safe to show

  useEffect(() => {
    const lastDismissed = localStorage.getItem(DISMISS_KEY)
    const stillDismissed = lastDismissed && Date.now() - Number(lastDismissed) < DISMISS_DURATION_MS
    setDismissed(!!stillDismissed)

    fetch('/api/profile/status')
      .then((res) => {
        if (!res.ok) throw new Error()
        return res.json()
      })
      .then(setStatus)
      .catch(() => {
        // fail silently — banner just won't show if status can't be fetched
      })
  }, [])

  const handleDismiss = () => {
    localStorage.setItem(DISMISS_KEY, String(Date.now()))
    setDismissed(true)
  }

  if (!status || dismissed) return null

  const needsProfileWork = status.profileCompleteness < 100
  const needsIdVerification = !status.idVerified && status.idVerificationStatus !== 'pending'

  if (!needsProfileWork && !needsIdVerification) return null

  const message = needsIdVerification && needsProfileWork
    ? `Your profile is ${status.profileCompleteness}% complete and your identity isn't verified yet.`
    : needsIdVerification
      ? "Verify your identity to build trust with other members."
      : `Your profile is ${status.profileCompleteness}% complete. Finish it to get better matches.`

  return (
    <div style={styles.banner}>
      <div style={styles.bannerContent}>
        <div style={styles.progressCircleWrap}>
          <svg width="36" height="36" viewBox="0 0 36 36" style={styles.progressCircle}>
            <circle cx="18" cy="18" r="15.5" fill="none" stroke="#fce8ee" strokeWidth="3" />
            <circle
              cx="18" cy="18" r="15.5" fill="none" stroke="#d6336c" strokeWidth="3"
              strokeDasharray={`${(status.profileCompleteness / 100) * 97.4} 97.4`}
              strokeLinecap="round"
              transform="rotate(-90 18 18)"
            />
          </svg>
          <span style={styles.progressCircleText}>{status.profileCompleteness}%</span>
        </div>
        <p style={styles.bannerText}>{message}</p>
      </div>
      <div style={styles.bannerActions}>
        <button onClick={() => router.push('/profile')} style={styles.bannerButton}>
          {needsIdVerification && !needsProfileWork ? 'Verify Now' : 'Complete Profile'}
        </button>
        <button onClick={handleDismiss} style={styles.dismissButton} aria-label="Dismiss">
          ✕
        </button>
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  banner: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 16,
    backgroundColor: '#fae543',
    border: '1px solid #f6c6d4',
    borderRadius: 14,
    padding: '12px 18px',
    margin: '16px 24px',
    flexWrap: 'wrap' as const,
  },
  bannerContent: { display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 200 },
  progressCircleWrap: { position: 'relative' as const, width: 36, height: 36, flexShrink: 0 },
  progressCircle: { display: 'block' },
  progressCircleText: {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    fontSize: 9,
    fontWeight: 700,
    color: '#d6336c',
  },
  bannerText: { fontSize: 13, color: '#5c2a3a', margin: 0, lineHeight: 1.4 },
  bannerActions: { display: 'flex', alignItems: 'center', gap: 8 },
  bannerButton: {
    padding: '8px 16px',
    borderRadius: 10,
    border: 'none',
    backgroundColor: '#d6336c',
    color: '#fff',
    fontWeight: 700,
    fontSize: 12,
    cursor: 'pointer',
    whiteSpace: 'nowrap' as const,
  },
  dismissButton: {
    background: 'none',
    border: 'none',
    color: '#a5486a',
    cursor: 'pointer',
    fontSize: 14,
    padding: 4,
  },
}