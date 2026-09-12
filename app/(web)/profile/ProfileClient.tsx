'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  RELIGION_LABELS,
  EDUCATION_LEVEL_LABELS,
  OCCUPATION_CATEGORY_LABELS,
  MARITAL_STATUS_LABELS,
  PHYSICAL_STATUS_LABELS,
  PROFILE_CREATED_BY_LABELS,
  EMPLOYMENT_TYPE_LABELS,
  EATING_HABIT_LABELS,
  SMOKING_HABIT_LABELS,
  DRINKING_HABIT_LABELS,
  FAMILY_STATUS_LABELS,
  FAMILY_VALUE_LABELS,
  FAMILY_TYPE_LABELS,
  NAKSHATRA_LABELS,
  DOSHAM_LABELS,
} from '@/lib/matrimonyLabels'
import { INDIAN_STATES, getDistrictsForState } from '@/lib/indianLocations'

type ProfileData = {
  fullName: string | null
  email: string | null
  emailVerified: boolean
  idVerified: boolean
  age: number | null
  gender: string | null
  dateOfBirth: string | null
  profileCompleteness: number
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
    state: string | null
    district: string | null
    maritalStatus: string | null
    physicalStatus: string | null
    profileCreatedBy: string | null
    employmentType: string | null
    eatingHabit: string | null
    smokingHabit: string | null
    drinkingHabit: string | null
    hobbies: string[] | null
    familyStatus: string | null
    familyValue: string | null
    familyType: string | null
    horoscopeAvailable: boolean
    horoscopeUrl: string | null
    rashi: string | null
    nakshatra: string | null
    dosham: string | null
    partnerAgeMin: number | null
    partnerAgeMax: number | null
    partnerHeightMin: number | null
    partnerHeightMax: number | null
    partnerReligion: string | null
    partnerCaste: string | null
    partnerMotherTongue: string | null
    partnerMaritalStatus: string | null
    partnerEducationLevel: string | null
    partnerOccupationCategory: string | null
    partnerEmploymentType: string | null
    partnerState: string | null
    partnerDistrict: string | null
    partnerEatingHabit: string | null
    partnerSmokingHabit: string | null
    partnerDrinkingHabit: string | null
    partnerPhysicalStatus: string | null
    partnerFamilyStatus: string | null
    partnerFamilyValue: string | null
    partnerFamilyType: string | null
    partnerDosham: string | null
    partnerNakshatra: string | null
    idDocumentType: string | null
    idVerificationStatus: string | null
    idVerificationRejectionReason: string | null
  } | null
}

async function patchProfile(payload: Record<string, any>) {
  const res = await fetch('/api/profile/update', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const result = await res.json()
  if (!res.ok) throw new Error(result.error || 'Failed to save')
  return result
}

export default function ProfileClient({ initialData }: { initialData: ProfileData }) {
  const [data, setData] = useState(initialData)
  const [editing, setEditing] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState(initialData.profile?.avatarUrl ?? null)
  const [coverUrl, setCoverUrl] = useState(initialData.profile?.coverUrl ?? null)
  const [uploadingSlot, setUploadingSlot] = useState<'avatar' | 'cover' | null>(null)
  const [photoError, setPhotoError] = useState('')

  const uploadPhoto = async (file: File, slot: 'avatar' | 'cover') => {
    setPhotoError('')
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

      // Photos save immediately on upload — no separate "Save" click needed
      // for the avatar/cover, unlike the text-field sections below.
      await patchProfile(slot === 'avatar' ? { avatarUrl: publicUrl } : { coverUrl: publicUrl })

      if (slot === 'avatar') setAvatarUrl(publicUrl)
      else setCoverUrl(publicUrl)

      setData((prev) => ({
        ...prev,
        profile: prev.profile
          ? { ...prev.profile, ...(slot === 'avatar' ? { avatarUrl: publicUrl } : { coverUrl: publicUrl }) }
          : prev.profile,
      }))
    } catch {
      setPhotoError(`Failed to upload ${slot === 'avatar' ? 'profile' : 'cover'} photo`)
    } finally {
      setUploadingSlot(null)
    }
  }

  const details = [
    data.profile?.occupation && { icon: '💼', label: data.profile.occupation },
    data.profile?.education && { icon: '🎓', label: data.profile.education },
    (data.profile?.district || data.profile?.state) && {
      icon: '📍',
      label: [data.profile?.district, data.profile?.state].filter(Boolean).join(', '),
    },
    (data.profile?.religion || data.profile?.caste || data.profile?.height) && {
      icon: '🧬',
      label: [
        data.profile?.religion ? RELIGION_LABELS[data.profile.religion] ?? data.profile.religion : null,
        data.profile?.caste,
        data.profile?.height ? `${data.profile.height} cm` : null,
      ].filter(Boolean).join(' · '),
    },
    data.profile?.maritalStatus && {
      icon: '💍',
      label: MARITAL_STATUS_LABELS[data.profile.maritalStatus] ?? data.profile.maritalStatus,
    },
    (data.profile?.familyStatus || data.profile?.familyType) && {
      icon: '👨‍👩‍👧',
      label: [
        data.profile?.familyStatus ? FAMILY_STATUS_LABELS[data.profile.familyStatus] : null,
        data.profile?.familyType ? FAMILY_TYPE_LABELS[data.profile.familyType] : null,
      ].filter(Boolean).join(' · '),
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
            {data.profile?.bio ? <p style={styles.bio}>{data.profile.bio}</p> : null}
          </div>

          <div style={styles.progressSection}>
            <div style={styles.progressLabelRow}>
              <p style={styles.progressLabel}>Profile Strength</p>
              <p style={styles.progressPercent}>{data.profileCompleteness}%</p>
            </div>
            <div style={styles.progressTrack}>
              <div style={{ ...styles.progressFill, width: `${data.profileCompleteness}%` }} />
            </div>
          </div>

          <button onClick={() => setEditing(true)} style={styles.editButton}>Edit Profile</button>

          <div style={styles.idCard}>
            <p style={styles.idCardTitle}>Identity Verification</p>
            {data.idVerified ? (
              <span style={styles.idBadgeVerified}>✓ Verified</span>
            ) : data.profile?.idVerificationStatus === 'pending' ? (
              <span style={styles.idBadgePending}>Under Review</span>
            ) : data.profile?.idVerificationStatus === 'rejected' ? (
              <div>
                <span style={styles.idBadgeRejected}>Rejected</span>
                <p style={styles.idStatusText}>{data.profile.idVerificationRejectionReason}</p>
                <button onClick={() => setEditing(true)} style={styles.idVerifyButton}>Resubmit</button>
              </div>
            ) : (
              <button onClick={() => setEditing(true)} style={styles.idVerifyButton}>Verify Now</button>
            )}
          </div>

          {details.length > 0 && (
            <div style={styles.detailsCard}>
              <h2 style={styles.cardTitle}>Matrimony Details</h2>
              {details.map((d, i) => (
                <div key={i} style={styles.detailRow}>
                  <span>{d.icon}</span>
                  <span style={styles.detailText}>{d.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  const p = data.profile

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.editHeader}>
          <h1 style={styles.editTitle}>Edit Profile</h1>
          <button onClick={() => setEditing(false)} style={styles.doneButton}>Done</button>
        </div>

        <div style={styles.coverWrap}>
          {coverUrl ? <img src={coverUrl} alt="" style={styles.coverImg} /> : <div style={styles.coverPlaceholder} />}
          <label style={styles.coverEditBadge}>
            {uploadingSlot === 'cover' ? '...' : '📷'}
            <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => e.target.files?.[0] && uploadPhoto(e.target.files[0], 'cover')} />
          </label>
        </div>

        <div style={styles.avatarSection}>
          {avatarUrl ? <img src={avatarUrl} alt="" style={styles.avatar} /> : <div style={{ ...styles.avatar, ...styles.avatarPlaceholder }}>👤</div>}
          <label style={styles.avatarEditBadge}>
            {uploadingSlot === 'avatar' ? '...' : '📷'}
            <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => e.target.files?.[0] && uploadPhoto(e.target.files[0], 'avatar')} />
          </label>
        </div>
        {photoError && <p style={{ ...styles.error, padding: '0 24px' }}>{photoError}</p>}

        <BasicInfoSection
          initial={{
            fullName: data.fullName ?? '',
            gender: data.gender ?? '',
            dateOfBirth: data.dateOfBirth?.slice(0, 10) ?? '',
            maritalStatus: p?.maritalStatus ?? '',
            physicalStatus: p?.physicalStatus ?? '',
            profileCreatedBy: p?.profileCreatedBy ?? '',
            bio: p?.bio ?? '',
            height: p?.height ? String(p.height) : '',
          }}
          onSaved={(vals) => setData((prev) => ({
            ...prev,
            fullName: vals.fullName,
            gender: vals.gender,
            dateOfBirth: vals.dateOfBirth,
            profile: prev.profile ? { ...prev.profile, maritalStatus: vals.maritalStatus, physicalStatus: vals.physicalStatus, profileCreatedBy: vals.profileCreatedBy, bio: vals.bio, height: vals.height ? Number(vals.height) : null } : prev.profile,
          }))}
        />

        <ReligionAstroSection
          initial={{
            religion: p?.religion ?? '', caste: p?.caste ?? '', motherTongue: p?.motherTongue ?? '',
            horoscopeAvailable: p?.horoscopeAvailable ?? false, rashi: p?.rashi ?? '',
            nakshatra: p?.nakshatra ?? '', dosham: p?.dosham ?? '',
          }}
          onSaved={(vals) => setData((prev) => ({ ...prev, profile: prev.profile ? { ...prev.profile, ...vals } : prev.profile }))}
        />

        <CareerSection
          initial={{
            educationLevel: p?.educationLevel ?? '', education: p?.education ?? '',
            occupationCategory: p?.occupationCategory ?? '', employmentType: p?.employmentType ?? '',
            occupation: p?.occupation ?? '', annualIncome: p?.annualIncome ?? '',
          }}
          onSaved={(vals) => setData((prev) => ({ ...prev, profile: prev.profile ? { ...prev.profile, ...vals } : prev.profile }))}
        />

        <LocationSection
          initial={{ state: p?.state ?? '', district: p?.district ?? '' }}
          onSaved={(vals) => setData((prev) => ({ ...prev, profile: prev.profile ? { ...prev.profile, ...vals } : prev.profile }))}
        />

        <LifestyleSection
          initial={{
            eatingHabit: p?.eatingHabit ?? '', smokingHabit: p?.smokingHabit ?? '', drinkingHabit: p?.drinkingHabit ?? '',
            hobbies: p?.hobbies?.join(', ') ?? '', familyStatus: p?.familyStatus ?? '', familyValue: p?.familyValue ?? '', familyType: p?.familyType ?? '',
          }}
          onSaved={(vals) => setData((prev) => ({ ...prev, profile: prev.profile ? { ...prev.profile, ...vals, hobbies: vals.hobbies.split(',').map((h: string) => h.trim()).filter(Boolean) } : prev.profile }))}
        />

        <PartnerPreferencesSection
          initial={{
            partnerAgeMin: p?.partnerAgeMin ? String(p.partnerAgeMin) : '',
            partnerAgeMax: p?.partnerAgeMax ? String(p.partnerAgeMax) : '',
            partnerHeightMin: p?.partnerHeightMin ? String(p.partnerHeightMin) : '',
            partnerHeightMax: p?.partnerHeightMax ? String(p.partnerHeightMax) : '',
            partnerReligion: p?.partnerReligion ?? '', partnerCaste: p?.partnerCaste ?? '',
            partnerMotherTongue: p?.partnerMotherTongue ?? '', partnerMaritalStatus: p?.partnerMaritalStatus ?? '',
            partnerEducationLevel: p?.partnerEducationLevel ?? '', partnerOccupationCategory: p?.partnerOccupationCategory ?? '',
            partnerEmploymentType: p?.partnerEmploymentType ?? '', partnerState: p?.partnerState ?? '',
            partnerDistrict: p?.partnerDistrict ?? '', partnerEatingHabit: p?.partnerEatingHabit ?? '',
            partnerSmokingHabit: p?.partnerSmokingHabit ?? '', partnerDrinkingHabit: p?.partnerDrinkingHabit ?? '',
            partnerPhysicalStatus: p?.partnerPhysicalStatus ?? '', partnerFamilyStatus: p?.partnerFamilyStatus ?? '',
            partnerFamilyValue: p?.partnerFamilyValue ?? '', partnerFamilyType: p?.partnerFamilyType ?? '',
            partnerDosham: p?.partnerDosham ?? '', partnerNakshatra: p?.partnerNakshatra ?? '',
          }}
          onSaved={(vals) => setData((prev) => ({ ...prev, profile: prev.profile ? { ...prev.profile, ...vals } : prev.profile }))}
        />

        {!data.idVerified && (
          <IdVerificationUpload onSubmitted={() => window.location.reload()} />
        )}

        <div style={styles.deleteAccountLink}>
          <Link href="/settings" style={styles.deleteAccountLinkText}>Delete My Account</Link>
        </div>
      </div>
    </div>
  )
}

// ---------- Shared building blocks ----------

function SectionShell({
  title, children, onSave, saving, saved, error,
}: {
  title: string; children: React.ReactNode; onSave: () => void; saving: boolean; saved: boolean; error: string
}) {
  return (
    <div style={styles.sectionCard}>
      <div style={styles.sectionHeader}>
        <h3 style={styles.sectionTitle}>{title}</h3>
        <button onClick={onSave} disabled={saving} style={styles.sectionSaveButton}>
          {saving ? 'Saving...' : saved ? 'Saved ✓' : 'Save'}
        </button>
      </div>
      {children}
      {error && <p style={styles.error}>{error}</p>}
    </div>
  )
}

function useSectionSave<T extends Record<string, any>>(onSaved: (vals: T) => void) {
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  const save = async (payload: T, transformForCallback?: T) => {
    setError('')
    setSaving(true)
    setSaved(false)
    try {
      // Empty-string values from unselected <select> fields aren't valid
      // Prisma enum values — omit them so those fields are simply left
      // untouched rather than sent as "" and rejected.
      const sanitized = Object.fromEntries(
        Object.entries(payload).filter(([, v]) => v !== '')
      ) as T

      await patchProfile(sanitized)
      onSaved(transformForCallback ?? payload)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (e: any) {
      setError(e.message || 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  return { saving, saved, error, save }
}

function Field({ label, value, onChange, multiline, type = 'text' }: { label: string; value: string; onChange: (v: string) => void; multiline?: boolean; type?: string }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={styles.label}>{label}</label>
      {multiline ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} style={{ ...styles.input, height: 80, resize: 'vertical' as const }} />
      ) : (
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)} style={styles.input} />
      )}
    </div>
  )
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: Record<string, string> }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={styles.label}>{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)} style={styles.input}>
        <option value="">Select</option>
        {Object.entries(options).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
      </select>
    </div>
  )
}

// ---------- Individual sections ----------

function BasicInfoSection({ initial, onSaved }: { initial: any; onSaved: (v: any) => void }) {
  const [v, setV] = useState(initial)
  const { saving, saved, error, save } = useSectionSave(onSaved)
  const set = (k: string, val: any) => setV((p: any) => ({ ...p, [k]: val }))

  const buildPayload = () => ({
    ...v,
    height: v.height ? Number(v.height) : undefined,
  })

  return (
    <SectionShell title="Basic Info" onSave={() => save(buildPayload(), v)} saving={saving} saved={saved} error={error}>
      <Field label="Full Name" value={v.fullName} onChange={(val) => set('fullName', val)} />
      <div style={styles.pillRow}>
        {['MALE', 'FEMALE', 'OTHER'].map((g) => (
          <button key={g} type="button" onClick={() => set('gender', g)} style={v.gender === g ? styles.pillActive : styles.pill}>
            {g === 'MALE' ? 'Male' : g === 'FEMALE' ? 'Female' : 'Other'}
          </button>
        ))}
      </div>
      <div style={{ marginBottom: 14 }}>
        <label style={styles.label}>Date of Birth</label>
        <input type="date" value={v.dateOfBirth} onChange={(e) => set('dateOfBirth', e.target.value)} style={styles.input} />
      </div>
      <Select label="Marital Status" value={v.maritalStatus} onChange={(val) => set('maritalStatus', val)} options={MARITAL_STATUS_LABELS} />
      <Select label="Physical Status" value={v.physicalStatus} onChange={(val) => set('physicalStatus', val)} options={PHYSICAL_STATUS_LABELS} />
      <Select label="Profile Created By" value={v.profileCreatedBy} onChange={(val) => set('profileCreatedBy', val)} options={PROFILE_CREATED_BY_LABELS} />
      <Field label="Bio" value={v.bio} onChange={(val) => set('bio', val)} multiline />
      <Field label="Height (cm)" value={v.height} onChange={(val) => set('height', val)} type="number" />
    </SectionShell>
  )
}

function ReligionAstroSection({ initial, onSaved }: { initial: any; onSaved: (v: any) => void }) {
  const [v, setV] = useState(initial)
  const { saving, saved, error, save } = useSectionSave(onSaved)
  const set = (k: string, val: any) => setV((p: any) => ({ ...p, [k]: val }))

  return (
    <SectionShell title="Religion & Astro Details" onSave={() => save(v)} saving={saving} saved={saved} error={error}>
      <Select label="Religion" value={v.religion} onChange={(val) => set('religion', val)} options={RELIGION_LABELS} />
      <Field label="Caste / Community" value={v.caste} onChange={(val) => set('caste', val)} />
      <Field label="Mother Tongue" value={v.motherTongue} onChange={(val) => set('motherTongue', val)} />
      <label style={styles.checkboxRow}>
        <input type="checkbox" checked={v.horoscopeAvailable} onChange={(e) => set('horoscopeAvailable', e.target.checked)} />
        <span style={styles.checkboxLabel}>Horoscope Available</span>
      </label>
      <Field label="Rashi (Moon Sign)" value={v.rashi} onChange={(val) => set('rashi', val)} />
      <Select label="Nakshatra" value={v.nakshatra} onChange={(val) => set('nakshatra', val)} options={NAKSHATRA_LABELS} />
      <Select label="Dosham" value={v.dosham} onChange={(val) => set('dosham', val)} options={DOSHAM_LABELS} />
    </SectionShell>
  )
}

function CareerSection({ initial, onSaved }: { initial: any; onSaved: (v: any) => void }) {
  const [v, setV] = useState(initial)
  const { saving, saved, error, save } = useSectionSave(onSaved)
  const set = (k: string, val: any) => setV((p: any) => ({ ...p, [k]: val }))

  return (
    <SectionShell title="Education & Career" onSave={() => save(v)} saving={saving} saved={saved} error={error}>
      <Select label="Education Level" value={v.educationLevel} onChange={(val) => set('educationLevel', val)} options={EDUCATION_LEVEL_LABELS} />
      <Field label="Degree / Field (detail)" value={v.education} onChange={(val) => set('education', val)} />
      <Select label="Occupation Category" value={v.occupationCategory} onChange={(val) => set('occupationCategory', val)} options={OCCUPATION_CATEGORY_LABELS} />
      <Select label="Employment Type" value={v.employmentType} onChange={(val) => set('employmentType', val)} options={EMPLOYMENT_TYPE_LABELS} />
      <Field label="Job Title (detail)" value={v.occupation} onChange={(val) => set('occupation', val)} />
      <Field label="Annual Income" value={v.annualIncome} onChange={(val) => set('annualIncome', val)} />
    </SectionShell>
  )
}

function LocationSection({ initial, onSaved }: { initial: any; onSaved: (v: any) => void }) {
  const [v, setV] = useState(initial)
  const { saving, saved, error, save } = useSectionSave(onSaved)
  const districts = getDistrictsForState(v.state)

  return (
    <SectionShell title="Location" onSave={() => save(v)} saving={saving} saved={saved} error={error}>
      <div style={{ marginBottom: 14 }}>
        <label style={styles.label}>State</label>
        <select value={v.state} onChange={(e) => setV({ state: e.target.value, district: '' })} style={styles.input}>
          <option value="">Select state</option>
          {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <div style={{ marginBottom: 14 }}>
        <label style={styles.label}>District</label>
        <select
          value={v.district}
          onChange={(e) => setV((p: any) => ({ ...p, district: e.target.value }))}
          style={styles.input}
          disabled={!v.state}
        >
          <option value="">{v.state ? 'Select district' : 'Select a state first'}</option>
          {districts.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>
    </SectionShell>
  )
}

function LifestyleSection({ initial, onSaved }: { initial: any; onSaved: (v: any) => void }) {
  const [v, setV] = useState(initial)
  const { saving, saved, error, save } = useSectionSave(onSaved)
  const set = (k: string, val: any) => setV((p: any) => ({ ...p, [k]: val }))

  return (
    <SectionShell
      title="Lifestyle & Family"
      onSave={() => save({ ...v, hobbies: v.hobbies.split(',').map((h: string) => h.trim()).filter(Boolean) }, v)}
      saving={saving} saved={saved} error={error}
    >
      <Select label="Eating Habits" value={v.eatingHabit} onChange={(val) => set('eatingHabit', val)} options={EATING_HABIT_LABELS} />
      <Select label="Smoking Habits" value={v.smokingHabit} onChange={(val) => set('smokingHabit', val)} options={SMOKING_HABIT_LABELS} />
      <Select label="Drinking Habits" value={v.drinkingHabit} onChange={(val) => set('drinkingHabit', val)} options={DRINKING_HABIT_LABELS} />
      <Field label="Hobbies (comma-separated)" value={v.hobbies} onChange={(val) => set('hobbies', val)} />
      <Select label="Family Status" value={v.familyStatus} onChange={(val) => set('familyStatus', val)} options={FAMILY_STATUS_LABELS} />
      <Select label="Family Value" value={v.familyValue} onChange={(val) => set('familyValue', val)} options={FAMILY_VALUE_LABELS} />
      <Select label="Family Type" value={v.familyType} onChange={(val) => set('familyType', val)} options={FAMILY_TYPE_LABELS} />
    </SectionShell>
  )
}

function PartnerPreferencesSection({ initial, onSaved }: { initial: any; onSaved: (v: any) => void }) {
  const [v, setV] = useState(initial)
  const { saving, saved, error, save } = useSectionSave(onSaved)
  const set = (k: string, val: any) => setV((p: any) => ({ ...p, [k]: val }))
  const districts = getDistrictsForState(v.partnerState)

  const buildPayload = () => ({
    ...v,
    partnerAgeMin: v.partnerAgeMin ? Number(v.partnerAgeMin) : undefined,
    partnerAgeMax: v.partnerAgeMax ? Number(v.partnerAgeMax) : undefined,
    partnerHeightMin: v.partnerHeightMin ? Number(v.partnerHeightMin) : undefined,
    partnerHeightMax: v.partnerHeightMax ? Number(v.partnerHeightMax) : undefined,
  })

  return (
    <SectionShell title="Partner Preferences" onSave={() => save(buildPayload(), v)} saving={saving} saved={saved} error={error}>
      <div style={{ display: 'flex', gap: 10 }}>
        <Field label="Min Age" value={v.partnerAgeMin} onChange={(val) => set('partnerAgeMin', val)} type="number" />
        <Field label="Max Age" value={v.partnerAgeMax} onChange={(val) => set('partnerAgeMax', val)} type="number" />
      </div>
      <div style={{ display: 'flex', gap: 10 }}>
        <Field label="Min Height (cm)" value={v.partnerHeightMin} onChange={(val) => set('partnerHeightMin', val)} type="number" />
        <Field label="Max Height (cm)" value={v.partnerHeightMax} onChange={(val) => set('partnerHeightMax', val)} type="number" />
      </div>
      <Select label="Preferred Religion" value={v.partnerReligion} onChange={(val) => set('partnerReligion', val)} options={RELIGION_LABELS} />
      <Field label="Preferred Caste" value={v.partnerCaste} onChange={(val) => set('partnerCaste', val)} />
      <Field label="Preferred Mother Tongue" value={v.partnerMotherTongue} onChange={(val) => set('partnerMotherTongue', val)} />
      <Select label="Preferred Marital Status" value={v.partnerMaritalStatus} onChange={(val) => set('partnerMaritalStatus', val)} options={MARITAL_STATUS_LABELS} />
      <Select label="Preferred Physical Status" value={v.partnerPhysicalStatus} onChange={(val) => set('partnerPhysicalStatus', val)} options={PHYSICAL_STATUS_LABELS} />
      <Select label="Preferred Education Level" value={v.partnerEducationLevel} onChange={(val) => set('partnerEducationLevel', val)} options={EDUCATION_LEVEL_LABELS} />
      <Select label="Preferred Occupation Category" value={v.partnerOccupationCategory} onChange={(val) => set('partnerOccupationCategory', val)} options={OCCUPATION_CATEGORY_LABELS} />
      <Select label="Preferred Employment Type" value={v.partnerEmploymentType} onChange={(val) => set('partnerEmploymentType', val)} options={EMPLOYMENT_TYPE_LABELS} />

      <div style={{ marginBottom: 14 }}>
        <label style={styles.label}>Preferred State</label>
        <select value={v.partnerState} onChange={(e) => setV((p: any) => ({ ...p, partnerState: e.target.value, partnerDistrict: '' }))} style={styles.input}>
          <option value="">Any</option>
          {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <div style={{ marginBottom: 14 }}>
        <label style={styles.label}>Preferred District</label>
        <select value={v.partnerDistrict} onChange={(e) => set('partnerDistrict', e.target.value)} style={styles.input} disabled={!v.partnerState}>
          <option value="">Any</option>
          {districts.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      <Select label="Preferred Eating Habits" value={v.partnerEatingHabit} onChange={(val) => set('partnerEatingHabit', val)} options={EATING_HABIT_LABELS} />
      <Select label="Preferred Smoking Habits" value={v.partnerSmokingHabit} onChange={(val) => set('partnerSmokingHabit', val)} options={SMOKING_HABIT_LABELS} />
      <Select label="Preferred Drinking Habits" value={v.partnerDrinkingHabit} onChange={(val) => set('partnerDrinkingHabit', val)} options={DRINKING_HABIT_LABELS} />
      <Select label="Preferred Family Status" value={v.partnerFamilyStatus} onChange={(val) => set('partnerFamilyStatus', val)} options={FAMILY_STATUS_LABELS} />
      <Select label="Preferred Family Value" value={v.partnerFamilyValue} onChange={(val) => set('partnerFamilyValue', val)} options={FAMILY_VALUE_LABELS} />
      <Select label="Preferred Family Type" value={v.partnerFamilyType} onChange={(val) => set('partnerFamilyType', val)} options={FAMILY_TYPE_LABELS} />
      <Select label="Preferred Dosham" value={v.partnerDosham} onChange={(val) => set('partnerDosham', val)} options={DOSHAM_LABELS} />
      <Select label="Preferred Nakshatra" value={v.partnerNakshatra} onChange={(val) => set('partnerNakshatra', val)} options={NAKSHATRA_LABELS} />
    </SectionShell>
  )
}

function IdVerificationUpload({ onSubmitted }: { onSubmitted: () => void }) {
  const [documentType, setDocumentType] = useState<'aadhar' | 'pan'>('aadhar')
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [documentUrl, setDocumentUrl] = useState<string | null>(null)
  const [error, setError] = useState('')

  const uploadDoc = async (file: File) => {
    setError('')
    setUploading(true)
    try {
      const presignRes = await fetch('/api/upload/presign', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contentType: file.type, folder: 'id-documents' }),
      })
      if (!presignRes.ok) throw new Error()
      const { uploadUrl, publicUrl } = await presignRes.json()
      const uploadRes = await fetch(uploadUrl, { method: 'PUT', headers: { 'Content-Type': file.type }, body: file })
      if (!uploadRes.ok) throw new Error()
      setDocumentUrl(publicUrl)
    } catch {
      setError('Failed to upload document')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async () => {
    if (!documentUrl) { setError('Please upload your document first'); return }
    setSubmitting(true)
    try {
      const res = await fetch('/api/profile/verify-id', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentType, documentUrl }),
      })
      if (!res.ok) throw new Error()
      onSubmitted()
    } catch {
      setError('Failed to submit. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={styles.idUploadCard}>
      <p style={styles.sectionTitle}>Identity Verification</p>
      <p style={styles.idUploadNote}>Upload a clear photo of your Aadhaar or PAN card. Reviewed manually, never shown publicly.</p>
      <div style={styles.pillRow}>
        <button type="button" onClick={() => setDocumentType('aadhar')} style={documentType === 'aadhar' ? styles.pillActive : styles.pill}>Aadhaar Card</button>
        <button type="button" onClick={() => setDocumentType('pan')} style={documentType === 'pan' ? styles.pillActive : styles.pill}>PAN Card</button>
      </div>
      {documentUrl ? (
        <div>
          <img src={documentUrl} alt="" style={styles.idPreviewImg} />
          <button type="button" onClick={() => setDocumentUrl(null)} style={styles.idRemoveButton}>Remove</button>
        </div>
      ) : (
        <label style={styles.idUploadButton}>
          {uploading ? 'Uploading...' : 'Upload Document'}
          <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => e.target.files?.[0] && uploadDoc(e.target.files[0])} />
        </label>
      )}
      {error && <p style={styles.error}>{error}</p>}
      <button type="button" onClick={handleSubmit} disabled={submitting || !documentUrl} style={styles.idSubmitButton}>
        {submitting ? 'Submitting...' : 'Submit for Review'}
      </button>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: '100vh', backgroundColor: '#fff0f3', fontFamily: 'system-ui, sans-serif' },
  container: { maxWidth: 640, margin: '0 auto', paddingBottom: 40 },
  coverWrap: { height: 200, backgroundColor: '#f6c6d4', position: 'relative' as const },
  coverImg: { width: '100%', height: '100%', objectFit: 'cover' as const },
  coverPlaceholder: { width: '100%', height: '100%', backgroundColor: '#f6c6d4' },
  coverEditBadge: { position: 'absolute' as const, bottom: 12, right: 16, width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(0,0,0,0.45)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 16 },
  avatarSection: { marginTop: -50, marginLeft: 24, position: 'relative' as const, width: 100 },
  avatar: { width: 100, height: 100, borderRadius: 50, border: '4px solid #fff0f3', objectFit: 'cover' as const },
  avatarPlaceholder: { backgroundColor: '#fce8ee', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40 },
  avatarEditBadge: { position: 'absolute' as const, bottom: 0, right: 0, width: 30, height: 30, borderRadius: 15, backgroundColor: '#d6336c', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 13, border: '2px solid #fff0f3' },
  nameSection: { padding: '14px 24px 0' },
  name: { fontSize: 22, fontWeight: 700, color: '#5c2a3a', margin: 0 },
  email: { fontSize: 13, color: '#a5486a', margin: '4px 0 0' },
  bio: { fontSize: 14, color: '#5c2a3a', marginTop: 10, lineHeight: 1.5 },
  progressSection: { padding: '0 24px', marginTop: 18, marginBottom: 4 },
  progressLabelRow: { display: 'flex', justifyContent: 'space-between', marginBottom: 6 },
  progressLabel: { fontSize: 13, fontWeight: 700, color: '#5c2a3a', margin: 0 },
  progressPercent: { fontSize: 13, fontWeight: 700, color: '#d6336c', margin: 0 },
  progressTrack: { height: 8, backgroundColor: '#fce8ee', borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#d6336c', borderRadius: 4, transition: 'width 0.3s ease' },
  editButton: { margin: '18px 24px 0', padding: '11px 20px', borderRadius: 12, border: 'none', backgroundColor: '#d6336c', color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer', width: 'calc(100% - 48px)' },
  idCard: { backgroundColor: '#ffffff', borderRadius: 16, padding: 18, margin: '16px 24px 0' },
  idCardTitle: { fontSize: 14, fontWeight: 700, color: '#5c2a3a', margin: '0 0 10px' },
  idBadgeVerified: { fontSize: 12, fontWeight: 700, color: '#1a7a3d', backgroundColor: '#d4f4dd', borderRadius: 8, padding: '5px 12px' },
  idBadgePending: { fontSize: 12, fontWeight: 700, color: '#8a6d00', backgroundColor: '#fff3cd', borderRadius: 8, padding: '5px 12px' },
  idBadgeRejected: { fontSize: 12, fontWeight: 700, color: '#c0392b', backgroundColor: '#fce8e8', borderRadius: 8, padding: '5px 12px' },
  idStatusText: { fontSize: 12, color: '#8a5464', margin: '8px 0' },
  idVerifyButton: { padding: '8px 16px', borderRadius: 10, border: 'none', backgroundColor: '#d6336c', color: '#fff', fontWeight: 700, fontSize: 12, cursor: 'pointer' },
  detailsCard: { backgroundColor: '#ffffff', borderRadius: 16, padding: 20, margin: '16px 24px 0' },
  cardTitle: { fontSize: 14, fontWeight: 700, color: '#5c2a3a', margin: '0 0 12px' },
  detailRow: { display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0' },
  detailText: { fontSize: 13, color: '#5c2a3a' },
  editHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px 0' },
  editTitle: { fontSize: 20, fontWeight: 700, color: '#5c2a3a', margin: 0 },
  doneButton: { padding: '8px 18px', borderRadius: 10, border: 'none', backgroundColor: '#d6336c', color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer' },
  sectionCard: { backgroundColor: '#ffffff', borderRadius: 16, padding: 20, margin: '16px 24px 0' },
  sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  sectionTitle: { fontSize: 14, fontWeight: 700, color: '#d6336c', margin: 0 },
  sectionSaveButton: { padding: '7px 16px', borderRadius: 8, border: '1px solid #d6336c', backgroundColor: '#ffffff', color: '#d6336c', fontWeight: 700, fontSize: 12, cursor: 'pointer', minWidth: 76 },
  label: { display: 'block', fontSize: 12, fontWeight: 600, color: '#a5486a', marginBottom: 5 },
  input: { width: '100%', padding: '9px 12px', borderRadius: 10, border: '1px solid #f6c6d4', fontSize: 14, backgroundColor: '#ffffff', color: '#5c2a3a', boxSizing: 'border-box' as const },
  pillRow: { display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' as const },
  pill: { flex: 1, minWidth: 70, padding: '8px 0', borderRadius: 8, border: '1px solid #f6c6d4', backgroundColor: '#fff', color: '#a5486a', fontWeight: 600, fontSize: 13, cursor: 'pointer' },
  pillActive: { flex: 1, minWidth: 70, padding: '8px 0', borderRadius: 8, border: '1px solid #d6336c', backgroundColor: '#d6336c', color: '#fff', fontWeight: 600, fontSize: 13, cursor: 'pointer' },
  checkboxRow: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, cursor: 'pointer' },
  checkboxLabel: { fontSize: 13, color: '#5c2a3a', fontWeight: 600 },
  error: { color: '#e03131', fontSize: 12, marginTop: 8 },
  idUploadCard: { backgroundColor: '#fff5f7', borderRadius: 16, padding: 20, margin: '24px 24px 0' },
  idUploadNote: { fontSize: 12, color: '#8a5464', lineHeight: 1.5, margin: '0 0 14px' },
  idPreviewImg: { width: '100%', maxWidth: 300, borderRadius: 10, marginBottom: 8, display: 'block' },
  idRemoveButton: { fontSize: 12, color: '#e03131', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 },
  idUploadButton: { display: 'inline-block', marginTop: 10, padding: '10px 18px', borderRadius: 10, border: '1px dashed #d6336c', color: '#d6336c', fontWeight: 600, fontSize: 13, cursor: 'pointer' },
  idSubmitButton: { marginTop: 16, padding: '11px 20px', borderRadius: 10, border: 'none', backgroundColor: '#d6336c', color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer' },
  deleteAccountLink: { marginTop: 24, marginInline: 24, paddingTop: 20, borderTop: '1px solid #fce8ee', textAlign: 'center' as const },
  deleteAccountLinkText: { fontSize: 13, color: '#e03131', fontWeight: 600, textDecoration: 'none' },
}