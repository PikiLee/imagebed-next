import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { cleanEnv, str } from 'envalid'

const env = cleanEnv(process.env, {
  ENDPOINT: str(),
  ACCESS_KEY_ID: str(),
  SECRET_ACCESS_KEY: str(),
  BUCKET: str(),
})

const client = new S3Client({
  region: 'auto',
  endpoint: env.ENDPOINT,
  credentials: {
    accessKeyId: env.ACCESS_KEY_ID,
    secretAccessKey: env.SECRET_ACCESS_KEY,
  },
})

export function uploadFile(key: string, file: Buffer) {
  return client.send(
    new PutObjectCommand({
      Bucket: env.BUCKET,
      Key: key,
      Body: file,
    })
  )
}
