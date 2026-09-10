"use client";

import { useState } from "react";
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
} from "@/lib/matrimonyLabels";
import { Link } from "lucide-react";

type ProfileData = {
  fullName: string | null;
  email: string | null;
  emailVerified: boolean;
  idVerified: boolean;
  age: number | null;
  gender: string | null;
  dateOfBirth: string | null;
  profileCompleteness: number;
  profile: {
    bio: string | null;
    avatarUrl: string | null;
    coverUrl: string | null;
    height: number | null;
    religion: string | null;
    caste: string | null;
    motherTongue: string | null;
    education: string | null;
    educationLevel: string | null;
    occupation: string | null;
    occupationCategory: string | null;
    annualIncome: string | null;
    city: string | null;
    state: string | null;
    maritalStatus: string | null;
    physicalStatus: string | null;
    profileCreatedBy: string | null;
    employmentType: string | null;
    country: string | null;
    citizenship: string | null;
    eatingHabit: string | null;
    smokingHabit: string | null;
    drinkingHabit: string | null;
    hobbies: string[] | null;
    familyStatus: string | null;
    familyValue: string | null;
    familyType: string | null;
    horoscopeAvailable: boolean;
    horoscopeUrl: string | null;
    rashi: string | null;
    nakshatra: string | null;
    dosham: string | null;
    partnerAgeMin: number | null;
    partnerAgeMax: number | null;
    partnerReligion: string | null;
    partnerCaste: string | null;
    partnerEducationLevel: string | null;
    partnerOccupationCategory: string | null;
    partnerCity: string | null;
    partnerState: string | null;
    partnerHeightMin: number | null;
    partnerHeightMax: number | null;
    partnerMotherTongue: string | null;
    partnerMaritalStatus: string | null;
    partnerEatingHabit: string | null;
    partnerSmokingHabit: string | null;
    partnerDrinkingHabit: string | null;
    partnerCountry: string | null;
    partnerDosham: string | null;
    idDocumentType: string | null;
    idVerificationStatus: string | null;
    idVerificationRejectionReason: string | null;
  } | null;
};

export default function ProfileClient({
  initialData,
}: {
  initialData: ProfileData;
}) {
  const [data, setData] = useState(initialData);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    fullName: initialData.fullName ?? "",
    gender: initialData.gender ?? "",
    dateOfBirth: initialData.dateOfBirth
      ? initialData.dateOfBirth.slice(0, 10)
      : "",
    bio: initialData.profile?.bio ?? "",
    height: initialData.profile?.height
      ? String(initialData.profile.height)
      : "",
    religion: initialData.profile?.religion ?? "",
    caste: initialData.profile?.caste ?? "",
    motherTongue: initialData.profile?.motherTongue ?? "",
    education: initialData.profile?.education ?? "",
    educationLevel: initialData.profile?.educationLevel ?? "",
    occupation: initialData.profile?.occupation ?? "",
    occupationCategory: initialData.profile?.occupationCategory ?? "",
    annualIncome: initialData.profile?.annualIncome ?? "",
    city: initialData.profile?.city ?? "",
    state: initialData.profile?.state ?? "",
    maritalStatus: initialData.profile?.maritalStatus ?? "",
    physicalStatus: initialData.profile?.physicalStatus ?? "",
    profileCreatedBy: initialData.profile?.profileCreatedBy ?? "",
    employmentType: initialData.profile?.employmentType ?? "",
    country: initialData.profile?.country ?? "",
    citizenship: initialData.profile?.citizenship ?? "",
    eatingHabit: initialData.profile?.eatingHabit ?? "",
    smokingHabit: initialData.profile?.smokingHabit ?? "",
    drinkingHabit: initialData.profile?.drinkingHabit ?? "",
    hobbies: initialData.profile?.hobbies?.join(", ") ?? "",
    familyStatus: initialData.profile?.familyStatus ?? "",
    familyValue: initialData.profile?.familyValue ?? "",
    familyType: initialData.profile?.familyType ?? "",
    horoscopeAvailable: initialData.profile?.horoscopeAvailable ?? false,
    rashi: initialData.profile?.rashi ?? "",
    nakshatra: initialData.profile?.nakshatra ?? "",
    dosham: initialData.profile?.dosham ?? "",
    partnerAgeMin: initialData.profile?.partnerAgeMin
      ? String(initialData.profile.partnerAgeMin)
      : "",
    partnerAgeMax: initialData.profile?.partnerAgeMax
      ? String(initialData.profile.partnerAgeMax)
      : "",
    partnerReligion: initialData.profile?.partnerReligion ?? "",
    partnerCaste: initialData.profile?.partnerCaste ?? "",
    partnerEducationLevel: initialData.profile?.partnerEducationLevel ?? "",
    partnerOccupationCategory:
      initialData.profile?.partnerOccupationCategory ?? "",
    partnerCity: initialData.profile?.partnerCity ?? "",
    partnerState: initialData.profile?.partnerState ?? "",
    partnerHeightMin: initialData.profile?.partnerHeightMin
      ? String(initialData.profile.partnerHeightMin)
      : "",
    partnerHeightMax: initialData.profile?.partnerHeightMax
      ? String(initialData.profile.partnerHeightMax)
      : "",
    partnerMotherTongue: initialData.profile?.partnerMotherTongue ?? "",
    partnerMaritalStatus: initialData.profile?.partnerMaritalStatus ?? "",
    partnerEatingHabit: initialData.profile?.partnerEatingHabit ?? "",
    partnerSmokingHabit: initialData.profile?.partnerSmokingHabit ?? "",
    partnerDrinkingHabit: initialData.profile?.partnerDrinkingHabit ?? "",
    partnerCountry: initialData.profile?.partnerCountry ?? "",
    partnerDosham: initialData.profile?.partnerDosham ?? "",
  });
  const [avatarUrl, setAvatarUrl] = useState(
    initialData.profile?.avatarUrl ?? null,
  );
  const [coverUrl, setCoverUrl] = useState(
    initialData.profile?.coverUrl ?? null,
  );
  const [horoscopeUrl, setHoroscopeUrl] = useState(
    initialData.profile?.horoscopeUrl ?? null,
  );
  const [uploadingSlot, setUploadingSlot] = useState<
    "avatar" | "cover" | "horoscope" | null
  >(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const update = (key: keyof typeof form, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const uploadFile = async (
    file: File,
    slot: "avatar" | "cover" | "horoscope",
  ) => {
    setError("");
    setUploadingSlot(slot);
    try {
      const presignRes = await fetch("/api/upload/presign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contentType: file.type,
          folder: slot === "horoscope" ? "horoscope-docs" : "profile-photos",
        }),
      });
      if (!presignRes.ok) throw new Error();
      const { uploadUrl, publicUrl } = await presignRes.json();

      const uploadRes = await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });
      if (!uploadRes.ok) throw new Error();

      if (slot === "avatar") setAvatarUrl(publicUrl);
      else if (slot === "cover") setCoverUrl(publicUrl);
      else setHoroscopeUrl(publicUrl);
    } catch {
      setError(`Failed to upload ${slot}`);
    } finally {
      setUploadingSlot(null);
    }
  };

  const handleSave = async () => {
    setError("");

    if (!form.fullName.trim()) {
      setError("Name cannot be empty");
      return;
    }

    if (form.partnerAgeMin && form.partnerAgeMax) {
      const min = Number(form.partnerAgeMin);
      const max = Number(form.partnerAgeMax);
      if (isNaN(min) || isNaN(max) || min < 18 || max < min) {
        setError("Please enter a valid partner age range");
        return;
      }
    }

    setSaving(true);
    try {
      const res = await fetch("/api/profile/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
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
          maritalStatus: form.maritalStatus || undefined,
          physicalStatus: form.physicalStatus || undefined,
          profileCreatedBy: form.profileCreatedBy || undefined,
          employmentType: form.employmentType || undefined,
          country: form.country,
          citizenship: form.citizenship,
          eatingHabit: form.eatingHabit || undefined,
          smokingHabit: form.smokingHabit || undefined,
          drinkingHabit: form.drinkingHabit || undefined,
          hobbies: form.hobbies
            ? form.hobbies
                .split(",")
                .map((h) => h.trim())
                .filter(Boolean)
            : [],
          familyStatus: form.familyStatus || undefined,
          familyValue: form.familyValue || undefined,
          familyType: form.familyType || undefined,
          horoscopeAvailable: form.horoscopeAvailable,
          horoscopeUrl: horoscopeUrl ?? undefined,
          rashi: form.rashi,
          nakshatra: form.nakshatra || undefined,
          dosham: form.dosham || undefined,
          partnerAgeMin: form.partnerAgeMin
            ? Number(form.partnerAgeMin)
            : undefined,
          partnerAgeMax: form.partnerAgeMax
            ? Number(form.partnerAgeMax)
            : undefined,
          partnerReligion: form.partnerReligion,
          partnerCaste: form.partnerCaste,
          partnerEducationLevel: form.partnerEducationLevel || undefined,
          partnerOccupationCategory:
            form.partnerOccupationCategory || undefined,
          partnerCity: form.partnerCity,
          partnerState: form.partnerState,
          partnerHeightMin: form.partnerHeightMin
            ? Number(form.partnerHeightMin)
            : undefined,
          partnerHeightMax: form.partnerHeightMax
            ? Number(form.partnerHeightMax)
            : undefined,
          partnerMotherTongue: form.partnerMotherTongue,
          partnerMaritalStatus: form.partnerMaritalStatus || undefined,
          partnerEatingHabit: form.partnerEatingHabit || undefined,
          partnerSmokingHabit: form.partnerSmokingHabit || undefined,
          partnerDrinkingHabit: form.partnerDrinkingHabit || undefined,
          partnerCountry: form.partnerCountry,
          partnerDosham: form.partnerDosham || undefined,
          avatarUrl: avatarUrl ?? undefined,
          coverUrl: coverUrl ?? undefined,
        }),
      });
      const result = await res.json();

      if (!res.ok) {
        setError(result.error || "Failed to save changes");
        setSaving(false);
        return;
      }

      window.location.reload();
    } catch {
      setError("Network error. Please try again.");
      setSaving(false);
    }
  };

  const details = [
    data.profile?.occupation && { icon: "💼", label: data.profile.occupation },
    data.profile?.education && { icon: "🎓", label: data.profile.education },
    (data.profile?.city || data.profile?.state) && {
      icon: "📍",
      label: [data.profile?.city, data.profile?.state]
        .filter(Boolean)
        .join(", "),
    },
    (data.profile?.religion || data.profile?.caste || data.profile?.height) && {
      icon: "🧬",
      label: [
        data.profile?.religion
          ? (RELIGION_LABELS[data.profile.religion] ?? data.profile.religion)
          : null,
        data.profile?.caste,
        data.profile?.height ? `${data.profile.height} cm` : null,
      ]
        .filter(Boolean)
        .join(" · "),
    },
    data.profile?.maritalStatus && {
      icon: "💍",
      label:
        MARITAL_STATUS_LABELS[data.profile.maritalStatus] ??
        data.profile.maritalStatus,
    },
    (data.profile?.eatingHabit ||
      data.profile?.smokingHabit ||
      data.profile?.drinkingHabit) && {
      icon: "🍽️",
      label: [
        data.profile?.eatingHabit
          ? EATING_HABIT_LABELS[data.profile.eatingHabit]
          : null,
        data.profile?.smokingHabit
          ? `Smoking: ${SMOKING_HABIT_LABELS[data.profile.smokingHabit]}`
          : null,
        data.profile?.drinkingHabit
          ? `Drinking: ${DRINKING_HABIT_LABELS[data.profile.drinkingHabit]}`
          : null,
      ]
        .filter(Boolean)
        .join(" · "),
    },
    (data.profile?.familyStatus || data.profile?.familyType) && {
      icon: "👨‍👩‍👧",
      label: [
        data.profile?.familyStatus
          ? FAMILY_STATUS_LABELS[data.profile.familyStatus]
          : null,
        data.profile?.familyType
          ? FAMILY_TYPE_LABELS[data.profile.familyType]
          : null,
      ]
        .filter(Boolean)
        .join(" · "),
    },
    data.profile?.hobbies &&
      data.profile.hobbies.length > 0 && {
        icon: "🎨",
        label: data.profile.hobbies.join(", "),
      },
    data.age && { icon: "🎂", label: `${data.age} years old` },
  ].filter(Boolean) as { icon: string; label: string }[];

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
              <div style={{ ...styles.avatar, ...styles.avatarPlaceholder }}>
                👤
              </div>
            )}
          </div>

          <div style={styles.nameSection}>
            <h1 style={styles.name}>
              {data.fullName || "Your Name"}{" "}
              {data.emailVerified && (
                <span style={{ color: "#d6336c" }}>✓</span>
              )}
            </h1>
            <p style={styles.email}>{data.email}</p>
            {data.profile?.bio ? (
              <p style={styles.bio}>{data.profile.bio}</p>
            ) : null}
          </div>

          <div style={styles.progressSection}>
            <div style={styles.progressLabelRow}>
              <p style={styles.progressLabel}>Profile Strength</p>
              <p style={styles.progressPercent}>{data.profileCompleteness}%</p>
            </div>
            <div style={styles.progressTrack}>
              <div
                style={{
                  ...styles.progressFill,
                  width: `${data.profileCompleteness}%`,
                }}
              />
            </div>
            {data.profileCompleteness < 100 && (
              <p style={styles.progressHint}>
                Complete your profile to get better matches
              </p>
            )}
          </div>

          <button onClick={() => setEditing(true)} style={styles.editButton}>
            Edit Profile
          </button>

          <div style={styles.idCard}>
            <p style={styles.idCardTitle}>Identity Verification</p>
            {data.idVerified ? (
              <div style={styles.idStatusRow}>
                <span style={styles.idBadgeVerified}>✓ Verified</span>
              </div>
            ) : data.profile?.idVerificationStatus === "pending" ? (
              <div style={styles.idStatusRow}>
                <span style={styles.idBadgePending}>Under Review</span>
                <p style={styles.idStatusText}>
                  We'll notify you once your document is reviewed.
                </p>
              </div>
            ) : data.profile?.idVerificationStatus === "rejected" ? (
              <div style={styles.idStatusRow}>
                <span style={styles.idBadgeRejected}>Rejected</span>
                <p style={styles.idStatusText}>
                  {data.profile.idVerificationRejectionReason}
                </p>
                <button
                  onClick={() => setEditing(true)}
                  style={styles.idResubmitButton}
                >
                  Resubmit Document
                </button>
              </div>
            ) : (
              <div style={styles.idStatusRow}>
                <p style={styles.idStatusText}>
                  Verify your identity to build trust with other members.
                </p>
                <button
                  onClick={() => setEditing(true)}
                  style={styles.idVerifyButton}
                >
                  Verify Now
                </button>
              </div>
            )}
          </div>

          {details.length > 0 && (
            <div style={styles.detailsCard}>
              <div style={styles.detailsHeader}>
                <h2 style={styles.cardTitle}>Matrimony Details</h2>
                <button
                  onClick={() => setEditing(true)}
                  style={styles.detailsEditLink}
                >
                  Edit
                </button>
              </div>
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
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.editHeader}>
          <h1 style={styles.editTitle}>Edit Profile</h1>
          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={() => setEditing(false)}
              style={styles.cancelButton}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              style={styles.saveButton}
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>

        <div style={styles.coverWrap}>
          {coverUrl ? (
            <img src={coverUrl} alt="" style={styles.coverImg} />
          ) : (
            <div style={styles.coverPlaceholder} />
          )}
          <label style={styles.coverEditBadge}>
            {uploadingSlot === "cover" ? "..." : "📷"}
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) =>
                e.target.files?.[0] && uploadFile(e.target.files[0], "cover")
              }
            />
          </label>
        </div>

        <div style={styles.avatarSection}>
          {avatarUrl ? (
            <img src={avatarUrl} alt="" style={styles.avatar} />
          ) : (
            <div style={{ ...styles.avatar, ...styles.avatarPlaceholder }}>
              👤
            </div>
          )}
          <label style={styles.avatarEditBadge}>
            {uploadingSlot === "avatar" ? "..." : "📷"}
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) =>
                e.target.files?.[0] && uploadFile(e.target.files[0], "avatar")
              }
            />
          </label>
        </div>

        <div style={styles.form}>
          <h3 style={styles.sectionTitle}>Basic Info</h3>
          <Field
            label="Full Name"
            value={form.fullName}
            onChange={(v) => update("fullName", v)}
          />

          <label style={styles.label}>Gender</label>
          <div style={styles.pillRow}>
            {["MALE", "FEMALE", "OTHER"].map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => update("gender", g)}
                style={form.gender === g ? styles.pillActive : styles.pill}
              >
                {g === "MALE" ? "Male" : g === "FEMALE" ? "Female" : "Other"}
              </button>
            ))}
          </div>

          <label style={styles.label}>Date of Birth</label>
          <input
            type="date"
            value={form.dateOfBirth}
            onChange={(e) => update("dateOfBirth", e.target.value)}
            style={styles.input}
          />

          <label style={styles.label}>Marital Status</label>
          <select
            value={form.maritalStatus}
            onChange={(e) => update("maritalStatus", e.target.value)}
            style={styles.input}
          >
            <option value="">Select</option>
            {Object.entries(MARITAL_STATUS_LABELS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>

          <label style={styles.label}>Physical Status</label>
          <select
            value={form.physicalStatus}
            onChange={(e) => update("physicalStatus", e.target.value)}
            style={styles.input}
          >
            <option value="">Select</option>
            {Object.entries(PHYSICAL_STATUS_LABELS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>

          <label style={styles.label}>Profile Created By</label>
          <select
            value={form.profileCreatedBy}
            onChange={(e) => update("profileCreatedBy", e.target.value)}
            style={styles.input}
          >
            <option value="">Select</option>
            {Object.entries(PROFILE_CREATED_BY_LABELS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>

          <Field
            label="Bio"
            value={form.bio}
            onChange={(v) => update("bio", v)}
            multiline
          />
          <Field
            label="Height (cm)"
            value={form.height}
            onChange={(v) => update("height", v)}
            type="number"
          />

          <h3 style={styles.sectionTitle}>Religion & Community</h3>

          <label style={styles.label}>Religion</label>
          <select
            value={form.religion}
            onChange={(e) => update("religion", e.target.value)}
            style={styles.input}
          >
            <option value="">Select religion</option>
            {Object.entries(RELIGION_LABELS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>

          <Field
            label="Caste / Community"
            value={form.caste}
            onChange={(v) => update("caste", v)}
          />
          <Field
            label="Mother Tongue"
            value={form.motherTongue}
            onChange={(v) => update("motherTongue", v)}
          />

          <h3 style={styles.sectionTitle}>Astro Details</h3>

          <label style={styles.checkboxRow}>
            <input
              type="checkbox"
              checked={form.horoscopeAvailable}
              onChange={(e) => update("horoscopeAvailable", e.target.checked)}
            />
            <span style={styles.checkboxLabel}>Horoscope Available</span>
          </label>

          {form.horoscopeAvailable && (
            <>
              {horoscopeUrl ? (
                <div style={styles.filePreviewRow}>
                  <span style={styles.filePreviewText}>
                    Horoscope document uploaded
                  </span>
                  <button
                    type="button"
                    onClick={() => setHoroscopeUrl(null)}
                    style={styles.idRemoveButton}
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <label style={styles.idUploadButton}>
                  {uploadingSlot === "horoscope"
                    ? "Uploading..."
                    : "Upload Horoscope"}
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    style={{ display: "none" }}
                    onChange={(e) =>
                      e.target.files?.[0] &&
                      uploadFile(e.target.files[0], "horoscope")
                    }
                  />
                </label>
              )}
            </>
          )}

          <Field
            label="Rashi (Moon Sign)"
            value={form.rashi}
            onChange={(v) => update("rashi", v)}
          />

          <label style={styles.label}>Nakshatra</label>
          <select
            value={form.nakshatra}
            onChange={(e) => update("nakshatra", e.target.value)}
            style={styles.input}
          >
            <option value="">Select</option>
            {Object.entries(NAKSHATRA_LABELS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>

          <label style={styles.label}>Dosham</label>
          <select
            value={form.dosham}
            onChange={(e) => update("dosham", e.target.value)}
            style={styles.input}
          >
            <option value="">Select</option>
            {Object.entries(DOSHAM_LABELS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>

          <h3 style={styles.sectionTitle}>Education & Career</h3>

          <label style={styles.label}>Highest Education Level</label>
          <select
            value={form.educationLevel}
            onChange={(e) => update("educationLevel", e.target.value)}
            style={styles.input}
          >
            <option value="">Select education level</option>
            {Object.entries(EDUCATION_LEVEL_LABELS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>

          <Field
            label="Degree / Field (optional detail)"
            value={form.education}
            onChange={(v) => update("education", v)}
          />

          <label style={styles.label}>Occupation Category</label>
          <select
            value={form.occupationCategory}
            onChange={(e) => update("occupationCategory", e.target.value)}
            style={styles.input}
          >
            <option value="">Select category</option>
            {Object.entries(OCCUPATION_CATEGORY_LABELS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>

          <label style={styles.label}>Employment Type</label>
          <select
            value={form.employmentType}
            onChange={(e) => update("employmentType", e.target.value)}
            style={styles.input}
          >
            <option value="">Select</option>
            {Object.entries(EMPLOYMENT_TYPE_LABELS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>

          <Field
            label="Job Title (optional detail)"
            value={form.occupation}
            onChange={(v) => update("occupation", v)}
          />
          <Field
            label="Annual Income"
            value={form.annualIncome}
            onChange={(v) => update("annualIncome", v)}
          />

          <h3 style={styles.sectionTitle}>Location</h3>
          <Field
            label="City"
            value={form.city}
            onChange={(v) => update("city", v)}
          />
          <Field
            label="State"
            value={form.state}
            onChange={(v) => update("state", v)}
          />
          <Field
            label="Country"
            value={form.country}
            onChange={(v) => update("country", v)}
          />
          <Field
            label="Citizenship"
            value={form.citizenship}
            onChange={(v) => update("citizenship", v)}
          />

          <h3 style={styles.sectionTitle}>Lifestyle</h3>

          <label style={styles.label}>Eating Habits</label>
          <select
            value={form.eatingHabit}
            onChange={(e) => update("eatingHabit", e.target.value)}
            style={styles.input}
          >
            <option value="">Select</option>
            {Object.entries(EATING_HABIT_LABELS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>

          <label style={styles.label}>Smoking Habits</label>
          <select
            value={form.smokingHabit}
            onChange={(e) => update("smokingHabit", e.target.value)}
            style={styles.input}
          >
            <option value="">Select</option>
            {Object.entries(SMOKING_HABIT_LABELS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>

          <label style={styles.label}>Drinking Habits</label>
          <select
            value={form.drinkingHabit}
            onChange={(e) => update("drinkingHabit", e.target.value)}
            style={styles.input}
          >
            <option value="">Select</option>
            {Object.entries(DRINKING_HABIT_LABELS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>

          <Field
            label="Hobbies (comma-separated)"
            value={form.hobbies}
            onChange={(v) => update("hobbies", v)}
          />

          <h3 style={styles.sectionTitle}>Family Details</h3>

          <label style={styles.label}>Family Status</label>
          <select
            value={form.familyStatus}
            onChange={(e) => update("familyStatus", e.target.value)}
            style={styles.input}
          >
            <option value="">Select</option>
            {Object.entries(FAMILY_STATUS_LABELS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>

          <label style={styles.label}>Family Value</label>
          <select
            value={form.familyValue}
            onChange={(e) => update("familyValue", e.target.value)}
            style={styles.input}
          >
            <option value="">Select</option>
            {Object.entries(FAMILY_VALUE_LABELS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>

          <label style={styles.label}>Family Type</label>
          <select
            value={form.familyType}
            onChange={(e) => update("familyType", e.target.value)}
            style={styles.input}
          >
            <option value="">Select</option>
            {Object.entries(FAMILY_TYPE_LABELS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>

          <h3 style={styles.sectionTitle}>Partner Preferences</h3>

          <div style={{ display: "flex", gap: 10 }}>
            <Field
              label="Min Age"
              value={form.partnerAgeMin}
              onChange={(v) => update("partnerAgeMin", v)}
              type="number"
            />
            <Field
              label="Max Age"
              value={form.partnerAgeMax}
              onChange={(v) => update("partnerAgeMax", v)}
              type="number"
            />
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <Field
              label="Min Height (cm)"
              value={form.partnerHeightMin}
              onChange={(v) => update("partnerHeightMin", v)}
              type="number"
            />
            <Field
              label="Max Height (cm)"
              value={form.partnerHeightMax}
              onChange={(v) => update("partnerHeightMax", v)}
              type="number"
            />
          </div>

          <label style={styles.label}>Preferred Religion</label>
          <select
            value={form.partnerReligion}
            onChange={(e) => update("partnerReligion", e.target.value)}
            style={styles.input}
          >
            <option value="">Any</option>
            {Object.entries(RELIGION_LABELS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>

          <Field
            label="Preferred Caste"
            value={form.partnerCaste}
            onChange={(v) => update("partnerCaste", v)}
          />
          <Field
            label="Preferred Mother Tongue"
            value={form.partnerMotherTongue}
            onChange={(v) => update("partnerMotherTongue", v)}
          />

          <label style={styles.label}>Preferred Education Level</label>
          <select
            value={form.partnerEducationLevel}
            onChange={(e) => update("partnerEducationLevel", e.target.value)}
            style={styles.input}
          >
            <option value="">Any</option>
            {Object.entries(EDUCATION_LEVEL_LABELS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>

          <label style={styles.label}>Preferred Occupation Category</label>
          <select
            value={form.partnerOccupationCategory}
            onChange={(e) =>
              update("partnerOccupationCategory", e.target.value)
            }
            style={styles.input}
          >
            <option value="">Any</option>
            {Object.entries(OCCUPATION_CATEGORY_LABELS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>

          <label style={styles.label}>Preferred Marital Status</label>
          <select
            value={form.partnerMaritalStatus}
            onChange={(e) => update("partnerMaritalStatus", e.target.value)}
            style={styles.input}
          >
            <option value="">Any</option>
            {Object.entries(MARITAL_STATUS_LABELS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>

          <label style={styles.label}>Preferred Eating Habits</label>
          <select
            value={form.partnerEatingHabit}
            onChange={(e) => update("partnerEatingHabit", e.target.value)}
            style={styles.input}
          >
            <option value="">Any</option>
            {Object.entries(EATING_HABIT_LABELS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>

          <label style={styles.label}>Preferred Smoking Habits</label>
          <select
            value={form.partnerSmokingHabit}
            onChange={(e) => update("partnerSmokingHabit", e.target.value)}
            style={styles.input}
          >
            <option value="">Any</option>
            {Object.entries(SMOKING_HABIT_LABELS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>

          <label style={styles.label}>Preferred Drinking Habits</label>
          <select
            value={form.partnerDrinkingHabit}
            onChange={(e) => update("partnerDrinkingHabit", e.target.value)}
            style={styles.input}
          >
            <option value="">Any</option>
            {Object.entries(DRINKING_HABIT_LABELS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>

          <label style={styles.label}>Preferred Dosham</label>
          <select
            value={form.partnerDosham}
            onChange={(e) => update("partnerDosham", e.target.value)}
            style={styles.input}
          >
            <option value="">Any</option>
            {Object.entries(DOSHAM_LABELS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>

          <Field
            label="Preferred City"
            value={form.partnerCity}
            onChange={(v) => update("partnerCity", v)}
          />
          <Field
            label="Preferred State"
            value={form.partnerState}
            onChange={(v) => update("partnerState", v)}
          />
          <Field
            label="Preferred Country"
            value={form.partnerCountry}
            onChange={(v) => update("partnerCountry", v)}
          />

          {error && <p style={styles.error}>{error}</p>}
        </div>

        {!data.idVerified && (
          <IdVerificationUpload onSubmitted={() => window.location.reload()} />
        )}

        
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  multiline,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
  type?: string;
}) {
  return (
    <div style={{ flex: 1, marginBottom: 14 }}>
      <label style={styles.label}>{label}</label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{ ...styles.input, height: 80, resize: "vertical" as const }}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={styles.input}
        />
      )}
    </div>
  );
}

function IdVerificationUpload({ onSubmitted }: { onSubmitted: () => void }) {
  const [documentType, setDocumentType] = useState<"aadhar" | "pan">("aadhar");
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [documentUrl, setDocumentUrl] = useState<string | null>(null);
  const [error, setError] = useState("");

  const uploadDoc = async (file: File) => {
    setError("");
    setUploading(true);
    try {
      const presignRes = await fetch("/api/upload/presign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contentType: file.type,
          folder: "id-documents",
        }),
      });
      if (!presignRes.ok) throw new Error();
      const { uploadUrl, publicUrl } = await presignRes.json();

      const uploadRes = await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });
      if (!uploadRes.ok) throw new Error();

      setDocumentUrl(publicUrl);
    } catch {
      setError("Failed to upload document");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!documentUrl) {
      setError("Please upload your document first");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/profile/verify-id", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentType, documentUrl }),
      });
      if (!res.ok) throw new Error();
      onSubmitted();
    } catch {
      setError("Failed to submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={styles.idUploadCard}>
      <p style={styles.sectionTitle}>Identity Verification</p>
      <p style={styles.idUploadNote}>
        Upload a clear photo of your Aadhaar or PAN card. This is reviewed
        manually and only used to confirm your identity — it's never shown
        publicly on your profile.
      </p>

      <div style={styles.pillRow}>
        <button
          type="button"
          onClick={() => setDocumentType("aadhar")}
          style={documentType === "aadhar" ? styles.pillActive : styles.pill}
        >
          Aadhaar Card
        </button>
        <button
          type="button"
          onClick={() => setDocumentType("pan")}
          style={documentType === "pan" ? styles.pillActive : styles.pill}
        >
          PAN Card
        </button>
      </div>

      {documentUrl ? (
        <div style={styles.idPreviewWrap}>
          <img
            src={documentUrl}
            alt="Document preview"
            style={styles.idPreviewImg}
          />
          <button
            type="button"
            onClick={() => setDocumentUrl(null)}
            style={styles.idRemoveButton}
          >
            Remove
          </button>
        </div>
      ) : (
        <label style={styles.idUploadButton}>
          {uploading ? "Uploading..." : "Upload Document"}
          <input
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) =>
              e.target.files?.[0] && uploadDoc(e.target.files[0])
            }
          />
        </label>
      )}

      {error && <p style={styles.error}>{error}</p>}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={submitting || !documentUrl}
        style={styles.idSubmitButton}
      >
        {submitting ? "Submitting..." : "Submit for Review"}
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
  container: { maxWidth: 640, margin: "0 auto", paddingBottom: 40 },
  coverWrap: {
    height: 200,
    backgroundColor: "#f6c6d4",
    position: "relative" as const,
  },
  coverImg: { width: "100%", height: "100%", objectFit: "cover" as const },
  coverPlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "#f6c6d4",
  },
  coverEditBadge: {
    position: "absolute" as const,
    bottom: 12,
    right: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(0,0,0,0.45)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    fontSize: 16,
  },
  avatarSection: {
    marginTop: -50,
    marginLeft: 24,
    position: "relative" as const,
    width: 100,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    border: "4px solid #fff0f3",
    objectFit: "cover" as const,
  },
  avatarPlaceholder: {
    backgroundColor: "#fce8ee",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 40,
  },
  avatarEditBadge: {
    position: "absolute" as const,
    bottom: 0,
    right: 0,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#d6336c",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    fontSize: 13,
    border: "2px solid #fff0f3",
  },
  nameSection: { padding: "14px 24px 0" },
  name: { fontSize: 22, fontWeight: 700, color: "#5c2a3a", margin: 0 },
  email: { fontSize: 13, color: "#a5486a", margin: "4px 0 0" },
  bio: { fontSize: 14, color: "#5c2a3a", marginTop: 10, lineHeight: 1.5 },
  progressSection: { padding: "0 24px", marginTop: 18, marginBottom: 4 },
  progressLabelRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  progressLabel: { fontSize: 13, fontWeight: 700, color: "#5c2a3a", margin: 0 },
  progressPercent: {
    fontSize: 13,
    fontWeight: 700,
    color: "#d6336c",
    margin: 0,
  },
  progressTrack: {
    height: 8,
    backgroundColor: "#fce8ee",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#d6336c",
    borderRadius: 4,
    transition: "width 0.3s ease",
  },
  progressHint: { fontSize: 11, color: "#a5486a", marginTop: 6 },
  editButton: {
    margin: "18px 24px 0",
    padding: "11px 20px",
    borderRadius: 12,
    border: "none",
    backgroundColor: "#d6336c",
    color: "#fff",
    fontWeight: 700,
    fontSize: 14,
    cursor: "pointer",
    width: "calc(100% - 48px)",
  },
  idCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 18,
    margin: "16px 24px 0",
  },
  idCardTitle: {
    fontSize: 14,
    fontWeight: 700,
    color: "#5c2a3a",
    margin: "0 0 10px",
  },
  idStatusRow: {
    display: "flex",
    flexDirection: "column" as const,
    gap: 8,
    alignItems: "flex-start",
  },
  idBadgeVerified: {
    fontSize: 12,
    fontWeight: 700,
    color: "#1a7a3d",
    backgroundColor: "#d4f4dd",
    borderRadius: 8,
    padding: "5px 12px",
  },
  idBadgePending: {
    fontSize: 12,
    fontWeight: 700,
    color: "#8a6d00",
    backgroundColor: "#fff3cd",
    borderRadius: 8,
    padding: "5px 12px",
  },
  idBadgeRejected: {
    fontSize: 12,
    fontWeight: 700,
    color: "#c0392b",
    backgroundColor: "#fce8e8",
    borderRadius: 8,
    padding: "5px 12px",
  },
  idStatusText: { fontSize: 12, color: "#8a5464", margin: 0 },
  idVerifyButton: {
    padding: "8px 16px",
    borderRadius: 10,
    border: "none",
    backgroundColor: "#d6336c",
    color: "#fff",
    fontWeight: 700,
    fontSize: 12,
    cursor: "pointer",
  },
  idResubmitButton: {
    padding: "8px 16px",
    borderRadius: 10,
    border: "none",
    backgroundColor: "#d6336c",
    color: "#fff",
    fontWeight: 700,
    fontSize: 12,
    cursor: "pointer",
  },
  detailsCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    margin: "16px 24px 0",
  },
  detailsHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  cardTitle: { fontSize: 14, fontWeight: 700, color: "#5c2a3a", margin: 0 },
  detailsEditLink: {
    fontSize: 12,
    fontWeight: 700,
    color: "#d6336c",
    background: "none",
    border: "none",
    cursor: "pointer",
  },
  detailRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "6px 0",
  },
  detailText: { fontSize: 13, color: "#5c2a3a" },
  visibilityNote: {
    fontSize: 11,
    color: "#a5486a",
    marginTop: 12,
    paddingTop: 12,
    borderTop: "1px solid #fce8ee",
  },
  editHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 24px 0",
  },
  editTitle: { fontSize: 20, fontWeight: 700, color: "#5c2a3a", margin: 0 },
  cancelButton: {
    padding: "8px 16px",
    borderRadius: 10,
    border: "1px solid #f6c6d4",
    backgroundColor: "#fff",
    color: "#a5486a",
    fontWeight: 600,
    fontSize: 13,
    cursor: "pointer",
  },
  saveButton: {
    padding: "8px 16px",
    borderRadius: 10,
    border: "none",
    backgroundColor: "#d6336c",
    color: "#fff",
    fontWeight: 700,
    fontSize: 13,
    cursor: "pointer",
  },
  form: { padding: "20px 24px 0" },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 700,
    color: "#d6336c",
    marginTop: 20,
    marginBottom: 6,
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
    padding: "9px 12px",
    borderRadius: 10,
    border: "1px solid #f6c6d4",
    fontSize: 14,
    backgroundColor: "#ffffff",
    color: "#5c2a3a",
    boxSizing: "border-box" as const,
    marginBottom: 14,
  },
  pillRow: {
    display: "flex",
    gap: 8,
    marginBottom: 14,
    flexWrap: "wrap" as const,
  },
  pill: {
    flex: 1,
    minWidth: 70,
    padding: "8px 0",
    borderRadius: 8,
    border: "1px solid #f6c6d4",
    backgroundColor: "#fff",
    color: "#a5486a",
    fontWeight: 600,
    fontSize: 13,
    cursor: "pointer",
  },
  pillActive: {
    flex: 1,
    minWidth: 70,
    padding: "8px 0",
    borderRadius: 8,
    border: "1px solid #d6336c",
    backgroundColor: "#d6336c",
    color: "#fff",
    fontWeight: 600,
    fontSize: 13,
    cursor: "pointer",
  },
  checkboxRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 14,
    cursor: "pointer",
  },
  checkboxLabel: { fontSize: 13, color: "#5c2a3a", fontWeight: 600 },
  filePreviewRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 14,
  },
  filePreviewText: { fontSize: 12, color: "#5c2a3a" },
  error: { color: "#e03131", fontSize: 13, marginTop: 4, marginBottom: 12 },
  idUploadCard: {
    backgroundColor: "#fff5f7",
    borderRadius: 16,
    padding: 20,
    margin: "24px 24px 0",
  },
  idUploadNote: {
    fontSize: 12,
    color: "#8a5464",
    lineHeight: 1.5,
    margin: "0 0 14px",
  },
  idPreviewWrap: { marginTop: 10 },
  idPreviewImg: {
    width: "100%",
    maxWidth: 300,
    borderRadius: 10,
    marginBottom: 8,
    display: "block",
  },
  idRemoveButton: {
    fontSize: 12,
    color: "#e03131",
    background: "none",
    border: "none",
    cursor: "pointer",
    fontWeight: 600,
  },
  idUploadButton: {
    display: "inline-block",
    marginTop: 10,
    padding: "10px 18px",
    borderRadius: 10,
    border: "1px dashed #d6336c",
    color: "#d6336c",
    fontWeight: 600,
    fontSize: 13,
    cursor: "pointer",
  },
  idSubmitButton: {
    marginTop: 16,
    padding: "11px 20px",
    borderRadius: 10,
    border: "none",
    backgroundColor: "#d6336c",
    color: "#fff",
    fontWeight: 700,
    fontSize: 13,
    cursor: "pointer",
  },
  deleteAccountLink: {
    marginTop: 24,
    paddingTop: 20,
    borderTop: "1px solid #fce8ee",
    textAlign: "center" as const,
  },
  deleteAccountLinkText: {
    fontSize: 13,
    color: "#e03131",
    fontWeight: 600,
    textDecoration: "none",
  },
};
