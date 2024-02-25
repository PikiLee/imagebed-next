import { randomUUID } from 'crypto'

export function generateID() {
  return randomUUID()
}

export const prefix = `/images/`

export function getImageKey(id: string) {
  return `${prefix}${id}`
}
