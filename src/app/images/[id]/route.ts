import { getFileUrl } from '@/lib/file'
import { getImageKey } from '@/lib/key'

export const dynamic = 'force-dynamic'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const key = getImageKey(params.id)
  const url = await getFileUrl(key)

  return Response.redirect(url)
}
