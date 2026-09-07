'use client'

import { useState } from 'react'
import {
  RELIGION_LABELS,
  EDUCATION_LEVEL_LABELS,
  OCCUPATION_CATEGORY_LABELS,
} from '@/lib/matrimonyLabels'

type ProfileData = {
  fullName: string | null
  email: string | null
  emailVerified: boolean
  age: number | null
  gender: string | null
  dateOfBirth: string | null
  profile: {
    bio: string | null
    avatarUrl: string | null
    coverUrl: string | null
    height: number | null
    religion: string | null
    caste: string | null
    motherTongue: string | null
    education: string | null
    educationLevel: string | null
    occupation: string | null
    occupationCategory: string | null
    annualIncome: string | null
    city: string | null
    state: string | null
    partnerAgeMin: number | null
    partnerAgeMax: number | null
    partnerReligion: string | null
    partnerCaste: string | null
  } | null
}

export default function ProfileClient({ initialData }: { initialData: ProfileData }) {
  const [data, setData] = useState(initialData)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    fullName: initialData.fullName ?? '',
    gender: initialData.gender ?? '',
    dateOfBirth: initialData.dateOfBirth ? initialData.dateOfBirth.slice(0, 10) : '',
    bio: initialData.profile?.bio ?? '',
    height: initialData.profile?.height ? String(initialData.profile.height) : '',
    religion: initialData.profile?.religion ?? '',
    caste: initialData.profile?.caste ?? '',
    motherTongue: initialData.profile?.motherTongue ?? '',
    education: initialData.profile?.education ?? '',
    educationLevel: initialData.profile?.educationLevel ?? '',
    occupation: initialData.profile?.occupation ?? '',
    occupationCategory: initialData.profile?.occupationCategory ?? '',
    annualIncome: initialData.profile?.annualIncome ?? '',
    city: initialData.profile?.city ?? '',
    state: initialData.profile?.state ?? '',
    partnerAgeMin: initialData.profile?.partnerAgeMin ? String(initialData.profile.partnerAgeMin) : '',
    partnerAgeMax: initialData.profile?.partnerAgeMax ? String(initialData.profile.partnerAgeMax) : '',
    partnerReligion: initialData.profile?.partnerReligion ?? '',
    partnerCaste: initialData.profile?.partnerCaste ?? '',
  })
  const [avatarUrl, setAvatarUrl] = useState(initialData.profile?.avatarUrl ?? null)
  const [coverUrl, setCoverUrl] = useState(initialData.profile?.coverUrl ?? null)
  const [uploadingSlot, setUploadingSlot] = useState<'avatar' | 'cover' | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const update = (key: keyof typeof form, value: string) => setForm((prev) => ({ ...prev, [key]: value }))

  const uploadPhoto = async (file: File, slot: 'avatar' | 'cover') => {
    setError('')
    setUploadingSlot(slot)
    try {
      const presignRes = await fetch('/api/upload/presign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contentType: file.type, folder: 'profile-photos' }),
      })
      if (!presignRes.ok) throw new Error()
      const { uploadUrl, publicUrl } = await presignRes.json()

      const uploadRes = await fetch(uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
      })
      if (!uploadRes.ok) throw new Error()

      if (slot === 'avatar') setAvatarUrl(publicUrl)
      else setCoverUrl(publicUrl)
    } catch {
      setError(`Failed to upload ${slot === 'avatar' ? 'profile' : 'cover'} photo`)
    } finally {
      setUploadingSlot(null)
    }
  }

  const handleSave = async () => {
    setError('')

    if (!form.fullName.trim()) {
      setError('Name cannot be empty')
      return
    }

    if (form.partnerAgeMin && form.partnerAgeMax) {
      const min = Number(form.partnerAgeMin)
      const max = Number(form.partnerAgeMax)
      if (isNaN(min) || isNaN(max) || min < 18 || max < min) {
        setError('Please enter a valid partner age range')
        return
      }
    }

    setSaving(true)
    try {
      const res = await fetch('/api/profile/update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: form.fullName,
          gender: form.gender || undefined,
          dateOfBirth: form.dateOfBirth || undefined,
          bio: form.bio,
          height: form.height ? Number(form.height) : undefined,
          religion: form.religion,
          caste: form.caste,
          motherTongue: form.motherTongue,
          education: form.education,
          educationLevel: form.educationLevel || undefined,
          occupation: form.occupation,
          occupationCategory: form.occupationCategory || undefined,
          annualIncome: form.annualIncome,
          city: form.city,
          state: form.state,
          partnerAgeMin: form.partnerAgeMin ? Number(form.partnerAgeMin) : undefined,
          partnerAgeMax: form.partnerAgeMax ? Number(form.partnerAgeMax) : undefined,
          partnerReligion: form.partnerReligion,
          partnerCaste: form.partnerCaste,
          avatarUrl: avatarUrl ?? undefined,
          coverUrl: coverUrl ?? undefined,
        }),
      })
      const result = await res.json()

      if (!res.ok) {
        setError(result.error || 'Failed to save changes')
        setSaving(false)
        return
      }

      const age = form.dateOfBirth
        ? Math.floor((Date.now() - new Date(form.dateOfBirth).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
        : data.age

      setData({
        fullName: form.fullName,
        email: data.email,
        emailVerified: data.emailVerified,
        age,
        gender: form.gender,
        dateOfBirth: form.dateOfBirth,
        profile: {
          bio: form.bio,
          avatarUrl,
          coverUrl,
          height: form.height ? Number(form.height) : null,
          religion: form.religion,
          caste: form.caste,
          motherTongue: form.motherTongue,
          education: form.education,
          educationLevel: form.educationLevel || null,
          occupation: form.occupation,
          occupationCategory: form.occupationCategory || null,
          annualIncome: form.annualIncome,
          city: form.city,
          state: form.state,
          partnerAgeMin: form.partnerAgeMin ? Number(form.partnerAgeMin) : null,
          partnerAgeMax: form.partnerAgeMax ? Number(form.partnerAgeMax) : null,
          partnerReligion: form.partnerReligion,
          partnerCaste: form.partnerCaste,
        },
      })
      setEditing(false)
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const details = [
    data.profile?.occupation && { icon: '💼', label: data.profile.occupation },
    data.profile?.education && { icon: '🎓', label: data.profile.education },
    (data.profile?.city || data.profile?.state) && {
      icon: '📍',
      label: [data.profile?.city, data.profile?.state].filter(Boolean).join(', '),
    },
    (data.profile?.religion || data.profile?.caste || data.profile?.height) && {
      icon: '🧬',
      label: [
        data.profile?.religion ? RELIGION_LABELS[data.profile.religion] ?? data.profile.religion : null,
        data.profile?.caste,
        data.profile?.height ? `${data.profile.height} cm` : null,
      ]
        .filter(Boolean)
        .join(' · '),
    },
    data.age && { icon: '🎂', label: `${data.age} years old` },
  ].filter(Boolean) as { icon: string; label: string }[]

  if (!editing) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.coverWrap}>
            {data.profile?.coverUrl ? (
              <img src={data.profile.coverUrl} alt="" style={styles.coverImg} />
            ) : (
              <div style={styles.coverPlaceholder} />
            )}
          </div>

          <div style={styles.avatarSection}>
            {data.profile?.avatarUrl ? (
              <img src={data.profile.avatarUrl} alt="" style={styles.avatar} />
            ) : (
              <div style={{ ...styles.avatar, ...styles.avatarPlaceholder }}>👤</div>
            )}
          </div>

          <div style={styles.nameSection}>
            <h1 style={styles.name}>
              {data.fullName || 'Your Name'} {data.emailVerified && <span style={{ color: '#d6336c' }}>✓</span>}
            </h1>
            <p style={styles.email}>{data.email}</p>
            {data.profile?.bio && <p style={styles.bio}>{data.profile.bio}</p>}
          </div>

          <button onClick={() => setEditing(true)} style={styles.editButton}>
            Edit Profile
          </button>

          {details.length > 0 && (
            <div style={styles.detailsCard}>
              <h2 style={styles.cardTitle}>Matrimony Details</h2>
              {details.map((d, i) => (
                <div key={i} style={styles.detailRow}>
                  <span>{d.icon}</span>
                  <span style={styles.detailText}>{d.label}</span>
                </div>
              ))}
              <p style={styles.visibilityNote}>
                🔒 Matrimony profile visible to verified users only
              </p>
            </div>
          )}
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
            <button onClick={handleSave} disabled={saving} style={styles.saveButton}>
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>

        <div style={styles.coverWrap}>
          {coverUrl ? <img src={coverUrl} alt="" style={styles.coverImg} /> : <div style={styles.coverPlaceholder} />}
          <label style={styles.coverEditBadge}>
            {uploadingSlot === 'cover' ? '...' : '📷'}
            <input
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={(e) => e.target.files?.[0] && uploadPhoto(e.target.files[0], 'cover')}
            />
          </label>
        </div>

        <div style={styles.avatarSection}>
          {avatarUrl ? (
            <img src={avatarUrl} alt="" style={styles.avatar} />
          ) : (
            <div style={{ ...styles.avatar, ...styles.avatarPlaceholder }}>👤</div>
          )}
          <label style={styles.avatarEditBadge}>
            {uploadingSlot === 'avatar' ? '...' : '📷'}
            <input
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={(e) => e.target.files?.[0] && uploadPhoto(e.target.files[0], 'avatar')}
            />
          </label>
        </div>

        <div style={styles.form}>
          <h3 style={styles.sectionTitle}>Basic Info</h3>
          <Field label="Full Name" value={form.fullName} onChange={(v) => update('fullName', v)} />

          <label style={styles.label}>Gender</label>
          <div style={styles.pillRow}>
            {['MALE', 'FEMALE', 'OTHER'].map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => update('gender', g)}
                style={form.gender === g ? styles.pillActive : styles.pill}
              >
                {g === 'MALE' ? 'Male' : g === 'FEMALE' ? 'Female' : 'Other'}
              </button>
            ))}
          </div>

          <label style={styles.label}>Date of Birth</label>
          <input
            type="date"
            value={form.dateOfBirth}
            onChange={(e) => update('dateOfBirth', e.target.value)}
            style={styles.input}
          />

          <Field label="Bio" value={form.bio} onChange={(v) => update('bio', v)} multiline />
          <Field label="Height (cm)" value={form.height} onChange={(v) => update('height', v)} type="number" />

          <h3 style={styles.sectionTitle}>Religion & Community</h3>

          <label style={styles.label}>Religion</label>
          <select
            value={form.religion}
            onChange={(e) => update('religion', e.target.value)}
            style={styles.input}
          >
            <option value="">Select religion</option>
            {Object.entries(RELIGION_LABELS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>

          <Field label="Caste / Community" value={form.caste} onChange={(v) => update('caste', v)} />
          <Field label="Mother Tongue" value={form.motherTongue} onChange={(v) => update('motherTongue', v)} />

          <h3 style={styles.sectionTitle}>Education & Career</h3>

          <label style={styles.label}>Highest Education Level</label>
          <select
            value={form.educationLevel}
            onChange={(e) => update('educationLevel', e.target.value)}
            style={styles.input}
          >
            <option value="">Select education level</option>
            {Object.entries(EDUCATION_LEVEL_LABELS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>

          <Field label="Degree / Field (optional detail)" value={form.education} onChange={(v) => update('education', v)} />

          <label style={styles.label}>Occupation Category</label>
          <select
            value={form.occupationCategory}
            onChange={(e) => update('occupationCategory', e.target.value)}
            style={styles.input}
          >
            <option value="">Select category</option>
            {Object.entries(OCCUPATION_CATEGORY_LABELS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>

          <Field label="Job Title (optional detail)" value={form.occupation} onChange={(v) => update('occupation', v)} />
          <Field label="Annual Income" value={form.annualIncome} onChange={(v) => update('annualIncome', v)} />

          <h3 style={styles.sectionTitle}>Location</h3>
          <Field label="City" value={form.city} onChange={(v) => update('city', v)} />
          <Field label="State" value={form.state} onChange={(v) => update('state', v)} />

          <h3 style={styles.sectionTitle}>Partner Preferences</h3>
          <div style={{ display: 'flex', gap: 10 }}>
            <Field label="Min Age" value={form.partnerAgeMin} onChange={(v) => update('partnerAgeMin', v)} type="number" />
            <Field label="Max Age" value={form.partnerAgeMax} onChange={(v) => update('partnerAgeMax', v)} type="number" />
          </div>

          <label style={styles.label}>Preferred Religion (optional)</label>
          <select
            value={form.partnerReligion}
            onChange={(e) => update('partnerReligion', e.target.value)}
            style={styles.input}
          >
            <option value="">Any</option>
            {Object.entries(RELIGION_LABELS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>

          <Field label="Preferred Caste" value={form.partnerCaste} onChange={(v) => update('partnerCaste', v)} />

          {error && <p style={styles.error}>{error}</p>}
        </div>
      </div>
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
  multiline,
  type = 'text',
}: {
  label: string
  value: string
  onChange: (v: string) => void
  multiline?: boolean
  type?: string
}) {
  return (
    <div style={{ flex: 1, marginBottom: 14 }}>
      <label style={styles.label}>{label}</label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{ ...styles.input, height: 80, resize: 'vertical' as const }}
        />
      ) : (
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)} style={styles.input} />
      )}
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: '100vh', backgroundColor: '#fff0f3', fontFamily: 'system-ui, sans-serif' },
  container: { maxWidth: 640, margin: '0 auto', paddingBottom: 40 },
  coverWrap: { height: 200, backgroundColor: '#f6c6d4', position: 'relative' as const },
  coverImg: { width: '100%', height: '100%', objectFit: 'cover' as const },
  coverPlaceholder: { width: '100%', height: '100%', backgroundColor: '#f6c6d4' },
  coverEditBadge: {
    position: 'absolute' as const,
    bottom: 12,
    right: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.45)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    fontSize: 16,
  },
  avatarSection: { marginTop: -50, marginLeft: 24, position: 'relative' as const, width: 100 },
  avatar: { width: 100, height: 100, borderRadius: 50, border: '4px solid #fff0f3', objectFit: 'cover' as const },
  avatarPlaceholder: {
    backgroundColor: '#fce8ee',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 40,
  },
  avatarEditBadge: {
    position: 'absolute' as const,
    bottom: 0,
    right: 0,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#d6336c',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    fontSize: 13,
    border: '2px solid #fff0f3',
  },
  nameSection: { padding: '14px 24px 0' },
  name: { fontSize: 22, fontWeight: 700, color: '#5c2a3a', margin: 0 },
  email: { fontSize: 13, color: '#a5486a', margin: '4px 0 0' },
  bio: { fontSize: 14, color: '#5c2a3a', marginTop: 10, lineHeight: 1.5 },
  editButton: {
    margin: '18px 24px 0',
    padding: '11px 20px',
    borderRadius: 12,
    border: 'none',
    backgroundColor: '#d6336c',
    color: '#fff',
    fontWeight: 700,
    fontSize: 14,
    cursor: 'pointer',
  },
  detailsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    margin: '20px 24px 0',
  },
  cardTitle: { fontSize: 14, fontWeight: 700, color: '#5c2a3a', margin: '0 0 12px' },
  detailRow: { display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0' },
  detailText: { fontSize: 13, color: '#5c2a3a' },
  visibilityNote: {
    fontSize: 11,
    color: '#a5486a',
    marginTop: 12,
    paddingTop: 12,
    borderTop: '1px solid #fce8ee',
  },
  editHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 24px 0',
  },
  editTitle: { fontSize: 20, fontWeight: 700, color: '#5c2a3a', margin: 0 },
  cancelButton: {
    padding: '8px 16px',
    borderRadius: 10,
    border: '1px solid #f6c6d4',
    backgroundColor: '#fff',
    color: '#a5486a',
    fontWeight: 600,
    fontSize: 13,
    cursor: 'pointer',
  },
  saveButton: {
    padding: '8px 16px',
    borderRadius: 10,
    border: 'none',
    backgroundColor: '#d6336c',
    color: '#fff',
    fontWeight: 700,
    fontSize: 13,
    cursor: 'pointer',
  },
  form: { padding: '20px 24px 0' },
  sectionTitle: { fontSize: 13, fontWeight: 700, color: '#d6336c', marginTop: 20, marginBottom: 6 },
  label: { display: 'block', fontSize: 12, fontWeight: 600, color: '#a5486a', marginBottom: 5 },
  input: {
    width: '100%',
    padding: '9px 12px',
    borderRadius: 10,
    border: '1px solid #f6c6d4',
    fontSize: 14,
    backgroundColor: '#ffffff',
    color: '#5c2a3a',
    boxSizing: 'border-box' as const,
  },
  pillRow: { display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' as const },
  pill: {
    flex: 1,
    minWidth: 70,
    padding: '8px 0',
    borderRadius: 8,
    border: '1px solid #f6c6d4',
    backgroundColor: '#fff',
    color: '#a5486a',
    fontWeight: 600,
    fontSize: 13,
    cursor: 'pointer',
  },
  pillActive: {
    flex: 1,
    minWidth: 70,
    padding: '8px 0',
    borderRadius: 8,
    border: '1px solid #d6336c',
    backgroundColor: '#d6336c',
    color: '#fff',
    fontWeight: 600,
    fontSize: 13,
    cursor: 'pointer',
  },
  error: { color: '#e03131', fontSize: 13, marginTop: 12 },
}