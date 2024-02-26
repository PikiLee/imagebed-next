'use client'

import { useRef } from 'react'
import useSWRMutation from 'swr/mutation'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { P } from '@/components/ui/p'

import ImageCard from '../image-card'
import ImageCardSkeleton from '../ImageCardSkeleton'

export default function UploadButton() {
  const { data, trigger, isMutating, error } = useSWRMutation(
    `/api/images`,
    (
      url,
      {
        arg: { method, body },
      }: {
        arg: {
          method: 'POST' | 'DELETE'
          body: FormData | { id: string }
        }
      }
    ) => {
      return fetch(url, {
        method,
        body: body instanceof FormData ? body : JSON.stringify(body),
      }).then((res) => {
        if (res.ok) return res.json()

        throw new Error(
          `Failed to ${method === 'POST' ? 'upload' : 'delete'} image`
        )
      })
    }
  )
  const url = data?.url

  async function onDelete() {
    const match = url.match(/images\/(?<id>.*)/)
    const id = match?.groups?.id
    if (id) {
      trigger({
        method: 'DELETE',
        body: { id },
      })
    }
  }

  const inputRef = useRef<HTMLInputElement>(null)

  async function onChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('image', file)
    trigger({
      method: 'POST',
      body: formData,
    })
  }
  return (
    <div className="flex flex-col gap-4 items-center justify-center w-full max-w-120">
      <Button onClick={() => inputRef.current?.click()} disabled={isMutating}>
        {isMutating ? 'Loading...' : 'Upload Image'}
      </Button>
      <Input
        className="fixed left-[-9999px] top-0"
        type="file"
        accept="image/*"
        onChange={onChange}
        ref={inputRef}
      />
      {isMutating ? (
        <ImageCardSkeleton />
      ) : (
        url && <ImageCard url={url} onDelete={onDelete} />
      )}
      {error && <P>{error}</P>}
    </div>
  )
}
