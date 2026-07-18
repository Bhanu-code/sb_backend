// app/api/interests/[interestId]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  req: NextRequest,
  { params }: { params: { interestId: string } }
) {
  try {
    const userId = req.headers.get('x-user-id')
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { action } = await req.json()
    if (action !== 'accept' && action !== 'decline') {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    const interest = await prisma.interest.findUnique({
      where: { id: params.interestId },
    })

    if (!interest) {
      return NextResponse.json({ error: 'Interest not found' }, { status: 404 })
    }

    if (interest.receiverId !== userId) {
      return NextResponse.json(
        { error: 'Only the receiver can respond to this interest' },
        { status: 403 }
      )
    }

    if (interest.status !== 'pending') {
      return NextResponse.json({ error: 'Interest already resolved' }, { status: 409 })
    }

    const updated = await prisma.interest.update({
      where: { id: params.interestId },
      data: { status: action === 'accept' ? 'accepted' : 'declined' },
    })

    return NextResponse.json({ interest: updated })
  } catch (err) {
    console.error('Respond to interest error:', err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}