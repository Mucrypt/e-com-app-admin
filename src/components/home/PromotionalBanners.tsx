'use client'
import React, { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { ChevronLeftIcon, ChevronRightIcon, PlayIcon, PauseIcon, StarIcon, FireIcon, SparklesIcon } from '@heroicons/react/24/outline'
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'
import { Banner, PromotionalBannersProps } from '@/types/banner.types'
import BannerCard from './BannerCard'

const PromotionalBanners: React.FC<PromotionalBannersProps> = ({
  limit = 5,
  bannerTypes,
  className = '',
  showControls = true,
  autoPlay = true,
  interval = 5000,
  layout = 'carousel',
  showTitle = true,
  title = 'Special Offers',
  subtitle = 'Don\'t miss out on these amazing deals',
}) => {
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(autoPlay)
  const [impressionsTracked, setImpressionsTracked] = useState<Set<string>>(new Set())
  
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null)
  
  // Track when component becomes visible to track impressions
  const [containerRef, isVisible] = useIntersectionObserver({
    threshold: 0.5,
    rootMargin: '-50px 0px',
  })

  // Fetch banners from API
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setLoading(true)
        setError(null)

        const params = new URLSearchParams({
          limit: limit.toString(),
          active: 'true',
        })

        if (bannerTypes && bannerTypes.length > 0) {
          params.append('types', bannerTypes.join(','))
        }

        const response = await fetch(`/api/banners?${params}`)
        
        if (!response.ok) {
          throw new Error(`Failed to fetch banners: ${response.statusText}`)
        }

        const data = await response.json()
        setBanners(Array.isArray(data) ? data : [])
        
        console.log('🎌 Fetched promotional banners:', data.length)
      } catch (err) {
        console.error('❌ Error fetching promotional banners:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch banners')
      } finally {
        setLoading(false)
      }
    }

    fetchBanners()
  }, [limit, bannerTypes])

  // Track banner impressions when component becomes visible
  useEffect(() => {
    if (isVisible && banners.length > 0) {
      const untracked = banners.filter(banner => !impressionsTracked.has(banner.id))
      
      if (untracked.length > 0) {
        const trackImpressions = async () => {
          try {
            const bannerIds = untracked.map(banner => banner.id)
            
            await fetch('/api/banners/impressions', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ banner_ids: bannerIds }),
            })

            // Mark as tracked
            setImpressionsTracked(prev => {
              const newSet = new Set(prev)
              bannerIds.forEach(id => newSet.add(id))
              return newSet
            })

            console.log('📊 Tracked impressions for banners:', bannerIds)
          } catch (error) {
            console.error('❌ Error tracking banner impressions:', error)
          }
        }

        trackImpressions()
      }
    }
  }, [isVisible, banners, impressionsTracked])

  // Auto-play functionality
  useEffect(() => {
    if (isAutoPlaying && banners.length > 1) {
      autoPlayRef.current = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % banners.length)
      }, interval)

      return () => {
        if (autoPlayRef.current) {
          clearInterval(autoPlayRef.current)
        }
      }
    }
  }, [isAutoPlaying, banners.length, interval])

  // Handle banner click
  const handleBannerClick = async (banner: Banner) => {
    try {
      // Track click
      await fetch(`/api/banners/${banner.id}/click`, {
        method: 'POST',
      })

      console.log('🖱️ Tracked click for banner:', banner.title)

      // Navigate to CTA URL if available
      if (banner.cta_url) {
        window.open(banner.cta_url, '_self')
      }
    } catch (error) {
      console.error('❌ Error tracking banner click:', error)
      // Still navigate even if tracking fails
      if (banner.cta_url) {
        window.open(banner.cta_url, '_self')
      }
    }
  }

  // Navigation functions
  const goToPrevious = () => {
    setCurrentIndex(prev => (prev - 1 + banners.length) % banners.length)
    setIsAutoPlaying(false)
  }

  const goToNext = () => {
    setCurrentIndex(prev => (prev + 1) % banners.length)
    setIsAutoPlaying(false)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
    setIsAutoPlaying(false)
  }

  // Get banner styles with better image handling
  const getBannerStyles = (banner: Banner) => {
    const styles: React.CSSProperties = {}

    // Always apply a beautiful gradient base
    if (banner.gradient_from && banner.gradient_to) {
      styles.background = `linear-gradient(135deg, ${banner.gradient_from} 0%, ${banner.gradient_to} 100%)`
    } else if (banner.background_color) {
      // Create a sophisticated gradient from the background color
      const color = banner.background_color
      styles.background = `linear-gradient(135deg, ${color} 0%, ${color}dd 50%, ${color}99 100%)`
    } else {
      // Default modern gradient
      styles.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }

    if (banner.text_color) {
      styles.color = banner.text_color
    } else {
      styles.color = '#ffffff' // Ensure text is always visible
    }

    return styles
  }

  // Enhanced position classes - all banners will be centered for consistency but with different content alignment
  const getContentAlignment = (banner: Banner) => {
    // Always center the container, but align content based on banner position
    switch (banner.position) {
      case 'right':
        return 'items-center justify-end text-right'
      case 'left':
        return 'items-center justify-start text-left'
      case 'center':
      default:
        return 'items-center justify-center text-center'
    }
  }

  // Enhanced banner type badge with icons and modern styling
  const getBannerTypeBadge = (banner: Banner) => {
    if (!banner.banner_type) return null

    const badges = {
      flash_sale: { 
        text: 'FLASH SALE', 
        icon: FireIcon,
        gradient: 'from-red-500 to-orange-500', 
        animation: 'animate-pulse',
        glow: 'shadow-red-500/50'
      },
      new_arrival: { 
        text: 'NEW ARRIVAL', 
        icon: SparklesIcon,
        gradient: 'from-green-500 to-emerald-500', 
        animation: 'animate-bounce',
        glow: 'shadow-green-500/50'
      },
      seasonal: { 
        text: 'SEASONAL', 
        icon: StarIcon,
        gradient: 'from-blue-500 to-cyan-500', 
        animation: '',
        glow: 'shadow-blue-500/50'
      },
      promotion: { 
        text: 'SPECIAL OFFER', 
        icon: StarIcon,
        gradient: 'from-purple-500 to-pink-500', 
        animation: '',
        glow: 'shadow-purple-500/50'
      },
      featured: { 
        text: 'FEATURED', 
        icon: StarIcon,
        gradient: 'from-yellow-500 to-orange-500', 
        animation: '',
        glow: 'shadow-yellow-500/50'
      },
      limited: { 
        text: 'LIMITED TIME', 
        icon: FireIcon,
        gradient: 'from-orange-500 to-red-600', 
        animation: 'animate-pulse',
        glow: 'shadow-orange-500/50'
      },
    }

    const badge = badges[banner.banner_type]
    if (!badge) return null

    const IconComponent = badge.icon

    return (
      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${badge.gradient} text-white text-sm font-bold shadow-lg ${badge.glow} ${badge.animation} backdrop-blur-sm`}>
        <IconComponent className="w-4 h-4" />
        <span>{banner.meta_data?.badge || badge.text}</span>
      </div>
    )
  }

  // Loading state
  if (loading) {
    return (
      <div className={`relative overflow-hidden rounded-2xl ${className}`}>
        <div className="h-96 md:h-[500px] bg-gray-200 animate-pulse flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-64 h-8 bg-gray-300 rounded mx-auto"></div>
            <div className="w-96 h-6 bg-gray-300 rounded mx-auto"></div>
            <div className="w-32 h-10 bg-gray-300 rounded mx-auto"></div>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <p className="text-gray-600">Unable to load promotional banners</p>
        <p className="text-sm text-gray-400 mt-2">{error}</p>
      </div>
    )
  }

  // No banners state
  if (banners.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <p className="text-gray-600">No promotional banners available</p>
      </div>
    )
  }

  const currentBanner = banners[currentIndex]

  // Render grid layout
  const renderGridLayout = () => (
    <div className={`space-y-8 ${className}`}>
      {/* Section Header */}
      {showTitle && (
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">{title}</h2>
          {subtitle && (
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">{subtitle}</p>
          )}
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {banners.map((banner) => (
          <BannerCard
            key={banner.id}
            banner={banner}
            onClick={handleBannerClick}
            className="h-48 sm:h-56 md:h-64 lg:h-72"
          />
        ))}
      </div>
    </div>
  )

  // Render featured layout (large + small banners)
  const renderFeaturedLayout = () => {
    const [featured, ...others] = banners
    
    return (
      <div className={`space-y-8 ${className}`}>
        {/* Section Header */}
        {showTitle && (
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">{title}</h2>
            {subtitle && (
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">{subtitle}</p>
            )}
          </div>
        )}

        {/* Featured Banner */}
        {featured && (
          <BannerCard
            banner={featured}
            onClick={handleBannerClick}
            className="h-64 sm:h-80 md:h-96 lg:h-[400px]"
          />
        )}

        {/* Secondary Banners */}
        {others.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {others.map((banner) => (
              <BannerCard
                key={banner.id}
                banner={banner}
                onClick={handleBannerClick}
                className="h-40 sm:h-48 md:h-56 lg:h-64"
              />
            ))}
          </div>
        )}
      </div>
    )
  }

  // Handle different layouts
  if (layout === 'grid') {
    return (
      <div ref={containerRef}>
        {loading && (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <div className="w-64 h-8 bg-gray-300 rounded mx-auto animate-pulse"></div>
              <div className="w-96 h-6 bg-gray-300 rounded mx-auto animate-pulse"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="h-64 md:h-80 bg-gray-200 rounded-2xl animate-pulse"></div>
              ))}
            </div>
          </div>
        )}
        {error && (
          <div className="text-center py-12">
            <p className="text-gray-600">Unable to load promotional banners</p>
            <p className="text-sm text-gray-400 mt-2">{error}</p>
          </div>
        )}
        {!loading && !error && banners.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No promotional banners available</p>
          </div>
        )}
        {!loading && !error && banners.length > 0 && renderGridLayout()}
      </div>
    )
  }

  if (layout === 'featured') {
    return (
      <div ref={containerRef}>
        {loading && (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <div className="w-64 h-8 bg-gray-300 rounded mx-auto animate-pulse"></div>
              <div className="w-96 h-6 bg-gray-300 rounded mx-auto animate-pulse"></div>
            </div>
            <div className="h-96 md:h-[500px] bg-gray-200 rounded-2xl animate-pulse"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="h-48 md:h-64 bg-gray-200 rounded-2xl animate-pulse"></div>
              ))}
            </div>
          </div>
        )}
        {error && (
          <div className="text-center py-12">
            <p className="text-gray-600">Unable to load promotional banners</p>
            <p className="text-sm text-gray-400 mt-2">{error}</p>
          </div>
        )}
        {!loading && !error && banners.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No promotional banners available</p>
          </div>
        )}
        {!loading && !error && banners.length > 0 && renderFeaturedLayout()}
      </div>
    )
  }

  // Default carousel layout
  return (
    <div className={`space-y-8 ${className}`}>
      {/* Section Header */}
      {showTitle && (
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">{title}</h2>
          {subtitle && (
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">{subtitle}</p>
          )}
        </div>
      )}

      {/* Carousel Container */}
      <div ref={containerRef} className="relative overflow-hidden rounded-2xl shadow-2xl">
        {/* Loading State */}
        {loading && (
          <div className="h-64 sm:h-80 md:h-96 lg:h-[400px] xl:h-[450px] bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse flex items-center justify-center">
            <div className="text-center space-y-3 sm:space-y-4">
              <div className="w-48 sm:w-56 md:w-64 h-6 sm:h-7 md:h-8 bg-gray-300 rounded mx-auto animate-pulse"></div>
              <div className="w-64 sm:w-80 md:w-96 h-4 sm:h-5 md:h-6 bg-gray-300 rounded mx-auto animate-pulse"></div>
              <div className="w-24 sm:w-28 md:w-32 h-8 sm:h-9 md:h-10 bg-gray-300 rounded mx-auto animate-pulse"></div>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <p className="text-gray-600">Unable to load promotional banners</p>
            <p className="text-sm text-gray-400 mt-2">{error}</p>
          </div>
        )}

        {/* No Banners State */}
        {!loading && !error && banners.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No promotional banners available</p>
          </div>
        )}

        {/* Main Banner Carousel */}
        {!loading && !error && banners.length > 0 && (
          <>
            {/* Main Banner */}
            <div
              className="relative h-64 sm:h-80 md:h-96 lg:h-[400px] xl:h-[450px] flex transition-all duration-700 ease-in-out group"
              style={getBannerStyles(currentBanner)}
            >
              {/* Background Image with better handling */}
              {currentBanner.image_url && (
                <div className="absolute inset-0">
                  {/* Mobile Image */}
                  <img
                    src={currentBanner.mobile_image_url || currentBanner.image_url}
                    alt={currentBanner.title}
                    className="w-full h-full object-cover md:hidden"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                  {/* Desktop Image */}
                  <img
                    src={currentBanner.image_url}
                    alt={currentBanner.title}
                    className="w-full h-full object-cover hidden md:block"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                  {/* Sophisticated Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                </div>
              )}

              {/* Animated Background Elements */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-20 w-40 h-40 bg-white/5 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
                <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-white/5 rounded-full blur-2xl animate-bounce animation-delay-2000"></div>
              </div>

              {/* Content Container */}
              <div className={`relative z-20 flex flex-col p-4 sm:p-6 md:p-8 lg:p-12 xl:p-16 w-full ${getContentAlignment(currentBanner)}`}>
                <div className="max-w-2xl lg:max-w-3xl xl:max-w-4xl space-y-4 sm:space-y-6 md:space-y-8">
                  {/* Badge */}
                  <div className="transform -rotate-1 hover:rotate-0 transition-transform duration-300">
                    {getBannerTypeBadge(currentBanner)}
                  </div>

                  {/* Title with stunning typography */}
                  <div className="space-y-2 sm:space-y-3 md:space-y-4">
                    <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black leading-tight bg-gradient-to-r from-white to-white/90 bg-clip-text text-transparent drop-shadow-2xl">
                      {currentBanner.title}
                    </h3>
                    
                    {/* Subtitle */}
                    {currentBanner.subtitle && (
                      <h4 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white/95 drop-shadow-lg">
                        {currentBanner.subtitle}
                      </h4>
                    )}
                  </div>

                  {/* Description */}
                  {currentBanner.description && (
                    <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 leading-relaxed max-w-2xl lg:max-w-3xl drop-shadow-md line-clamp-2 md:line-clamp-3">
                      {currentBanner.description}
                    </p>
                  )}

                  {/* CTA Button - Amazon-style but more modern */}
                  {currentBanner.cta_text && currentBanner.cta_url && (
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6">
                      <button
                        onClick={() => handleBannerClick(currentBanner)}
                        className="group relative overflow-hidden px-6 sm:px-8 md:px-10 lg:px-12 py-3 sm:py-4 md:py-5 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold text-base sm:text-lg md:text-xl rounded-xl md:rounded-2xl hover:from-yellow-300 hover:to-orange-400 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-yellow-500/25"
                      >
                        <span className="relative z-10 flex items-center justify-center gap-2 sm:gap-3">
                          {currentBanner.cta_text}
                          <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </button>
                      
                      {/* Secondary action button */}
                      <button className="px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5 bg-white/10 backdrop-blur-md text-white font-semibold text-sm sm:text-base md:text-lg rounded-xl md:rounded-2xl border-2 border-white/20 hover:bg-white/20 hover:border-white/40 transition-all duration-300">
                        Learn More
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Enhanced Countdown Timer */}
              {currentBanner.meta_data?.countdown && currentBanner.end_date && (
                <div className="absolute top-8 right-8 bg-black/60 backdrop-blur-xl text-white px-6 py-4 rounded-2xl border border-white/20">
                  <div className="text-sm font-medium text-orange-300 mb-1">⏰ Limited Time</div>
                  <div className="text-2xl font-black text-white">
                    ENDS SOON!
                  </div>
                  <div className="text-xs text-white/70 mt-1">Don't miss out</div>
                </div>
              )}

              {/* Premium Quality Indicator */}
              {(currentBanner.priority && currentBanner.priority >= 9) && (
                <div className="absolute top-8 left-8 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg animate-pulse">
                  ⭐ PREMIUM
                </div>
              )}
            </div>

            {/* Modern Navigation Controls */}
            {showControls && banners.length > 1 && (
              <>
                {/* Previous/Next Buttons */}
                <button
                  onClick={goToPrevious}
                  className="absolute left-2 sm:left-4 md:left-6 top-1/2 transform -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-white/10 backdrop-blur-xl text-white rounded-xl md:rounded-2xl hover:bg-white/20 transition-all duration-300 border border-white/20 shadow-2xl hover:scale-110 group"
                  aria-label="Previous banner"
                >
                  <ChevronLeftIcon className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 mx-auto group-hover:-translate-x-1 transition-transform duration-300" />
                </button>

                <button
                  onClick={goToNext}
                  className="absolute right-2 sm:right-4 md:right-6 top-1/2 transform -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-white/10 backdrop-blur-xl text-white rounded-xl md:rounded-2xl hover:bg-white/20 transition-all duration-300 border border-white/20 shadow-2xl hover:scale-110 group"
                  aria-label="Next banner"
                >
                  <ChevronRightIcon className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 mx-auto group-hover:translate-x-1 transition-transform duration-300" />
                </button>

                {/* Premium Dots Indicator */}
                <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 sm:space-x-3 md:space-x-4 bg-black/20 backdrop-blur-xl px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-xl md:rounded-2xl border border-white/20">
                  {banners.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={`relative transition-all duration-300 ${
                        index === currentIndex
                          ? 'w-12 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full'
                          : 'w-4 h-4 bg-white/40 hover:bg-white/60 rounded-full hover:scale-125'
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    >
                      {index === currentIndex && (
                        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse"></div>
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* Auto-play Control */}
            {banners.length > 1 && (
              <button
                onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                className="absolute bottom-4 sm:bottom-6 md:bottom-8 right-4 sm:right-6 md:right-8 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-black/30 backdrop-blur-xl text-white rounded-xl md:rounded-2xl hover:bg-black/50 transition-all duration-300 border border-white/20 shadow-xl group"
                aria-label={isAutoPlaying ? 'Pause slideshow' : 'Resume slideshow'}
              >
                {isAutoPlaying ? (
                  <PauseIcon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 mx-auto group-hover:scale-110 transition-transform duration-300" />
                ) : (
                  <PlayIcon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 mx-auto group-hover:scale-110 transition-transform duration-300" />
                )}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default PromotionalBanners