'use client'

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

export default function UploadButton() {
  async function onChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('image', file)
    const res = await fetch('/upload', {
      method: 'POST',
      body: formData,
    })
    const { url } = await res.json()
    console.log({ url })
  }
  return (
    <div>
      <Label htmlFor="image">Upload Image</Label>
      <Input id="image" type="file" accept="image/*" onChange={onChange} />
    </div>
  )
}
