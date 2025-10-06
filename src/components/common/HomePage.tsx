// app/page.tsx
import React from 'react'

import CategoryGrid from '@/components/home/CategoryGrid'
import FeaturedProducts from '@/components/home/FeaturedProducts'
import PromotionalBanners from '@/components/home/PromotionalBanners'
import Testimonials from '@/components/home/Testimonials'
import BlogSection from '@/components/home/BlogSection'

import Newsletter from '@/components/home/Newsletter'

export default function HomePage() {
  return (
    <main className='min-h-screen bg-background'>
    
   
      <CategoryGrid />
      <FeaturedProducts />
      <PromotionalBanners />
      <Testimonials />
      <BlogSection />
      <Newsletter />
    </main>
  )
}
