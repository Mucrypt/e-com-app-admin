'use client'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import {
  FaArrowLeft,
  FaEdit,
  FaTrash,
  FaBox,
  FaCalendarAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaBarcode,
  FaWarehouse,
  FaWeight,
  FaRuler,
  FaStar,
  FaImages,
  FaExpand,
  FaChevronLeft,
  FaChevronRight,
} from 'react-icons/fa'
import Image from 'next/image'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import ProductImageGallery from '@/components/common/ProductImageGallery'
import { getProductImages as parseProductImages } from '@/lib/image-utils'
import { motion } from 'framer-motion'

export default function ViewProductPage() {
  const router = useRouter()
  const params = useParams()

  type Product = {
    id: string
    name: string
    description?: string
    price: number
    cost_price?: number
    image_url?: string
    images?: string[] | string // Can be JSON string or array
    category_id?: string
    is_active: boolean
    created_at: string
    updated_at: string
    stock?: number
    sku?: string
    barcode?: string
    color?: string
    size?: string
    brand?: string
    weight?: number
    dimensions?: {
      length?: number
      width?: number
      height?: number
    }
    rating?: number
    review_count?: number
    meta_title?: string
    meta_description?: string
    seo_keywords?: string
    is_featured?: boolean
    is_on_sale?: boolean
    original_price?: number
    sale_starts_at?: string
    sale_ends_at?: string
  }

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showImageGallery, setShowImageGallery] = useState(false)

  // Get all product images including scraped images
  const getAllProductImages = (): string[] => {
    if (!product) return []
    return parseProductImages(product)
  }

  const productImages = getAllProductImages()
  const hasMultipleImages = productImages.length > 1

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/product/${params.id}`)
        if (!res.ok) throw new Error('Failed to fetch product')
        const data = await res.json()
        setProduct(data)
      } catch (err) {
        const error = err as Error
        setError(error.message || 'Error loading product')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchProduct()
    }
  }, [params.id])

  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <LoadingSpinner message='Loading product details...' />
      </div>
    )
  }

  if (error) {
    return (
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
          <div className='flex items-center'>
            <FaTimesCircle className='text-red-500 mr-3' />
            <div>
              <h3 className='text-sm font-medium text-red-800'>Error</h3>
              <p className='text-sm text-red-700 mt-1'>{error}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className='container mx-auto p-4 md:p-6 overflow-auto'>
        <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-4'>
          <div className='flex items-center'>
            <FaTimesCircle className='text-yellow-500 mr-3' />
            <div>
              <h3 className='text-sm font-medium text-yellow-800'>Not Found</h3>
              <p className='text-sm text-yellow-700 mt-1'>Product not found</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price)
  }

  return (
    <div className='space-y-6 p-6 overflow-y-auto max-h-[calc(100vh-200px)]'>
      <div className='flex items-center justify-between mb-8'>
        <button
          onClick={() => router.back()}
          className='flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200'
        >
          <FaArrowLeft className='mr-2' />
          <span className='font-medium'>Back to Products</span>
        </button>

        <div className='flex space-x-3'>
          <button
            onClick={() =>
              router.push(`/superadmin/content/product/${product.id}/edit`)
            }
            className='flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors'
          >
            <FaEdit className='text-sm' />
            <span>Edit Product</span>
          </button>
          <button
            onClick={() => {
              if (confirm('Are you sure you want to delete this product?')) {
                // Delete logic here
              }
            }}
            className='flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors'
          >
            <FaTrash className='text-sm' />
            <span>Delete</span>
          </button>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className='bg-white dark:bg-gray-800 shadow-xl rounded-lg overflow-hidden'
      >
        {/* Header Section */}
        <div className='px-8 py-6 border-b border-gray-200 dark:border-gray-700'>
          <div className='flex items-start justify-between'>
            <div className='flex-1'>
              <h1 className='text-3xl font-extrabold text-gray-900 dark:text-white'>
                {product.name}
              </h1>
              <div className='flex items-center mt-2 space-x-2'>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    product.is_active
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}
                >
                  {product.is_active ? (
                    <FaCheckCircle className='mr-1' />
                  ) : (
                    <FaTimesCircle className='mr-1' />
                  )}
                  {product.is_active ? 'Active' : 'Inactive'}
                </span>
                {product.is_featured && (
                  <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'>
                    Featured
                  </span>
                )}
                {product.is_on_sale && (
                  <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'>
                    On Sale
                  </span>
                )}
                {hasMultipleImages && (
                  <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'>
                    <FaImages className='mr-1' />
                    {productImages.length} Images
                  </span>
                )}
              </div>
            </div>

            {/* Image Preview Section */}
            <div className='ml-6'>
              {productImages.length > 0 ? (
                <div className='relative'>
                  <div className='relative h-32 w-32 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 group cursor-pointer'
                       onClick={() => setShowImageGallery(true)}>
                    <Image
                      src={productImages[0]}
                      alt={product.name}
                      fill
                      className='object-cover transition-transform duration-200 group-hover:scale-110'
                      sizes='128px'
                    />
                    {hasMultipleImages && (
                      <div className='absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center'>
                        <div className='opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-white'>
                          <FaExpand className='w-6 h-6' />
                        </div>
                      </div>
                    )}
                    {hasMultipleImages && (
                      <div className='absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded-full'>
                        +{productImages.length - 1}
                      </div>
                    )}
                  </div>
                  {hasMultipleImages && (
                    <button
                      onClick={() => setShowImageGallery(true)}
                      className='mt-2 w-full text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium'
                    >
                      View all {productImages.length} images
                    </button>
                  )}
                </div>
              ) : (
                <div className='h-32 w-32 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center bg-gray-50 dark:bg-gray-800'>
                  <FaImages className='w-8 h-8 text-gray-400' />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8 p-8'>
          {/* Basic Information */}
          <div className='md:col-span-2 space-y-6'>
            {/* Product Images Section */}
            {productImages.length > 0 && (
              <div>
                <h2 className='text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center'>
                  <FaImages className='mr-2' />
                  Product Images ({productImages.length})
                </h2>

                <div className='bg-gray-50 dark:bg-gray-700 rounded-lg p-6'>
                  {productImages.length === 1 ? (
                    <div className='relative w-full h-64 rounded-lg overflow-hidden'>
                      <Image
                        src={productImages[0]}
                        alt={product.name}
                        fill
                        className='object-cover'
                        sizes='(max-width: 768px) 100vw, 66vw'
                      />
                    </div>
                  ) : (
                    <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                      {productImages.slice(0, 8).map((image, index) => (
                        <div
                          key={index}
                          className='relative aspect-square rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600 group cursor-pointer'
                          onClick={() => setShowImageGallery(true)}
                        >
                          <Image
                            src={image}
                            alt={`${product.name} - Image ${index + 1}`}
                            fill
                            className='object-cover transition-transform duration-200 group-hover:scale-110'
                            sizes='200px'
                          />
                          <div className='absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center'>
                            <div className='opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-white'>
                              <FaExpand className='w-4 h-4' />
                            </div>
                          </div>
                          {index === 0 && (
                            <div className='absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full'>
                              Main
                            </div>
                          )}
                        </div>
                      ))}
                      {productImages.length > 8 && (
                        <div
                          className='relative aspect-square rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-600 flex items-center justify-center cursor-pointer group'
                          onClick={() => setShowImageGallery(true)}
                        >
                          <div className='text-center'>
                            <FaImages className='w-8 h-8 text-gray-400 dark:text-gray-300 mx-auto mb-2' />
                            <span className='text-sm font-medium text-gray-600 dark:text-gray-300'>
                              +{productImages.length - 8} more
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {productImages.length > 1 && (
                    <div className='mt-4 text-center'>
                      <button
                        onClick={() => setShowImageGallery(true)}
                        className='inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors'
                      >
                        <FaExpand className='mr-2' />
                        View All Images ({productImages.length})
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div>
              <h2 className='text-lg font-medium text-gray-900 dark:text-white mb-4'>
                Product Details
              </h2>

              <div className='bg-gray-50 dark:bg-gray-700 rounded-lg p-6'>
                <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                  <div>
                    <h3 className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                      Description
                    </h3>
                    <p className='mt-1 text-sm text-gray-900 dark:text-white'>
                      {product.description || 'No description provided'}
                    </p>
                  </div>

                  <div>
                    <h3 className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                      Category
                    </h3>
                    <p className='mt-1 text-sm text-gray-900 dark:text-white'>
                      {product.category_id ? (
                        <span className='inline-flex items-center'>
                          <FaBox className='mr-1' />
                          {/* You might want to fetch and display category name */}
                          {product.category_id}
                        </span>
                      ) : (
                        'No category assigned'
                      )}
                    </p>
                  </div>

                  <div>
                    <h3 className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                      Price
                    </h3>
                    <p className='mt-1 text-sm text-gray-900 dark:text-white'>
                      {formatPrice(product.price)}
                      {product.is_on_sale && product.original_price && (
                        <span className='ml-2 line-through text-gray-500 dark:text-gray-400'>
                          {formatPrice(product.original_price)}
                        </span>
                      )}
                    </p>
                  </div>

                  <div>
                    <h3 className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                      SKU
                    </h3>
                    <p className='mt-1 text-sm text-gray-900 dark:text-white flex items-center'>
                      <FaBarcode className='mr-1' />
                      {product.sku || 'Not set'}
                    </p>
                  </div>

                  <div>
                    <h3 className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                      Brand
                    </h3>
                    <p className='mt-1 text-sm text-gray-900 dark:text-white'>
                      {product.brand || 'Not set'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Inventory Information */}
            <div>
              <h2 className='text-lg font-medium text-gray-900 dark:text-white mb-4'>
                Inventory Details
              </h2>

              <div className='bg-gray-50 dark:bg-gray-700 rounded-lg p-6'>
                <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                  <div>
                    <h3 className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                      Stock Quantity
                    </h3>
                    <p className='mt-1 text-sm text-gray-900 dark:text-white flex items-center'>
                      <FaWarehouse className='mr-1' />
                      {product.stock !== undefined ? product.stock : 'Not set'}
                    </p>
                  </div>

                  <div>
                    <h3 className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                      Weight
                    </h3>
                    <p className='mt-1 text-sm text-gray-900 dark:text-white flex items-center'>
                      <FaWeight className='mr-1' />
                      {product.weight ? `${product.weight} kg` : 'Not set'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Ratings & Reviews */}
            {product.rating && (
              <div>
                <h2 className='text-lg font-medium text-gray-900 dark:text-white mb-4'>
                  Ratings & Reviews
                </h2>

                <div className='bg-gray-50 dark:bg-gray-700 rounded-lg p-6'>
                  <div className='flex items-center'>
                    <div className='flex items-center'>
                      <FaStar className='text-yellow-500 text-xl mr-1' />
                      <span className='text-xl font-bold text-gray-900 dark:text-white'>
                        {product.rating.toFixed(1)}
                      </span>
                    </div>
                    <div className='ml-4'>
                      <span className='text-sm text-gray-500 dark:text-gray-400'>
                        {product.review_count || 0} reviews
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SEO Information */}
            <div>
              <h2 className='text-lg font-medium text-gray-900 dark:text-white mb-4'>
                SEO Information
              </h2>

              <div className='bg-gray-50 dark:bg-gray-700 rounded-lg p-6'>
                <div className='space-y-4'>
                  <div>
                    <h3 className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                      Meta Title
                    </h3>
                    <p className='mt-1 text-sm text-gray-900 dark:text-white'>
                      {product.meta_title || 'Not set'}
                    </p>
                  </div>

                  <div>
                    <h3 className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                      Meta Description
                    </h3>
                    <p className='mt-1 text-sm text-gray-900 dark:text-white'>
                      {product.meta_description || 'Not set'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Metadata */}
          <div className='space-y-6'>
            <div>
              <h2 className='text-lg font-medium text-gray-900 dark:text-white mb-4'>
                System Information
              </h2>

              <div className='bg-gray-50 dark:bg-gray-700 rounded-lg p-6'>
                <div className='space-y-4'>
                  <div>
                    <h3 className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                      Product ID
                    </h3>
                    <p className='mt-1 text-sm text-gray-900 dark:text-white font-mono'>
                      {product.id}
                    </p>
                  </div>

                  <div>
                    <h3 className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                      Created
                    </h3>
                    <p className='mt-1 text-sm text-gray-900 dark:text-white flex items-center'>
                      <FaCalendarAlt className='mr-1' />
                      {new Date(product.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  <div>
                    <h3 className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                      Last Updated
                    </h3>
                    <p className='mt-1 text-sm text-gray-900 dark:text-white flex items-center'>
                      <FaCalendarAlt className='mr-1' />
                      {new Date(product.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sale Information */}
            {product.is_on_sale && (
              <div>
                <h2 className='text-lg font-medium text-gray-900 dark:text-white mb-4'>
                  Sale Information
                </h2>

                <div className='bg-gray-50 dark:bg-gray-700 rounded-lg p-6'>
                  <div className='space-y-4'>
                    <div>
                      <h3 className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                        Sale Starts
                      </h3>
                      <p className='mt-1 text-sm text-gray-900 dark:text-white flex items-center'>
                        <FaCalendarAlt className='mr-1' />
                        {product.sale_starts_at
                          ? new Date(
                              product.sale_starts_at
                            ).toLocaleDateString()
                          : 'Not set'}
                      </p>
                    </div>

                    <div>
                      <h3 className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                        Sale Ends
                      </h3>
                      <p className='mt-1 text-sm text-gray-900 dark:text-white flex items-center'>
                        <FaCalendarAlt className='mr-1' />
                        {product.sale_ends_at
                          ? new Date(product.sale_ends_at).toLocaleDateString()
                          : 'Not set'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div>
              <h2 className='text-lg font-medium text-gray-900 dark:text-white mb-4'>
                Quick Actions
              </h2>

              <div className='space-y-2'>
                <button
                  onClick={() =>
                    router.push(
                      `/superadmin/content/product/${product.id}/edit`
                    )
                  }
                  className='w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                >
                  <FaEdit className='mr-2' />
                  Edit Product
                </button>

                <button
                  onClick={() => {
                    if (
                      confirm('Are you sure you want to delete this product?')
                    ) {
                      // TODO: Implement delete functionality
                    }
                  }}
                  className='w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
                >
                  <FaTrash className='mr-2' />
                  Delete Product
                </button>

                <button
                  onClick={() => {
                    setProduct((prev) =>
                      prev ? { ...prev, is_active: !prev.is_active } : prev
                    )
                    // TODO: Implement status toggle API call
                  }}
                  className={`w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    product.is_active
                      ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                      : 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
                  }`}
                >
                  {product.is_active ? (
                    <FaTimesCircle className='mr-2' />
                  ) : (
                    <FaCheckCircle className='mr-2' />
                  )}
                  {product.is_active ? 'Deactivate' : 'Activate'}
                </button>

                <button
                  onClick={() => {
                    setProduct((prev) =>
                      prev ? { ...prev, is_featured: !prev.is_featured } : prev
                    )
                    // TODO: Implement featured toggle API call
                  }}
                  className={`w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    product.is_featured
                      ? 'bg-purple-600 hover:bg-purple-700 focus:ring-purple-500'
                      : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500'
                  }`}
                >
                  {product.is_featured ? (
                    <FaTimesCircle className='mr-2' />
                  ) : (
                    <FaCheckCircle className='mr-2' />
                  )}
                  {product.is_featured ? 'Remove Featured' : 'Mark as Featured'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Image Gallery Modal */}
      {showImageGallery && productImages.length > 0 && (
        <div className='fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4'>
          <div className='relative w-full max-w-6xl max-h-full'>
            <div className='bg-white dark:bg-gray-800 rounded-lg overflow-hidden'>
              <div className='flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700'>
                <h3 className='text-lg font-medium text-gray-900 dark:text-white'>
                  Product Images ({productImages.length})
                </h3>
                <button
                  onClick={() => setShowImageGallery(false)}
                  className='text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors'
                >
                  <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                  </svg>
                </button>
              </div>
              
              <div className='p-6'>
                <ProductImageGallery
                  images={productImages}
                  title={product.name}
                  maxHeight="70vh"
                  showThumbnails={true}
                  showImageCount={true}
                  autoPlay={false}
                  allowManipulation={false}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
