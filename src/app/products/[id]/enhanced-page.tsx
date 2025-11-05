'use client'
import React, { useState, useEffect } from 'react'
import { useParams, notFound } from 'next/navigation'
import Link from 'next/link'
import {
  FaHeart,
  FaShoppingCart,
  FaStar,
  FaShare,
  FaTruck,
  FaShieldAlt,
  FaSync,
  FaCheck,
  FaPlus,
  FaMinus,
  FaFacebook,
  FaTwitter,
  FaPinterest,
  FaWhatsapp,
  FaRegHeart,
} from 'react-icons/fa'
import { useAuth } from '@/hooks/useAuth'
import { useUserRole } from '@/hooks/useUserRole'
import ProductImageGallery from '@/components/common/ProductImageGallery'
import { getProductImages as parseProductImages } from '@/lib/image-utils'

interface Product {
  id: string
  name: string
  price: number
  original_price?: number
  description?: string
  short_description?: string
  image_url?: string
  images?: string[] | string // Can be JSON string or array
  category_id: string
  stock_quantity: number
  is_active: boolean
  is_featured: boolean
  rating?: number
  review_count?: number
  brand?: string
  sku?: string
  weight?: number
  dimensions?: string
  categories?: {
    id: string
    name: string
    slug: string
    color?: string
  }
}

interface Review {
  id: string
  user_name: string
  rating: number
  comment: string
  created_at: string
  verified: boolean
}

const mockReviews: Review[] = [
  {
    id: '1',
    user_name: 'Sarah Johnson',
    rating: 5,
    comment: 'Absolutely love this product! The quality exceeded my expectations and delivery was super fast.',
    created_at: '2024-01-15',
    verified: true,
  },
  {
    id: '2',
    user_name: 'Mike Chen',
    rating: 4,
    comment: 'Great product overall. Good value for money and works perfectly as described.',
    created_at: '2024-01-10',
    verified: true,
  },
  {
    id: '3',
    user_name: 'Emily Davis',
    rating: 5,
    comment: 'This is my second purchase. The product is reliable and the customer service is excellent!',
    created_at: '2024-01-05',
    verified: true,
  },
]

const EnhancedProductDetailsPage: React.FC = () => {
  const params = useParams()
  const productId = params.id as string
  const { user } = useAuth()
  const { hasAdminAccess } = useUserRole()

  // State variables
  const [product, setProduct] = useState<Product | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState('description')
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [isWishlistLoading, setIsWishlistLoading] = useState(false)

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/product/${productId}`)
        if (!response.ok) throw new Error('Product not found')

        const data = await response.json()
        setProduct(data.product)
        setReviews(mockReviews) // In real app, fetch from API
      } catch (err) {
        console.error(err)
        setError('Product not found')
      } finally {
        setLoading(false)
      }
    }

    if (productId) {
      fetchProduct()
    }
  }, [productId])

  // Check wishlist status
  useEffect(() => {
    if (user && product) {
      checkWishlistStatus()
    }
  }, [user, product])

  const checkWishlistStatus = async () => {
    try {
      const response = await fetch('/api/wishlist')
      if (response.ok) {
        const data = await response.json()
        const isInList = data.items.some((item: any) => item.product_id === productId)
        setIsWishlisted(isInList)
      }
    } catch (error) {
      console.error('Error checking wishlist status:', error)
    }
  }

  const handleWishlistToggle = async () => {
    if (!user) {
      alert('Please login to add items to wishlist')
      return
    }

    setIsWishlistLoading(true)
    try {
      const method = isWishlisted ? 'DELETE' : 'POST'
      const response = await fetch('/api/wishlist', {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ product_id: productId }),
      })

      if (response.ok) {
        setIsWishlisted(!isWishlisted)
      } else {
        throw new Error('Failed to update wishlist')
      }
    } catch (error) {
      console.error('Error updating wishlist:', error)
      alert('Failed to update wishlist')
    } finally {
      setIsWishlistLoading(false)
    }
  }

  const getProductImages = (): string[] => {
    if (!product) return ['/images/placeholder-product.jpg']
    return parseProductImages(product)
  }

  // Image manipulation handlers for admin users
  const handleImageReorder = async (newOrder: string[]) => {
    if (!product || !hasAdminAccess) return

    try {
      const response = await fetch(`/api/product/${product.id}/images`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'reorder',
          images: newOrder,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setProduct(data.product)
      }
    } catch (error) {
      console.error('Error reordering images:', error)
      alert('Failed to reorder images')
    }
  }

  const handleSetMainImage = async (imageIndex: number) => {
    if (!product || !hasAdminAccess) return

    try {
      const response = await fetch(`/api/product/${product.id}/images`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'setMain',
          mainImageIndex: imageIndex,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setProduct(data.product)
      }
    } catch (error) {
      console.error('Error setting main image:', error)
      alert('Failed to set main image')
    }
  }

  const handleDeleteImage = async (imageIndex: number) => {
    if (!product || !hasAdminAccess) return

    if (confirm('Are you sure you want to delete this image?')) {
      try {
        const response = await fetch(`/api/product/${product.id}/images`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'delete',
            imageIndex,
          }),
        })

        if (response.ok) {
          const data = await response.json()
          setProduct(data.product)
        }
      } catch (error) {
        console.error('Error deleting image:', error)
        alert('Failed to delete image')
      }
    }
  }

  const handleAddImages = async (files: FileList) => {
    if (!product || !hasAdminAccess) return

    const formData = new FormData()
    for (let i = 0; i < files.length; i++) {
      formData.append('images', files[i])
    }

    try {
      const response = await fetch(`/api/product/${product.id}/images`, {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        setProduct(data.product)
        alert('Images uploaded successfully!')
      }
    } catch (error) {
      console.error('Error uploading images:', error)
      alert('Failed to upload images')
    }
  }

  const handleAddToCart = () => {
    // Implement cart functionality
    alert(`Added ${quantity} item(s) to cart`)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.name,
          text: product?.description,
          url: window.location.href,
        })
      } catch (error) {
        console.error('Error sharing:', error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert('Product link copied to clipboard!')
    }
  }

  const productImages = getProductImages()
  const hasDiscount = !!product && typeof product.original_price === 'number' && product.original_price > product.price
  const discountPercentage = hasDiscount
    ? Math.round(((product.original_price! - product.price) / product.original_price!) * 100)
    : 0

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100'>
        <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600'></div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100'>
        <div className='text-center'>
          <h2 className='text-2xl font-bold text-gray-900 mb-4'>Product Not Found</h2>
          <Link
            href='/products'
            className='bg-indigo-600 text-white px-6 py-3 rounded-2xl hover:bg-indigo-700 transition-colors'
          >
            Back to Products
          </Link>
        </div>
      </div>
    )
  }

  const averageRating = product.rating || 4.5
  const reviewCount = product.review_count || reviews.length

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100'>
      {/* Navigation */}
      <nav className='bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50'>
        <div className='container mx-auto px-4 py-4'>
          <div className='flex items-center justify-between'>
            <Link
              href='/products'
              className='text-gray-600 hover:text-indigo-600 transition-colors'
            >
              ← Back to Products
            </Link>
            <div className='flex items-center space-x-4'>
              <button
                onClick={handleShare}
                title='Share product'
                aria-label='Share product'
                className='p-2 text-gray-600 hover:text-indigo-600 transition-colors'
              >
                <FaShare className='w-5 h-5' />
              </button>
              <button
                onClick={handleWishlistToggle}
                disabled={isWishlistLoading}
                className={`p-2 transition-colors ${
                  isWishlisted
                    ? 'text-red-500'
                    : 'text-gray-600 hover:text-red-500'
                } ${isWishlistLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isWishlisted ? (
                  <FaHeart className='w-5 h-5' />
                ) : (
                  <FaRegHeart className='w-5 h-5' />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className='container mx-auto px-4 py-8'>
        {/* Product Main Section */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16'>
          {/* Enhanced Product Images Gallery */}
          <div className='space-y-6'>
            <ProductImageGallery
              images={productImages}
              title={product.name}
              onImageReorder={hasAdminAccess ? handleImageReorder : undefined}
              onSetMainImage={hasAdminAccess ? handleSetMainImage : undefined}
              onDeleteImage={hasAdminAccess ? handleDeleteImage : undefined}
              onAddImages={hasAdminAccess ? handleAddImages : undefined}
              allowManipulation={hasAdminAccess}
              maxHeight="600px"
              showThumbnails={true}
              showImageCount={true}
              autoPlay={false}
            />
            
            {/* Admin Mode Indicator */}
            {hasAdminAccess && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-center space-x-2 text-blue-700">
                  <FaShieldAlt className="w-4 h-4" />
                  <span className="font-medium text-sm">
                    🔧 Admin Mode: You can manipulate images - drag to reorder, set main image, delete images, or add new ones.
                  </span>
                </div>
              </div>
            )}

            {/* Discount Badge */}
            {hasDiscount && (
              <div className="bg-gradient-to-r from-red-500 to-pink-600 text-white p-4 rounded-xl text-center">
                <div className="text-2xl font-bold">🎉 {discountPercentage}% OFF</div>
                <div className="text-sm opacity-90">Limited time offer!</div>
              </div>
            )}
          </div>

          {/* Product Information */}
          <div className='space-y-8'>
            {/* Product Header */}
            <div className='bg-white rounded-3xl shadow-xl p-8'>
              <div className='space-y-6'>
                {/* Product Title and Category */}
                <div>
                  {product.categories && (
                    <div className='mb-3'>
                      <span 
                        className='inline-block px-4 py-2 rounded-full text-sm font-medium text-white'
                        style={{ backgroundColor: product.categories.color || '#6366f1' }}
                      >
                        {product.categories.name}
                      </span>
                    </div>
                  )}
                  <h1 className='text-4xl font-bold text-gray-900 mb-2'>{product.name}</h1>
                  {product.brand && (
                    <p className='text-lg text-gray-600'>by {product.brand}</p>
                  )}
                </div>

                {/* Rating and Reviews */}
                <div className='flex items-center space-x-4'>
                  <div className='flex items-center space-x-1'>
                    {[...Array(5)].map((_, index) => (
                      <FaStar
                        key={index}
                        className={`w-5 h-5 ${
                          index < Math.floor(averageRating)
                            ? 'text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className='text-lg font-semibold text-gray-900 ml-2'>
                      {averageRating.toFixed(1)}
                    </span>
                  </div>
                  <span className='text-gray-600'>({reviewCount} reviews)</span>
                  {product.is_featured && (
                    <span className='bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-3 py-1 rounded-full text-sm font-bold'>
                      ⭐ Featured
                    </span>
                  )}
                </div>

                {/* Price */}
                <div className='flex items-baseline space-x-4'>
                  <span className='text-5xl font-bold text-indigo-600'>
                    ${product.price.toFixed(2)}
                  </span>
                  {hasDiscount && (
                    <span className='text-2xl text-gray-500 line-through'>
                      ${product.original_price!.toFixed(2)}
                    </span>
                  )}
                </div>

                {/* Stock Status */}
                <div className='flex items-center space-x-2'>
                  <FaCheck className='w-5 h-5 text-green-500' />
                  <span className='text-green-600 font-medium'>
                    {product.stock_quantity > 0 
                      ? `${product.stock_quantity} in stock`
                      : 'Out of stock'
                    }
                  </span>
                </div>

                {/* Short Description */}
                {product.short_description && (
                  <p className='text-gray-700 text-lg leading-relaxed'>
                    {product.short_description}
                  </p>
                )}
              </div>
            </div>

            {/* Purchase Options */}
            <div className='bg-white rounded-3xl shadow-xl p-8'>
              <div className='space-y-6'>
                {/* Quantity Selector */}
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-3'>
                    Quantity
                  </label>
                  <div className='flex items-center space-x-4'>
                    <div className='flex items-center border border-gray-300 rounded-xl overflow-hidden'>
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className='p-3 hover:bg-gray-100 transition-colors'
                        disabled={quantity <= 1}
                      >
                        <FaMinus className='w-4 h-4' />
                      </button>
                      <span className='px-6 py-3 font-semibold text-lg border-x border-gray-300'>
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className='p-3 hover:bg-gray-100 transition-colors'
                        disabled={quantity >= product.stock_quantity}
                      >
                        <FaPlus className='w-4 h-4' />
                      </button>
                    </div>
                    <span className='text-gray-600'>
                      Total: ${(product.price * quantity).toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className='space-y-4'>
                  <button
                    onClick={handleAddToCart}
                    disabled={product.stock_quantity === 0}
                    className='w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-8 rounded-2xl font-semibold text-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none'
                  >
                    <FaShoppingCart className='inline w-5 h-5 mr-3' />
                    {product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                  </button>

                  <button
                    onClick={handleWishlistToggle}
                    disabled={isWishlistLoading}
                    className={`w-full py-4 px-8 rounded-2xl font-semibold text-lg transition-all duration-300 border-2 ${
                      isWishlisted
                        ? 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100'
                        : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                    } ${isWishlistLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {isWishlisted ? (
                      <>
                        <FaHeart className='inline w-5 h-5 mr-3' />
                        Remove from Wishlist
                      </>
                    ) : (
                      <>
                        <FaRegHeart className='inline w-5 h-5 mr-3' />
                        Add to Wishlist
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Product Features */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <div className='bg-white rounded-2xl p-6 shadow-lg text-center'>
                <FaTruck className='w-8 h-8 text-indigo-600 mx-auto mb-3' />
                <h3 className='font-semibold text-gray-900 mb-2'>Free Shipping</h3>
                <p className='text-sm text-gray-600'>On orders over $50</p>
              </div>
              <div className='bg-white rounded-2xl p-6 shadow-lg text-center'>
                <FaShieldAlt className='w-8 h-8 text-indigo-600 mx-auto mb-3' />
                <h3 className='font-semibold text-gray-900 mb-2'>Warranty</h3>
                <p className='text-sm text-gray-600'>1 year guarantee</p>
              </div>
              <div className='bg-white rounded-2xl p-6 shadow-lg text-center'>
                <FaSync className='w-8 h-8 text-indigo-600 mx-auto mb-3' />
                <h3 className='font-semibold text-gray-900 mb-2'>Easy Returns</h3>
                <p className='text-sm text-gray-600'>30-day return policy</p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className='bg-white rounded-3xl shadow-xl overflow-hidden mb-16'>
          <div className='border-b border-gray-200'>
            <nav className='flex space-x-8 px-8'>
              {['description', 'specifications', 'reviews'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-6 px-4 border-b-2 font-medium text-lg capitalize transition-colors ${
                    activeTab === tab
                      ? 'border-indigo-600 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          <div className='p-8'>
            {activeTab === 'description' && (
              <div className='prose max-w-none'>
                <p className='text-gray-700 text-lg leading-relaxed'>
                  {product.description || 'No description available for this product.'}
                </p>
              </div>
            )}

            {activeTab === 'specifications' && (
              <div className='space-y-4'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  {product.sku && (
                    <div className='flex justify-between py-3 border-b border-gray-200'>
                      <span className='font-medium text-gray-900'>SKU:</span>
                      <span className='text-gray-700'>{product.sku}</span>
                    </div>
                  )}
                  {product.brand && (
                    <div className='flex justify-between py-3 border-b border-gray-200'>
                      <span className='font-medium text-gray-900'>Brand:</span>
                      <span className='text-gray-700'>{product.brand}</span>
                    </div>
                  )}
                  {product.weight && (
                    <div className='flex justify-between py-3 border-b border-gray-200'>
                      <span className='font-medium text-gray-900'>Weight:</span>
                      <span className='text-gray-700'>{product.weight} lbs</span>
                    </div>
                  )}
                  {product.dimensions && (
                    <div className='flex justify-between py-3 border-b border-gray-200'>
                      <span className='font-medium text-gray-900'>Dimensions:</span>
                      <span className='text-gray-700'>{product.dimensions}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className='space-y-6'>
                <div className='flex items-center justify-between'>
                  <h3 className='text-2xl font-bold text-gray-900'>Customer Reviews</h3>
                  <div className='flex items-center space-x-4'>
                    <div className='flex items-center space-x-1'>
                      {[...Array(5)].map((_, index) => (
                        <FaStar
                          key={index}
                          className={`w-5 h-5 ${
                            index < Math.floor(averageRating)
                              ? 'text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className='text-lg font-semibold'>{averageRating.toFixed(1)}</span>
                    <span className='text-gray-600'>({reviewCount} reviews)</span>
                  </div>
                </div>

                <div className='space-y-6'>
                  {reviews.map((review) => (
                    <div key={review.id} className='bg-gray-50 rounded-2xl p-6'>
                      <div className='flex items-center justify-between mb-4'>
                        <div className='flex items-center space-x-4'>
                          <div className='w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center'>
                            <span className='text-indigo-600 font-semibold text-lg'>
                              {review.user_name.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <h4 className='font-semibold text-gray-900'>{review.user_name}</h4>
                            <div className='flex items-center space-x-2'>
                              <div className='flex items-center space-x-1'>
                                {[...Array(5)].map((_, index) => (
                                  <FaStar
                                    key={index}
                                    className={`w-4 h-4 ${
                                      index < review.rating
                                        ? 'text-yellow-400'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                              {review.verified && (
                                <span className='bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full'>
                                  Verified Purchase
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <span className='text-sm text-gray-500'>
                          {new Date(review.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className='text-gray-700 leading-relaxed'>{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default EnhancedProductDetailsPage