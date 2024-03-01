import {
  DeleteObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

import { privateEnv } from './priavteEnv'

// Create an R2 client instance
const client = new S3Client({
  region: 'auto',
  endpoint: privateEnv.ENDPOINT,
  credentials: {
    accessKeyId: privateEnv.ACCESS_KEY_ID,
    secretAccessKey: privateEnv.SECRET_ACCESS_KEY,
  },
})

// Upload a file to R2 bucket
export function getUploadFileUrl(key: string): Promise<string> {
  return getSignedUrl(
    client,
    new PutObjectCommand({
      Bucket: privateEnv.BUCKET,
      Key: key,
    }),
    {
      expiresIn: 3600,
    }
  )
}

// Get a file from R2 bucket
export async function getFileUrl(key: string): Promise<string> {
  return getSignedUrl(
    client,
    new GetObjectCommand({ Bucket: privateEnv.BUCKET, Key: key }),
    {
      expiresIn: 3600,
    }
  )
}

export async function listFiles(prefix: string, continuationToken?: string) {
  return await client.send(
    new ListObjectsV2Command({
      Bucket: privateEnv.BUCKET,
      Prefix: prefix,
      MaxKeys: 6,
      ContinuationToken: continuationToken,
    })
  )
}

export async function deleteFile(key: string): Promise<void> {
  await client.send(
    new DeleteObjectCommand({ Bucket: privateEnv.BUCKET, Key: key })
  )
}
