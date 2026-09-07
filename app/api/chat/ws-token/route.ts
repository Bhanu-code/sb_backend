// app/api/chat/ws-token/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getWebSessionUser } from '@/lib/webSession'
import { SignJWT } from 'jose'

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!)

export async function GET(req: NextRequest) {
  const user = await getWebSessionUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Short-lived token specifically for the WS handshake — the WS query
  // string can end up in server access logs, so we don't want to expose
  // the same long-lived 30-day session token there.
  const wsToken = await new SignJWT({ userId: user.id })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('5m')
    .sign(JWT_SECRET)

  return NextResponse.json({ token: wsToken })
}