// lib/profileId.ts
export function formatProfileId(profileNumber: number): string {
  return `SB${profileNumber.toString().padStart(6, '0')}`
}

export function parseProfileId(input: string): number | null {
  const match = input.trim().toUpperCase().match(/^SB0*(\d+)$/)
  return match ? Number(match[1]) : null
}