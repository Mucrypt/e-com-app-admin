'use client'
import React, { useState, useEffect } from 'react'
import { useParams} from 'next/navigation'
import Image from 'next/image'
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

interface Product {
  id: string
  name: string
  price: number
  original_price?: number
  description?: string
  short_description?: string
  image_url?: string
  images?: string[]
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
    comment:
      'Absolutely love this product! The quality exceeded my expectations and delivery was super fast.',
    created_at: '2024-01-15',
    verified: true,
  },
  {
    id: '2',
    user_name: 'Mike Chen',
    rating: 4,
    comment:
      'Great product overall. Good value for money and works perfectly as described.',
    created_at: '2024-01-10',
    verified: true,
  },
  {
    id: '3',
    user_name: 'Emily Davis',
    rating: 5,
    comment:
      'This is my second purchase. The product is reliable and the customer service is excellent!',
    created_at: '2024-01-05',
    verified: true,
  },
]

const ProductDetailsPage: React.FC = () => {
  const params = useParams()
  const productId = params.id as string

  // State variables
  const [product, setProduct] = useState<Product | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState('description')
  const [isWishlisted, setIsWishlisted] = useState(false)

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/product/${productId}`)
        if (!response.ok) throw new Error('Product not found')

        const productData = await response.json()
        setProduct(productData)
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

  const getProductImages = (): string[] => {
    if (!product) return ['/images/placeholder-product.jpg']

    const images: string[] = []
    if (product.image_url) images.push(product.image_url)
    if (product.images) {
      if (Array.isArray(product.images)) {
        images.push(...product.images)
      }
    }
    return images.length > 0 ? images : ['/images/placeholder-product.jpg']
  }

  const productImages = getProductImages()
  const hasDiscount =
    !!product &&
    typeof product.original_price === 'number' &&
    product.original_price > product.price
  const discountPercentage = hasDiscount
    ? Math.round(
        ((product.original_price! - product.price) / product.original_price!) *
          100
      )
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
          <h2 className='text-2xl font-bold text-gray-900 mb-4'>
            Product Not Found
          </h2>
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
                title='Share product'
                aria-label='Share product'
                className='p-2 text-gray-600 hover:text-indigo-600 transition-colors'
              >
                <FaShare className='w-5 h-5' />
              </button>
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`p-2 transition-colors ${
                  isWishlisted
                    ? 'text-red-500'
                    : 'text-gray-600 hover:text-red-500'
                }`}
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
          {/* Product Images */}
          <div className='space-y-6'>
            {/* Main Image */}
            <div className='bg-white rounded-3xl shadow-2xl p-8 border border-gray-200'>
              <div className='relative aspect-square overflow-hidden rounded-2xl'>
                <Image
                  src={productImages[selectedImage]}
                  alt={product.name}
                  fill
                  className='object-cover hover:scale-105 transition-transform duration-500'
                  sizes='(max-width: 768px) 100vw, 50vw'
                />
                {hasDiscount && (
                  <div className='absolute top-4 left-4 bg-gradient-to-r from-red-500 to-pink-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-2xl'>
                    🎉 {discountPercentage}% OFF
                  </div>
                )}
                {product.is_featured && (
                  <div className='absolute top-4 right-4 bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-2xl'>
                    ⭐ Featured
                  </div>
                )}
              </div>
            </div>

            {/* Thumbnail Images */}
            {productImages.length > 1 && (
              <div className='flex space-x-4 overflow-x-auto pb-4'>
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all duration-300 ${
                      selectedImage === index
                        ? 'border-indigo-500 shadow-lg scale-110'
                        : 'border-gray-200 hover:border-indigo-300'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} view ${index + 1}`}
                      width={80}
                      height={80}
                      className='object-cover w-full h-full'
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className='space-y-8'>
            {/* Breadcrumb */}
            <nav className='flex items-center space-x-3 text-sm text-gray-600'>
              <Link
                href='/'
                className='hover:text-indigo-600 transition-colors'
              >
                Home
              </Link>
              <span>›</span>
              <Link
                href='/products'
                className='hover:text-indigo-600 transition-colors'
              >
                Products
              </Link>
              {product.categories && (
                <>
                  <span>›</span>
                  <span className='text-indigo-600 font-semibold'>
                    {product.categories.name}
                  </span>
                </>
              )}
            </nav>

            {/* Product Title & Rating */}
            <div>
              <h1 className='text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight'>
                {product.name}
              </h1>

              <div className='flex items-center space-x-4 mb-4'>
                <div className='flex items-center bg-yellow-50 px-4 py-2 rounded-2xl border border-yellow-200'>
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(averageRating)
                          ? 'text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className='ml-3 text-gray-700 font-semibold'>
                    {averageRating} ({reviewCount} reviews)
                  </span>
                </div>
                <span className='bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold'>
                  ✓ In Stock
                </span>
              </div>

              {product.brand && (
                <p className='text-lg text-gray-600'>
                  Brand:{' '}
                  <span className='font-semibold text-indigo-600'>
                    {product.brand}
                  </span>
                </p>
              )}
            </div>

            {/* Price Section */}
            <div className='bg-gradient-to-r from-indigo-50 to-purple-50 rounded-3xl p-6 border border-indigo-100'>
              <div className='flex items-center space-x-4 mb-4'>
                <span className='text-4xl font-bold text-gray-900'>
                  ${product.price.toFixed(2)}
                </span>
                {hasDiscount && (
                  <>
                    <span className='text-2xl text-gray-500 line-through'>
                      ${product.original_price!.toFixed(2)}
                    </span>
                    <span className='bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold'>
                      Save $
                      {(product.original_price! - product.price).toFixed(2)}
                    </span>
                  </>
                )}
              </div>
              <p className='text-green-600 font-semibold flex items-center'>
                <FaCheck className='w-4 h-4 mr-2' />
                Free shipping on orders over $50
              </p>
            </div>

            {/* Short Description */}
            {product.short_description && (
              <p className='text-lg text-gray-600 leading-relaxed'>
                {product.short_description}
              </p>
            )}

            {/* Quantity & Add to Cart */}
            <div className='space-y-6'>
              <div className='flex items-center space-x-4'>
                <span className='text-lg font-semibold text-gray-700'>
                  Quantity:
                </span>
                <div className='flex items-center space-x-3 bg-white rounded-2xl border border-gray-300 p-2'>
                  <button
                    title='Decrease quantity'
                    aria-label='Decrease quantity'
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className='w-10 h-10 rounded-2xl bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center'
                  >
                    <FaMinus className='w-4 h-4' />
                  </button>
                  <span className='text-xl font-bold w-12 text-center'>
                    {quantity}
                  </span>
                  <button
                    title='Increase quantity'
                    aria-label='Increase quantity'
                    onClick={() => setQuantity(quantity + 1)}
                    className='w-10 h-10 rounded-2xl bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center'
                  >
                    <FaPlus className='w-4 h-4' />
                  </button>
                </div>
              </div>

              <div className='flex space-x-4'>
                <button className='flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-8 rounded-2xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-2xl flex items-center justify-center space-x-3'>
                  <FaShoppingCart className='w-5 h-5' />
                  <span>
                    Add to Cart - ${(product.price * quantity).toFixed(2)}
                  </span>
                </button>
                <button className='bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-8 rounded-2xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-2xl'>
                  Buy Now
                </button>
              </div>
            </div>

            {/* Features */}
            <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
              <div className='bg-white rounded-2xl p-4 text-center border border-gray-200 shadow-lg'>
                <FaTruck className='w-8 h-8 text-indigo-600 mx-auto mb-2' />
                <p className='font-semibold text-gray-900'>Free Shipping</p>
                <p className='text-sm text-gray-600'>On orders over $50</p>
              </div>
              <div className='bg-white rounded-2xl p-4 text-center border border-gray-200 shadow-lg'>
                <FaShieldAlt className='w-8 h-8 text-green-600 mx-auto mb-2' />
                <p className='font-semibold text-gray-900'>2-Year Warranty</p>
                <p className='text-sm text-gray-600'>Full protection</p>
              </div>
              <div className='bg-white rounded-2xl p-4 text-center border border-gray-200 shadow-lg'>
                <FaSync className='w-8 h-8 text-blue-600 mx-auto mb-2' />
                <p className='font-semibold text-gray-900'>30-Day Returns</p>
                <p className='text-sm text-gray-600'>No questions asked</p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className='bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden mb-16'>
          {/* Tab Headers */}
          <div className='border-b border-gray-200'>
            <div className='flex overflow-x-auto'>
              {[
                {
                  id: 'description',
                  label: 'Product Description',
                  icon: '📋',
                },
                { id: 'specifications', label: 'Specifications', icon: '⚙️' },
                {
                  id: 'reviews',
                  label: `Reviews (${reviewCount})`,
                  icon: '⭐',
                },
                { id: 'shipping', label: 'Shipping Info', icon: '🚚' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-shrink-0 px-8 py-6 font-semibold transition-all duration-300 border-b-2 ${
                    activeTab === tab.id
                      ? 'border-indigo-600 text-indigo-600 bg-indigo-50'
                      : 'border-transparent text-gray-600 hover:text-indigo-600 hover:bg-gray-50'
                  }`}
                >
                  <span className='mr-2'>{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className='p-8'>
            {activeTab === 'description' && (
              <div className='prose prose-lg max-w-none'>
                <h3 className='text-2xl font-bold text-gray-900 mb-6'>
                  About This Product
                </h3>
                <p className='text-gray-600 leading-relaxed mb-6'>
                  {product.description ||
                    product.short_description ||
                    'No description available.'}
                </p>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-8'>
                  <div className='bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-6'>
                    <h4 className='font-bold text-gray-900 mb-3'>
                      🌟 Key Features
                    </h4>
                    <ul className='space-y-2 text-gray-600'>
                      <li className='flex items-center'>
                        <FaCheck className='w-4 h-4 text-green-500 mr-3' />
                        Premium quality materials
                      </li>
                      <li className='flex items-center'>
                        <FaCheck className='w-4 h-4 text-green-500 mr-3' />
                        Easy to use and maintain
                      </li>
                      <li className='flex items-center'>
                        <FaCheck className='w-4 h-4 text-green-500 mr-3' />
                        Environmentally friendly
                      </li>
                    </ul>
                  </div>

                  <div className='bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-6'>
                    <h4 className='font-bold text-gray-900 mb-3'>
                      💡 Perfect For
                    </h4>
                    <ul className='space-y-2 text-gray-600'>
                      <li className='flex items-center'>
                        <FaCheck className='w-4 h-4 text-green-500 mr-3' />
                        Everyday use
                      </li>
                      <li className='flex items-center'>
                        <FaCheck className='w-4 h-4 text-green-500 mr-3' />
                        Professional settings
                      </li>
                      <li className='flex items-center'>
                        <FaCheck className='w-4 h-4 text-green-500 mr-3' />
                        Gift purposes
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'specifications' && (
              <div className='space-y-6'>
                <h3 className='text-2xl font-bold text-gray-900'>
                  Technical Specifications
                </h3>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div className='space-y-4'>
                    <div className='flex justify-between border-b border-gray-200 pb-2'>
                      <span className='font-semibold text-gray-700'>SKU</span>
                      <span className='text-gray-600'>
                        {product.sku || 'N/A'}
                      </span>
                    </div>
                    <div className='flex justify-between border-b border-gray-200 pb-2'>
                      <span className='font-semibold text-gray-700'>Brand</span>
                      <span className='text-gray-600'>
                        {product.brand || 'N/A'}
                      </span>
                    </div>
                    <div className='flex justify-between border-b border-gray-200 pb-2'>
                      <span className='font-semibold text-gray-700'>
                        Weight
                      </span>
                      <span className='text-gray-600'>
                        {product.weight ? `${product.weight} kg` : 'N/A'}
                      </span>
                    </div>
                  </div>
                  <div className='space-y-4'>
                    <div className='flex justify-between border-b border-gray-200 pb-2'>
                      <span className='font-semibold text-gray-700'>
                        Dimensions
                      </span>
                      <span className='text-gray-600'>
                        {product.dimensions || 'N/A'}
                      </span>
                    </div>
                    <div className='flex justify-between border-b border-gray-200 pb-2'>
                      <span className='font-semibold text-gray-700'>
                        Warranty
                      </span>
                      <span className='text-gray-600'>2 Years</span>
                    </div>
                    <div className='flex justify-between border-b border-gray-200 pb-2'>
                      <span className='font-semibold text-gray-700'>
                        In Stock
                      </span>
                      <span className='text-gray-600'>
                        {product.stock_quantity} units
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className='space-y-8'>
                <div className='flex flex-col md:flex-row md:items-center md:justify-between'>
                  <div>
                    <h3 className='text-2xl font-bold text-gray-900 mb-2'>
                      Customer Reviews
                    </h3>
                    <div className='flex items-center space-x-4'>
                      <div className='flex items-center'>
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            className={`w-6 h-6 ${
                              i < Math.floor(averageRating)
                                ? 'text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className='text-lg text-gray-600'>
                        {averageRating} out of 5
                      </span>
                    </div>
                  </div>
                  <button className='mt-4 md:mt-0 bg-indigo-600 text-white px-6 py-3 rounded-2xl hover:bg-indigo-700 transition-colors'>
                    Write a Review
                  </button>
                </div>

                <div className='space-y-6'>
                  {reviews.map((review) => (
                    <div
                      key={review.id}
                      className='bg-gray-50 rounded-2xl p-6 border border-gray-200'
                    >
                      <div className='flex items-center justify-between mb-4'>
                        <div className='flex items-center space-x-4'>
                          <div className='w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold'>
                            {review.user_name.charAt(0)}
                          </div>
                          <div>
                            <h4 className='font-semibold text-gray-900'>
                              {review.user_name}
                            </h4>
                            <div className='flex items-center space-x-2'>
                              <div className='flex items-center'>
                                {[...Array(5)].map((_, i) => (
                                  <FaStar
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < review.rating
                                        ? 'text-yellow-400'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                              {review.verified && (
                                <span className='bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold'>
                                  ✓ Verified Purchase
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <span className='text-sm text-gray-500'>
                          {review.created_at}
                        </span>
                      </div>
                      <p className='text-gray-600 leading-relaxed'>
                        {review.comment}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className='space-y-6'>
                <h3 className='text-2xl font-bold text-gray-900'>
                  Shipping Information
                </h3>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div className='bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-6'>
                    <h4 className='font-bold text-gray-900 mb-4'>
                      🚚 Delivery Options
                    </h4>
                    <div className='space-y-3'>
                      <div className='flex justify-between'>
                        <span className='text-gray-700'>Standard Shipping</span>
                        <span className='text-gray-600'>3-5 business days</span>
                      </div>
                      <div className='flex justify-between'>
                        <span className='text-gray-700'>Express Shipping</span>
                        <span className='text-gray-600'>1-2 business days</span>
                      </div>
                      <div className='flex justify-between'>
                        <span className='text-gray-700'>Free Shipping</span>
                        <span className='text-green-600 font-semibold'>
                          Orders over $50
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className='bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-6'>
                    <h4 className='font-bold text-gray-900 mb-4'>
                      📦 Return Policy
                    </h4>
                    <div className='space-y-3 text-gray-600'>
                      <p>✅ 30-day money-back guarantee</p>
                      <p>✅ Free returns for all items</p>
                      <p>✅ No restocking fees</p>
                      <p>✅ Easy return process</p>
                    </div>
                  </div>
                </div>

                <div className='bg-yellow-50 border border-yellow-200 rounded-2xl p-6'>
                  <h4 className='font-bold text-yellow-800 mb-2'>
                    ⚠️ Important Notes
                  </h4>
                  <ul className='text-yellow-700 space-y-1'>
                    <li>• Signature may be required for delivery</li>
                    <li>• Tracking information will be provided via email</li>
                    <li>• Contact us within 24 hours for damaged items</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Share Section */}
        <div className='text-center bg-white rounded-3xl shadow-2xl p-8 border border-gray-200'>
          <h3 className='text-2xl font-bold text-gray-900 mb-4'>
            Love this product? Share it!
          </h3>
          <div className='flex justify-center space-x-4'>
            {[
              { icon: FaFacebook, color: 'blue', label: 'Facebook' },
              { icon: FaTwitter, color: 'sky', label: 'Twitter' },
              { icon: FaPinterest, color: 'red', label: 'Pinterest' },
              { icon: FaWhatsapp, color: 'green', label: 'WhatsApp' },
            ].map(({ icon: Icon, color, label }) => (
              <button
                key={label}
                className={`w-12 h-12 rounded-2xl bg-${color}-500 text-white flex items-center justify-center hover:bg-${color}-600 transition-colors transform hover:scale-110`}
                title={`Share on ${label}`}
              >
                <Icon className='w-5 h-5' />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailsPage
