An user interface to upload images to the Cloudflare R2 and obtain the URLs for those images. 
+ Constructed using Next.js
+ The user interface is protected by a password.

## Getting Started

First, run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

### Set Environment Variables
```
# Generate your cloudflare R2 API key on https://dash.cloudflare.com/?to=/:account/r2/api-tokens
ENDPOINT=
ACCESS_KEY_ID=
SECRET_ACCESS_KEY=

# Your cloudflare R2 bucket name
BUCKET=

# A random string used to encrypt cookies and sessions
NEXTAUTH_SECRET=

# A password used to guard the user interface
PASSWORD=

# The domain name of your website
DOMAIN=
```