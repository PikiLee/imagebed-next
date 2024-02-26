import { randomUUID } from 'crypto'

import { isDev } from './isDev'
import { publicEnv } from './publicEnv'

export function generateID() {
  // reversed timestamp is used to sort images descending by creation date
  const futureDate = new Date('9999-12-31T23:59:59.999Z').getTime()
  const now = Date.now()
  const reversedTimestamp = futureDate - now

  return `${reversedTimestamp}-${randomUUID()}`
}

export const prefix = `images/`

export function getImageKey(id: string) {
  return `${prefix}${id}`
}

export function getURLFromKey(key: string) {
  return `${isDev ? 'http://localhost:3000' : publicEnv.NEXT_PUBLIC_DOMAIN}/${key}`
}
