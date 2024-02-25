import ImageGrid from '@/components/ImageGrid'
import { H2 } from '@/components/ui/h2'
import { listFiles } from '@/lib/file'
import { prefix } from '@/lib/key'

export default async function History() {
  const images = await listFiles(prefix)

  return (
    <main className="flex flex-col gap-12 items-center">
      <H2>History</H2>
      {images.Contents && <ImageGrid images={images} />}
    </main>
  )
}
