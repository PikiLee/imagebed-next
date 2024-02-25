import { randomUUID } from 'crypto'
import { isDev } from './isDev'
import { env } from './env'

export function generateID() {
  return randomUUID()
}

export const prefix = `images/`

export function getImageKey(id: string) {
  return `${prefix}${id}`
}

export function getURLFromKey(key: string) {
  return `${isDev ? 'http://localhost:3000' : env.DOMAIN}/${key}`
}
