'use client'

import { useInView } from 'framer-motion'
import { useEffect, useRef } from 'react'
import useSWRInfinite from 'swr/infinite'

import ImageCard from '@/components/image-card'
import { getKey } from '@/lib/getKey'
import { getURLFromKey } from '@/lib/key'

import ImageCardSkeleton from './ImageCardSkeleton'

export default function ImageGrid({}: {}) {
  const {
    data,
    error,
    size,
    setSize,
    isLoading: isInitialLoading,
  } = useSWRInfinite(getKey, ({ pageIndex, NextContinuationToken }) => {
    return fetch(
      `/images${NextContinuationToken ? `?continuationToken=${NextContinuationToken}` : ''}`
    ).then((res) => res.json())
  })
  const isLoading =
    isInitialLoading ||
    (size > 0 && data && typeof data[size - 1] === 'undefined')
  const images = {
    Contents: data?.flatMap((d) => d.Contents ?? []),
    IsTruncated: data ? data[data.length - 1].IsTruncated : false,
  }
  const imagesRef = useRef(images)
  if (imagesRef.current !== images) imagesRef.current = images
  const urls = images.Contents?.map(
    (image) => image.Key && getURLFromKey(image.Key)
  )

  const loadMoreRef = useRef<HTMLDivElement>(null)
  const inView = useInView(loadMoreRef, { margin: '0px 0px -50px 0px' })

  useEffect(() => {
    if (inView && !isLoading && imagesRef.current.IsTruncated) {
      setSize((size) => size + 1)
    }
  }, [inView, setSize, isLoading])

  return (
    <>
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

        {isLoading &&
          Array.from({ length: 6 }).map((_, i) => (
            <ImageCardSkeleton key={i} />
          ))}
      </ul>

      <div ref={loadMoreRef}></div>
    </>
  )
}
