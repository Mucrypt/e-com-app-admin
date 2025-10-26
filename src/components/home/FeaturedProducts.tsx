'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { FaHeart, FaShoppingCart, FaStar, FaEye } from 'react-icons/fa'
import FeaturedProductsSkeleton from '@/components/common/FeaturedProductsSkeleton'

interface Product {
  id: string
  name: string
  price: number
  original_price?: number | null
  image_url?: string | null
  images?: string | string[] | null
  rating?: number | null
  review_count?: number | null
  is_on_sale?: boolean | null
  is_featured?: boolean | null
  brand?: string | null
  short_description?: string | null
  description?: string | null
  sku?: string | null
  stock_quantity?: number | null
  is_active?: boolean | null
}

interface FeaturedProductsProps {
  title?: string
  subtitle?: string
  limit?: number
}

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({
  title = 'Featured Products',
  subtitle = 'Discover our hand-picked favorites',
  limit = 8,
}) => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        setError(null)

        // console.log('🔍 Fetching featured products...')

        const response = await fetch(
          `/api/products?featured=true&limit=${limit}`
        )
        // console.log('📡 Response status:', response.status)

        if (!response.ok) {
          const errorText = await response.text()
          console.error('❌ API Error:', errorText)
          throw new Error(`Failed to fetch products: ${response.status}`)
        }

        const data = await response.json()
        // console.log('📦 API Response:', data)

        setProducts(data || [])
      } catch (err: unknown) {
        console.error('❌ Error fetching featured products:', err)
        const message =
          err instanceof Error
            ? err.message
            : 'Failed to load featured products'
        setError(message)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [limit])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price)
  }

  const getDiscountPercentage = (original: number, current: number) => {
    return Math.round(((original - current) / original) * 100)
  }

  const getProductImage = (product: Product): string => {
    // Primary: Use image_url
    if (product.image_url) {
      return product.image_url
    }

    // Secondary: Try to parse images field
    if (product.images) {
      if (typeof product.images === 'string') {
        try {
          const parsed = JSON.parse(product.images)
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed[0]
          }
        } catch {
          // If parsing fails, assume it's a direct URL
          return product.images
        }
      } else if (Array.isArray(product.images) && product.images.length > 0) {
        return product.images[0]
      }
    }

    // Fallback image
    return '/images/placeholder-product.jpg'
  }

  if (loading) {
    return <FeaturedProductsSkeleton itemCount={limit} />
  }

  if (error) {
    return (
      <section className='py-16 bg-white'>
        <div className='container mx-auto px-4'>
          <div className='text-center'>
            <h2 className='text-3xl font-bold text-gray-900 mb-4'>{title}</h2>
            <div className='bg-red-50 border border-red-200 rounded-lg p-4 max-w-md mx-auto'>
              <p className='text-red-600'>{error}</p>
              <button
                onClick={() => window.location.reload()}
                className='mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700'
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (products.length === 0) {
    return (
      <section className='py-16 bg-white'>
        <div className='container mx-auto px-4'>
          <div className='text-center'>
            <h2 className='text-3xl font-bold text-gray-900 mb-4'>{title}</h2>
            <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-md mx-auto'>
              <p className='text-yellow-800'>No featured products found</p>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className='py-16 bg-white'>
      <div className='container mx-auto px-4'>
        <div className='text-center mb-12'>
          <h2 className='text-3xl font-bold text-gray-900 mb-4'>{title}</h2>
          <p className='text-gray-600'>{subtitle}</p>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
          {products.map((product, index) => {
            const imageUrl = getProductImage(product)

            return (
              <div
                key={product.id}
                className='group relative bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200'
              >
                {/* Image Container - Fixed height and proper aspect ratio */}
                <div className='relative w-full h-64 bg-gray-50 overflow-hidden'>
                  <Image
                    src={imageUrl}
                    alt={product.name}
                    fill
                    className='object-cover transition-transform duration-300 group-hover:scale-105'
                    sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw'
                    priority={index < 4}
                    onError={(e) => {
                      console.error(
                        `Image failed to load for ${product.name}:`,
                        imageUrl
                      )
                      // Fallback to a placeholder or hide the image
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                    }}
                  />

                  {/* Sale Badge */}
                  {product.is_on_sale && product.original_price && (
                    <div className='absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-bold z-20'>
                      -
                      {getDiscountPercentage(
                        product.original_price,
                        product.price
                      )}
                      %
                    </div>
                  )}

                  {/* Featured Badge */}
                  {product.is_featured && (
                    <div className='absolute top-3 right-3 bg-blue-500 text-white px-2 py-1 rounded-md text-xs font-bold z-20'>
                      Featured
                    </div>
                  )}

                  {/* Hover Overlay */}
                  <div className='absolute inset-0 bg-black opacity-0 group-hover:opacity-30 transition-opacity duration-300 z-10'></div>

                  {/* Hover Actions */}
                  <div className='absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30'>
                    <div className='flex space-x-2'>
                      <button
                        className='bg-white text-gray-800 p-3 rounded-full hover:bg-gray-100 transition-colors shadow-lg'
                        onClick={() => {
                          // console.log('Quick view:', product.id)
                          // Add your quick view logic here
                        }}
                        title={`Quick view ${product.name}`}
                      >
                        <FaEye className='w-4 h-4' />
                      </button>
                      <button
                        className='bg-white text-red-600 p-3 rounded-full hover:bg-red-50 transition-colors shadow-lg'
                        onClick={() => {
                          // console.log('Add to wishlist:', product.id)
                          // Add your wishlist logic here
                        }}
                        title={`Add ${product.name} to wishlist`}
                      >
                        <FaHeart className='w-4 h-4' />
                      </button>
                      <button
                        className='bg-indigo-600 text-white p-3 rounded-full hover:bg-indigo-700 transition-colors shadow-lg'
                        onClick={() => {
                          // console.log('Add to cart:', product.id)
                          // Add your cart logic here
                        }}
                        title={`Add ${product.name} to cart`}
                      >
                        <FaShoppingCart className='w-4 h-4' />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Product Info */}
                <div className='p-4'>
                  <Link href={`/products/${product.id}`}>
                    <h3 className='font-semibold text-gray-900 mb-2 hover:text-indigo-600 transition-colors line-clamp-2'>
                      {product.name}
                    </h3>
                  </Link>

                  {product.rating && product.rating > 0 && (
                    <div className='flex items-center space-x-1 mb-2'>
                      <div className='flex items-center'>
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(product.rating || 0)
                                ? 'text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className='text-sm text-gray-500'>
                        ({product.review_count || 0})
                      </span>
                    </div>
                  )}

                  <div className='flex items-center space-x-2'>
                    <span className='text-lg font-bold text-gray-900'>
                      {formatPrice(product.price)}
                    </span>
                    {product.original_price && product.is_on_sale && (
                      <span className='text-sm text-gray-500 line-through'>
                        {formatPrice(product.original_price)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className='text-center mt-8'>
          <Link
            href='/products'
            className='inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors duration-300'
          >
            View All Products
          </Link>
        </div>
      </div>
    </section>
  )
}

export default FeaturedProducts
