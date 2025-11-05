'use client'

import React from 'react'
import PromotionalBanners from '@/components/home/PromotionalBanners'

interface CategoryBannersProps {
  currentCategory?: {
    id: string
    name: string
    slug: string
  } | null
}

export default function CategoryBanners({ currentCategory }: CategoryBannersProps) {
  return (
    <div className="category-banners-container">
      {/* Main Featured Banner Section for Category Page Top */}
      <div className='mb-8'>
        <PromotionalBanners 
          layout="featured"
          limit={5}
          autoPlay={true}
          interval={10000}
          showTitle={false}
          showControls={true}
          placement="category_page_top"
          className="category-page-banners bg-white rounded-lg shadow-sm"
        />
      </div>

      {/* Secondary Grid Banners for Category Page Inline - Only show when we have a specific category */}
      {currentCategory && (
        <div className='mb-6'>
          <PromotionalBanners 
            layout="grid"
            limit={6}
            autoPlay={false}
            showTitle={false}
            showControls={false}
            placement="category_page_inline"
            className="category-specific-banners bg-white rounded-lg shadow-sm p-6"
          />
        </div>
      )}
    </div>
  )
}