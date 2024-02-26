'use client'

import Image from 'next/image'
import Link from 'next/link'

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'

import { Button } from './ui/button'
import { useToast } from './ui/use-toast'

export default function ImageCard({ url }: { url: string }) {
  const { toast } = useToast()

  async function onDelete() {
    const match = url.match(/images\/(?<id>.*)/)
    const id = match?.groups?.id
    if (id) {
      const res = await fetch(`/api/images`, {
        method: 'DELETE',
        body: JSON.stringify({ id }),
      })

      if (res.ok) {
        toast({
          title: 'Image deleted',
        })
      } else {
        toast({
          title: 'Failed to delete image',
        })
      }
    }
  }

  return (
    <Card>
      <CardHeader></CardHeader>
      <CardContent>
        <Image src={url} alt="image" width={1920} height={1080} />
      </CardContent>
      <CardFooter>
        <div className="flex flex-col gap-4">
          <Link href={url} target="_blank" className="break-all">
            {url}
          </Link>
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
          <Button onClick={onDelete}>Delete</Button>
        </div>
      </CardFooter>
    </Card>
  )
}
