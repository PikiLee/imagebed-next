import { getFile } from '@/lib/file'
import { getImageKey } from '@/lib/key'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const key = getImageKey(params.id)
  const image = await getFile(key)

  return new Response(image)
}
