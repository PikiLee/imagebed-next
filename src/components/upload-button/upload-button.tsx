import { useRef } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function UploadButton({
  onChange,
  isUploading,
}: {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  isUploading: boolean
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  return (
    <>
      <Button onClick={() => inputRef.current?.click()} disabled={isUploading}>
        {isUploading ? 'Uploading...' : 'Upload Image'}
      </Button>
      <Input
        role="hidden-input"
        className="fixed left-[-9999px] top-0"
        type="file"
        accept="image/*"
        onChange={onChange}
        ref={inputRef}
        multiple
      />
    </>
  )
}
