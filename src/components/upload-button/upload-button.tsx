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

export default function UploadButton() {
  const [loading, setLoading] = useState(false)
  const [url, setUrl] = useState<string | null>(null)
  const path = url?.match(/\/images\/.*/)?.[0]
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
    <div className="flex flex-col gap-4 items-center justify-center">
      {!loading ? (
        url ? (
          <>
            <H3>Uploading has succeeded! Copy the image URL.</H3>
            <Link href={url} target="blank">
              {url}
            </Link>
            <div className="flex gap-4">
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(url)
                  toast({
                    title: 'URL copied',
                  })
                }}
              >
                Copy URL
              </Button>
              <Button
                onClick={() => {
                  setLoading(false)
                  setError(null)
                  setUrl(null)
                }}
              >
                Upload New Image
              </Button>
            </div>
            {path && (
              <Image
                src={path}
                width={1920}
                height={1080}
                alt="Uploaded Image"
              />
            )}
          </>
        ) : (
          <>
            <Label htmlFor="image">Select a Image</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={onChange}
            />
          </>
        )
      ) : (
        <P>Uploading...</P>
      )}
      {error && <P>{error}</P>}
    </div>
  )
}
