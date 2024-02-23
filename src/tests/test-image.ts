import fs from 'fs'
import path from 'path'

export const testImage = new File(
  [fs.readFileSync(path.join(__dirname, '../assets/test.jpg'))],
  'test.png',
  {
    type: 'image/jpg',
  }
)
