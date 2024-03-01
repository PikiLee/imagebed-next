import { NextRequest } from 'next/server'

import { deleteFile, getUploadFileUrl } from '@/lib/file'
import { listFiles } from '@/lib/file'
import { generateID, getImageKey, getURLFromKey } from '@/lib/key'
import { prefix } from '@/lib/key'

export async function POST() {
  const id = generateID()
  const key = getImageKey(id)
  const uploadUrl = await getUploadFileUrl(key)

  return Response.json({ uploadUrl, imageUrl: getURLFromKey(key) })
}

export async function GET(request: NextRequest) {
  const continuationToken =
    request.nextUrl.searchParams.get('continuationToken')
  const images = await listFiles(prefix, continuationToken ?? undefined)

  return Response.json(images)
}

export async function DELETE(request: Request) {
  const { id } = await request.json()

  if (!id) {
    return Response.json({ error: 'No id provided' }, { status: 400 })
  }

  const key = getImageKey(id)
  await deleteFile(key)

  return Response.json({ success: true })
}
