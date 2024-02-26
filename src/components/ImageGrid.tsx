'use client'

import { useInView } from 'framer-motion'
import { useEffect, useRef } from 'react'
import useSWRInfinite from 'swr/infinite'

import ImageCard from '@/components/image-card'
import { getKey } from '@/lib/getKey'
import { getURLFromKey } from '@/lib/key'

import { Skeleton } from './ui/skeleton'

export default function ImageGrid({}: {}) {
  const { data, error, setSize, isValidating } = useSWRInfinite(
    getKey,
    ({ pageIndex, NextContinuationToken }) => {
      //   console.log('fetching', pageIndex, NextContinuationToken)
      return fetch(
        `/images${NextContinuationToken ? `?continuationToken=${NextContinuationToken}` : ''}`
      ).then((res) => res.json())
    }
  )
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
    if (inView) {
      setSize((size) => size + 1)
    }
  }, [inView, setSize])

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

        {isValidating &&
          Array.from({ length: 3 }).map((_, i) => (
            <div className="flex items-center space-x-4" key={i}>
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          ))}
      </ul>

      <div ref={loadMoreRef}></div>
    </>
  )
}
