// scripts/backfill-avatars.ts
import { prisma } from '../lib/prisma'

async function main() {
  const profiles = await prisma.profile.findMany({
    where: { avatarUrl: null },
  })

  let updated = 0

  for (const profile of profiles) {
    if (!profile.photos || profile.photos.length === 0) continue

    await prisma.profile.update({
      where: { id: profile.id },
      data: {
        avatarUrl: profile.photos[0],
        coverUrl: profile.photos[1] ?? undefined,
      },
    })
    updated++
  }

  console.log(`Backfilled ${updated} profiles (checked ${profiles.length} total)`)
}

main().finally(() => process.exit())