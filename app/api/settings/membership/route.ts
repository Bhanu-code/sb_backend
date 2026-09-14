// app/api/settings/membership/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const userId = req.headers.get('x-user-id')
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const subscription = await prisma.subscription.findUnique({ where: { userId } })

  if (!subscription) {
    return NextResponse.json({ plan: 'Free', status: null, startDate: null, endDate: null })
  }

  return NextResponse.json({
    plan: subscription.plan,
    status: subscription.status,
    startDate: subscription.startDate,
    endDate: subscription.endDate,
    amount: subscription.amount,
  })
}