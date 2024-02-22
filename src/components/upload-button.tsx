'use client'

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { Button } from './ui/button'

export default function UploadButton() {
  const [loading, setLoading] = useState(false)
  const [url, setUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

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
    <div>
      {!loading ? (
        url ? (
          <>
            <div>Image Url</div>
            <p>{url}</p>
            <Button
              onClick={() => {
                setLoading(false)
                setError(null)
                setUrl(null)
              }}
            >
              Upload again
            </Button>
          </>
        ) : (
          <>
            <Label htmlFor="image">Upload Image</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={onChange}
            />
          </>
        )
      ) : (
        <div>Uploading...</div>
      )}
      {error && <p>{error}</p>}
    </div>
  )
}
