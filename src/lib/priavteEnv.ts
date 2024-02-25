import { cleanEnv, str } from 'envalid'

export const privateEnv = cleanEnv(process.env, {
  ENDPOINT: str(),
  ACCESS_KEY_ID: str(),
  SECRET_ACCESS_KEY: str(),
  BUCKET: str(),
  NEXTAUTH_SECRET: str(),
  PASSWORD: str(),
})
