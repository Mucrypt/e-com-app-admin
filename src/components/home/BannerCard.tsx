'use client'
import React from 'react'
import { Banner } from '@/types/banner.types'

interface BannerCardProps {
  banner: Banner
  onClick: (banner: Banner) => void
  className?: string
}

const BannerCard: React.FC<BannerCardProps> = ({ banner, onClick, className = '' }) => {
  const getBannerStyles = () => {
    const styles: React.CSSProperties = {}

    // If there's an image, use a subtle background
    if (banner.image_url) {
      styles.backgroundColor = banner.background_color || '#f8fafc'
    } else {
      // No image, create attractive gradients
      if (banner.gradient_from && banner.gradient_to) {
        styles.background = `linear-gradient(135deg, ${banner.gradient_from} 0%, ${banner.gradient_to} 100%)`
      } else if (banner.background_color) {
        // Create a sophisticated gradient from the background color
        const color = banner.background_color
        styles.background = `linear-gradient(135deg, ${color} 0%, ${color}dd 50%, ${color}aa 100%)`
      } else {
        // Default attractive gradient when no image
        styles.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }
    }

    if (banner.text_color) {
      styles.color = banner.text_color
    } else {
      // Better text color defaults
      styles.color = banner.image_url ? '#ffffff' : '#ffffff'
    }

    return styles
  }

  const getPositionClasses = () => {
    switch (banner.position) {
      case 'center':
        return 'text-center items-center justify-center'
      case 'right':
        return 'text-right items-end justify-end'
      case 'left':
      default:
        return 'text-left items-start justify-start'
    }
  }

  const getBannerTypeBadge = () => {
    if (!banner.banner_type) return null

    const badges = {
      flash_sale: { text: 'FLASH SALE', color: 'bg-red-500', animation: 'animate-pulse' },
      new_arrival: { text: 'NEW', color: 'bg-green-500', animation: 'animate-bounce' },
      seasonal: { text: 'SEASONAL', color: 'bg-blue-500', animation: '' },
      promotion: { text: 'PROMO', color: 'bg-purple-500', animation: '' },
      featured: { text: 'FEATURED', color: 'bg-yellow-500', animation: '' },
      limited: { text: 'LIMITED', color: 'bg-orange-500', animation: 'animate-pulse' },
    }

    const badge = badges[banner.banner_type]
    if (!badge) return null

    return (
      <span className={`inline-block px-3 py-1 text-xs font-bold text-white rounded-full ${badge.color} ${badge.animation}`}>
        {banner.meta_data?.badge || badge.text}
      </span>
    )
  }

  return (
    <div
      className={`relative overflow-hidden rounded-2xl shadow-lg cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.02] ${className}`}
      style={getBannerStyles()}
      onClick={() => onClick(banner)}
    >
      {/* Background Image */}
      {banner.image_url && (
        <div className="absolute inset-0">
          <img
            src={banner.mobile_image_url || banner.image_url}
            alt={banner.title}
            className="w-full h-full object-cover md:hidden"
            loading="lazy"
          />
          <img
            src={banner.image_url}
            alt={banner.title}
            className="w-full h-full object-cover hidden md:block"
            loading="lazy"
          />
          {/* Lighter overlay for better image visibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20"></div>
        </div>
      )}

      {/* Content */}
      <div className={`relative z-10 flex flex-col p-4 sm:p-6 md:p-8 h-full ${getPositionClasses()}`}>
        <div className="space-y-3 sm:space-y-4">
          {/* Badge */}
          {getBannerTypeBadge()}

          {/* Title */}
          <h3 className={`text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold leading-tight ${banner.image_url ? 'drop-shadow-lg' : ''}`}>
            {banner.title}
          </h3>

          {/* Subtitle */}
          {banner.subtitle && (
            <h4 className={`text-sm sm:text-base md:text-lg lg:text-xl font-medium opacity-90 ${banner.image_url ? 'drop-shadow-md' : ''}`}>
              {banner.subtitle}
            </h4>
          )}

          {/* Description */}
          {banner.description && (
            <p className={`text-xs sm:text-sm md:text-base lg:text-lg opacity-80 leading-relaxed line-clamp-2 ${banner.image_url ? 'drop-shadow-sm' : ''}`}>
              {banner.description}
            </p>
          )}

          {/* CTA Button */}
          {banner.cta_text && (
            <button className="inline-flex items-center px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 bg-white text-gray-900 font-semibold rounded-full hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg text-xs sm:text-sm md:text-base">
              {banner.cta_text}
              <svg className="ml-1.5 sm:ml-2 w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Priority indicator */}
      {banner.priority && banner.priority >= 9 && (
        <div className="absolute top-4 right-4 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
          HIGH PRIORITY
        </div>
      )}
    </div>
  )
}

export default BannerCard