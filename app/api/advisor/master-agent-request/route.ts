// app/api/advisor/master-agent-request/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id')
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({ where: { id: userId } })

    if (!user || user.role !== 'advisor') {
      return NextResponse.json({ error: 'Only advisors can apply' }, { status: 403 })
    }

    if (user.referralCount < 100) {
      return NextResponse.json(
        { error: 'You need at least 100 completed referrals to apply' },
        { status: 400 }
      )
    }

    const existing = await prisma.masterAgentRequest.findUnique({ where: { userId } })
    if (existing) {
      return NextResponse.json({ error: 'You have already applied', status: existing.status }, { status: 409 })
    }

    const request = await prisma.masterAgentRequest.create({
      data: { userId },
    })

    return NextResponse.json({ request }, { status: 201 })
  } catch (err) {
    console.error('Master agent request error:', err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}