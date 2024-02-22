import { getFile } from '@/utils/file'

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const key = `images/${params.slug}`

  const image = await getFile(key)
  console.log(image)

  return new Response(image)
}
