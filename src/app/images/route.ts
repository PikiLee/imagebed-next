import { listFiles } from '@/lib/file'
import { prefix } from '@/lib/key'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const continuationToken =
    request.nextUrl.searchParams.get('continuationToken')
  const images = await listFiles(prefix, continuationToken ?? undefined)

  return Response.json(images)
}
