'use client'

import { ListObjectsV2CommandOutput } from '@aws-sdk/client-s3'
import { useInView } from 'framer-motion'
import { useEffect, useRef } from 'react'
import useSWR, { useSWRConfig } from 'swr'
import useSWRInfinite from 'swr/infinite'

import ImageCard from '@/components/image-card'
import { getKey } from '@/lib/getKey'
import { getImageKey, getURLFromKey } from '@/lib/key'

import ImageCardSkeleton from './image-card-skeleton'
import { P } from './ui/p'
import { useToast } from './ui/use-toast'

type ArrayElement<ArrType> = ArrType extends readonly (infer ElementType)[]
  ? ElementType
  : never

export default function ImageGrid({}: {}) {
  const { toast } = useToast()
  const { mutate: globalMutate } = useSWRConfig()

  const { data: recentUploadImageUrl } = useSWR('/api/images')
  const {
    data,
    error,
    size,
    setSize,
    isLoading: isInitialLoading,
    mutate,
  } = useSWRInfinite(getKey, ({ pageIndex, NextContinuationToken }) => {
    return fetch(
      `/api/images${NextContinuationToken ? `?continuationToken=${NextContinuationToken}` : ''}`
    ).then((res) => {
      if (res.ok) return res.json()

      throw new Error('Failed to load more images')
    })
  })

  const isLoading = size > 0 && data && typeof data[size - 1] === 'undefined'
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

  async function onDelete(url: string) {
    try {
      const match = url.match(/images\/(?<id>.*)/)
      const id = match?.groups?.id
      if (id) {
        await mutate(
          async () => {
            const res = await fetch(`/api/images`, {
              method: 'DELETE',
              body: JSON.stringify({ id }),
            })
            if (res.ok) {
              if (recentUploadImageUrl) {
                const match = recentUploadImageUrl.match(/images\/(?<id>.*)/)
                const recentUploadImageId = match?.groups?.id
                if (recentUploadImageId === id) globalMutate('/api/images', '')
              }
              return res.json()
            }
            throw new Error('Failed to delete image.')
          },
          {
            optimisticData: data?.map((d) => {
              return {
                ...d,
                Contents: d.Contents?.filter(
                  (c: ArrayElement<ListObjectsV2CommandOutput['Contents']>) =>
                    c.Key !== getImageKey(id)
                ),
              }
            }),
            populateCache: false,
          }
        )
      }
    } catch (e: unknown) {
      if (e instanceof Error) {
        toast({
          title: e.message,
        })
      }
    }
  }

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

        {isLoading &&
          !error &&
          Array.from({ length: 6 }).map((_, i) => (
            <ImageCardSkeleton key={i} />
          ))}
      </ul>
      {error && <P>{error.message}</P>}

      <div ref={loadMoreRef}></div>
    </>
  )
}
