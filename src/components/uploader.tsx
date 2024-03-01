'use client'

import { useRef } from 'react'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { P } from '@/components/ui/p'
import { cn } from '@/lib/utils'

import ImageCard from './image-card'
import ImageCardSkeleton from './image-card-skeleton'
import { useToast } from './ui/use-toast'

export function isFulfilled<T>(
  value: PromiseSettledResult<T>
): value is PromiseFulfilledResult<T> {
  return value.status === 'fulfilled'
}

export default function Uploader() {
  const { toast } = useToast()

  const { data: uploadResults } =
    useSWR<PromiseSettledResult<string>[]>('/api/images')
  const {
    trigger: triggerUpload,
    isMutating: isUploading,
    error: uploadError,
  } = useSWRMutation(
    `/api/images`,
    async (
      url,
      {
        arg,
      }: {
        arg: FileList
      }
    ) => {
      const requestUrl = new URL(url, window.location.origin)
      requestUrl.searchParams.set('numOfImages', arg.length.toString())
      const res = await fetch(requestUrl, {
        method: 'POST',
      })

      if (!res.ok) throw new Error(`Failed to upload image`)

      const urls = await res.json()

      const uploadRes = await Promise.allSettled(
        Array.from(arg).map(async (image, index) => {
          const res = await fetch(urls[index].uploadUrl, {
            method: 'PUT',
            body: image,
            headers: {
              'Content-Type': 'image/*',
            },
          })
          if (!res.ok) throw new Error(`Failed to upload image`)

          return urls[index].imageUrl
        })
      )

      return uploadRes
    },
    {
      revalidate: false,
      populateCache: true,
    }
  )

  const { trigger: triggerDelete } = useSWRMutation(
    `/api/images`,
    async (
      url,
      {
        arg,
      }: {
        arg: string
      }
    ) => {
      if (!uploadResults) return
      const matchedResult = uploadResults
        .filter(isFulfilled)
        .find((r) => r.value === arg)
      const match = matchedResult?.value?.match(/images\/(?<id>.*)/)
      const id = match?.groups?.id
      if (!id) throw new Error(`Failed to delete image`)

      const res = await fetch(url, {
        method: 'DELETE',
        body: JSON.stringify({ id }),
      })

      if (!res.ok) throw new Error(`Failed to delete image`)
    },
    {
      revalidate: false,
      populateCache: false,
      onError: (err) =>
        toast({
          title: err.message,
        }),
    }
  )

  async function onDelete(url: string) {
    if (!uploadResults) return
    triggerDelete(url, {
      optimisticData: uploadResults.filter(
        (r) => !isFulfilled(r) || r.value !== url
      ),
      rollbackOnError: true,
    })
  }

  const inputRef = useRef<HTMLInputElement>(null)

  async function onChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files
    if (!files) return

    triggerUpload(files)
  }
  return (
    <div className="flex flex-col gap-4 items-center justify-center w-full">
      <Button onClick={() => inputRef.current?.click()} disabled={isUploading}>
        {isUploading ? 'Uploading...' : 'Upload Image'}
      </Button>
      <Input
        className="fixed left-[-9999px] top-0"
        type="file"
        accept="image/*"
        onChange={onChange}
        ref={inputRef}
        multiple
      />
      {isUploading ? (
        <ImageCardSkeleton />
      ) : (
        <div
          className={cn(
            'grid grid-cols-1 gap-4',
            uploadResults?.length === 1
              ? 'lg:grid-cols-1 sm:grid-cols-1'
              : uploadResults?.length === 2
                ? 'lg:grid-cols-2 sm:grid-cols-2'
                : 'sm:grid-cols-2 lg:grid-cols-3'
          )}
        >
          {uploadResults?.map((uploadResult) => {
            return uploadResult.status === 'fulfilled' ? (
              <ImageCard
                url={uploadResult.value}
                onDelete={onDelete}
                key={uploadResult.value}
              />
            ) : (
              'Error uploading image'
            )
          })}
        </div>
      )}

      {uploadError && <P>{uploadError.message}</P>}
    </div>
  )
}
