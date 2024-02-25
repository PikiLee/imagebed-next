import { randomUUID } from 'crypto'

export function generateID() {
  return randomUUID()
}

// Add a prefix to the key to separate dev and prod files
const environmentPrefix = process.env.NODE_ENV === 'production' ? 'prod' : 'dev'
export const prefix = `${environmentPrefix}/images/`

export function getImageKey(id: string) {
  return `${prefix}${id}`
}
