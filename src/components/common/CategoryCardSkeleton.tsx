import React from 'react'
import Skeleton from './Skeleton'

const CategoryCardSkeleton: React.FC = () => {
  return (
    <div className='relative overflow-hidden rounded-xl shadow-lg group'>
      {/* Background Image Skeleton */}
      <Skeleton className='w-full h-48 md:h-64' />

      {/* Overlay Skeleton */}
      <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent'>
        <div className='absolute bottom-0 left-0 right-0 p-6'>
          {/* Category Name */}
          <Skeleton className='w-32 h-6 mb-2 bg-white/20' />
          {/* Product Count */}
          <Skeleton className='w-20 h-4 bg-white/15' />
        </div>
      </div>
    </div>
  )
}

export default CategoryCardSkeleton
