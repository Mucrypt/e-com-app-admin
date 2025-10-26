import React from 'react'
import Skeleton from './Skeleton'
import ProductCardSkeleton from './ProductCardSkeleton'

interface BestSellingProductsSkeletonProps {
  itemCount?: number
}

const BestSellingProductsSkeleton: React.FC<
  BestSellingProductsSkeletonProps
> = ({ itemCount = 8 }) => {
  return (
    <section className='py-16 bg-gray-50'>
      <div className='container mx-auto px-4'>
        {/* Header */}
        <div className='text-center mb-12'>
          <div className='space-y-4'>
            <Skeleton className='w-72 h-8 mx-auto' />
            <Skeleton className='w-96 h-5 mx-auto' />
          </div>
        </div>

        {/* Products Grid */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
          {[...Array(itemCount)].map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>

        {/* View All Button */}
        <div className='text-center mt-8'>
          <Skeleton className='w-40 h-12 mx-auto rounded-lg' />
        </div>
      </div>
    </section>
  )
}

export default BestSellingProductsSkeleton
