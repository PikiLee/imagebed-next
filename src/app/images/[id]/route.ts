import { getFile } from '@/lib/file'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const key = `images/${params.id}`
  const image = await getFile(key)

  return new Response(image)
}
