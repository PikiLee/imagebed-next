import {
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'
import { cleanEnv, str } from 'envalid'
import { Readable } from 'stream'

// Validate and retrieve environment variables
const env = cleanEnv(process.env, {
  ENDPOINT: str(),
  ACCESS_KEY_ID: str(),
  SECRET_ACCESS_KEY: str(),
  BUCKET: str(),
})

// Create an R2 client instance
const client = new S3Client({
  region: 'auto',
  endpoint: env.ENDPOINT,
  credentials: {
    accessKeyId: env.ACCESS_KEY_ID,
    secretAccessKey: env.SECRET_ACCESS_KEY,
  },
})

// Upload a file to R2 bucket
export function uploadFile(key: string, file: Buffer) {
  return client.send(
    new PutObjectCommand({
      Bucket: env.BUCKET,
      Key: key,
      Body: file,
    })
  )
}

// Get a file from R2 bucket
export async function getFile(key: string): Promise<Buffer> {
  const res = await client.send(
    new GetObjectCommand({ Bucket: env.BUCKET, Key: key })
  )
  if (!res.Body) throw new Error('No body in response')
  return Buffer.from(await streamToBuffer(res.Body as Readable))
}

export async function listFiles(prefix: string, continuationToken?: string) {
  return await client.send(
    new ListObjectsV2Command({
      Bucket: env.BUCKET,
      Prefix: prefix,
      MaxKeys: 2,
      ContinuationToken: continuationToken,
    })
  )
}

// Convert a readable stream to a buffer
async function streamToBuffer(stream: Readable) {
  const chunks = []
  for await (let chunk of stream) {
    chunks.push(chunk)
  }
  return Buffer.concat(chunks)
}
