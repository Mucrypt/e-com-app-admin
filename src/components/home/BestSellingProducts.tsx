'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { FaHeart, FaShoppingCart, FaStar, FaEye, FaCrown } from 'react-icons/fa'
import BestSellingProductsSkeleton from '@/components/common/BestSellingProductsSkeleton'

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

interface BestSellingProductsProps {
  title?: string
  subtitle?: string
  limit?: number
}

const BestSellingProducts: React.FC<BestSellingProductsProps> = ({
  title = 'Best Selling Products',
  subtitle = 'Most popular items among our customers',
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

        const response = await fetch(
          `/api/products?sortBy=bestselling&limit=${limit}`
        )

        if (!response.ok) {
          throw new Error(`Failed to fetch products: ${response.status}`)
        }

        const data = await response.json()
        setProducts(data || [])
      } catch (err: unknown) {
        console.error('❌ Error fetching best selling products:', err)
        const message =
          err instanceof Error
            ? err.message
            : 'Failed to load best selling products'
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

  const getProductImage = (product: Product): string | null => {
    // Helper function to check if URL is a placeholder
    const isPlaceholderUrl = (url: string): boolean => {
      const lowerUrl = url.toLowerCase()
      return (
        lowerUrl.includes('placeholder') ||
        lowerUrl.includes('via.placeholder.com') ||
        lowerUrl.includes('placehold') ||
        url.startsWith('data:')
      )
    }

    if (product.image_url && !isPlaceholderUrl(product.image_url)) {
      return product.image_url
    }

    if (product.images) {
      if (typeof product.images === 'string') {
        try {
          const parsed = JSON.parse(product.images)
          if (Array.isArray(parsed) && parsed.length > 0) {
            const firstImage = parsed[0]
            if (!isPlaceholderUrl(firstImage)) {
              return firstImage
            }
          }
        } catch (e) {
          console.error(
            `Error parsing images for ${product.name}:`,
            product.images,
            e
          )
          if (!isPlaceholderUrl(product.images)) {
            return product.images
          }
        }
      } else if (Array.isArray(product.images) && product.images.length > 0) {
        const firstImage = product.images[0]
        if (!isPlaceholderUrl(firstImage)) {
          return firstImage
        }
      }
    }

    return null
  }

  const handleQuickView = (e: React.MouseEvent, productId: string) => {
    e.preventDefault()
    e.stopPropagation()
    console.log('Quick view:', productId)
    // Add your quick view logic here
  }

  const handleAddToWishlist = (e: React.MouseEvent, productId: string) => {
    e.preventDefault()
    e.stopPropagation()
    console.log('Add to wishlist:', productId)
    // Add your wishlist logic here
  }

  const handleAddToCart = (e: React.MouseEvent, productId: string) => {
    e.preventDefault()
    e.stopPropagation()
    console.log('Add to cart:', productId)
    // Add your cart logic here
  }

  if (loading) {
    return <BestSellingProductsSkeleton itemCount={limit} />
  }

  if (error) {
    return (
      <section className='py-16 bg-gray-50'>
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
      <section className='py-16 bg-gray-50'>
        <div className='container mx-auto px-4'>
          <div className='text-center'>
            <h2 className='text-3xl font-bold text-gray-900 mb-4'>{title}</h2>
            <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-md mx-auto'>
              <p className='text-yellow-800'>No best selling products found</p>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className='py-16 bg-gray-50'>
      <div className='container mx-auto px-4'>
        <div className='text-center mb-12'>
          <h2 className='text-3xl font-bold text-gray-900 mb-4'>{title}</h2>
          <p className='text-gray-600'>{subtitle}</p>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
          {products.map((product, index) => {
            const imageUrl = getProductImage(product)

            return (
              <div key={product.id} className='group'>
                <Link
                  href={`/products/${product.id}`}
                  className='block bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 cursor-pointer'
                >
                  {/* Image Container */}
                  <div className='relative w-full h-64 bg-gray-50 overflow-hidden'>
                    {imageUrl ? (
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
                          const target = e.target as HTMLImageElement
                          target.style.display = 'none'
                        }}
                      />
                    ) : (
                      <div className='w-full h-full flex items-center justify-center bg-gray-100 text-gray-400'>
                        <div className='text-center'>
                          <div className='w-16 h-16 mx-auto mb-2 bg-gray-200 rounded-lg flex items-center justify-center'>
                            <svg
                              className='w-8 h-8 text-gray-400'
                              fill='none'
                              stroke='currentColor'
                              viewBox='0 0 24 24'
                            >
                              <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth={2}
                                d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
                              />
                            </svg>
                          </div>
                          <span className='text-sm'>No Image</span>
                        </div>
                      </div>
                    )}

                    {/* Best Seller Badge */}
                    <div className='absolute top-3 left-3 bg-orange-500 text-white px-2 py-1 rounded-md text-xs font-bold z-20 flex items-center space-x-1'>
                      <FaCrown className='w-3 h-3' />
                      <span>Best Seller</span>
                    </div>

                    {/* Sale Badge */}
                    {product.is_on_sale && product.original_price && (
                      <div className='absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-bold z-20'>
                        -
                        {getDiscountPercentage(
                          product.original_price,
                          product.price
                        )}
                        %
                      </div>
                    )}

                    {/* Hover Overlay */}
                    <div className='absolute inset-0 bg-black opacity-0 group-hover:opacity-30 transition-opacity duration-300 z-10'></div>

                    {/* Hover Actions */}
                    <div className='absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30'>
                      <div className='flex space-x-2'>
                        <button
                          className='bg-white text-gray-800 p-3 rounded-full hover:bg-gray-100 transition-colors shadow-lg'
                          onClick={(e) => handleQuickView(e, product.id)}
                          title={`Quick view ${product.name}`}
                        >
                          <FaEye className='w-4 h-4' />
                        </button>
                        <button
                          className='bg-white text-red-600 p-3 rounded-full hover:bg-red-50 transition-colors shadow-lg'
                          onClick={(e) => handleAddToWishlist(e, product.id)}
                          title={`Add ${product.name} to wishlist`}
                        >
                          <FaHeart className='w-4 h-4' />
                        </button>
                        <button
                          className='bg-indigo-600 text-white p-3 rounded-full hover:bg-indigo-700 transition-colors shadow-lg'
                          onClick={(e) => handleAddToCart(e, product.id)}
                          title={`Add ${product.name} to cart`}
                        >
                          <FaShoppingCart className='w-4 h-4' />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className='p-4'>
                    <h3 className='font-semibold text-gray-900 mb-2 hover:text-indigo-600 transition-colors line-clamp-2'>
                      {product.name}
                    </h3>

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
                </Link>
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

export default BestSellingProducts
