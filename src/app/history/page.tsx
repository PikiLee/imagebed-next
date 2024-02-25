import { H2 } from '@/components/ui/h2'
import { listFiles } from '@/lib/file'
import { getURLFromKey, prefix } from '@/lib/key'
import Image from 'next/image'
import Link from 'next/link'

export default async function History() {
  const images = await listFiles(prefix)

  return (
    <main className="flex flex-col gap-12 items-center">
      <H2>History</H2>
      <ul className="grid grid-cols-3 gap-4">
        {images.Contents?.map((image) => {
          const path = `/${image.Key}`
          return (
            image.Key &&
            path && (
              <li key={image.Key}>
                <Link href={path} target="_blank">
                  <Image
                    src={path}
                    alt={image.Key}
                    width={1920}
                    height={1080}
                  />
                </Link>
                <Link href={path}>{getURLFromKey(image.Key)}</Link>
              </li>
            )
          )
        })}
      </ul>
    </main>
  )
}
