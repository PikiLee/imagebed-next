export function generateID() {
  const characters =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let id = ''
  for (let i = 0; i < 10; i++) {
    id += characters.charAt(Math.floor(Math.random() * characters.length))
  }

  return id
}

// Add a prefix to the key to separate dev and prod files
const environmentPrefix = process.env.NODE_ENV === 'production' ? 'prod' : 'dev'
function addEnvironmentPrefix(key: string) {
  return `${environmentPrefix}/${key}`
}

export function getImageKey(id: string) {
  return addEnvironmentPrefix(`images/${id}`)
}
