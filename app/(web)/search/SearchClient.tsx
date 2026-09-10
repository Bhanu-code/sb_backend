'use client'

import { useState } from 'react'
import {
  RELIGION_LABELS, EDUCATION_LEVEL_LABELS, OCCUPATION_CATEGORY_LABELS, MARITAL_STATUS_LABELS,
  PHYSICAL_STATUS_LABELS, EMPLOYMENT_TYPE_LABELS, EATING_HABIT_LABELS, SMOKING_HABIT_LABELS,
  DRINKING_HABIT_LABELS, FAMILY_STATUS_LABELS, FAMILY_VALUE_LABELS, FAMILY_TYPE_LABELS,
  NAKSHATRA_LABELS, DOSHAM_LABELS,
} from '@/lib/matrimonyLabels'

type Profile = {
  id: string; name: string; age: number; profession: string | null; location: string | null
  religion: string | null; caste: string | null; height: number | null; education: string | null
  image: string | null
}

const initialFilters = {
  ageMin: '21', ageMax: '35', heightMin: '', heightMax: '',
  maritalStatus: '', motherTongue: '', physicalStatus: '',
  religion: '', caste: '', nakshatra: '', dosham: '', hasHoroscope: '',
  employmentType: '', educationLevel: '', occupationCategory: '',
  country: '', citizenship: '', city: '', state: '',
  eatingHabit: '', smokingHabit: '', drinkingHabit: '',
  familyStatus: '', familyValue: '', familyType: '',
  hasPhoto: '',
}

export default function SearchClient() {
  const [filters, setFilters] = useState(initialFilters)
  const [results, setResults] = useState<Profile[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [sentIds, setSentIds] = useState<Set<string>>(new Set())
  const [showFilters, setShowFilters] = useState(true)

  const update = (key: keyof typeof filters, value: string) => setFilters((prev) => ({ ...prev, [key]: value }))

  const runSearch = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([k, v]) => { if (v) params.set(k, v) })
      const res = await fetch(`/api/matches/search?${params.toString()}`)
      const data = await res.json()
      setResults(data.profiles ?? [])
      setShowFilters(false) // collapse to results view after a successful search
    } catch {
      setResults([])
      setShowFilters(false)
    } finally {
      setLoading(false)
    }
  }

  const sendInterest = async (id: string) => {
    try {
      const res = await fetch('/api/matches/interest', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ receiverId: id }),
      })
      if (res.ok) setSentIds((prev) => new Set(prev).add(id))
    } catch {}
  }

  const resetSearch = () => {
    setFilters(initialFilters)
    setResults(null)
    setShowFilters(true)
  }

  const activeFilterCount = Object.entries(filters).filter(([k, v]) => v && v !== initialFilters[k as keyof typeof initialFilters]).length

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.headerRow}>
          <h1 style={styles.title}>Advanced Search</h1>
          {results !== null && !showFilters && (
            <div style={styles.headerActions}>
              <button onClick={() => setShowFilters(true)} style={styles.modifyButton}>
                Modify Search{activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}
              </button>
              <button onClick={resetSearch} style={styles.resetButton}>Reset</button>
            </div>
          )}
        </div>

        {showFilters && (
          <>
            <FilterGroup title="Basic Details">
              <RangeRow label="Age" min={filters.ageMin} max={filters.ageMax} onMin={(v) => update('ageMin', v)} onMax={(v) => update('ageMax', v)} />
              <RangeRow label="Height (cm)" min={filters.heightMin} max={filters.heightMax} onMin={(v) => update('heightMin', v)} onMax={(v) => update('heightMax', v)} />
              <SelectField label="Marital Status" value={filters.maritalStatus} onChange={(v) => update('maritalStatus', v)} options={MARITAL_STATUS_LABELS} />
              <TextField label="Mother Tongue" value={filters.motherTongue} onChange={(v) => update('motherTongue', v)} />
              <SelectField label="Physical Status" value={filters.physicalStatus} onChange={(v) => update('physicalStatus', v)} options={PHYSICAL_STATUS_LABELS} />
            </FilterGroup>

            <FilterGroup title="Religious & Astro Details">
              <SelectField label="Religion" value={filters.religion} onChange={(v) => update('religion', v)} options={RELIGION_LABELS} />
              <TextField label="Caste" value={filters.caste} onChange={(v) => update('caste', v)} />
              <SelectField label="Nakshatra" value={filters.nakshatra} onChange={(v) => update('nakshatra', v)} options={NAKSHATRA_LABELS} />
              <SelectField label="Dosham" value={filters.dosham} onChange={(v) => update('dosham', v)} options={DOSHAM_LABELS} />
              <CheckboxField label="Only profiles with horoscope" checked={filters.hasHoroscope === 'true'} onChange={(c) => update('hasHoroscope', c ? 'true' : '')} />
            </FilterGroup>

            <FilterGroup title="Professional Details">
              <SelectField label="Employment Type" value={filters.employmentType} onChange={(v) => update('employmentType', v)} options={EMPLOYMENT_TYPE_LABELS} />
              <SelectField label="Education Level" value={filters.educationLevel} onChange={(v) => update('educationLevel', v)} options={EDUCATION_LEVEL_LABELS} />
              <SelectField label="Occupation Category" value={filters.occupationCategory} onChange={(v) => update('occupationCategory', v)} options={OCCUPATION_CATEGORY_LABELS} />
            </FilterGroup>

            <FilterGroup title="Location Details">
              <TextField label="Country" value={filters.country} onChange={(v) => update('country', v)} />
              <TextField label="Citizenship" value={filters.citizenship} onChange={(v) => update('citizenship', v)} />
              <TextField label="City" value={filters.city} onChange={(v) => update('city', v)} />
              <TextField label="State" value={filters.state} onChange={(v) => update('state', v)} />
            </FilterGroup>

            <FilterGroup title="Lifestyle">
              <SelectField label="Eating Habits" value={filters.eatingHabit} onChange={(v) => update('eatingHabit', v)} options={EATING_HABIT_LABELS} />
              <SelectField label="Smoking Habits" value={filters.smokingHabit} onChange={(v) => update('smokingHabit', v)} options={SMOKING_HABIT_LABELS} />
              <SelectField label="Drinking Habits" value={filters.drinkingHabit} onChange={(v) => update('drinkingHabit', v)} options={DRINKING_HABIT_LABELS} />
            </FilterGroup>

            <FilterGroup title="Family Details">
              <SelectField label="Family Status" value={filters.familyStatus} onChange={(v) => update('familyStatus', v)} options={FAMILY_STATUS_LABELS} />
              <SelectField label="Family Value" value={filters.familyValue} onChange={(v) => update('familyValue', v)} options={FAMILY_VALUE_LABELS} />
              <SelectField label="Family Type" value={filters.familyType} onChange={(v) => update('familyType', v)} options={FAMILY_TYPE_LABELS} />
            </FilterGroup>

            <FilterGroup title="Profile Type">
              <CheckboxField label="Only profiles with photo" checked={filters.hasPhoto === 'true'} onChange={(c) => update('hasPhoto', c ? 'true' : '')} />
            </FilterGroup>

            <div style={styles.searchButtonRow}>
              {results !== null && (
                <button onClick={() => setShowFilters(false)} style={styles.cancelFilterButton}>Cancel</button>
              )}
              <button onClick={runSearch} disabled={loading} style={styles.searchButton}>
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </>
        )}

        {results !== null && !showFilters && (
          <div style={styles.resultsSection}>
            <p style={styles.resultsCount}>{results.length} matches found</p>
            {results.length === 0 ? (
              <div style={styles.emptyState}>
                <p style={styles.emptyText}>No matches found for these filters.</p>
                <button onClick={() => setShowFilters(true)} style={styles.modifyButton}>Modify Search</button>
              </div>
            ) : (
              <div style={styles.grid}>
                {results.map((p) => {
                  const sent = sentIds.has(p.id)
                  return (
                    <div key={p.id} style={styles.card}>
                      <div style={styles.cardImageWrap}>
                        {p.image ? <img src={p.image} alt={p.name} style={styles.cardImage} /> : <div style={{ ...styles.cardImage, ...styles.cardImagePlaceholder }}>👤</div>}
                      </div>
                      <div style={styles.cardBody}>
                        <h3 style={styles.cardName}>{p.name}, {p.age}</h3>
                        {p.profession && <p style={styles.cardDetail}>💼 {p.profession}</p>}
                        {p.location && <p style={styles.cardDetail}>📍 {p.location}</p>}
                      </div>
                      <div style={styles.cardActions}>
                        <button onClick={() => sendInterest(p.id)} disabled={sent} style={sent ? styles.sentButton : styles.likeButton}>
                          {sent ? '✓ Sent' : 'Send Interest'}
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={styles.filterGroup}>
      <h3 style={styles.filterGroupTitle}>{title}</h3>
      <div style={styles.filterGrid}>{children}</div>
    </div>
  )
}

function SelectField({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: Record<string, string> }) {
  return (
    <div>
      <label style={styles.label}>{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)} style={styles.input}>
        <option value="">Any</option>
        {Object.entries(options).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
      </select>
    </div>
  )
}

function TextField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label style={styles.label}>{label}</label>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} style={styles.input} />
    </div>
  )
}

function CheckboxField({ label, checked, onChange }: { label: string; checked: boolean; onChange: (c: boolean) => void }) {
  return (
    <label style={styles.checkboxRow}>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span style={styles.checkboxLabel}>{label}</span>
    </label>
  )
}

function RangeRow({ label, min, max, onMin, onMax }: { label: string; min: string; max: string; onMin: (v: string) => void; onMax: (v: string) => void }) {
  return (
    <div>
      <label style={styles.label}>{label}</label>
      <div style={{ display: 'flex', gap: 8 }}>
        <input type="number" value={min} onChange={(e) => onMin(e.target.value)} placeholder="Min" style={styles.input} />
        <input type="number" value={max} onChange={(e) => onMax(e.target.value)} placeholder="Max" style={styles.input} />
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: '100vh', backgroundColor: '#fff0f3', fontFamily: 'system-ui, sans-serif' },
  container: { maxWidth: 1000, margin: '0 auto', padding: '32px 24px 60px' },
  headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap' as const, gap: 12 },
  title: { fontSize: 24, fontWeight: 700, color: '#5c2a3a', margin: 0 },
  headerActions: { display: 'flex', gap: 10 },
  modifyButton: { padding: '9px 18px', borderRadius: 10, border: '1px solid #d6336c', backgroundColor: '#ffffff', color: '#d6336c', fontWeight: 700, fontSize: 13, cursor: 'pointer' },
  resetButton: { padding: '9px 18px', borderRadius: 10, border: '1px solid #f6c6d4', backgroundColor: '#ffffff', color: '#a5486a', fontWeight: 600, fontSize: 13, cursor: 'pointer' },
  filterGroup: { backgroundColor: '#ffffff', borderRadius: 16, padding: 20, marginBottom: 16 },
  filterGroupTitle: { fontSize: 14, fontWeight: 700, color: '#d6336c', margin: '0 0 14px' },
  filterGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 },
  label: { display: 'block', fontSize: 12, fontWeight: 600, color: '#a5486a', marginBottom: 5 },
  input: { width: '100%', padding: '9px 12px', borderRadius: 10, border: '1px solid #f6c6d4', fontSize: 13, backgroundColor: '#fff', color: '#5c2a3a', boxSizing: 'border-box' as const },
  checkboxRow: { display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' },
  checkboxLabel: { fontSize: 13, color: '#5c2a3a' },
  searchButtonRow: { display: 'flex', gap: 10, marginTop: 8 },
  cancelFilterButton: { padding: 14, borderRadius: 12, border: '1px solid #f6c6d4', backgroundColor: '#ffffff', color: '#a5486a', fontWeight: 600, fontSize: 14, cursor: 'pointer' },
  searchButton: { flex: 1, padding: 14, borderRadius: 12, border: 'none', backgroundColor: '#d6336c', color: '#fff', fontWeight: 700, fontSize: 15, cursor: 'pointer' },
  resultsSection: { marginTop: 8 },
  resultsCount: { fontSize: 14, fontWeight: 700, color: '#5c2a3a', marginBottom: 16 },
  emptyState: { display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: 12, padding: '60px 0' },
  emptyText: { fontSize: 14, color: '#a5486a' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 18 },
  card: { backgroundColor: '#ffffff', borderRadius: 16, overflow: 'hidden', boxShadow: '0 4px 16px rgba(214,51,108,0.06)' },
  cardImageWrap: { width: '100%', aspectRatio: '1', backgroundColor: '#fce8ee' },
  cardImage: { width: '100%', height: '100%', objectFit: 'cover' as const },
  cardImagePlaceholder: { display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36 },
  cardBody: { padding: '12px 14px' },
  cardName: { fontSize: 14, fontWeight: 700, color: '#5c2a3a', margin: '0 0 6px' },
  cardDetail: { fontSize: 11, color: '#8a5464', margin: '2px 0' },
  cardActions: { padding: '0 14px 14px' },
  likeButton: { width: '100%', padding: 8, borderRadius: 8, border: 'none', backgroundColor: '#d6336c', color: '#fff', fontWeight: 700, fontSize: 11, cursor: 'pointer' },
  sentButton: { width: '100%', padding: 8, borderRadius: 8, border: '1px solid #d6336c', backgroundColor: '#fce8ee', color: '#d6336c', fontWeight: 700, fontSize: 11, cursor: 'default' },
}