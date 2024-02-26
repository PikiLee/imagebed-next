import { File } from 'buffer'

import { uploadFile } from '@/lib/file'
import { generateID, getImageKey, getURLFromKey } from '@/lib/key'

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
