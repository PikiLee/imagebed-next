import { randomUUID } from 'crypto'
import { cleanEnv, str } from 'envalid'

export function generateID() {
  return randomUUID()
}

export const prefix = `images/`

export function getImageKey(id: string) {
  return `${prefix}${id}`
}

export function getURLFromKey(key: string) {
  return `${
    process.env.NODE_ENV === 'production'
      ? cleanEnv(process.env, {
          DOMAIN: str(),
        }).DOMAIN
      : 'http://localhost:3000'
  }/${key}`
}
