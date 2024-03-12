'use client'

import { ListObjectsV2CommandOutput } from '@aws-sdk/client-s3'
import { useInView } from 'framer-motion'
import { useEffect, useRef } from 'react'
import useSWR from 'swr'
import useSWRInfinite from 'swr/infinite'

import { getKey } from '@/lib/getKey'
import { getImageKey, getURLFromKey } from '@/lib/key'

import ImageGrid from './image-grid/image-grid'
import { P } from './ui/p'
import { useToast } from './ui/use-toast'
import { isFulfilled } from './uploader'

type ArrayElement<ArrType> = ArrType extends readonly (infer ElementType)[]
  ? ElementType
  : never

export default function History() {
  const { toast } = useToast()

  const { data: uploadResults, mutate: uploadMutate } =
    useSWR<PromiseSettledResult<string>[]>('/api/images')
  const {
    data,
    error,
    size,
    setSize,
    isLoading: isInitialLoading,
    mutate,
  } = useSWRInfinite(
    getKey,
    async ({ pageIndex, NextContinuationToken }) => {
      const res = await fetch(
        `/api/images${NextContinuationToken ? `?continuationToken=${NextContinuationToken}` : ''}`
      )

      if (!res.ok) throw new Error('Failed to load images')

      const data = await res.json()
      return data
    },
    {
      revalidateAll: true,
    }
  )

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
  const numberOfUrls = urls?.length ?? 0

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
              if (uploadResults) {
                uploadMutate(
                  uploadResults.filter(
                    (r) => !isFulfilled(r) || r.value !== url
                  )
                )
              }

              if (numberOfUrls % 6 === 1 && numberOfUrls > 6) setSize(size - 1)
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
      <ImageGrid
        urls={urls}
        isLoadingMore={isLoading && !error}
        onDelete={onDelete}
      />
      {error && <P>{error.message}</P>}

      <div ref={loadMoreRef}></div>
    </>
  )
}
