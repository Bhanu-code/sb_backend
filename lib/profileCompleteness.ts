// lib/profileCompleteness.ts

export const PROGRESS_FIELDS = [
  'avatarUrl', 'bio', 'height', 'religion', 'caste', 'motherTongue',
  'educationLevel', 'occupationCategory', 'annualIncome', 'city', 'state',
  'maritalStatus', 'partnerAgeMin', 'partnerAgeMax', 'partnerReligion',
  'partnerEducationLevel', 'partnerCity',
  'physicalStatus', 'employmentType', 'eatingHabit', 'smokingHabit',
  'drinkingHabit', 'familyStatus', 'familyType',
] as const

/**
 * Computes profile completeness as a percentage (0-100), factoring in
 * both the filled-out Profile fields and ID verification status.
 * This is the single source of truth — anywhere completeness needs to
 * be calculated should import and call this, not reimplement the math.
 */
export function calculateProfileCompleteness(
  profile: Record<string, any> | null | undefined,
  idVerified: boolean
): number {
  const filledCount = PROGRESS_FIELDS.filter((f) => {
    const val = profile?.[f]
    return val !== null && val !== undefined && val !== ''
  }).length

  const idVerifiedBonus = idVerified ? 1 : 0
  const totalPossible = PROGRESS_FIELDS.length + 1

  return Math.round(((filledCount + idVerifiedBonus) / totalPossible) * 100)
}