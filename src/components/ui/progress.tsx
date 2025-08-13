'use client'

import { cn } from '@/lib/utils'

interface ProgressProps {
  value: number
  max?: number
  className?: string
}

export function Progress({ value, max = 100, className }: ProgressProps) {
  const percentage = Math.min((value / max) * 100, 100)
  return (
    <div
      className={cn(
        'h-2 w-full bg-gray-200 rounded-full overflow-hidden',
        className
      )}
    >
      <div
        className={cn(
          'h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full',
          percentage >= 100
            ? 'w-full'
            : percentage >= 75
            ? 'w-3/4'
            : percentage >= 50
            ? 'w-1/2'
            : percentage >= 25
            ? 'w-1/4'
            : 'w-0'
        )}
      />
    </div>
  )
}
