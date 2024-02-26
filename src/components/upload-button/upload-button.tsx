'use client'

import { useRef, useState } from 'react'

import { Button } from '@/components/ui/button'
import { H3 } from '@/components/ui/h3'
import { Input } from '@/components/ui/input'
import { P } from '@/components/ui/p'

import ImageCard from '../image-card'
import ImageCardSkeleton from '../ImageCardSkeleton'

export default function UploadButton() {
  const [loading, setLoading] = useState(false)
  const [url, setUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const inputRef = useRef<HTMLInputElement>(null)

  async function onChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    setLoading(true)
    setError(null)
    setUrl(null)
    const formData = new FormData()
    formData.append('image', file)
    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })
    if (!res.ok) {
      setError('Failed to upload image')
      setLoading(false)
      return
    }

    const { url } = await res.json()
    setUrl(url)
    setLoading(false)
  }
  return (
    <div className="flex flex-col gap-4 items-center justify-center w-full max-w-120">
      <Button onClick={() => inputRef.current?.click()} disabled={loading}>
        {loading ? 'Uploading...' : 'Upload Image'}
      </Button>
      <Input
        className="fixed left-[-9999px] top-0"
        type="file"
        accept="image/*"
        onChange={onChange}
        ref={inputRef}
      />
      {url && (
        <H3 className="text-center">
          Uploading succeeded! Copy the image URL.
        </H3>
      )}
      {loading ? <ImageCardSkeleton /> : url && <ImageCard url={url} />}
      {error && <P>{error}</P>}
    </div>
  )
}
