'use client'

import { ListObjectsV2CommandOutput } from '@aws-sdk/client-s3'
import { useInView } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

import ImageCard from '@/components/image-card'
import { getURLFromKey } from '@/lib/key'

export default function ImageGrid({
  images: _images,
}: {
  images: ListObjectsV2CommandOutput
}) {
  const [images, setImages] = useState(_images)
  const imagesRef = useRef(_images)
  if (imagesRef.current !== images) imagesRef.current = images
  console.log('images', images.Contents?.length)
  const urls = images.Contents?.map(
    (image) => image.Key && getURLFromKey(image.Key)
  )

  const loadMoreRef = useRef<HTMLDivElement>(null)
  const inView = useInView(loadMoreRef, { margin: '0px 0px 0px 0px' })

  useEffect(() => {
    async function loadMore() {
      console.log(
        'imagesRef.current.Contents.length',
        imagesRef.current.Contents?.length
      )
      const res = await fetch(
        `/images?continuationToken=${imagesRef.current.NextContinuationToken}`
      )
      if (!res.ok) return

      const _newImages = await res.json()
      const newImages = Object.assign({}, imagesRef.current, _newImages)
      newImages.Contents = [
        ...(imagesRef.current.Contents ?? []),
        ..._newImages.Contents,
      ]
      setImages(newImages)
    }

    if (inView && imagesRef.current.IsTruncated) {
      console.log('load more')
      loadMore()
    }
  }, [inView])

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

      <div ref={loadMoreRef}></div>
    </ul>
  )
}
