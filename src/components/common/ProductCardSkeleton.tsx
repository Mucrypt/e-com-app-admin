import React from 'react'
import Skeleton from './Skeleton'

const ProductCardSkeleton: React.FC = () => {
  return (
    <div className='bg-white rounded-lg shadow-md overflow-hidden border border-gray-200'>
      {/* Image Skeleton */}
      <div className='relative w-full h-64 bg-gray-100'>
        <Skeleton className='w-full h-full' />

        {/* Badge Skeletons */}
        <div className='absolute top-3 left-3'>
          <Skeleton className='w-12 h-5 rounded-md' />
        </div>
        <div className='absolute top-3 right-3'>
          <Skeleton className='w-16 h-5 rounded-md' />
        </div>
      </div>

      {/* Content Skeleton */}
      <div className='p-4 space-y-3'>
        {/* Product Name */}
        <div className='space-y-2'>
          <Skeleton className='w-full h-4' />
          <Skeleton className='w-3/4 h-4' />
        </div>

        {/* Rating */}
        <div className='flex items-center space-x-2'>
          <div className='flex space-x-1'>
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className='w-4 h-4' variant='circular' />
            ))}
          </div>
          <Skeleton className='w-12 h-3' />
        </div>

        {/* Price */}
        <div className='flex items-center space-x-2'>
          <Skeleton className='w-16 h-6' />
          <Skeleton className='w-12 h-4' />
        </div>
      </div>
    </div>
  )
}

export default ProductCardSkeleton
