// lib/requireAdminRole.ts — small helper used by every other admin route
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function requireAdminRole(req: NextRequest) {
  const userId = req.headers.get('x-user-id')
  if (!userId) {
    return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
  }

  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user || user.role !== 'admin') {
    return { error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) }
  }

  return { user }
}