import { NextRequest } from 'next/server'

import { listFiles } from '@/lib/file'
import { prefix } from '@/lib/key'

export async function GET(request: NextRequest) {
  const continuationToken =
    request.nextUrl.searchParams.get('continuationToken')
  const images = await listFiles(prefix, continuationToken ?? undefined)

  return Response.json(images)
}
