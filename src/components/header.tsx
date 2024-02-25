'use client'

import Link from 'next/link'
import { signOut } from 'next-auth/react'

import { Button } from './ui/button'
import { H1 } from './ui/h1'

export default function Header() {
  return (
    <header className="fixed top-0 left-0 flex items-center justify-between w-full h-16 px-8 bg-white">
      <H1>Image Bed Next</H1>
      <nav className="flex items-center gap-4">
        <Link href="/">Upload</Link>
        <Link href="/history">History</Link>
        <Button onClick={() => signOut()}>Sign Out</Button>
      </nav>
    </header>
  )
}
