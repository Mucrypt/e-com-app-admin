import React from 'react'
import HeroSkeleton from './HeroSkeleton'
import CategoryGridSkeleton from './CategoryGridSkeleton'
import FeaturedProductsSkeleton from './FeaturedProductsSkeleton'
import BestSellingProductsSkeleton from './BestSellingProductsSkeleton'
import Skeleton from './Skeleton'

const HomePageSkeleton: React.FC = () => {
  return (
    <div className='min-h-screen bg-white'>
      {/* Hero Section */}
      <HeroSkeleton />

      {/* Category Grid Section */}
      <CategoryGridSkeleton itemCount={6} />

      {/* Featured Products Section */}
      <FeaturedProductsSkeleton itemCount={8} />

      {/* Promotional Banner Skeleton */}
      <section className='py-16 bg-gradient-to-r from-indigo-600 to-purple-600'>
        <div className='container mx-auto px-4'>
          <div className='text-center space-y-6'>
            <Skeleton className='w-80 h-10 mx-auto bg-white/20' />
            <Skeleton className='w-96 h-6 mx-auto bg-white/15' />
            <div className='flex justify-center gap-4'>
              <Skeleton className='w-32 h-12 rounded-lg bg-white/20' />
              <Skeleton className='w-28 h-12 rounded-lg bg-white/15' />
            </div>
          </div>
        </div>
      </section>

      {/* Best Selling Products Section */}
      <BestSellingProductsSkeleton itemCount={8} />

      {/* Newsletter Section Skeleton */}
      <section className='py-16 bg-gray-900'>
        <div className='container mx-auto px-4'>
          <div className='max-w-2xl mx-auto text-center space-y-6'>
            <Skeleton className='w-64 h-8 mx-auto bg-white/20' />
            <Skeleton className='w-80 h-5 mx-auto bg-white/15' />
            <div className='flex max-w-md mx-auto gap-3'>
              <Skeleton className='flex-1 h-12 rounded-lg bg-white/10' />
              <Skeleton className='w-24 h-12 rounded-lg bg-white/20' />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section Skeleton */}
      <section className='py-16 bg-white'>
        <div className='container mx-auto px-4'>
          <div className='text-center mb-12'>
            <Skeleton className='w-64 h-8 mx-auto mb-4' />
            <Skeleton className='w-80 h-5 mx-auto' />
          </div>

          <div className='grid md:grid-cols-3 gap-8'>
            {[...Array(3)].map((_, index) => (
              <div key={index} className='bg-gray-50 rounded-xl p-6 space-y-4'>
                <div className='flex space-x-1'>
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className='w-5 h-5' variant='circular' />
                  ))}
                </div>
                <div className='space-y-3'>
                  <Skeleton className='w-full h-4' />
                  <Skeleton className='w-5/6 h-4' />
                  <Skeleton className='w-4/6 h-4' />
                </div>
                <div className='flex items-center space-x-3 pt-4'>
                  <Skeleton className='w-12 h-12' variant='circular' />
                  <div className='space-y-2'>
                    <Skeleton className='w-24 h-4' />
                    <Skeleton className='w-16 h-3' />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePageSkeleton
