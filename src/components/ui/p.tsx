import React from 'react'

export function P({
  children,
  ...props
}: { children: React.ReactNode } & React.HTMLProps<HTMLParagraphElement>) {
  return (
    <p className="leading-7 [&:not(:first-child)]:mt-6" {...props}>
      {children}
    </p>
  )
}
