// app/api/settings/blocked/[blockedId]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  req: NextRequest,
  { params }: { params: { blockedId: string } }
) {
  const userId = req.headers.get('x-user-id')
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await prisma.block.deleteMany({ where: { blockerId: userId, blockedId: params.blockedId } })

  return NextResponse.json({ message: 'Unblocked' })
}