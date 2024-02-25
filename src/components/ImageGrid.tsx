import { ListObjectsV2CommandOutput } from '@aws-sdk/client-s3'

import ImageCard from '@/components/image-card'
import { getURLFromKey } from '@/lib/key'

export default function ImageGrid({
  images,
}: {
  images: ListObjectsV2CommandOutput
}) {
  const urls = images.Contents?.map(
    (image) => image.Key && getURLFromKey(image.Key)
  )

  return (
    <ul className="grid grid-cols-3 gap-4">
      {urls?.map((url) => {
        return (
          url && (
            <li key={url}>
              <ImageCard url={url} />
            </li>
          )
        )
      })}
    </ul>
  )
}
