// app/advisor/profile/ProfileClient.tsx
'use client'

import { useEffect, useState } from 'react'

type AdvisorProfile = {
  fullName: string | null
  email: string | null
  phone: string | null
  role: string
  referralCode: string
  avatarUrl: string | null
  address: string | null
  city: string | null
  state: string | null
  pincode: string | null
}

export default function ProfileClient() {
  const [profile, setProfile] = useState<AdvisorProfile | null>(null)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ fullName: '', phone: '', address: '', city: '', state: '', pincode: '' })
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const loadProfile = async () => {
    const res = await fetch('/api/advisor/profile')
    if (res.ok) {
      const data: AdvisorProfile = await res.json()
      setProfile(data)
      setForm({
        fullName: data.fullName ?? '',
        phone: data.phone ?? '',
        address: data.address ?? '',
        city: data.city ?? '',
        state: data.state ?? '',
        pincode: data.pincode ?? '',
      })
      setAvatarUrl(data.avatarUrl)
    }
  }

  useEffect(() => {
    loadProfile()
  }, [])

  const uploadAvatar = async (file: File) => {
    setError('')
    setUploading(true)
    try {
      const presignRes = await fetch('/api/upload/presign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contentType: file.type, folder: 'advisor-photos' }),
      })
      if (!presignRes.ok) throw new Error()
      const { uploadUrl, publicUrl } = await presignRes.json()

      const uploadRes = await fetch(uploadUrl, { method: 'PUT', headers: { 'Content-Type': file.type }, body: file })
      if (!uploadRes.ok) throw new Error()

      setAvatarUrl(publicUrl)
    } catch {
      setError('Failed to upload photo')
    } finally {
      setUploading(false)
    }
  }

  const handleSave = async () => {
    setError('')
    if (!form.fullName.trim()) {
      setError('Name cannot be empty')
      return
    }

    setSaving(true)
    try {
      const res = await fetch('/api/advisor/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, avatarUrl: avatarUrl ?? undefined }),
      })
      const result = await res.json()
      if (!res.ok) {
        setError(result.error || 'Failed to save changes')
        setSaving(false)
        return
      }
      await loadProfile()
      setEditing(false)
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (!profile) {
    return <div style={styles.loadingContainer}><p style={styles.statusText}>Loading...</p></div>
  }

  const addressLine = [profile.city, profile.state, profile.pincode].filter(Boolean).join(', ')

  if (!editing) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.avatarSection}>
            {profile.avatarUrl ? (
              <img src={profile.avatarUrl} alt="" style={styles.avatar} />
            ) : (
              <div style={{ ...styles.avatar, ...styles.avatarPlaceholder }}>👤</div>
            )}
            <h1 style={styles.name}>{profile.fullName || 'Advisor'}</h1>
            <span style={styles.roleBadge}>{profile.role === 'master_agent' ? 'Master Agent' : 'Advisor'}</span>
          </div>

          <div style={styles.infoCard}>
            <p style={styles.infoRow}>📧 {profile.email || 'Not set'}</p>
            <p style={styles.infoRow}>📞 {profile.phone || 'Not set'}</p>
            <p style={styles.infoRow}>📍 {profile.address ? `${profile.address}, ${addressLine}` : addressLine || 'Not set'}</p>
          </div>

          <div style={styles.codeCard}>
            <p style={styles.codeLabel}>Referral Code</p>
            <p style={styles.codeValue}>{profile.referralCode}</p>
          </div>

          <button onClick={() => setEditing(true)} style={styles.editButton}>Edit Profile</button>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.editHeader}>
          <h1 style={styles.editTitle}>Edit Profile</h1>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => setEditing(false)} style={styles.cancelButton}>Cancel</button>
            <button onClick={handleSave} disabled={saving} style={styles.saveButton}>{saving ? 'Saving...' : 'Save'}</button>
          </div>
        </div>

        <div style={styles.avatarSection}>
          {avatarUrl ? <img src={avatarUrl} alt="" style={styles.avatar} /> : <div style={{ ...styles.avatar, ...styles.avatarPlaceholder }}>👤</div>}
          <label style={styles.uploadLabel}>
            {uploading ? 'Uploading...' : 'Change Photo'}
            <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => e.target.files?.[0] && uploadAvatar(e.target.files[0])} />
          </label>
        </div>

        <div style={styles.form}>
          <Field label="Full Name" value={form.fullName} onChange={(v) => setForm((p) => ({ ...p, fullName: v }))} />
          <Field label="Phone Number" value={form.phone} onChange={(v) => setForm((p) => ({ ...p, phone: v }))} />
          <Field label="Address" value={form.address} onChange={(v) => setForm((p) => ({ ...p, address: v }))} multiline />
          <Field label="City" value={form.city} onChange={(v) => setForm((p) => ({ ...p, city: v }))} />
          <Field label="State" value={form.state} onChange={(v) => setForm((p) => ({ ...p, state: v }))} />
          <Field label="Pincode" value={form.pincode} onChange={(v) => setForm((p) => ({ ...p, pincode: v }))} />
          {error && <p style={styles.error}>{error}</p>}
        </div>
      </div>
    </div>
  )
}

function Field({ label, value, onChange, multiline }: { label: string; value: string; onChange: (v: string) => void; multiline?: boolean }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={styles.label}>{label}</label>
      {multiline ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} style={{ ...styles.input, height: 70 }} />
      ) : (
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)} style={styles.input} />
      )}
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: '100vh', backgroundColor: '#fff0f3', fontFamily: 'system-ui, sans-serif' },
  loadingContainer: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff0f3' },
  statusText: { color: '#a5486a', fontSize: 14 },
  container: { maxWidth: 520, margin: '0 auto', padding: '32px 24px' },
  avatarSection: { textAlign: 'center', marginBottom: 20 },
  avatar: { width: 90, height: 90, borderRadius: 45, objectFit: 'cover', marginBottom: 12 },
  avatarPlaceholder: { backgroundColor: '#fce8ee', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, margin: '0 auto 12px' },
  name: { fontSize: 20, fontWeight: 700, color: '#5c2a3a', margin: 0 },
  roleBadge: { display: 'inline-block', marginTop: 10, backgroundColor: '#d6336c', color: '#fff', fontWeight: 700, fontSize: 12, borderRadius: 10, padding: '4px 12px' },
  infoCard: { backgroundColor: '#ffffff', borderRadius: 16, padding: 18, marginBottom: 14 },
  infoRow: { fontSize: 14, color: '#5c2a3a', margin: '8px 0' },
  codeCard: { backgroundColor: '#ffffff', borderRadius: 16, padding: 18, marginBottom: 20 },
  codeLabel: { fontSize: 12, color: '#a5486a', fontWeight: 600, margin: 0 },
  codeValue: { fontSize: 18, color: '#5c2a3a', fontWeight: 700, margin: '4px 0 0', letterSpacing: 1 },
  editButton: { width: '100%', padding: 13, borderRadius: 12, border: 'none', backgroundColor: '#d6336c', color: '#fff', fontWeight: 700, fontSize: 15, cursor: 'pointer' },
  editHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  editTitle: { fontSize: 20, fontWeight: 700, color: '#5c2a3a', margin: 0 },
  cancelButton: { padding: '8px 16px', borderRadius: 10, border: '1px solid #f6c6d4', backgroundColor: '#fff', color: '#a5486a', fontWeight: 600, fontSize: 13, cursor: 'pointer' },
  saveButton: { padding: '8px 16px', borderRadius: 10, border: 'none', backgroundColor: '#d6336c', color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer' },
  uploadLabel: { fontSize: 13, color: '#d6336c', fontWeight: 600, cursor: 'pointer' },
  form: { backgroundColor: '#ffffff', borderRadius: 16, padding: 20 },
  label: { display: 'block', fontSize: 12, fontWeight: 600, color: '#a5486a', marginBottom: 5 },
  input: { width: '100%', padding: '9px 12px', borderRadius: 10, border: '1px solid #f6c6d4', fontSize: 14, boxSizing: 'border-box' },
  error: { color: '#e03131', fontSize: 13, marginTop: 8 },
}