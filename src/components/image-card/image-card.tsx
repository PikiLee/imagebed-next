'use client'

import { Copy, Trash2 } from 'lucide-react'
import { ComponentProps } from 'react'

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

import { Button } from '../ui/button'
import { useToast } from '../ui/use-toast'

export default function ImageCard({
  url,
  onDelete,
  ...props
}: {
  url: string
  onDelete: (url: string) => void
} & ComponentProps<typeof Card>) {
  const { toast } = useToast()

  return (
    <Card {...props}>
      <CardHeader></CardHeader>
      <CardContent>
        <div className="relative">
          <img src={url} alt="Uploaded Image" width={1920} height={1080} />
          <div className="absolute top-4 right-4 flex gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => {
                      navigator.clipboard.writeText(url)
                      toast({
                        title: 'URL copied',
                      })
                    }}
                    aria-label="Copy URL"
                  >
                    <Copy size={16} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Copy URL</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => onDelete(url)}
                    variant="destructive"
                    aria-label="Delete"
                  >
                    <Trash2 size={16} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Delete Image</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  )
}
