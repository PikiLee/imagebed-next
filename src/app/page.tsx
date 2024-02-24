import { H2 } from '@/components/ui/h2'
import UploadButton from '@/components/upload-button/upload-button'

export default function Home() {
  return (
    <main className="container flex flex-col items-center justify-start gap-12 py-24">
      <H2>Upload Image</H2>
      <UploadButton />
    </main>
  )
}
