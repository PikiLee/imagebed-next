'use client'

import { useInView } from 'framer-motion'
import { useEffect, useRef } from 'react'
import useSWRInfinite from 'swr/infinite'

import ImageCard from '@/components/image-card'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { getKey } from '@/lib/getKey'
import { getURLFromKey } from '@/lib/key'

import { Skeleton } from './ui/skeleton'

export default function ImageGrid({}: {}) {
  const { data, error, size, setSize, isLoading } = useSWRInfinite(
    getKey,
    ({ pageIndex, NextContinuationToken }) => {
      //   console.log('fetching', pageIndex, NextContinuationToken)
      return fetch(
        `/images${NextContinuationToken ? `?continuationToken=${NextContinuationToken}` : ''}`
      ).then((res) => res.json())
    }
  )
  const isLoadingMore =
    isLoading || (size > 0 && data && typeof data[size - 1] === 'undefined')
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
    if (inView && !isLoadingMore && imagesRef.current.IsTruncated) {
      setSize((size) => size + 1)
    }
  }, [inView, setSize, isLoadingMore])

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

        {isLoadingMore &&
          Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader></CardHeader>
              <CardContent>
                <Skeleton className="aspect-video" />
              </CardContent>
              <CardFooter>
                <div className="flex flex-col gap-4">
                  <Skeleton className="h-4" />
                  <Skeleton className="h-4" />
                </div>
              </CardFooter>
            </Card>
          ))}
      </ul>

      <div ref={loadMoreRef}></div>
    </>
  )
}
