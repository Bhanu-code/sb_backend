"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { VISIBILITY_LABELS } from "@/lib/matrimonyLabels";

type Section =
  | "password"
  | "notifications"
  | "privacy"
  | "membership"
  | "deactivate"
  | "ignored"
  | "blocked"
  | "delete";

const SECTIONS: { key: Section; label: string }[] = [
  { key: "password", label: "Change Password" },
  { key: "notifications", label: "Alerts & Updates" },
  { key: "privacy", label: "Privacy" },
  { key: "membership", label: "Membership Details" },
  { key: "deactivate", label: "Deactivate Profile" },
  { key: "ignored", label: "Ignored Profiles" },
  { key: "blocked", label: "Blocked Profiles" },
  { key: "delete", label: "Delete Profile" },
];

export default function SettingsClient({ email }: { email: string | null }) {
  const router = useRouter();
  const [active, setActive] = useState<Section>("password");
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
    } catch {
      setLoggingOut(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>Profile Settings</h1>

        <div style={styles.layout}>
          <nav style={styles.sidebar}>
            {SECTIONS.map((s) => (
              <button
                key={s.key}
                onClick={() => setActive(s.key)}
                style={{
                  ...styles.sidebarItem,
                  ...(active === s.key ? styles.sidebarItemActive : {}),
                  ...(s.key === "delete" ? styles.sidebarItemDanger : {}),
                }}
              >
                {s.label}
              </button>
            ))}
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              style={styles.sidebarItemLogout}
            >
              {loggingOut ? "Logging out..." : "Logout"}
            </button>
          </nav>

          <div style={styles.content}>
            {active === "password" && <ChangePasswordSection />}
            {active === "notifications" && <NotificationsSection />}
            {active === "privacy" && <PrivacySection />}
            {active === "membership" && <MembershipSection />}
            {active === "deactivate" && <DeactivateSection />}
            {active === "ignored" && <IgnoredSection />}
            {active === "blocked" && <BlockedSection />}
            {active === "delete" && <DeleteAccountSection email={email} />}
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------- Change Password ----------

function ChangePasswordSection() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    setError("");
    setSuccess(false);

    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/settings/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to update password");
        setSaving(false);
        return;
      }
      setSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <SectionCard title="Change Password">
      <Field
        label="Current Password"
        type="password"
        value={currentPassword}
        onChange={setCurrentPassword}
      />
      <Field
        label="New Password"
        type="password"
        value={newPassword}
        onChange={setNewPassword}
      />
      <Field
        label="Confirm New Password"
        type="password"
        value={confirmPassword}
        onChange={setConfirmPassword}
      />
      {error && <p style={styles.error}>{error}</p>}
      {success && <p style={styles.success}>Password updated successfully.</p>}
      <button
        onClick={handleSubmit}
        disabled={saving}
        style={styles.saveButton}
      >
        {saving ? "Saving..." : "Update Password"}
      </button>
    </SectionCard>
  );
}

// ---------- Notifications ----------
function NotificationsSection() {
  const [notificationsEnabled, setNotificationsEnabled] = useState<
    boolean | null
  >(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) =>
        setNotificationsEnabled(data.notificationsEnabled ?? true),
      );
  }, []);

  const toggle = async () => {
    if (notificationsEnabled === null) return;
    const next = !notificationsEnabled;
    setNotificationsEnabled(next);
    setSaving(true);
    try {
      await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationsEnabled: next }),
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <SectionCard title="Alerts & Updates">
      <ToggleRow
        label="Push Notifications"
        description="Get notified about new interests, messages, and matches"
        checked={notificationsEnabled ?? true}
        onChange={toggle}
        disabled={notificationsEnabled === null || saving}
      />
    </SectionCard>
  );
}

// ---------- Privacy ----------

function PrivacySection() {
  const [privacyTab, setPrivacyTab] = useState<
    "mobile" | "photo" | "profile" | "horoscope"
  >("mobile");
  const [settings, setSettings] = useState<{
    locationSharingEnabled: boolean;
    mobilePrivacyEnabled: boolean;
    matrimonyVisible: boolean;
    profileVisibility: string;
    photoVisibility: string;
    horoscopeVisibility: string;
  } | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/settings/privacy")
      .then((res) => res.json())
      .then(setSettings);
  }, []);

  const update = async (field: string, value: any) => {
    setSettings((prev) => (prev ? { ...prev, [field]: value } : prev));
    setSaving(true);
    try {
      await fetch("/api/settings/privacy", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: value }),
      });
    } finally {
      setSaving(false);
    }
  };

  if (!settings) {
    return (
      <SectionCard title="Privacy">
        <p style={styles.mutedText}>Loading...</p>
      </SectionCard>
    );
  }

  const PRIVACY_TABS = [
    { key: "mobile" as const, label: "Mobile Privacy" },
    { key: "photo" as const, label: "Photo Privacy" },
    { key: "profile" as const, label: "Profile Privacy" },
    { key: "horoscope" as const, label: "Horoscope Privacy" },
  ];

  return (
    <SectionCard title="Privacy">
      <div style={styles.privacyTabsRow}>
        {PRIVACY_TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setPrivacyTab(t.key)}
            style={
              privacyTab === t.key ? styles.privacyTabActive : styles.privacyTab
            }
          >
            {t.label}
          </button>
        ))}
      </div>

      {privacyTab === "mobile" && (
        <div>
          <p style={styles.privacyStatusText}>
            Your mobile number is currently{" "}
            <strong>
              {settings.mobilePrivacyEnabled
                ? "hidden from non-contacts"
                : "visible to all members"}
            </strong>
            .
          </p>
          <ToggleRow
            label="Hide Mobile Number"
            description="Only members you've accepted an interest with can see your phone number"
            checked={settings.mobilePrivacyEnabled}
            onChange={() =>
              update("mobilePrivacyEnabled", !settings.mobilePrivacyEnabled)
            }
            disabled={saving}
          />
          <ToggleRow
            label="Location Sharing"
            description="Allow the app to use your location for nearby matches"
            checked={settings.locationSharingEnabled}
            onChange={() =>
              update("locationSharingEnabled", !settings.locationSharingEnabled)
            }
            disabled={saving}
          />
        </div>
      )}

      {privacyTab === "photo" && (
        <VisibilityRadioGroup
          field="photoVisibility"
          value={settings.photoVisibility}
          onChange={(v) => update("photoVisibility", v)}
          disabled={saving}
        />
      )}

      {privacyTab === "profile" && (
        <>
          <VisibilityRadioGroup
            field="profileVisibility"
            value={settings.profileVisibility}
            onChange={(v) => update("profileVisibility", v)}
            disabled={saving}
          />
          <div
            style={{
              marginTop: 18,
              paddingTop: 18,
              borderTop: "1px solid #fce8ee",
            }}
          >
            <ToggleRow
              label="Appear in Search & Discovery"
              description="Turn off to fully hide your profile from Matches and Search"
              checked={settings.matrimonyVisible}
              onChange={() =>
                update("matrimonyVisible", !settings.matrimonyVisible)
              }
              disabled={saving}
            />
          </div>
        </>
      )}

      {privacyTab === "horoscope" && (
        <VisibilityRadioGroup
          field="horoscopeVisibility"
          value={settings.horoscopeVisibility}
          onChange={(v) => update("horoscopeVisibility", v)}
          disabled={saving}
        />
      )}
    </SectionCard>
  );
}

function VisibilityRadioGroup({
  field,
  value,
  onChange,
  disabled,
}: {
  field: string;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}) {
  const label =
    field === "photoVisibility"
      ? "Photo"
      : field === "horoscopeVisibility"
        ? "Horoscope"
        : "Profile";

  return (
    <div>
      <p style={styles.privacyStatusText}>
        Your {label} Privacy is currently set to{" "}
        <strong>"{VISIBILITY_LABELS[value]?.split(" (")[0] ?? value}"</strong>
      </p>
      <div style={styles.radioGroup}>
        {Object.entries(VISIBILITY_LABELS).map(([key, labelText]) => (
          <label key={key} style={styles.radioRow}>
            <input
              type="radio"
              name={field}
              checked={value === key}
              onChange={() => onChange(key)}
              disabled={disabled}
            />
            <span style={styles.radioLabel}>
              {labelText}
              {key === "visible_to_all" && (
                <span style={styles.recommendedBadge}>
                  Recommended for better response
                </span>
              )}
            </span>
          </label>
        ))}
      </div>
      {value === "visible_to_selected" && (
        <p style={styles.radioHint}>
          When members request to view, you can decide whether to allow it.
        </p>
      )}
    </div>
  );
}

// ---------- Membership ----------
function MembershipSection() {
  const [membership, setMembership] = useState<{
    plan: string;
    status: string | null;
    startDate: string | null;
    endDate: string | null;
  } | null>(null);

  useEffect(() => {
    fetch("/api/settings/membership")
      .then((res) => res.json())
      .then(setMembership);
  }, []);

  if (!membership) {
    return (
      <SectionCard title="Membership Details">
        <p style={styles.mutedText}>Loading...</p>
      </SectionCard>
    );
  }

  return (
    <SectionCard title="Membership Details">
      <div style={styles.membershipRow}>
        <span style={styles.mutedText}>Current Plan</span>
        <span style={styles.membershipValue}>{membership.plan}</span>
      </div>
      {membership.status && (
        <div style={styles.membershipRow}>
          <span style={styles.mutedText}>Status</span>
          <span style={styles.membershipValue}>{membership.status}</span>
        </div>
      )}
      {membership.endDate && (
        <div style={styles.membershipRow}>
          <span style={styles.mutedText}>Valid Until</span>
          <span style={styles.membershipValue}>
            {new Date(membership.endDate).toLocaleDateString()}
          </span>
        </div>
      )}
      {membership.plan === "Free" && (
        <p style={{ ...styles.mutedText, marginTop: 12 }}>
          You're on the free plan. Upgrade to unlock premium features.
        </p>
      )}
    </SectionCard>
  );
}

// ---------- Deactivate ----------
function DeactivateSection() {
  const [isActive, setIsActive] = useState<boolean | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/settings/deactivate")
      .then((res) => res.json())
      .then((data) => setIsActive(data.isActive ?? true));
  }, []);

  const toggle = async () => {
    if (isActive === null) return;
    const next = !isActive;
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/settings/deactivate", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: next }),
      });
      if (res.ok) {
        setIsActive(next);
        setMessage(
          next
            ? "Your profile is now active and visible again."
            : "Your profile has been deactivated and hidden from other members.",
        );
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <SectionCard title="Deactivate Profile">
      <p style={styles.dangerText}>
        Deactivating hides your profile from matches, search, and discovery. You
        can reactivate anytime by logging back in and toggling this again —
        nothing is deleted.
      </p>
      {isActive !== null && (
        <button
          onClick={toggle}
          disabled={saving}
          style={isActive ? styles.dangerButton : styles.saveButton}
        >
          {saving
            ? "Updating..."
            : isActive
              ? "Deactivate Profile"
              : "Reactivate Profile"}
        </button>
      )}
      {message && <p style={styles.success}>{message}</p>}
    </SectionCard>
  );
}

// ---------- Ignored Profiles ----------

function IgnoredSection() {
  const [ignored, setIgnored] = useState<
    | {
        id: string;
        name: string;
        avatarUrl: string | null;
        profession: string | null;
      }[]
    | null
  >(null);

  useEffect(() => {
    fetch("/api/settings/ignored")
      .then((res) => res.json())
      .then((data) => setIgnored(data.ignored ?? []));
  }, []);

  const handleRemove = async (id: string) => {
    setIgnored((prev) => prev?.filter((p) => p.id !== id) ?? null);
    await fetch(`/api/settings/ignored/${id}`, { method: "DELETE" });
  };

  return (
    <SectionCard title="Ignored Profiles">
      {ignored === null ? (
        <p style={styles.mutedText}>Loading...</p>
      ) : ignored.length === 0 ? (
        <p style={styles.mutedText}>You haven't ignored any profiles.</p>
      ) : (
        <div style={styles.profileList}>
          {ignored.map((p) => (
            <div key={p.id} style={styles.profileRow}>
              {p.avatarUrl ? (
                <img src={p.avatarUrl} alt="" style={styles.profileAvatar} />
              ) : (
                <div style={styles.profileAvatarPlaceholder}>👤</div>
              )}
              <div style={{ flex: 1 }}>
                <p style={styles.profileName}>{p.name}</p>
                {p.profession && (
                  <p style={styles.profileMeta}>{p.profession}</p>
                )}
              </div>
              <button
                onClick={() => handleRemove(p.id)}
                style={styles.undoButton}
              >
                Show Again
              </button>
            </div>
          ))}
        </div>
      )}
    </SectionCard>
  );
}
// ---------- Blocked Profiles ----------

function BlockedSection() {
  const [blocked, setBlocked] = useState<
    | {
        id: string;
        name: string;
        avatarUrl: string | null;
        profession: string | null;
      }[]
    | null
  >(null);

  useEffect(() => {
    fetch("/api/settings/blocked")
      .then((res) => res.json())
      .then((data) => setBlocked(data.blocked ?? []));
  }, []);

  const handleUnblock = async (id: string) => {
    setBlocked((prev) => prev?.filter((p) => p.id !== id) ?? null);
    await fetch(`/api/settings/blocked/${id}`, { method: "DELETE" });
  };

  return (
    <SectionCard title="Blocked Profiles">
      {blocked === null ? (
        <p style={styles.mutedText}>Loading...</p>
      ) : blocked.length === 0 ? (
        <p style={styles.mutedText}>You haven't blocked any profiles.</p>
      ) : (
        <div style={styles.profileList}>
          {blocked.map((p) => (
            <div key={p.id} style={styles.profileRow}>
              {p.avatarUrl ? (
                <img src={p.avatarUrl} alt="" style={styles.profileAvatar} />
              ) : (
                <div style={styles.profileAvatarPlaceholder}>👤</div>
              )}
              <div style={{ flex: 1 }}>
                <p style={styles.profileName}>{p.name}</p>
                {p.profession && (
                  <p style={styles.profileMeta}>{p.profession}</p>
                )}
              </div>
              <button
                onClick={() => handleUnblock(p.id)}
                style={styles.undoButton}
              >
                Unblock
              </button>
            </div>
          ))}
        </div>
      )}
    </SectionCard>
  );
}

// ---------- Delete Account ----------

function DeleteAccountSection({ email }: { email: string | null }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    setError("");
    if (!password) {
      setError("Please enter your password");
      return;
    }
    setDeleting(true);
    try {
      const res = await fetch("/api/account/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to delete account");
        setDeleting(false);
        return;
      }
      router.push("/");
    } catch {
      setError("Network error. Please try again.");
      setDeleting(false);
    }
  };

  return (
    <SectionCard title="Delete Account" danger>
      <p style={styles.dangerText}>
        This will permanently delete your account, profile, photos, posts,
        matches, conversations, and all related data for{" "}
        <strong>{email}</strong>. This action cannot be undone.
      </p>

      {!showConfirm ? (
        <button
          onClick={() => setShowConfirm(true)}
          style={styles.dangerButton}
        >
          Delete My Account
        </button>
      ) : (
        <div style={styles.confirmBox}>
          <p style={styles.confirmLabel}>Enter your password to confirm</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            placeholder="Password"
            autoFocus
          />
          {error && <p style={styles.error}>{error}</p>}
          <div style={styles.confirmActions}>
            <button
              onClick={() => {
                setShowConfirm(false);
                setPassword("");
                setError("");
              }}
              style={styles.cancelButton}
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={!password || deleting}
              style={styles.dangerButton}
            >
              {deleting ? "Deleting..." : "Permanently Delete"}
            </button>
          </div>
        </div>
      )}
    </SectionCard>
  );
}

// ---------- Shared components ----------

function SectionCard({
  title,
  danger,
  children,
}: {
  title: string;
  danger?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        ...styles.sectionCard,
        ...(danger ? styles.sectionCardDanger : {}),
      }}
    >
      <h2
        style={{
          ...styles.sectionTitle,
          ...(danger ? { color: "#c0392b" } : {}),
        }}
      >
        {title}
      </h2>
      {children}
    </div>
  );
}

function Field({
  label,
  type = "text",
  value,
  onChange,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={styles.label}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={styles.input}
      />
    </div>
  );
}

function ToggleRow({
  label,
  description,
  checked,
  onChange,
  disabled,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
}) {
  return (
    <div style={styles.toggleRow}>
      <div style={{ flex: 1 }}>
        <p style={styles.toggleLabel}>{label}</p>
        <p style={styles.toggleDescription}>{description}</p>
      </div>
      <button
        onClick={onChange}
        disabled={disabled}
        style={{
          ...styles.toggle,
          ...(checked ? styles.toggleOn : styles.toggleOff),
        }}
      >
        <span
          style={{
            ...styles.toggleKnob,
            ...(checked ? styles.toggleKnobOn : {}),
          }}
        />
      </button>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#fff0f3",
    fontFamily: "system-ui, sans-serif",
  },
  container: { maxWidth: 900, margin: "0 auto", padding: "32px 24px 60px" },
  title: {
    fontSize: 24,
    fontWeight: 700,
    color: "#5c2a3a",
    margin: "0 0 20px",
  },
  layout: {
    display: "flex",
    gap: 24,
    alignItems: "flex-start",
    flexWrap: "wrap" as const,
  },
  sidebar: {
    display: "flex",
    flexDirection: "column" as const,
    gap: 4,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 10,
    minWidth: 220,
  },
  sidebarItem: {
    textAlign: "left" as const,
    padding: "10px 14px",
    borderRadius: 10,
    border: "none",
    backgroundColor: "transparent",
    color: "#5c2a3a",
    fontWeight: 600,
    fontSize: 13,
    cursor: "pointer",
  },
  sidebarItemActive: { backgroundColor: "#fce8ee", color: "#d6336c" },
  sidebarItemDanger: { color: "#e03131" },
  sidebarItemLogout: {
    textAlign: "left" as const,
    padding: "10px 14px",
    borderRadius: 10,
    border: "none",
    backgroundColor: "transparent",
    color: "#a5486a",
    fontWeight: 600,
    fontSize: 13,
    cursor: "pointer",
    marginTop: 6,
    borderTop: "1px solid #f6c6d4",
    paddingTop: 14,
  },
  content: { flex: 1, minWidth: 280 },
  sectionCard: { backgroundColor: "#ffffff", borderRadius: 16, padding: 24 },
  sectionCardDanger: { border: "1px solid #fce8e8" },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: "#5c2a3a",
    margin: "0 0 18px",
  },
  label: {
    display: "block",
    fontSize: 12,
    fontWeight: 600,
    color: "#a5486a",
    marginBottom: 5,
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid #f6c6d4",
    fontSize: 14,
    boxSizing: "border-box" as const,
  },
  saveButton: {
    padding: "11px 22px",
    borderRadius: 10,
    border: "none",
    backgroundColor: "#d6336c",
    color: "#fff",
    fontWeight: 700,
    fontSize: 14,
    cursor: "pointer",
  },
  dangerButton: {
    padding: "11px 22px",
    borderRadius: 10,
    border: "1px solid #e03131",
    backgroundColor: "#ffffff",
    color: "#e03131",
    fontWeight: 700,
    fontSize: 14,
    cursor: "pointer",
  },
  error: { color: "#e03131", fontSize: 13, marginBottom: 12 },
  success: { color: "#1a7a3d", fontSize: 13, marginTop: 10 },
  mutedText: { fontSize: 13, color: "#a5486a" },
  dangerText: {
    fontSize: 13,
    color: "#5c2a3a",
    lineHeight: 1.6,
    margin: "0 0 18px",
  },
  confirmBox: {
    backgroundColor: "#fce8e8",
    borderRadius: 12,
    padding: 18,
    marginTop: 6,
  },
  confirmLabel: { fontSize: 13, color: "#5c2a3a", margin: "0 0 10px" },
  confirmActions: { display: "flex", gap: 10, marginTop: 12 },
  cancelButton: {
    flex: 1,
    padding: 11,
    borderRadius: 10,
    border: "1px solid #f6c6d4",
    backgroundColor: "#ffffff",
    color: "#a5486a",
    fontWeight: 600,
    fontSize: 14,
    cursor: "pointer",
  },
  toggleRow: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    padding: "12px 0",
    borderBottom: "1px solid #fce8ee",
  },
  toggleLabel: { fontSize: 14, fontWeight: 700, color: "#5c2a3a", margin: 0 },
  toggleDescription: { fontSize: 12, color: "#8a5464", margin: "3px 0 0" },
  toggle: {
    width: 44,
    height: 24,
    borderRadius: 12,
    border: "none",
    cursor: "pointer",
    position: "relative" as const,
    flexShrink: 0,
  },
  toggleOn: { backgroundColor: "#d6336c" },
  toggleOff: { backgroundColor: "#f6c6d4" },
  toggleKnob: {
    position: "absolute" as const,
    top: 3,
    left: 3,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#fff",
    transition: "left 0.15s ease",
  },
  toggleKnobOn: { left: 23 },
  membershipRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px 0",
    borderBottom: "1px solid #fce8ee",
  },
  membershipValue: { fontSize: 13, fontWeight: 700, color: "#5c2a3a" },
  profileList: { display: "flex", flexDirection: "column" as const, gap: 10 },
  profileRow: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: 12,
    backgroundColor: "#fff5f7",
    borderRadius: 12,
  },
  profileAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    objectFit: "cover" as const,
  },
  profileAvatarPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#fce8ee",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 18,
  },
  profileName: { fontSize: 13, fontWeight: 700, color: "#5c2a3a", margin: 0 },
  profileMeta: { fontSize: 12, color: "#a5486a", margin: "2px 0 0" },
  undoButton: {
    padding: "7px 14px",
    borderRadius: 8,
    border: "1px solid #d6336c",
    backgroundColor: "#ffffff",
    color: "#d6336c",
    fontWeight: 700,
    fontSize: 12,
    cursor: "pointer",
  },
  privacyTabsRow: {
    display: "flex",
    gap: 8,
    marginBottom: 20,
    borderBottom: "1px solid #f6c6d4",
    flexWrap: "wrap" as const,
  },
  privacyTab: {
    padding: "8px 14px",
    border: "none",
    borderBottom: "2px solid transparent",
    backgroundColor: "transparent",
    color: "#a5486a",
    fontWeight: 600,
    fontSize: 12,
    cursor: "pointer",
  },
  privacyTabActive: {
    padding: "8px 14px",
    border: "none",
    borderBottom: "2px solid #d6336c",
    backgroundColor: "transparent",
    color: "#d6336c",
    fontWeight: 700,
    fontSize: 12,
    cursor: "pointer",
  },
  privacyStatusText: { fontSize: 13, color: "#5c2a3a", marginBottom: 16 },
  radioGroup: { display: "flex", flexDirection: "column" as const, gap: 12 },
  radioRow: {
    display: "flex",
    alignItems: "flex-start",
    gap: 10,
    cursor: "pointer",
  },
  radioLabel: { fontSize: 13, color: "#5c2a3a", lineHeight: 1.5 },
  recommendedBadge: {
    marginLeft: 8,
    fontSize: 10,
    fontWeight: 700,
    color: "#8a6d00",
    backgroundColor: "#fff3cd",
    borderRadius: 6,
    padding: "2px 6px",
  },
  radioHint: { fontSize: 12, color: "#a5486a", marginTop: 10, paddingLeft: 24 },
};
