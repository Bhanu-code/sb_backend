// middleware.ts
import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!)

const PUBLIC_PATHS = [
  '/api/auth/register',
  '/api/auth/register-advisor',
  '/api/auth/login',
  '/api/auth/verify-otp',
  '/api/auth/send-otp',
  '/api/auth/resend-otp',
  '/api/auth/forgot-password',
  '/api/auth/set-password', // still needs to work pre-password for new users — see note below
  '/api/admin/login',
  '/api/admin/create',
]

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  if (!pathname.startsWith('/api/')) {
    return NextResponse.next()
  }

  // 1. Try Bearer token first (mobile apps)
  const authHeader = req.headers.get('authorization')
  const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null

  // 2. Fall back to cookie session (web app)
  const cookieToken = req.cookies.get('sb_session')?.value

  const token = bearerToken || cookieToken

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)

    const requestHeaders = new Headers(req.headers)
    requestHeaders.set('x-user-id', payload.userId as string)

    return NextResponse.next({
      request: { headers: requestHeaders },
    })
  } catch {
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 })
  }
}

export const config = {
  matcher: '/api/:path*',
}