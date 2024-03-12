import { unstable_serialize as infinite_unstable_serialize } from 'swr/infinite'

import History from '@/components/history'
import { SWRProvider } from '@/components/SWR-provider'
import { H2 } from '@/components/ui/h2'
import { listFiles } from '@/lib/file'
import { getKey } from '@/lib/getKey'
import { prefix } from '@/lib/key'

export const dynamic = 'force-dynamic'

export default async function HistoryPage() {
  const images = await listFiles(prefix)

  return (
    <main className="flex flex-col gap-12 items-center">
      <H2>History</H2>
      <SWRProvider
        value={{
          fallback: {
            [infinite_unstable_serialize(getKey)]: [images],
          },
        }}
      >
        <History />
      </SWRProvider>
    </main>
  )
}
