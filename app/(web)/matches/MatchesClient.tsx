"use client";

import { useCallback, useEffect, useState } from "react";
import { RELIGION_LABELS } from "@/lib/matrimonyLabels";

type Profile = {
  id: string;
  name: string;
  age: number;
  profession: string | null;
  location: string | null;
  religion: string | null;
  caste: string | null;
  height: number | null;
  education: string | null;
  image: string | null;
};

type Category =
  | "recommended"
  | "nearby"
  | "education"
  | "professional"
  | "community";

const CATEGORIES: { key: Category; label: string; icon: string }[] = [
  { key: "recommended", label: "Recommended", icon: "✨" },
  { key: "nearby", label: "Near Me", icon: "📍" },
  { key: "education", label: "Education", icon: "🎓" },
  { key: "professional", label: "Professional", icon: "💼" },
  { key: "community", label: "Community", icon: "🧬" },
];

export default function MatchesClient() {
  const [category, setCategory] = useState<Category>("recommended");
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actioningId, setActioningId] = useState<string | null>(null);
  const [sentIds, setSentIds] = useState<Set<string>>(new Set());
  const [passedIds, setPassedIds] = useState<Set<string>>(new Set());

  const fetchProfiles = useCallback(async (cat: Category) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/matches/discover?category=${cat}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setProfiles(data.profiles ?? []);
      setPassedIds(new Set());
    } catch {
      setError("Failed to load matches");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfiles(category);
  }, [category, fetchProfiles]);

  const handleLike = async (id: string) => {
    setActioningId(id);
    try {
      const res = await fetch("/api/matches/interest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ receiverId: id }),
      });
      if (res.ok) {
        setSentIds((prev) => new Set(prev).add(id));
      }
    } catch {
      // silent
    } finally {
      setActioningId(null);
    }
  };

  const handlePass = async (id: string) => {
    setPassedIds((prev) => new Set(prev).add(id));
    try {
      await fetch("/api/matches/pass", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetId: id }),
      });
    } catch {
      // local state already updated — worst case, the pass isn't
      // persisted and this profile could resurface on next refresh
    }
  };

  const visibleProfiles = profiles.filter((p) => !passedIds.has(p.id));

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.headerTitle}>Discover</h1>

        <div style={styles.categoryRow}>
          {CATEGORIES.map((c) => (
            <button
              key={c.key}
              onClick={() => setCategory(c.key)}
              style={
                category === c.key
                  ? styles.categoryTabActive
                  : styles.categoryTab
              }
            >
              <span>{c.icon}</span> {c.label}
            </button>
          ))}
        </div>

        {loading ? (
          <p style={styles.statusText}>Loading...</p>
        ) : error ? (
          <div style={styles.emptyState}>
            <p style={styles.statusText}>{error}</p>
            <button
              onClick={() => fetchProfiles(category)}
              style={styles.retryButton}
            >
              Retry
            </button>
          </div>
        ) : visibleProfiles.length === 0 ? (
          <div style={styles.emptyState}>
            <p style={styles.emptyTitle}>No matches in this category</p>
            <p style={styles.statusText}>
              Try a different category or check back later
            </p>
            <button
              onClick={() => fetchProfiles(category)}
              style={styles.retryButton}
            >
              Refresh
            </button>
          </div>
        ) : (
          <div style={styles.grid}>
            {visibleProfiles.map((profile) => {
              const sent = sentIds.has(profile.id);
              return (
                <div key={profile.id} style={styles.card}>
                  <div style={styles.cardImageWrap}>
                    {profile.image ? (
                      <img
                        src={profile.image}
                        alt={profile.name}
                        style={styles.cardImage}
                      />
                    ) : (
                      <div
                        style={{
                          ...styles.cardImage,
                          ...styles.cardImagePlaceholder,
                        }}
                      >
                        <span style={{ fontSize: 40 }}>👤</span>
                      </div>
                    )}
                  </div>

                  <div style={styles.cardBody}>
                    <h3 style={styles.cardName}>
                      {profile.name}, {profile.age}
                    </h3>
                    {profile.profession && (
                      <p style={styles.cardDetail}>💼 {profile.profession}</p>
                    )}
                    {profile.education && (
                      <p style={styles.cardDetail}>🎓 {profile.education}</p>
                    )}
                    {profile.location && (
                      <p style={styles.cardDetail}>📍 {profile.location}</p>
                    )}
                    {(profile.religion || profile.caste || profile.height) && (
                      <p style={styles.cardDetail}>
                        {[
                          profile.religion
                            ? (RELIGION_LABELS[profile.religion] ??
                              profile.religion)
                            : null,
                          profile.caste,
                          profile.height ? `${profile.height} cm` : null,
                        ]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                    )}
                  </div>

                  <div style={styles.cardActions}>
                    <button
                      onClick={() => handlePass(profile.id)}
                      style={styles.passButton}
                    >
                      Pass
                    </button>
                    <button
                      onClick={() => handleLike(profile.id)}
                      disabled={sent || actioningId === profile.id}
                      style={sent ? styles.sentButton : styles.likeButton}
                    >
                      {sent ? "✓ Interest Sent" : "♥ Send Interest"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#fff0f3",
    fontFamily: "system-ui, sans-serif",
  },
  container: { maxWidth: 1200, margin: "0 auto", padding: "32px 32px 60px" },
  headerTitle: {
    color: "#5c2a3a",
    fontSize: 26,
    fontWeight: 700,
    margin: "0 0 20px",
  },
  categoryRow: {
    display: "flex",
    gap: 10,
    marginBottom: 28,
    flexWrap: "wrap" as const,
  },
  categoryTab: {
    padding: "9px 16px",
    borderRadius: 20,
    border: "1px solid #f6c6d4",
    backgroundColor: "#ffffff",
    color: "#a5486a",
    fontWeight: 600,
    fontSize: 13,
    cursor: "pointer",
  },
  categoryTabActive: {
    padding: "9px 16px",
    borderRadius: 20,
    border: "1px solid #d6336c",
    backgroundColor: "#d6336c",
    color: "#ffffff",
    fontWeight: 600,
    fontSize: 13,
    cursor: "pointer",
  },
  statusText: { color: "#a5486a", fontSize: 14, textAlign: "center" },
  emptyState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 12,
    paddingTop: 60,
  },
  emptyTitle: { color: "#5c2a3a", fontSize: 18, fontWeight: 700, margin: 0 },
  retryButton: {
    padding: "10px 24px",
    borderRadius: 12,
    border: "none",
    backgroundColor: "#d6336c",
    color: "#fff",
    fontWeight: 700,
    fontSize: 14,
    cursor: "pointer",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
    gap: 20,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 18,
    overflow: "hidden",
    boxShadow: "0 4px 16px rgba(214,51,108,0.08)",
    display: "flex",
    flexDirection: "column" as const,
  },
  cardImageWrap: {
    width: "100%",
    aspectRatio: "1",
    backgroundColor: "#fce8ee",
  },
  cardImage: { width: "100%", height: "100%", objectFit: "cover" as const },
  cardImagePlaceholder: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  cardBody: { padding: "14px 16px", flex: 1 },
  cardName: {
    fontSize: 16,
    fontWeight: 700,
    color: "#5c2a3a",
    margin: "0 0 8px",
  },
  cardDetail: { fontSize: 12, color: "#8a5464", margin: "3px 0" },
  cardActions: { display: "flex", gap: 8, padding: "0 16px 16px" },
  passButton: {
    flex: 1,
    padding: "9px 0",
    borderRadius: 10,
    border: "1px solid #f6c6d4",
    backgroundColor: "#ffffff",
    color: "#a5486a",
    fontWeight: 600,
    fontSize: 12,
    cursor: "pointer",
  },
  likeButton: {
    flex: 2,
    padding: "9px 0",
    borderRadius: 10,
    border: "none",
    backgroundColor: "#d6336c",
    color: "#ffffff",
    fontWeight: 700,
    fontSize: 12,
    cursor: "pointer",
  },
  sentButton: {
    flex: 2,
    padding: "9px 0",
    borderRadius: 10,
    border: "1px solid #d6336c",
    backgroundColor: "#fce8ee",
    color: "#d6336c",
    fontWeight: 700,
    fontSize: 12,
    cursor: "default",
  },
};
