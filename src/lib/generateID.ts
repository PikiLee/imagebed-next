export function generateID() {
  const characters =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let key = ''
  for (let i = 0; i < 10; i++) {
    key += characters.charAt(Math.floor(Math.random() * characters.length))
  }

  return key
}
