'use client'

import ImageCard from '@/components/image-card/image-card'

import ImageCardSkeleton from '../image-card-skeleton'
import { P } from '../ui/p'

export default function ImageGrid({
  urls,
  isLoadingMore = false,
  onDelete,
}: {
  urls?: string[]
  isLoadingMore?: boolean
  onDelete: (url: string) => void
}) {
  const isEmpty = !urls?.length
  return (
    <>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {urls?.map((url) => {
          return (
            url && (
              <li key={url}>
                <ImageCard url={url} onDelete={onDelete} />
              </li>
            )
          )
        })}

        {isLoadingMore &&
          Array.from({ length: 6 }).map((_, i) => (
            <ImageCardSkeleton key={i} />
          ))}
      </ul>
      {isEmpty && <P>No images found</P>}
    </>
  )
}
