// app/api/saved-searches/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId = req.headers.get('x-user-id')
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const search = await prisma.savedSearch.findUnique({ where: { id: params.id } })
  if (!search || search.userId !== userId) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  await prisma.savedSearch.delete({ where: { id: params.id } })
  return NextResponse.json({ message: 'Deleted' })
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId = req.headers.get('x-user-id')
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const search = await prisma.savedSearch.findUnique({ where: { id: params.id } })
  if (!search || search.userId !== userId) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const { name } = await req.json()
  if (!name?.trim()) {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 })
  }

  const updated = await prisma.savedSearch.update({
    where: { id: params.id },
    data: { name: name.trim() },
  })

  return NextResponse.json({ search: updated })
}