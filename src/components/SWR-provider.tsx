'use client'
import { SWRConfig } from 'swr'
export const SWRProvider = ({
  children,
  value,
}: React.ComponentProps<typeof SWRConfig>) => {
  return <SWRConfig value={value}>{children}</SWRConfig>
}
