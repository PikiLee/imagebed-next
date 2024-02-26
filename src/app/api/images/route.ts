import { File } from 'buffer'
import { NextRequest } from 'next/server'

import { deleteFile, uploadFile } from '@/lib/file'
import { listFiles } from '@/lib/file'
import { generateID, getImageKey, getURLFromKey } from '@/lib/key'
import { prefix } from '@/lib/key'

export async function POST(request: Request) {
  const formData = await request.formData()
  const image = formData.get('image')
  if (!(image instanceof File)) {
    return Response.json({ error: 'No image provided' }, { status: 400 })
  }

  if (!/image\/.*/i.test(image.type)) {
    return Response.json({ error: 'Invalid image type' }, { status: 400 })
  }

  const buf = Buffer.from(await image.arrayBuffer())

  const id = generateID()
  const key = getImageKey(id)
  await uploadFile(key, buf)

  return Response.json({ url: getURLFromKey(key) })
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
