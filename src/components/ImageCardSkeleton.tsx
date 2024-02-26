import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'

import { Skeleton } from './ui/skeleton'

export default function ImageCardSkeleton() {
  return (
    <Card>
      <CardHeader></CardHeader>
      <CardContent>
        <Skeleton className="aspect-video" />
      </CardContent>
      <CardFooter>
        <div className="flex flex-col gap-4 w-full">
          <div className="flex flex-col gap-2 w-full">
            <Skeleton className="h-4" />
            <Skeleton className="w-1/2 h-4" />
          </div>
          <Skeleton className="h-8" />
        </div>
      </CardFooter>
    </Card>
  )
}
