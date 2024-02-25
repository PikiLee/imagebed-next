'use client'

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { Button } from '../ui/button'
import { P } from '../ui/p'
import { H3 } from '../ui/h3'
import Link from 'next/link'
import { useToast } from '@/components/ui/use-toast'
import Image from 'next/image'
import ImageCard from '../image-card'

export default function UploadButton() {
  const [loading, setLoading] = useState(false)
  const [url, setUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const { toast } = useToast()

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
    <div className="flex flex-col gap-4 items-center justify-center max-w-120">
      <Label htmlFor="image">Select a Image</Label>
      <Input id="image" type="file" accept="image/*" onChange={onChange} />
      {url && (
        <>
          <H3 className="text-center">
            Uploading succeeded! Copy the image URL.
          </H3>
          <ImageCard url={url} />
        </>
      )}

      {loading && <P>Uploading...</P>}
      {error && <P>{error}</P>}
    </div>
  )
}
