// app/api/upload/presign/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getPresignedUploadUrl } from '@/lib/s3'

const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'video/mp4',
  'video/quicktime',
  'video/x-matroska', // .mkv, in case picked from certain devices
  'video/webm',
]

export async function POST(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id')
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { contentType, folder } = await req.json()

    if (!contentType || !ALLOWED_TYPES.includes(contentType)) {
      return NextResponse.json(
        { error: 'Invalid or unsupported content type' },
        { status: 400 }
      )
    }

    const safeFolder = ['profile-photos', 'post-photos', 'post-videos', 'reels'].includes(folder)
      ? folder
      : 'misc'

    const { uploadUrl, publicUrl } = await getPresignedUploadUrl(
      `${safeFolder}/${userId}`,
      contentType
    )

    return NextResponse.json({ uploadUrl, publicUrl })
  } catch (err) {
    console.error('Presign error:', err)
    return NextResponse.json({ error: 'Failed to generate upload URL' }, { status: 500 })
  }
}