'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  RELIGION_LABELS,
  EDUCATION_LEVEL_LABELS,
  OCCUPATION_CATEGORY_LABELS,
} from '@/lib/matrimonyLabels'

type FormData = {
  gender: 'MALE' | 'FEMALE' | 'OTHER' | ''
  dateOfBirth: string
  heightCm: string
  religion: string
  caste: string
  motherTongue: string
  education: string
  educationLevel: string
  occupation: string
  occupationCategory: string
  annualIncome: string
  city: string
  state: string
  bio: string
  photos: string[]
  partnerAgeMin: string
  partnerAgeMax: string
  partnerReligion: string
  partnerCaste: string
}

const TOTAL_STEPS = 7

const initialData: FormData = {
  gender: '',
  dateOfBirth: '',
  heightCm: '',
  religion: '',
  caste: '',
  motherTongue: '',
  education: '',
  educationLevel: '',
  occupation: '',
  occupationCategory: '',
  annualIncome: '',
  city: '',
  state: '',
  bio: '',
  photos: [],
  partnerAgeMin: '',
  partnerAgeMax: '',
  partnerReligion: '',
  partnerCaste: '',
}

export default function OnboardingWizard() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [data, setData] = useState<FormData>(initialData)
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const update = (partial: Partial<FormData>) => setData((prev) => ({ ...prev, ...partial }))

  const next = () => {
    setError('')
    if (step === 1 && (!data.gender || !data.dateOfBirth || !data.heightCm)) {
      setError('Please fill in all fields')
      return
    }
    if (step === 2 && !data.religion.trim()) {
      setError('Please select your religion')
      return
    }
    if (step === 3 && (!data.educationLevel || !data.occupationCategory)) {
      setError('Please select your education level and occupation category')
      return
    }
    if (step === 4 && (!data.city.trim() || !data.state.trim())) {
      setError('Please fill in city and state')
      return
    }
    if (step === 5 && data.bio.trim().length < 20) {
      setError('Please write at least 20 characters about yourself')
      return
    }
    if (step === 6 && data.photos.length === 0) {
      setError('Please add at least 1 photo')
      return
    }
    setStep((s) => Math.min(s + 1, TOTAL_STEPS))
  }

  const back = () => {
    setError('')
    setStep((s) => Math.max(s - 1, 1))
  }

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setError('')
    setUploading(true)
    try {
      const presignRes = await fetch('/api/upload/presign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contentType: file.type, folder: 'profile-photos' }),
      })

      if (!presignRes.ok) throw new Error('Failed to get upload URL')
      const { uploadUrl, publicUrl } = await presignRes.json()

      const uploadRes = await fetch(uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
      })

      if (!uploadRes.ok) throw new Error('Upload failed')

      update({ photos: [...data.photos, publicUrl] })
    } catch {
      setError('Failed to upload photo. Please try again.')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  const removePhoto = (url: string) => {
    update({ photos: data.photos.filter((p) => p !== url) })
  }

  const handleSubmit = async () => {
    setError('')

    const min = Number(data.partnerAgeMin)
    const max = Number(data.partnerAgeMax)
    if (!data.partnerAgeMin || !data.partnerAgeMax || isNaN(min) || isNaN(max) || min < 18 || max < min) {
      setError('Please enter a valid age range')
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch('/api/onboarding/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gender: data.gender,
          dateOfBirth: data.dateOfBirth,
          heightCm: Number(data.heightCm),
          religion: data.religion,
          caste: data.caste,
          motherTongue: data.motherTongue,
          education: data.education,
          educationLevel: data.educationLevel || undefined,
          occupation: data.occupation,
          occupationCategory: data.occupationCategory || undefined,
          annualIncome: data.annualIncome,
          city: data.city,
          state: data.state,
          bio: data.bio,
          photos: data.photos,
          partnerAgeMin: min,
          partnerAgeMax: max,
          partnerReligion: data.partnerReligion,
          partnerCaste: data.partnerCaste,
        }),
      })

      const result = await res.json()

      if (!res.ok) {
        setError(result.error || 'Something went wrong')
        setSubmitting(false)
        return
      }

      router.push('/matches')
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.progressRow}>
          <span style={styles.stepText}>Step {step} of {TOTAL_STEPS}</span>
        </div>
        <div style={styles.progressTrack}>
          <div style={{ ...styles.progressFill, width: `${(step / TOTAL_STEPS) * 100}%` }} />
        </div>

        {step === 1 && (
          <Step title="Tell us about yourself">
            <Label>Gender</Label>
            <div style={styles.pillRow}>
              {(['MALE', 'FEMALE', 'OTHER'] as const).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => update({ gender: g })}
                  style={data.gender === g ? styles.pillActive : styles.pill}
                >
                  {g === 'MALE' ? 'Male' : g === 'FEMALE' ? 'Female' : 'Other'}
                </button>
              ))}
            </div>

            <Label>Date of Birth</Label>
            <input
              type="date"
              value={data.dateOfBirth}
              onChange={(e) => update({ dateOfBirth: e.target.value })}
              style={styles.input}
            />

            <Label>Height (cm)</Label>
            <input
              type="number"
              placeholder="e.g. 172"
              value={data.heightCm}
              onChange={(e) => update({ heightCm: e.target.value })}
              style={styles.input}
            />
          </Step>
        )}

        {step === 2 && (
          <Step title="Religion & Community">
            <Label>Religion</Label>
            <select
              value={data.religion}
              onChange={(e) => update({ religion: e.target.value })}
              style={styles.input}
            >
              <option value="">Select religion</option>
              {Object.entries(RELIGION_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>

            <Label>Caste / Community (optional)</Label>
            <input
              type="text"
              placeholder="e.g. Brahmin"
              value={data.caste}
              onChange={(e) => update({ caste: e.target.value })}
              style={styles.input}
            />

            <Label>Mother Tongue (optional)</Label>
            <input
              type="text"
              placeholder="e.g. Bengali"
              value={data.motherTongue}
              onChange={(e) => update({ motherTongue: e.target.value })}
              style={styles.input}
            />
          </Step>
        )}

        {step === 3 && (
          <Step title="Education & Career">
            <Label>Highest Education Level</Label>
            <select
              value={data.educationLevel}
              onChange={(e) => update({ educationLevel: e.target.value })}
              style={styles.input}
            >
              <option value="">Select education level</option>
              {Object.entries(EDUCATION_LEVEL_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>

            <Label>Degree / Field (optional detail)</Label>
            <input
              type="text"
              placeholder="e.g. B.Tech in Computer Science"
              value={data.education}
              onChange={(e) => update({ education: e.target.value })}
              style={styles.input}
            />

            <Label>Occupation Category</Label>
            <select
              value={data.occupationCategory}
              onChange={(e) => update({ occupationCategory: e.target.value })}
              style={styles.input}
            >
              <option value="">Select category</option>
              {Object.entries(OCCUPATION_CATEGORY_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>

            <Label>Job Title (optional detail)</Label>
            <input
              type="text"
              placeholder="e.g. Backend Engineer at Acme"
              value={data.occupation}
              onChange={(e) => update({ occupation: e.target.value })}
              style={styles.input}
            />

            <Label>Annual Income (optional)</Label>
            <input
              type="text"
              placeholder="e.g. ₹8-12 LPA"
              value={data.annualIncome}
              onChange={(e) => update({ annualIncome: e.target.value })}
              style={styles.input}
            />
          </Step>
        )}

        {step === 4 && (
          <Step title="Where are you located?">
            <Label>City</Label>
            <input
              type="text"
              placeholder="e.g. Kolkata"
              value={data.city}
              onChange={(e) => update({ city: e.target.value })}
              style={styles.input}
            />

            <Label>State</Label>
            <input
              type="text"
              placeholder="e.g. West Bengal"
              value={data.state}
              onChange={(e) => update({ state: e.target.value })}
              style={styles.input}
            />
          </Step>
        )}

        {step === 5 && (
          <Step title="Tell us about yourself">
            <Label>Bio</Label>
            <textarea
              placeholder="Share a bit about your personality, interests, and what you're looking for..."
              value={data.bio}
              onChange={(e) => e.target.value.length <= 300 && update({ bio: e.target.value })}
              style={{ ...styles.input, height: 120, resize: 'vertical' as const }}
            />
            <p style={styles.charCount}>{data.bio.length}/300</p>
          </Step>
        )}

        {step === 6 && (
          <Step title="Add your photos">
            <p style={styles.subtitle}>Add at least 1 photo. Profiles with photos get more matches.</p>

            <div style={styles.photoGrid}>
              {data.photos.map((url) => (
                <div key={url} style={styles.photoWrap}>
                  <img src={url} alt="" style={styles.photoImg} />
                  <button type="button" onClick={() => removePhoto(url)} style={styles.removePhotoBtn}>
                    ✕
                  </button>
                </div>
              ))}

              {data.photos.length < 6 && (
                <label style={styles.addPhotoBtn}>
                  {uploading ? '...' : '+'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    disabled={uploading}
                    style={{ display: 'none' }}
                  />
                </label>
              )}
            </div>
          </Step>
        )}

        {step === 7 && (
          <Step title="Partner Preferences">
            <p style={styles.subtitle}>What are you looking for in a partner?</p>

            <Label>Preferred Age Range</Label>
            <div style={{ display: 'flex', gap: 10 }}>
              <input
                type="number"
                placeholder="Min age"
                value={data.partnerAgeMin}
                onChange={(e) => update({ partnerAgeMin: e.target.value })}
                style={styles.input}
              />
              <input
                type="number"
                placeholder="Max age"
                value={data.partnerAgeMax}
                onChange={(e) => update({ partnerAgeMax: e.target.value })}
                style={styles.input}
              />
            </div>

            <Label>Preferred Religion (optional)</Label>
            <select
              value={data.partnerReligion}
              onChange={(e) => update({ partnerReligion: e.target.value })}
              style={styles.input}
            >
              <option value="">Any</option>
              {Object.entries(RELIGION_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>

            <Label>Preferred Caste (optional)</Label>
            <input
              type="text"
              placeholder="e.g. Brahmin"
              value={data.partnerCaste}
              onChange={(e) => update({ partnerCaste: e.target.value })}
              style={styles.input}
            />
          </Step>
        )}

        {error && <p style={styles.error}>{error}</p>}

        <div style={styles.buttonRow}>
          {step > 1 && (
            <button type="button" onClick={back} style={styles.secondaryButton}>
              Back
            </button>
          )}
          {step < TOTAL_STEPS ? (
            <button type="button" onClick={next} style={styles.primaryButton}>
              Continue
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              style={{ ...styles.primaryButton, opacity: submitting ? 0.6 : 1 }}
            >
              {submitting ? 'Saving...' : 'Finish'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function Step({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 style={styles.title}>{title}</h2>
      {children}
    </div>
  )
}

function Label({ children }: { children: React.ReactNode }) {
  return <label style={styles.label}>{children}</label>
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff0f3',
    fontFamily: 'system-ui, sans-serif',
    padding: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 32,
    width: 460,
    maxWidth: '100%',
    boxShadow: '0 8px 24px rgba(214,51,108,0.1)',
  },
  progressRow: { display: 'flex', justifyContent: 'flex-end', marginBottom: 8 },
  stepText: { fontSize: 12, fontWeight: 600, color: '#a5486a' },
  progressTrack: { height: 6, backgroundColor: '#f6c6d4', borderRadius: 3, overflow: 'hidden', marginBottom: 20 },
  progressFill: { height: '100%', backgroundColor: '#d6336c', borderRadius: 3 },
  title: { color: '#d6336c', fontSize: 20, fontWeight: 700, marginBottom: 16 },
  subtitle: { color: '#a5486a', fontSize: 13, marginBottom: 16 },
  label: { display: 'block', fontSize: 13, fontWeight: 600, color: '#a5486a', marginTop: 14, marginBottom: 6 },
  input: {
    width: '100%',
    padding: '10px 12px',
    borderRadius: 10,
    border: '1px solid #f6c6d4',
    fontSize: 14,
    backgroundColor: '#ffffff',
    color: '#5c2a3a',
    boxSizing: 'border-box' as const,
  },
  charCount: { fontSize: 11, color: '#c98ba0', textAlign: 'right', marginTop: 4 },
  pillRow: { display: 'flex', gap: 10 },
  pill: {
    flex: 1,
    padding: '10px 12px',
    borderRadius: 10,
    border: '1px solid #f6c6d4',
    backgroundColor: '#ffffff',
    color: '#a5486a',
    fontWeight: 600,
    fontSize: 14,
    cursor: 'pointer',
  },
  pillActive: {
    flex: 1,
    padding: '10px 12px',
    borderRadius: 10,
    border: '1px solid #d6336c',
    backgroundColor: '#d6336c',
    color: '#ffffff',
    fontWeight: 600,
    fontSize: 14,
    cursor: 'pointer',
  },
  photoGrid: { display: 'flex', flexWrap: 'wrap' as const, gap: 10 },
  photoWrap: { position: 'relative' as const, width: 90, height: 110 },
  photoImg: { width: '100%', height: '100%', objectFit: 'cover' as const, borderRadius: 10 },
  removePhotoBtn: {
    position: 'absolute' as const,
    top: -6,
    right: -6,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#e03131',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    fontSize: 11,
  },
  addPhotoBtn: {
    width: 90,
    height: 110,
    borderRadius: 10,
    border: '2px dashed #f6c6d4',
    backgroundColor: '#fff5f7',
    color: '#d6336c',
    fontSize: 24,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  error: { color: '#e03131', fontSize: 13, marginTop: 16, textAlign: 'center' },
  buttonRow: { display: 'flex', gap: 10, marginTop: 24 },
  primaryButton: {
    flex: 1,
    padding: 13,
    borderRadius: 12,
    border: 'none',
    backgroundColor: '#d6336c',
    color: '#fff',
    fontWeight: 700,
    fontSize: 15,
    cursor: 'pointer',
  },
  secondaryButton: {
    padding: '13px 20px',
    borderRadius: 12,
    border: '1px solid #f6c6d4',
    backgroundColor: '#ffffff',
    color: '#a5486a',
    fontWeight: 600,
    fontSize: 15,
    cursor: 'pointer',
  },
}