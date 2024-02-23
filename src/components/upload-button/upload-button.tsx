'use client'

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { Button } from '../ui/button'
import { H2 } from '../ui/h2'
import { P } from '../ui/p'
import { H3 } from '../ui/h3'
import Link from 'next/link'
import { useToast } from '@/components/ui/use-toast'

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
    const res = await fetch('/upload', {
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
      <H2>Upload Image</H2>
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
