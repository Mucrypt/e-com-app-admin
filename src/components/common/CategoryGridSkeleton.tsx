import React from 'react'
import Skeleton from './Skeleton'
import CategoryCardSkeleton from './CategoryCardSkeleton'

interface CategoryGridSkeletonProps {
  itemCount?: number
}

const CategoryGridSkeleton: React.FC<CategoryGridSkeletonProps> = ({
  itemCount = 6,
}) => {
  return (
    <section className='py-16 bg-gray-50'>
      <div className='container mx-auto px-4'>
        {/* Header */}
        <div className='text-center mb-12'>
          <div className='space-y-4'>
            <Skeleton className='w-48 h-8 mx-auto' />
            <Skeleton className='w-96 h-5 mx-auto' />
          </div>
        </div>

        {/* Categories Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {[...Array(itemCount)].map((_, index) => (
            <CategoryCardSkeleton key={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default CategoryGridSkeleton
