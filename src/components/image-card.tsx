'use client'

import Image from 'next/image'
import Link from 'next/link'

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'

import { Button } from './ui/button'
import { useToast } from './ui/use-toast'

export default function ImageCard({
  url,
  onDelete,
}: {
  url: string
  onDelete: () => void
}) {
  const { toast } = useToast()

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
