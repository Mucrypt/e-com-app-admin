'use client'
import React, { useEffect, useState } from 'react'

import CategoryGrid from '@/components/home/CategoryGrid'
import FeaturedProducts from '@/components/home/FeaturedProducts'
import BestSellingProducts from '@/components/home/BestSellingProducts'
import Newsletter from '@/components/home/Newsletter'
import Testimonials from '@/components/home/Testimonials'
import PromotionalBanners from '@/components/home/PromotionalBanners'
import BlogSection from '@/components/home/BlogSection'

const HomePage: React.FC = () => {
  const [isInitialLoading, setIsInitialLoading] = useState(true)

  useEffect(() => {
    // Simulate initial page load time
    const timer = setTimeout(() => {
      setIsInitialLoading(false)
    }, 800) // Reduced time for better UX

    return () => clearTimeout(timer)
  }, [])

  // Show skeleton for initial page load (but without Hero in skeleton)
  if (isInitialLoading) {
    return (
      <div className='min-h-screen bg-white'>
        {/* Category Grid Section */}
        <section className='py-16 bg-gray-50'>
          <div className='container mx-auto px-4'>
            {/* Header */}
            <div className='text-center mb-12'>
              <div className='space-y-4'>
                <div className='w-48 h-8 mx-auto bg-gray-300 rounded animate-pulse'></div>
                <div className='w-96 h-5 mx-auto bg-gray-300 rounded animate-pulse'></div>
              </div>
            </div>
            {/* Categories Grid Skeleton */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {[...Array(6)].map((_, index) => (
                <div
                  key={index}
                  className='relative overflow-hidden rounded-xl shadow-lg'
                >
                  <div className='w-full h-48 md:h-64 bg-gray-300 animate-pulse'></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Other skeleton sections */}
        <section className='py-16 bg-white'>
          <div className='container mx-auto px-4'>
            <div className='text-center mb-12'>
              <div className='w-64 h-8 mx-auto bg-gray-300 rounded animate-pulse mb-4'></div>
              <div className='w-80 h-5 mx-auto bg-gray-300 rounded animate-pulse'></div>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
              {[...Array(8)].map((_, index) => (
                <div
                  key={index}
                  className='bg-white rounded-lg shadow-md overflow-hidden border border-gray-200'
                >
                  <div className='w-full h-64 bg-gray-300 animate-pulse'></div>
                  <div className='p-4 space-y-3'>
                    <div className='w-full h-4 bg-gray-300 rounded animate-pulse'></div>
                    <div className='w-3/4 h-4 bg-gray-300 rounded animate-pulse'></div>
                    <div className='w-16 h-6 bg-gray-300 rounded animate-pulse'></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className='bg-white'>
      {/* Category Grid Section */}
      <CategoryGrid />

      {/* Featured Products Section */}
      <FeaturedProducts limit={8} />

      {/* Promotional Banners Section */}
      <PromotionalBanners />

      {/* Best Selling Products Section */}
      <BestSellingProducts limit={8} />

      {/* Blog Section */}
      <BlogSection />

      {/* Testimonials Section */}
      <Testimonials />

      {/* Newsletter Section */}
      <Newsletter />
    </div>
  )
}

export default HomePage
