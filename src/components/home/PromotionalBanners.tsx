'use client'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import {
  ArrowRight,
  Truck,
  Shield,
  Headphones,
  Award,
  
  Star,
} from 'lucide-react'

interface Banner {
  id: string
  title: string
  subtitle?: string | null
  description?: string | null
  image_url?: string | null
  background_color?: string | null
  text_color?: string | null
  sort_order?: number | null
  is_active?: boolean | null
}

const defaultFeatures = [
  {
    icon: Truck,
    title: 'Free Express Shipping',
    description: 'Free delivery on orders over $99',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Shield,
    title: '3-Year Warranty',
    description: 'Comprehensive product protection',
    color: 'from-green-500 to-emerald-500',
  },
  {
    icon: Headphones,
    title: '24/7 Premium Support',
    description: 'Always here to help you',
    color: 'from-purple-500 to-violet-500',
  },
  {
    icon: Award,
    title: 'Premium Quality',
    description: 'Curated excellence guaranteed',
    color: 'from-orange-500 to-amber-500',
  },
]

const PromotionalBanners = () => {
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)
  const [, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch('/api/banners?limit=4&active=true')

        if (!response.ok) {
          throw new Error(`Failed to fetch banners: ${response.status}`)
        }

        const data = await response.json()
        setBanners(data || [])
      } catch (err: unknown) {
        console.error('❌ Error fetching banners:', err)
        const message =
          err instanceof Error ? err.message : 'Failed to load banners'
        setError(message)
        // Fallback to default banners on error
        setBanners(getDefaultBanners())
      } finally {
        setLoading(false)
      }
    }

    fetchBanners()
  }, [])

  const getDefaultBanners = (): Banner[] => [
    {
      id: '1',
      title: 'Summer Luxury Collection',
      subtitle: 'Discover Premium Designs',
      description: 'Transform your space with our handpicked luxury collection',
      image_url:
        'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=600&fit=crop',
      background_color: '#667eea',
      text_color: '#ffffff',
    },
    {
      id: '2',
      title: 'Flash Sale',
      subtitle: 'Limited Time Only',
      description: "Up to 70% off on premium items - Don't miss out!",
      image_url:
        'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1200&h=600&fit=crop',
      background_color: '#ff6b6b',
      text_color: '#ffffff',
    },
  ]

  const getBannerGradient = (banner: Banner) => {
    return (
      banner.background_color ||
      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    )
  }

  if (loading) {
    return (
      <section className='py-20 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50'>
        <div className='container mx-auto px-6'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20'>
            {[1, 2].map((i) => (
              <div
                key={i}
                className='aspect-[2/1] bg-gray-200 rounded-3xl animate-pulse'
              />
            ))}
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className='h-48 bg-gray-200 rounded-2xl animate-pulse'
              />
            ))}
          </div>
        </div>
      </section>
    )
  }

  const activeBanners = banners.length > 0 ? banners : getDefaultBanners()

  return (
    <section className='py-20 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 relative overflow-hidden'>
    

      <div className='container mx-auto px-6 relative z-10'>
        {/* Main Promotional Banners */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20'>
          {activeBanners.slice(0, 2).map((banner, index) => (
            <motion.div
              key={banner.id}
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                duration: 0.8,
                delay: index * 0.2,
                type: 'spring',
                stiffness: 100,
              }}
              whileHover={{ y: -10, scale: 1.02 }}
              className='group relative overflow-hidden rounded-3xl shadow-2xl hover:shadow-4xl transition-all duration-700 transform-gpu'
            >
              <div className='aspect-[2/1] relative'>
                {/* Background Image */}
                {banner.image_url && (
                  <Image
                    src={banner.image_url}
                    alt={banner.title}
                    fill
                    className='object-cover group-hover:scale-110 transition-transform duration-1000'
                    priority={index < 2}
                  />
                )}

                {/* Gradient Overlay */}
                <div
                  className='absolute inset-0 opacity-90'
                  style={{ background: getBannerGradient(banner) }}
                />

                {/* Content */}
                <div className='absolute inset-0 flex flex-col justify-center p-8 lg:p-12 text-left items-start'>
                  <motion.h3
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className='text-3xl md:text-5xl font-bold mb-4 text-white leading-tight'
                    style={{ color: banner.text_color || '#ffffff' }}
                  >
                    {banner.title}
                  </motion.h3>

                  {banner.subtitle && (
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className='text-xl md:text-2xl opacity-90 mb-2'
                      style={{ color: banner.text_color || '#ffffff' }}
                    >
                      {banner.subtitle}
                    </motion.p>
                  )}

                  {banner.description && (
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className='text-lg opacity-80 mb-8 max-w-md'
                      style={{ color: banner.text_color || '#ffffff' }}
                    >
                      {banner.description}
                    </motion.p>
                  )}

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <Link href='/products'>
                      <Button
                        size='lg'
                        className='  hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group/btn border-0'
                      >
                        Shop Now
                        <ArrowRight className='ml-2 h-5 w-5 group-hover/btn:translate-x-1 transition-transform duration-300' />
                      </Button>
                    </Link>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'
        >
          {defaultFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.05 }}
              className='group relative'
            >
              <div className='relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border border-white/50 overflow-hidden'>
                {/* Background Gradient */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                />

                {/* Icon */}
                <div
                  className={`relative inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className='h-8 w-8 text-white' />
                </div>

                {/* Content */}
                <h4 className='text-xl font-bold mb-3 text-gray-900 group-hover:text-gray-800 transition-colors'>
                  {feature.title}
                </h4>
                <p className='text-gray-600 group-hover:text-gray-700 transition-colors leading-relaxed'>
                  {feature.description}
                </p>

                {/* Decorative Element */}
                <div className='absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                  <Star className='w-5 h-5 text-yellow-400 fill-current' />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default PromotionalBanners
