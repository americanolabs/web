import { cn } from '@/lib/utils'
import React from 'react'

export default function Loading({
  className,
  text = "Loading..."
}: {
  className?: string;
  text?: string;
}) {
  return (
    <div className={cn(`fixed z-[100] inset-0 flex flex-col items-center justify-center backdrop-blur-sm w-screen h-screen`, className)}>
      <div className="relative flex items-center justify-center">
        <div className="loader"></div>
      </div>
      <p className="mt-6 text-lg font-semibold text-white animate-pulse">{text}</p>
    </div>
  )
}
