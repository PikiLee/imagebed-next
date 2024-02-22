import { uploadFile } from '@/lib/file'
import { generateID } from '@/lib/generateID'
import { File } from 'buffer'

export async function POST(request: Request) {
  const formData = await request.formData()
  const image = formData.get('image')
  if (!(image instanceof File)) {
    return Response.json({ error: 'No image provided' }, { status: 400 })
  }
  const buf = Buffer.from(await image.arrayBuffer())

  const key = `images/${image.name.split('.')[0]}-${generateID()}`
  await uploadFile(key, buf)

  const origin = new URL(request.url).origin
  console.log(origin)

  return Response.json({ url: `${origin}/${key}` })
}
