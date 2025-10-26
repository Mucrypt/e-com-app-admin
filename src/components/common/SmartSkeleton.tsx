// src/components/common/SmartSkeleton.tsx
import { memo } from 'react'

interface SmartSkeletonProps {
  type: 'product' | 'category' | 'dashboard' | 'table'
  count?: number
}

const SkeletonVariants = {
  product: () => (
    <div className='animate-pulse space-y-4'>
      <div className='h-48 bg-gray-200 rounded-lg' />
      <div className='h-4 bg-gray-200 rounded w-3/4' />
      <div className='h-4 bg-gray-200 rounded w-1/2' />
    </div>
  ),
  category: () => (
    <div className='animate-pulse'>
      <div className='h-32 bg-gray-200 rounded-lg mb-4' />
      <div className='h-4 bg-gray-200 rounded' />
    </div>
  ),
  // Add more variants
}

export const SmartSkeleton = memo(({ type, count = 1 }: SmartSkeletonProps) => {
  const SkeletonComponent = SkeletonVariants[type]

  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <SkeletonComponent key={i} />
      ))}
    </>
  )
})

SmartSkeleton.displayName = 'SmartSkeleton'
