import React from 'react'
import Skeleton from './Skeleton'

const HeroSkeleton: React.FC = () => {
  return (
    <section className='relative bg-gradient-to-br from-indigo-50 via-white to-cyan-50 min-h-screen flex items-center overflow-hidden'>
      <div className='container mx-auto px-4 py-20'>
        <div className='grid lg:grid-cols-2 gap-12 items-center'>
          {/* Left Content */}
          <div className='space-y-8'>
            {/* Badge */}
            <div className='inline-flex'>
              <Skeleton className='w-40 h-8 rounded-full' />
            </div>

            {/* Main Heading */}
            <div className='space-y-4'>
              <Skeleton className='w-full h-12' />
              <Skeleton className='w-5/6 h-12' />
              <Skeleton className='w-4/6 h-12' />
            </div>

            {/* Description */}
            <div className='space-y-3'>
              <Skeleton className='w-full h-4' />
              <Skeleton className='w-5/6 h-4' />
              <Skeleton className='w-4/6 h-4' />
            </div>

            {/* CTA Buttons */}
            <div className='flex flex-col sm:flex-row gap-4'>
              <Skeleton className='w-40 h-12 rounded-lg' />
              <Skeleton className='w-32 h-12 rounded-lg' />
            </div>

            {/* Stats */}
            <div className='grid grid-cols-3 gap-6 pt-8 border-t border-gray-200'>
              {[...Array(3)].map((_, i) => (
                <div key={i} className='text-center space-y-2'>
                  <Skeleton className='w-16 h-8 mx-auto' />
                  <Skeleton className='w-20 h-4 mx-auto' />
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Hero Image */}
          <div className='relative'>
            <div className='relative z-10'>
              <Skeleton className='w-full h-96 rounded-2xl' />
            </div>

            {/* Floating Cards */}
            <div className='absolute -top-4 -left-4 w-24 h-32'>
              <Skeleton className='w-full h-full rounded-xl' />
            </div>
            <div className='absolute -bottom-4 -right-4 w-32 h-24'>
              <Skeleton className='w-full h-full rounded-xl' />
            </div>
          </div>
        </div>
      </div>

      {/* Background Elements */}
      <div className='absolute top-20 left-10 opacity-20'>
        <Skeleton className='w-20 h-20 rounded-full' />
      </div>
      <div className='absolute bottom-20 right-10 opacity-20'>
        <Skeleton className='w-16 h-16 rounded-full' />
      </div>
    </section>
  )
}

export default HeroSkeleton
