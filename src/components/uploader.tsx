'use client'

import { useRef } from 'react'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { P } from '@/components/ui/p'

import ImageCard from './image-card'
import ImageCardSkeleton from './image-card-skeleton'
import { useToast } from './ui/use-toast'

export default function Uploader() {
  const { toast } = useToast()

  const { data: url } = useSWR('/api/images')
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
        arg: FormData
      }
    ) => {
      const res = await fetch(url, {
        method: 'POST',
      })

      if (!res.ok) throw new Error(`Failed to upload image`)

      const { uploadUrl, imageUrl } = await res.json()

      const uploadRes = await fetch(uploadUrl, {
        method: 'PUT',
        body: arg.get('image'),
        headers: {
          'Content-Type': 'image/*',
        },
      })

      if (!uploadRes.ok) throw new Error(`Failed to upload image`)

      return imageUrl
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
      const res = await fetch(url, {
        method: 'DELETE',
        body: JSON.stringify({ id: arg }),
      })

      if (!res.ok) throw new Error(`Failed to delete image`)

      return ''
    },
    {
      optimisticData: '',
      revalidate: false,
      populateCache: true,
      onError: (err) =>
        toast({
          title: err.message,
        }),
    }
  )

  async function onDelete() {
    if (!url) return
    const match = url.match(/images\/(?<id>.*)/)
    const id = match?.groups?.id
    if (id) {
      triggerDelete(id)
    }
  }

  const inputRef = useRef<HTMLInputElement>(null)

  async function onChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('image', file)
    triggerUpload(formData)
  }
  return (
    <div className="flex flex-col gap-4 items-center justify-center w-full max-w-120">
      <Button onClick={() => inputRef.current?.click()} disabled={isUploading}>
        {isUploading ? 'Uploading...' : 'Upload Image'}
      </Button>
      <Input
        className="fixed left-[-9999px] top-0"
        type="file"
        accept="image/*"
        onChange={onChange}
        ref={inputRef}
      />
      {isUploading ? (
        <ImageCardSkeleton />
      ) : (
        url && <ImageCard url={url} onDelete={onDelete} />
      )}
      {uploadError && <P>{uploadError.message}</P>}
    </div>
  )
}
