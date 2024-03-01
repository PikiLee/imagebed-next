import { NextRequest } from 'next/server'

import { deleteFile, getUploadFileUrl } from '@/lib/file'
import { listFiles } from '@/lib/file'
import { generateID, getImageKey, getURLFromKey } from '@/lib/key'
import { prefix } from '@/lib/key'

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url)
  const numOfImages = Number(searchParams.get('numOfImages')) ?? 1

  const urls = await Promise.all(
    Array.from({ length: numOfImages }).map(async () => {
      const id = generateID()
      const key = getImageKey(id)
      const uploadUrl = await getUploadFileUrl(key)

      return { uploadUrl, imageUrl: getURLFromKey(key) }
    })
  )

  return Response.json(urls)
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
