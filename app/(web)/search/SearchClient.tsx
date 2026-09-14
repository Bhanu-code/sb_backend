'use client'

import { useEffect, useState } from 'react'
import {
  RELIGION_LABELS, EDUCATION_LEVEL_LABELS, OCCUPATION_CATEGORY_LABELS, MARITAL_STATUS_LABELS,
  PHYSICAL_STATUS_LABELS, EMPLOYMENT_TYPE_LABELS, EATING_HABIT_LABELS, SMOKING_HABIT_LABELS,
  DRINKING_HABIT_LABELS, FAMILY_STATUS_LABELS, FAMILY_VALUE_LABELS, FAMILY_TYPE_LABELS,
  NAKSHATRA_LABELS, DOSHAM_LABELS, BODY_TYPE_LABELS,
} from '@/lib/matrimonyLabels'
import { INDIAN_STATES, getDistrictsForState } from '@/lib/indianLocations'

type Profile = {
  id: string; profileId: string; name: string; age: number; profession: string | null
  location: string | null; religion: string | null; caste: string | null; height: number | null
  education: string | null; image: string | null
}

type SavedSearchItem = {
  id: string
  name: string
  filters: typeof initialFilters
  createdAt: string
}

type MainTab = 'criteria' | 'profileId' | 'saved'

const initialFilters = {
  ageMin: '21', ageMax: '35', heightMin: '', heightMax: '', weightMin: '', weightMax: '',
  maritalStatus: '', motherTongue: '', physicalStatus: '', bodyType: '',
  religion: '', caste: '', gothram: '', nakshatra: '', dosham: '', hasHoroscope: '',
  employmentType: '', educationLevel: '', occupationCategory: '',
  state: '', district: '', ancestralOrigin: '',
  eatingHabit: '', smokingHabit: '', drinkingHabit: '', spokenLanguages: '',
  familyStatus: '', familyValue: '', familyType: '',
  hasPhoto: '',
}

export default function SearchClient() {
  const [mainTab, setMainTab] = useState<MainTab>('criteria')
  // Filters queued up from a saved search, waiting to be picked up by
  // CriteriaSearch the moment it mounts. Passed as a prop rather than a
  // window event, since CriteriaSearch doesn't exist in the DOM yet at
  // the moment "Show Matches" is clicked (it's conditionally rendered
  // based on mainTab) — an event fired before it mounts has no listener
  // to catch it.
  const [pendingSearch, setPendingSearch] = useState<typeof initialFilters | null>(null)

  const handleShowMatches = (filters: typeof initialFilters) => {
    setPendingSearch(filters)
    setMainTab('criteria')
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.mainTabsRow}>
          <button onClick={() => setMainTab('criteria')} style={mainTab === 'criteria' ? styles.mainTabActive : styles.mainTab}>By Criteria</button>
          <button onClick={() => setMainTab('profileId')} style={mainTab === 'profileId' ? styles.mainTabActive : styles.mainTab}>By Profile ID</button>
          <button onClick={() => setMainTab('saved')} style={mainTab === 'saved' ? styles.mainTabActive : styles.mainTab}>Saved Search</button>
        </div>

        {mainTab === 'criteria' && (
          <CriteriaSearch
            pendingFilters={pendingSearch}
            onConsumePending={() => setPendingSearch(null)}
          />
        )}
        {mainTab === 'profileId' && <ProfileIdSearch />}
        {mainTab === 'saved' && <SavedSearches onShowMatches={handleShowMatches} />}
      </div>
    </div>
  )
}

function ProfileCard({ p, sent, onSend }: { p: Profile; sent: boolean; onSend: () => void }) {
  return (
    <div style={styles.card}>
      <div style={styles.cardImageWrap}>
        {p.image ? <img src={p.image} alt={p.name} style={styles.cardImage} /> : <div style={{ ...styles.cardImage, ...styles.cardImagePlaceholder }}>👤</div>}
      </div>
      <div style={styles.cardBody}>
        <h3 style={styles.cardName}>{p.name}, {p.age}</h3>
        <p style={styles.cardIdText}>{p.profileId}</p>
        {p.profession && <p style={styles.cardDetail}>💼 {p.profession}</p>}
        {p.location && <p style={styles.cardDetail}>📍 {p.location}</p>}
      </div>
      <div style={styles.cardActions}>
        <button onClick={onSend} disabled={sent} style={sent ? styles.sentButton : styles.likeButton}>
          {sent ? '✓ Sent' : 'Send Interest'}
        </button>
      </div>
    </div>
  )
}

// ---------- Tab 1: By Criteria ----------

function CriteriaSearch({
  pendingFilters,
  onConsumePending,
}: {
  pendingFilters: typeof initialFilters | null
  onConsumePending: () => void
}) {
  const [filters, setFilters] = useState(initialFilters)
  const [results, setResults] = useState<Profile[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [sentIds, setSentIds] = useState<Set<string>>(new Set())
  const [showFilters, setShowFilters] = useState(true)
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [saveName, setSaveName] = useState('')
  const [saveStatus, setSaveStatus] = useState('')

  const runSearchWithFilters = async (filtersToUse: typeof initialFilters) => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      Object.entries(filtersToUse).forEach(([k, v]) => { if (v) params.set(k, v) })
      const res = await fetch(`/api/matches/search?${params.toString()}`)
      const data = await res.json()
      setResults(data.profiles ?? [])
      setShowFilters(false)
    } catch {
      setResults([])
      setShowFilters(false)
    } finally {
      setLoading(false)
    }
  }

  // Runs once on mount (and whenever a fresh saved search comes in) —
  // this component only exists in the DOM once mainTab === 'criteria',
  // so pendingFilters is already available as a prop by the time this
  // effect runs, avoiding the mount-order race the old event-based
  // approach had.
  useEffect(() => {
    if (pendingFilters) {
      setFilters(pendingFilters)
      runSearchWithFilters(pendingFilters)
      onConsumePending()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingFilters])

  const update = (key: keyof typeof filters, value: string) => setFilters((prev) => ({ ...prev, [key]: value }))

  const runSearch = () => runSearchWithFilters(filters)

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

  const handleSaveSearch = async () => {
    if (!saveName.trim()) return
    setSaveStatus('saving')
    try {
      const res = await fetch('/api/saved-searches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: saveName, filters }),
      })
      if (!res.ok) throw new Error()
      setSaveStatus('saved')
      setTimeout(() => {
        setShowSaveDialog(false)
        setSaveStatus('')
        setSaveName('')
      }, 1200)
    } catch {
      setSaveStatus('error')
    }
  }

  const activeFilterCount = Object.entries(filters).filter(([k, v]) => v && v !== initialFilters[k as keyof typeof initialFilters]).length

  return (
    <>
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
            <RangeRow label="Weight (kg)" min={filters.weightMin} max={filters.weightMax} onMin={(v) => update('weightMin', v)} onMax={(v) => update('weightMax', v)} />
            <SelectField label="Body Type" value={filters.bodyType} onChange={(v) => update('bodyType', v)} options={BODY_TYPE_LABELS} />
            <SelectField label="Marital Status" value={filters.maritalStatus} onChange={(v) => update('maritalStatus', v)} options={MARITAL_STATUS_LABELS} />
            <TextField label="Mother Tongue" value={filters.motherTongue} onChange={(v) => update('motherTongue', v)} />
            <SelectField label="Physical Status" value={filters.physicalStatus} onChange={(v) => update('physicalStatus', v)} options={PHYSICAL_STATUS_LABELS} />
          </FilterGroup>

          <FilterGroup title="Religious & Astro Details">
            <SelectField label="Religion" value={filters.religion} onChange={(v) => update('religion', v)} options={RELIGION_LABELS} />
            <TextField label="Caste" value={filters.caste} onChange={(v) => update('caste', v)} />
            <TextField label="Gothram" value={filters.gothram} onChange={(v) => update('gothram', v)} />
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
            <div>
              <label style={styles.label}>State</label>
              <select value={filters.state} onChange={(e) => setFilters((prev) => ({ ...prev, state: e.target.value, district: '' }))} style={styles.input}>
                <option value="">Any</option>
                {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label style={styles.label}>District</label>
              <select value={filters.district} onChange={(e) => update('district', e.target.value)} style={styles.input} disabled={!filters.state}>
                <option value="">Any</option>
                {getDistrictsForState(filters.state).map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <TextField label="Ancestral Origin" value={filters.ancestralOrigin} onChange={(v) => update('ancestralOrigin', v)} />
          </FilterGroup>

          <FilterGroup title="Lifestyle">
            <SelectField label="Eating Habits" value={filters.eatingHabit} onChange={(v) => update('eatingHabit', v)} options={EATING_HABIT_LABELS} />
            <SelectField label="Smoking Habits" value={filters.smokingHabit} onChange={(v) => update('smokingHabit', v)} options={SMOKING_HABIT_LABELS} />
            <SelectField label="Drinking Habits" value={filters.drinkingHabit} onChange={(v) => update('drinkingHabit', v)} options={DRINKING_HABIT_LABELS} />
            <TextField label="Spoken Languages (comma-separated)" value={filters.spokenLanguages} onChange={(v) => update('spokenLanguages', v)} />
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
          <div style={styles.resultsHeaderRow}>
            <p style={styles.resultsCount}>{results.length} matches found</p>
            {results.length > 0 && (
              <button onClick={() => setShowSaveDialog(true)} style={styles.saveSearchButton}>
                💾 Save this search
              </button>
            )}
          </div>

          {showSaveDialog && (
            <div style={styles.saveDialog}>
              <input
                type="text"
                placeholder="Name this search (e.g. Kolkata Engineers)"
                value={saveName}
                onChange={(e) => setSaveName(e.target.value)}
                style={styles.input}
              />
              <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                <button onClick={() => setShowSaveDialog(false)} style={styles.cancelFilterButton}>Cancel</button>
                <button onClick={handleSaveSearch} disabled={saveStatus === 'saving'} style={styles.searchButton}>
                  {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved ✓' : 'Save'}
                </button>
              </div>
              {saveStatus === 'error' && <p style={styles.errorText}>Failed to save. Try again.</p>}
            </div>
          )}

          {results.length === 0 ? (
            <div style={styles.emptyState}>
              <p style={styles.emptyText}>No matches found for these filters.</p>
              <button onClick={() => setShowFilters(true)} style={styles.modifyButton}>Modify Search</button>
            </div>
          ) : (
            <div style={styles.grid}>
              {results.map((p) => (
                <ProfileCard key={p.id} p={p} sent={sentIds.has(p.id)} onSend={() => sendInterest(p.id)} />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  )
}

// ---------- Tab 2: By Profile ID ----------

function ProfileIdSearch() {
  const [profileIdInput, setProfileIdInput] = useState('')
  const [result, setResult] = useState<Profile | null | undefined>(undefined)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  const runSearch = async () => {
    if (!profileIdInput.trim()) return
    setLoading(true)
    setError('')
    setResult(undefined)
    try {
      const res = await fetch(`/api/matches/search-by-id?profileId=${encodeURIComponent(profileIdInput.trim())}`)
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Something went wrong')
        return
      }
      setResult(data.profile)
      setSent(false)
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const sendInterest = async () => {
    if (!result) return
    try {
      const res = await fetch('/api/matches/interest', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ receiverId: result.id }),
      })
      if (res.ok) setSent(true)
    } catch {}
  }

  return (
    <>
      <h1 style={styles.title}>Search by Profile ID</h1>
      <div style={styles.filterGroup}>
        <label style={styles.label}>Profile ID</label>
        <div style={{ display: 'flex', gap: 10 }}>
          <input
            type="text"
            placeholder="e.g. SB000123"
            value={profileIdInput}
            onChange={(e) => setProfileIdInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && runSearch()}
            style={styles.input}
          />
          <button onClick={runSearch} disabled={loading} style={{ ...styles.searchButton, flex: 'none', width: 140 }}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
        {error && <p style={styles.errorText}>{error}</p>}
      </div>

      {result === null && (
        <div style={styles.emptyState}>
          <p style={styles.emptyText}>No profile found with that ID.</p>
        </div>
      )}

      {result && (
        <div style={{ ...styles.grid, maxWidth: 260, marginTop: 20 }}>
          <ProfileCard p={result} sent={sent} onSend={sendInterest} />
        </div>
      )}
    </>
  )
}

// ---------- Tab 3: Saved Search ----------

function SavedSearches({ onShowMatches }: { onShowMatches: (filters: typeof initialFilters) => void }) {
  const [searches, setSearches] = useState<SavedSearchItem[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')

  const load = () => {
    fetch('/api/saved-searches')
      .then((res) => res.json())
      .then((data) => setSearches(data.searches ?? []))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const handleDelete = async (id: string) => {
    await fetch(`/api/saved-searches/${id}`, { method: 'DELETE' })
    load()
  }

  const startEdit = (search: SavedSearchItem) => {
    setEditingId(search.id)
    setEditName(search.name)
  }

  const saveEdit = async (id: string) => {
    await fetch(`/api/saved-searches/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: editName }),
    })
    setEditingId(null)
    load()
  }

  return (
    <>
      <h1 style={styles.title}>Your Saved Searches</h1>
      {loading ? (
        <p style={styles.emptyText}>Loading...</p>
      ) : searches.length === 0 ? (
        <div style={styles.emptyState}>
          <p style={styles.emptyText}>You haven't saved any searches yet.</p>
          <p style={{ ...styles.emptyText, fontSize: 12 }}>Run a search under "By Criteria" and save it for quick access later.</p>
        </div>
      ) : (
        <div style={styles.savedList}>
          {searches.map((s) => (
            <div key={s.id} style={styles.savedCard}>
              {editingId === s.id ? (
                <div style={{ flex: 1, display: 'flex', gap: 8 }}>
                  <input value={editName} onChange={(e) => setEditName(e.target.value)} style={styles.input} />
                  <button onClick={() => saveEdit(s.id)} style={styles.searchButton}>Save</button>
                </div>
              ) : (
                <>
                  <div style={{ flex: 1 }}>
                    <p style={styles.savedName}>{s.name}</p>
                    <p style={styles.savedMeta}>Saved {new Date(s.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => onShowMatches(s.filters)} style={styles.showMatchesButton}>Show Matches</button>
                    <button onClick={() => startEdit(s)} style={styles.iconButton} aria-label="Rename">✏️</button>
                    <button onClick={() => handleDelete(s.id)} style={styles.iconButton} aria-label="Delete">🗑️</button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  )
}

// ---------- Shared field components ----------

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
  mainTabsRow: { display: 'flex', gap: 4, marginBottom: 24, borderBottom: '1px solid #f6c6d4' },
  mainTab: { padding: '10px 18px', border: 'none', backgroundColor: 'transparent', color: '#a5486a', fontWeight: 600, fontSize: 14, cursor: 'pointer', borderBottom: '2px solid transparent' },
  mainTabActive: { padding: '10px 18px', border: 'none', backgroundColor: 'transparent', color: '#d6336c', fontWeight: 700, fontSize: 14, cursor: 'pointer', borderBottom: '2px solid #d6336c' },
  headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap' as const, gap: 12 },
  title: { fontSize: 22, fontWeight: 700, color: '#5c2a3a', margin: '0 0 16px' },
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
  resultsHeaderRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, flexWrap: 'wrap' as const, gap: 10 },
  resultsCount: { fontSize: 14, fontWeight: 700, color: '#5c2a3a', margin: 0 },
  saveSearchButton: { padding: '8px 16px', borderRadius: 10, border: '1px solid #d6336c', backgroundColor: '#ffffff', color: '#d6336c', fontWeight: 700, fontSize: 12, cursor: 'pointer' },
  saveDialog: { backgroundColor: '#ffffff', borderRadius: 14, padding: 18, marginBottom: 18 },
  errorText: { color: '#e03131', fontSize: 12, marginTop: 8 },
  emptyState: { display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: 8, padding: '60px 0' },
  emptyText: { fontSize: 14, color: '#a5486a' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 18 },
  card: { backgroundColor: '#ffffff', borderRadius: 16, overflow: 'hidden', boxShadow: '0 4px 16px rgba(214,51,108,0.06)' },
  cardImageWrap: { width: '100%', aspectRatio: '1', backgroundColor: '#fce8ee' },
  cardImage: { width: '100%', height: '100%', objectFit: 'cover' as const },
  cardImagePlaceholder: { display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36 },
  cardBody: { padding: '12px 14px' },
  cardName: { fontSize: 14, fontWeight: 700, color: '#5c2a3a', margin: '0 0 3px' },
  cardIdText: { fontSize: 10, color: '#c98ba0', margin: '0 0 6px', fontWeight: 600 },
  cardDetail: { fontSize: 11, color: '#8a5464', margin: '2px 0' },
  cardActions: { padding: '0 14px 14px' },
  likeButton: { width: '100%', padding: 8, borderRadius: 8, border: 'none', backgroundColor: '#d6336c', color: '#fff', fontWeight: 700, fontSize: 11, cursor: 'pointer' },
  sentButton: { width: '100%', padding: 8, borderRadius: 8, border: '1px solid #d6336c', backgroundColor: '#fce8ee', color: '#d6336c', fontWeight: 700, fontSize: 11, cursor: 'default' },
  savedList: { display: 'flex', flexDirection: 'column' as const, gap: 10 },
  savedCard: { display: 'flex', alignItems: 'center', gap: 12, backgroundColor: '#ffffff', borderRadius: 14, padding: 16 },
  savedName: { fontSize: 14, fontWeight: 700, color: '#5c2a3a', margin: 0 },
  savedMeta: { fontSize: 12, color: '#a5486a', margin: '2px 0 0' },
  showMatchesButton: { padding: '8px 16px', borderRadius: 10, border: '1px solid #d6336c', backgroundColor: '#ffffff', color: '#d6336c', fontWeight: 700, fontSize: 12, cursor: 'pointer' },
  iconButton: { width: 34, height: 34, borderRadius: 8, border: '1px solid #f6c6d4', backgroundColor: '#ffffff', cursor: 'pointer', fontSize: 14 },
}