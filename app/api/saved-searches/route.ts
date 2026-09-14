// app/api/saved-searches/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const userId = req.headers.get('x-user-id')
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const searches = await prisma.savedSearch.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json({ searches })
}

export async function POST(req: NextRequest) {
  const userId = req.headers.get('x-user-id')
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { name, filters } = await req.json()
  if (!name?.trim()) {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 })
  }

  const search = await prisma.savedSearch.create({
    data: { userId, name: name.trim(), filters },
  })

  return NextResponse.json({ search })
}