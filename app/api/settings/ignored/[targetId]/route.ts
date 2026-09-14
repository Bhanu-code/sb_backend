// app/api/settings/ignored/[targetId]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  req: NextRequest,
  { params }: { params: { targetId: string } }
) {
  const userId = req.headers.get('x-user-id')
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await prisma.pass.deleteMany({ where: { userId, targetId: params.targetId } })

  return NextResponse.json({ message: 'Removed from ignored list' })
}