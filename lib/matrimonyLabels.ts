// lib/matrimonyLabels.ts

export const RELIGION_LABELS: Record<string, string> = {
  hindu: 'Hindu',
  muslim: 'Muslim',
  christian: 'Christian',
  sikh: 'Sikh',
  buddhist: 'Buddhist',
  jain: 'Jain',
  parsi: 'Parsi',
  jewish: 'Jewish',
  other: 'Other',
}



export const EDUCATION_LEVEL_LABELS: Record<string, string> = {
  high_school: 'High School',
  diploma: 'Diploma',
  bachelors: "Bachelor's Degree",
  masters: "Master's Degree",
  phd: 'PhD',
  professional: 'Professional Degree',
  other: 'Other',
}

export const OCCUPATION_CATEGORY_LABELS: Record<string, string> = {
  engineering_technology: 'Engineering / Technology',
  healthcare: 'Healthcare / Medicine',
  finance: 'Finance / Banking',
  government: 'Government Service',
  education: 'Education / Teaching',
  business_management: 'Business / Management',
  arts_media: 'Arts / Media',
  legal: 'Legal',
  self_employed: 'Self-Employed',
  student: 'Student',
  other: 'Other',
}

// add to lib/matrimonyLabels.ts

export const MARITAL_STATUS_LABELS: Record<string, string> = {
  never_married: 'Never Married',
  divorced: 'Divorced',
  widowed: 'Widowed',
  awaiting_divorce: 'Awaiting Divorce',
}

export const PHYSICAL_STATUS_LABELS: Record<string, string> = {
  normal: 'Normal',
  physically_challenged: 'Physically Challenged',
}

export const PROFILE_CREATED_BY_LABELS: Record<string, string> = {
  self: 'Self', parent: 'Parent', sibling: 'Sibling', relative: 'Relative', friend: 'Friend',
}

export const EMPLOYMENT_TYPE_LABELS: Record<string, string> = {
  private_sector: 'Private Sector', government: 'Government', business: 'Business',
  self_employed: 'Self-Employed', not_working: 'Not Working',
}

export const EATING_HABIT_LABELS: Record<string, string> = {
  vegetarian: 'Vegetarian', non_vegetarian: 'Non-Vegetarian', eggetarian: 'Eggetarian', vegan: 'Vegan',
}

export const SMOKING_HABIT_LABELS: Record<string, string> = { no: 'No', occasionally: 'Occasionally', yes: 'Yes' }
export const DRINKING_HABIT_LABELS: Record<string, string> = { no: 'No', occasionally: 'Occasionally', yes: 'Yes' }

export const FAMILY_STATUS_LABELS: Record<string, string> = {
  middle_class: 'Middle Class', upper_middle_class: 'Upper Middle Class', rich: 'Rich', affluent: 'Affluent',
}

export const FAMILY_VALUE_LABELS: Record<string, string> = {
  traditional: 'Traditional', moderate: 'Moderate', liberal: 'Liberal',
}

export const FAMILY_TYPE_LABELS: Record<string, string> = { nuclear: 'Nuclear', joint: 'Joint' }

export const NAKSHATRA_LABELS: Record<string, string> = {
  ashwini: 'Ashwini', bharani: 'Bharani', krittika: 'Krittika', rohini: 'Rohini',
  mrigashira: 'Mrigashira', ardra: 'Ardra', punarvasu: 'Punarvasu', pushya: 'Pushya',
  ashlesha: 'Ashlesha', magha: 'Magha', purva_phalguni: 'Purva Phalguni',
  uttara_phalguni: 'Uttara Phalguni', hasta: 'Hasta', chitra: 'Chitra', swati: 'Swati',
  vishakha: 'Vishakha', anuradha: 'Anuradha', jyeshtha: 'Jyeshtha', moola: 'Moola',
  purva_ashadha: 'Purva Ashadha', uttara_ashadha: 'Uttara Ashadha', shravana: 'Shravana',
  dhanishta: 'Dhanishta', shatabhisha: 'Shatabhisha', purva_bhadrapada: 'Purva Bhadrapada',
  uttara_bhadrapada: 'Uttara Bhadrapada', revati: 'Revati',
}

export const DOSHAM_LABELS: Record<string, string> = {
  none: 'None', manglik: 'Manglik', other: 'Other', dont_know: "Don't Know",
}

export const PARTNER_PHYSICAL_STATUS_LABELS = PHYSICAL_STATUS_LABELS
export const PARTNER_EMPLOYMENT_TYPE_LABELS = EMPLOYMENT_TYPE_LABELS
export const PARTNER_FAMILY_STATUS_LABELS = FAMILY_STATUS_LABELS
export const PARTNER_FAMILY_VALUE_LABELS = FAMILY_VALUE_LABELS
export const PARTNER_FAMILY_TYPE_LABELS = FAMILY_TYPE_LABELS
export const PARTNER_NAKSHATRA_LABELS = NAKSHATRA_LABELS