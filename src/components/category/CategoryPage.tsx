'use client'
import React, { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import {
  FaFilter,
  FaSort,
  FaHeart,
  FaShoppingCart,
  FaStar,
  FaEye,
  FaChevronRight,
  FaTh,
  FaBars,
  FaSpinner,
  FaCheck,
} from 'react-icons/fa'
import { useWishlist } from '@/hooks/useWishlist'
import PromotionalBanners from '@/components/home/PromotionalBanners'
import CategoryBanners from '@/components/category/CategoryBanners'

interface Product {
  id: string
  name: string
  price: number
  original_price?: number
  description?: string
  short_description?: string
  image_url?: string
  images?: string | string[]
  category_id: string
  stock_quantity: number
  is_active: boolean
  is_featured: boolean
  rating?: number
  review_count?: number
  categories?: {
    id: string
    name: string
    slug: string
    color?: string
  }
}

interface Category {
  id: string
  name: string
  slug: string
  description?: string
  image_url?: string
  color?: string
  is_active: boolean
  product_count?: number
}

interface FilterState {
  categories: string[]
  priceRange: [number, number]
  rating: number
  brands: string[]
  inStock: boolean
  onSale: boolean
}

const CategoryPageContent: React.FC = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const categorySlug = searchParams.get('category') || ''

  // States
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState('relevance')
  const [showFilters, setShowFilters] = useState(false)
  const [totalProducts, setTotalProducts] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const productsPerPage = 20

  const [filters, setFilters] = useState<FilterState>({
    categories: categorySlug ? [categorySlug] : [], // Initialize with URL category
    priceRange: [0, 1000],
    rating: 0,
    brands: [],
    inStock: false,
    onSale: false,
  })

  // Wishlist functionality
  const { addToWishlist, isInWishlist, loading: wishlistLoading } = useWishlist()
  const [wishlistOperations, setWishlistOperations] = useState<Set<string>>(new Set())
  const [wishlistFeedback, setWishlistFeedback] = useState<{[key: string]: 'success' | 'error'}>({})

  // Helper function to show feedback
  const showWishlistFeedback = (productId: string, type: 'success' | 'error') => {
    setWishlistFeedback(prev => ({ ...prev, [productId]: type }))
    setTimeout(() => {
      setWishlistFeedback(prev => {
        const { [productId]: _, ...rest } = prev
        return rest
      })
    }, 2000)
  }

  // Helper function to get product image - only returns real images
  const getProductImage = (product: Product): string | null => {
    // Helper to check if URL is a placeholder
    const isPlaceholderUrl = (url: string): boolean => {
      return url.includes('placeholder') || 
             url.includes('via.placeholder.com') ||
             url.includes('placehold') ||
             url.startsWith('data:image') ||
             url.includes('placeholder-product')
    }

    if (product.image_url && product.image_url.trim() !== '' && !isPlaceholderUrl(product.image_url)) {
      return product.image_url
    }

    if (product.images) {
      if (typeof product.images === 'string' && product.images.trim() !== '' && !isPlaceholderUrl(product.images)) {
        return product.images
      }
      if (Array.isArray(product.images) && product.images.length > 0) {
        const firstImage = product.images[0]
        if (firstImage && firstImage.trim() !== '' && !isPlaceholderUrl(firstImage)) {
          return firstImage
        }
      }
    }

    // Return null instead of placeholder - let components handle no image state
    return null
  }

  // Handle category change from sidebar
  const handleCategoryChange = (categorySlug: string) => {
    console.log('🏷️ Frontend: Category clicked:', categorySlug)

    // Reset to first page when changing category
    setCurrentPage(1)

    // Update filters with the new category
    const newFilters = {
      ...filters,
      categories: categorySlug ? [categorySlug] : [],
    }
    setFilters(newFilters)

    // Update URL
    const url = categorySlug
      ? `/products?category=${categorySlug}`
      : '/products'
    router.push(url)

    console.log('📂 Frontend: Navigating to:', url)
  }

  // Clear filters
  const clearFilters = () => {
    setFilters({
      categories: [],
      priceRange: [0, 1000],
      rating: 0,
      brands: [],
      inStock: false,
      onSale: false,
    })
    setCurrentCategory(null)
    router.push('/products')
  }

  // Breadcrumb component
  const Breadcrumb = () => (
    <nav className='flex items-center space-x-2 text-sm text-gray-600 mb-6'>
      <Link href='/' className='hover:text-indigo-600 transition-colors'>
        Home
      </Link>
      <FaChevronRight className='w-3 h-3' />
      <Link
        href='/products'
        className='hover:text-indigo-600 transition-colors'
      >
        Products
      </Link>
      {currentCategory && (
        <>
          <FaChevronRight className='w-3 h-3' />
          <span className='text-gray-900 font-medium'>
            {currentCategory.name}
          </span>
        </>
      )}
    </nav>
  )

  // Product Card component
  const ProductCard = ({
    product,
    isListView = false,
  }: {
    product: Product
    isListView?: boolean
  }) => {
    const productImage = getProductImage(product)
    const hasDiscount =
      product.original_price && product.original_price > product.price
    const discountPercentage = hasDiscount
      ? Math.round(
          ((product.original_price! - product.price) /
            product.original_price!) *
            100
        )
      : 0

    // Button handlers
    const handleQuickView = (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      console.log('👁️ Quick view clicked for:', product.name)
      router.push(`/products/${product.id}`)
    }

    const handleAddToWishlist = async (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      
      // Check if already in wishlist
      if (isInWishlist(product.id)) {
        console.log('❤️ Product already in wishlist:', product.name)
        showWishlistFeedback(product.id, 'error')
        return
      }

      // Check if operation is already in progress
      if (wishlistOperations.has(product.id)) {
        return
      }

      try {
        console.log('❤️ Adding to wishlist:', product.name)
        
        // Mark operation as in progress
        setWishlistOperations(prev => new Set(prev.add(product.id)))

        const result = await addToWishlist({
          product_id: product.id,
          notes: `Added from ${currentCategory?.name || 'products'} page`,
          added_from: 'category_page'
        })

        if (result) {
          console.log('✅ Successfully added to wishlist:', product.name)
          showWishlistFeedback(product.id, 'success')
        } else {
          console.log('❌ Failed to add to wishlist:', product.name)
          showWishlistFeedback(product.id, 'error')
        }
      } catch (error) {
        console.error('❌ Error adding to wishlist:', error)
        showWishlistFeedback(product.id, 'error')
      } finally {
        // Remove operation from progress
        setWishlistOperations(prev => {
          const newSet = new Set(prev)
          newSet.delete(product.id)
          return newSet
        })
      }
    }

    const handleAddToCart = (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      console.log('🛒 Add to cart clicked for:', product.name)
      // Add cart functionality here
    }

    if (isListView) {
      return (
        <div className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden product-card-hover group cursor-pointer hover:shadow-lg transition-all duration-300'>
          <div className='flex'>
            {/* Product Image */}
            <div className='w-48 h-48 flex-shrink-0 relative' onClick={handleQuickView}>
              {productImage ? (
                <Image
                  src={productImage}
                  alt={product.name}
                  width={192}
                  height={192}
                  className='w-full h-full object-cover'
                />
              ) : (
                <div className='w-full h-full bg-gray-200 flex items-center justify-center'>
                  <div className="text-gray-400 text-center">
                    <svg 
                      className="w-12 h-12 mx-auto mb-2" 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path 
                        fillRule="evenodd" 
                        d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" 
                        clipRule="evenodd"
                      />
                    </svg>
                    <p className="text-sm">No image</p>
                  </div>
                </div>
              )}
              
              {/* Wishlist Button - Top Right Corner of Image */}
              <button
                className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-300 shadow-lg z-30 ${
                  isInWishlist(product.id)
                    ? 'bg-red-500 text-white'
                    : 'bg-white/90 backdrop-blur-sm text-red-500 hover:bg-red-500 hover:text-white'
                } ${
                  wishlistOperations.has(product.id) ? 'opacity-75 cursor-not-allowed' : ''
                }`}
                aria-label='Add to wishlist'
                title={isInWishlist(product.id) ? 'In wishlist' : 'Add to wishlist'}
                onClick={handleAddToWishlist}
                disabled={wishlistOperations.has(product.id)}
              >
                {wishlistOperations.has(product.id) ? (
                  <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
                ) : (
                  <FaHeart className={`w-4 h-4 ${isInWishlist(product.id) ? 'text-white' : ''}`} />
                )}
                {wishlistFeedback[product.id] && (
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap z-40">
                    {wishlistFeedback[product.id] === 'success' ? '✓ Added to wishlist!' : '✗ Error'}
                  </div>
                )}
              </button>

              {/* Badges */}
              {hasDiscount && (
                <div className='absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-medium z-20'>
                  -{discountPercentage}%
                </div>
              )}

              {product.stock_quantity <= 0 && (
                <div className='absolute inset-0 bg-black/50 flex items-center justify-center z-10'>
                  <span className='bg-red-500 text-white px-3 py-1 rounded text-sm font-semibold'>
                    Out of Stock
                  </span>
                </div>
              )}
            </div>
            
            {/* Product Details */}
            <div className='flex-1 p-6'>
              <div className='flex justify-between items-start mb-4'>
                <div className='flex-1'>
                  <Link href={`/products/${product.id}`}>
                    <h3 className='text-xl font-semibold text-gray-900 hover:text-indigo-600 transition-colors mb-2'>
                      {product.name}
                    </h3>
                  </Link>
                  {product.categories && (
                    <span className='inline-block bg-gray-100 text-gray-600 px-2 py-1 rounded text-sm'>
                      {product.categories.name}
                    </span>
                  )}
                </div>
              </div>

              {product.short_description && (
                <p className='text-gray-600 mb-4 line-clamp-2'>
                  {product.short_description}
                </p>
              )}

              {product.rating && (
                <div className='flex items-center mb-4'>
                  <div className='flex text-yellow-400'>
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating!)
                            ? 'text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className='text-sm text-gray-600 ml-2'>
                    ({product.review_count || 0} reviews)
                  </span>
                </div>
              )}

              <div className='flex items-center justify-between'>
                <div className='flex items-center space-x-2'>
                  <span className='text-2xl font-bold text-gray-900'>
                    ${product.price.toFixed(2)}
                  </span>
                  {hasDiscount && (
                    <span className='text-lg text-gray-500 line-through'>
                      ${product.original_price!.toFixed(2)}
                    </span>
                  )}
                  <div className='ml-4'>
                    {product.stock_quantity > 0 ? (
                      <span className='text-green-600 font-medium'>In Stock</span>
                    ) : (
                      <span className='text-red-600 font-medium'>Out of Stock</span>
                    )}
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className='flex space-x-2'>
                  <Link href={`/products/${product.id}`}>
                    <button className='bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center'>
                      <FaEye className='w-4 h-4 mr-2' />
                      View Details
                    </button>
                  </Link>
                  <button
                    className='bg-gray-100 text-gray-700 p-2 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                    onClick={handleAddToCart}
                    disabled={product.stock_quantity <= 0}
                    title="Add to Cart"
                    aria-label="Add to Cart"
                  >
                    <FaShoppingCart className='w-4 h-4' />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }

    // Grid view
    return (
      <div className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer'>
        {/* Product Image */}
        <div className='relative w-full h-64 overflow-hidden' onClick={handleQuickView}>
          {productImage ? (
            <Image
              src={productImage}
              alt={product.name}
              fill
              className='object-cover group-hover:scale-105 transition-transform duration-300'
              sizes='(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw'
              priority={false}
              unoptimized={true}
            />
          ) : (
            <div className='w-full h-full bg-gray-200 flex items-center justify-center'>
              <div className="text-gray-400 text-center">
                <svg 
                  className="w-12 h-12 mx-auto mb-2" 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" 
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-sm">No image</p>
              </div>
            </div>
          )}

          {/* Badges */}
          {hasDiscount && (
            <div className='absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-medium z-20'>
              -{discountPercentage}%
            </div>
          )}

          {product.is_featured && (
            <div className='absolute top-3 right-3 bg-indigo-500 text-white px-2 py-1 rounded-md text-xs font-medium z-20'>
              Featured
            </div>
          )}

          {/* Wishlist Button - Top Right Corner */}
          <button
            className={`absolute ${product.is_featured ? 'top-14 right-3' : 'top-3 right-3'} p-2 rounded-full transition-all duration-300 shadow-lg z-30 ${
              isInWishlist(product.id)
                ? 'bg-red-500 text-white transform scale-110'
                : 'bg-white/90 backdrop-blur-sm text-red-500 hover:bg-red-500 hover:text-white hover:scale-110'
            } ${
              wishlistOperations.has(product.id) ? 'opacity-75 cursor-not-allowed' : ''
            }`}
            aria-label='Add to wishlist'
            title={isInWishlist(product.id) ? 'In wishlist' : 'Add to wishlist'}
            onClick={handleAddToWishlist}
            disabled={wishlistOperations.has(product.id)}
          >
            {wishlistOperations.has(product.id) ? (
              <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
            ) : (
              <FaHeart className={`w-4 h-4 ${isInWishlist(product.id) ? 'text-white' : ''}`} />
            )}
            {wishlistFeedback[product.id] && (
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap z-40">
                {wishlistFeedback[product.id] === 'success' ? '✓ Added to wishlist!' : '✗ Error adding to wishlist'}
              </div>
            )}
          </button>

          {/* Stock Status Overlay */}
          {product.stock_quantity <= 0 && (
            <div className='absolute inset-0 bg-black/50 flex items-center justify-center z-10'>
              <span className='bg-red-500 text-white px-4 py-2 rounded-lg font-semibold'>
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className='p-4'>
          {/* Product Name and Category */}
          <div className='mb-3'>
            <Link href={`/products/${product.id}`}>
              <h3 className='text-lg font-semibold text-gray-900 hover:text-indigo-600 transition-colors line-clamp-2 mb-1'>
                {product.name}
              </h3>
            </Link>
            {product.categories && (
              <span className='inline-block bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs'>
                {product.categories.name}
              </span>
            )}
          </div>

          {/* Rating */}
          {product.rating && (
            <div className='flex items-center mb-3'>
              <div className='flex text-yellow-400'>
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={`w-3 h-3 ${
                      i < Math.floor(product.rating!)
                        ? 'text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className='text-sm text-gray-600 ml-1'>
                ({product.review_count || 0})
              </span>
            </div>
          )}

          {/* Price and Stock */}
          <div className='flex items-center justify-between mb-4'>
            <div className='flex items-center space-x-2'>
              <span className='text-xl font-bold text-gray-900'>
                ${product.price.toFixed(2)}
              </span>
              {hasDiscount && (
                <span className='text-sm text-gray-500 line-through'>
                  ${product.original_price!.toFixed(2)}
                </span>
              )}
            </div>
            <div className='text-sm'>
              {product.stock_quantity > 0 ? (
                <span className='text-green-600 font-medium'>In Stock</span>
              ) : (
                <span className='text-red-600 font-medium'>Out of Stock</span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className='flex space-x-2'>
            <Link href={`/products/${product.id}`} className='flex-1'>
              <button className='w-full bg-indigo-600 text-white py-2.5 px-4 rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center justify-center'>
                <FaEye className='w-4 h-4 mr-2' />
                View Details
              </button>
            </Link>
            <button
              className='bg-gray-100 text-gray-700 p-2.5 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
              onClick={handleAddToCart}
              disabled={product.stock_quantity <= 0}
              title="Add to Cart"
              aria-label="Add to Cart"
            >
              <FaShoppingCart className='w-4 h-4' />
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Sidebar component
  const Sidebar = () => (
    <div
      className={`bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden ${
        showFilters ? 'block' : 'hidden lg:block'
      }`}
    >
      {/* Categories Section */}
      <div className='p-6 border-b border-gray-100'>
        <h3 className='text-xl font-bold text-gray-900 mb-6 flex items-center'>
          <div className='w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center mr-3'>
            <FaFilter className='text-indigo-600 text-sm' />
          </div>
          Categories
        </h3>
        <div className='space-y-2'>
          <button
            onClick={() => handleCategoryChange('')}
            className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
              !currentCategory
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg transform scale-105'
                : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600 hover:shadow-md'
            }`}
          >
            <div className='flex items-center justify-between'>
              <span>All Categories</span>
              <span
                className={`text-sm px-2 py-1 rounded-full ${
                  !currentCategory
                    ? 'bg-white bg-opacity-20 text-white'
                    : 'bg-gray-100 text-gray-500'
                }`}
              >
                {totalProducts}
              </span>
            </div>
          </button>

          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.slug)}
              className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 font-medium group ${
                currentCategory?.id === category.id
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg transform scale-105'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600 hover:shadow-md'
              }`}
            >
              <div className='flex items-center justify-between'>
                <div className='flex items-center'>
                  {category.color && (
                    <div
                      className={`w-3 h-3 rounded-full mr-3 ${
                        currentCategory?.id === category.id
                          ? 'bg-white bg-opacity-30'
                          : ''
                      }`}
                      style={{
                        backgroundColor:
                          currentCategory?.id === category.id
                            ? undefined
                            : category.color,
                      }}
                    />
                  )}
                  <span>{category.name}</span>
                </div>
                {category.product_count !== undefined && (
                  <span
                    className={`text-sm px-2 py-1 rounded-full ${
                      currentCategory?.id === category.id
                        ? 'bg-white bg-opacity-20 text-white'
                        : 'bg-gray-100 text-gray-500 group-hover:bg-indigo-100 group-hover:text-indigo-600'
                    }`}
                  >
                    {category.product_count}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Price Range Section */}
      <div className='p-6 border-b border-gray-100'>
        <h3 className='text-lg font-bold text-gray-900 mb-4 flex items-center'>
          <div className='w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center mr-3'>
            <span className='text-green-600 text-xs font-bold'>$</span>
          </div>
          Price Range
        </h3>
        <div className='space-y-4'>
          <div className='flex items-center space-x-3'>
            <div className='flex-1'>
              <label className='block text-xs font-medium text-gray-500 mb-1'>
                Min Price
              </label>
              <input
                type='number'
                placeholder='0'
                value={filters.priceRange[0]}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    priceRange: [
                      parseInt(e.target.value) || 0,
                      prev.priceRange[1],
                    ],
                  }))
                }
                className='w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm'
              />
            </div>
            <div className='flex-shrink-0 text-gray-400 font-medium'>to</div>
            <div className='flex-1'>
              <label className='block text-xs font-medium text-gray-500 mb-1'>
                Max Price
              </label>
              <input
                type='number'
                placeholder='1000'
                value={filters.priceRange[1]}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    priceRange: [
                      prev.priceRange[0],
                      parseInt(e.target.value) || 1000,
                    ],
                  }))
                }
                className='w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm'
              />
            </div>
          </div>
        </div>
      </div>

      {/* Rating Section */}
      <div className='p-6 border-b border-gray-100'>
        <h3 className='text-lg font-bold text-gray-900 mb-4 flex items-center'>
          <div className='w-6 h-6 bg-yellow-100 rounded-lg flex items-center justify-center mr-3'>
            <FaStar className='text-yellow-500 text-xs' />
          </div>
          Rating
        </h3>
        <div className='space-y-2'>
          {[4, 3, 2, 1].map((rating) => (
            <button
              key={rating}
              onClick={() => setFilters((prev) => ({ ...prev, rating }))}
              className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 flex items-center ${
                filters.rating === rating
                  ? 'bg-yellow-50 text-yellow-800 border border-yellow-200'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className='flex items-center'>
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={`w-4 h-4 ${
                      i < rating ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className='ml-2 font-medium'>& up</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Additional Filters Section */}
      <div className='p-6 border-b border-gray-100'>
        <h3 className='text-lg font-bold text-gray-900 mb-4'>Quick Filters</h3>
        <div className='space-y-3'>
          <label className='flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer'>
            <input
              type='checkbox'
              checked={filters.onSale}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, onSale: e.target.checked }))
              }
              className='rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4'
            />
            <span className='ml-3 text-gray-700 font-medium'>On Sale</span>
            <div className='ml-auto w-2 h-2 bg-red-500 rounded-full'></div>
          </label>
          <label className='flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer'>
            <input
              type='checkbox'
              checked={filters.inStock}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, inStock: e.target.checked }))
              }
              className='rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4'
            />
            <span className='ml-3 text-gray-700 font-medium'>In Stock</span>
            <div className='ml-auto w-2 h-2 bg-green-500 rounded-full'></div>
          </label>
        </div>
      </div>

      {/* Clear Filters Button */}
      <div className='p-6'>
        <button
          onClick={clearFilters}
          className='w-full bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 py-3 px-4 rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all duration-200 font-medium shadow-md hover:shadow-lg'
        >
          Clear All Filters
        </button>
      </div>
    </div>
  )

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          '/api/categories?active=true&with_count=true'
        )
        if (response.ok) {
          const data = await response.json()
          setCategories(data || [])
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }

    fetchCategories()
  }, [])

  // Handle URL category changes and set current category
  useEffect(() => {
    if (categories.length > 0) {
      if (categorySlug && categorySlug !== '') {
        const category = categories.find((cat) => cat.slug === categorySlug)
        if (category) {
          setCurrentCategory(category)
          console.log('📂 Frontend: Set category from URL:', category.name)

          // Update filters with the category from URL
          setFilters((prev) => ({
            ...prev,
            categories: [categorySlug],
          }))
        }
      } else {
        setCurrentCategory(null)
        console.log('📂 Frontend: Cleared category (showing all products)')

        // Clear category filter
        setFilters((prev) => ({
          ...prev,
          categories: [],
        }))
      }
    }
  }, [categorySlug, categories])

  // Fetch products - FIXED: Now properly uses categorySlug from URL
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        setError(null)

        const queryParams = new URLSearchParams()

        // CRITICAL FIX: Use categorySlug from URL directly for API call
        if (categorySlug && categorySlug !== '') {
          queryParams.append('category', categorySlug)
          console.log(
            '🔍 Frontend: Requesting products for category:',
            categorySlug
          )
        } else {
          console.log(
            '🔍 Frontend: Requesting all products (no category filter)'
          )
        }

        queryParams.append('sortBy', sortBy)
        queryParams.append('limit', productsPerPage.toString())
        queryParams.append('page', currentPage.toString())

        if (filters.priceRange[0] > 0) {
          queryParams.append('minPrice', filters.priceRange[0].toString())
        }
        if (filters.priceRange[1] < 1000) {
          queryParams.append('maxPrice', filters.priceRange[1].toString())
        }
        if (filters.rating > 0) {
          queryParams.append('rating', filters.rating.toString())
        }
        if (filters.onSale) {
          queryParams.append('onSale', 'true')
        }
        if (filters.inStock) {
          queryParams.append('inStock', 'true')
        }

        const apiUrl = `/api/products?${queryParams.toString()}`
        console.log('🌐 Frontend: Fetching from:', apiUrl)

        const response = await fetch(apiUrl)
        if (!response.ok) {
          throw new Error('Failed to fetch products')
        }

        const data = await response.json()
        console.log('📦 Frontend: Received', data?.length || 0, 'products')

        setProducts(data || [])
        setTotalProducts(data?.length || 0)
      } catch (err) {
        console.error('❌ Frontend: Error fetching products:', err)
        setError('Failed to load products')
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [categorySlug, sortBy, currentPage, filters]) // categorySlug is now a dependency

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='container mx-auto px-4 py-8'>
        <Breadcrumb />

        {/* Header */}
        <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8'>
          <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between'>
            <div>
              <h1 className='text-3xl font-bold text-gray-900 mb-2'>
                {currentCategory?.name || 'All Products'}
              </h1>
              {currentCategory?.description && (
                <p className='text-gray-600'>{currentCategory.description}</p>
              )}
              <p className='text-sm text-gray-500 mt-2'>
                {totalProducts} products found
              </p>
            </div>

            {currentCategory?.image_url && (
              <div className='mt-4 lg:mt-0'>
                <div className='relative w-32 h-32 rounded-lg overflow-hidden'>
                  <Image
                    src={currentCategory.image_url}
                    alt={currentCategory.name}
                    fill
                    className='object-cover'
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Promotional Banners Section */}
        <CategoryBanners currentCategory={currentCategory} />

        {/* Filters and Sort Bar */}
        <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-8'>
          <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0'>
            <div className='flex items-center space-x-4'>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className='lg:hidden flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors'
              >
                <FaFilter className='w-4 h-4' />
                <span>Filters</span>
              </button>

              <div className='flex items-center space-x-2'>
                <span className='text-sm text-gray-600'>View:</span>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-indigo-100 text-indigo-600'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  aria-label='Grid view'
                  title='Grid view'
                >
                  <FaTh className='w-4 h-4' />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'list'
                      ? 'bg-indigo-100 text-indigo-600'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  aria-label='List view'
                  title='List view'
                >
                  <FaBars className='w-4 h-4' />
                </button>
              </div>
            </div>

            <div className='flex items-center space-x-4'>
              <div className='flex items-center space-x-2'>
                <FaSort className='w-4 h-4 text-gray-600' />
                <select
                  aria-label='Sort products'
                  title='Sort products'
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className='border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
                >
                  <option value='relevance'>Relevance</option>
                  <option value='price_low_to_high'>Price: Low to High</option>
                  <option value='price_high_to_low'>Price: High to Low</option>
                  <option value='rating'>Highest Rated</option>
                  <option value='newest'>Newest</option>
                  <option value='bestselling'>Best Selling</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className='flex flex-col lg:flex-row gap-8'>
          {/* Sidebar */}
          <div className='lg:w-80 flex-shrink-0'>
            <Sidebar />
          </div>

          {/* Products Grid */}
          <div className='flex-1'>
            {loading ? (
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                {[...Array(12)].map((_, index) => (
                  <div
                    key={index}
                    className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden'
                  >
                    <div className='aspect-square bg-gray-200 animate-pulse'></div>
                    <div className='p-4 space-y-3'>
                      <div className='h-4 bg-gray-200 rounded animate-pulse'></div>
                      <div className='h-4 bg-gray-200 rounded w-3/4 animate-pulse'></div>
                      <div className='h-6 bg-gray-200 rounded w-1/2 animate-pulse'></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className='text-center py-12'>
                <div className='bg-red-50 border border-red-200 rounded-lg p-8 max-w-md mx-auto'>
                  <p className='text-red-600'>{error}</p>
                </div>
              </div>
            ) : products.length === 0 ? (
              <div className='text-center py-12'>
                <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-8 max-w-md mx-auto mb-8'>
                  <p className='text-yellow-800'>
                    {currentCategory
                      ? `No products found in "${currentCategory.name}" category.`
                      : 'No products found matching your criteria.'}
                  </p>
                  <button
                    onClick={clearFilters}
                    className='mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors'
                  >
                    {currentCategory ? 'View All Products' : 'Clear Filters'}
                  </button>
                </div>
                
                {/* Show alternative banners when no products found */}
                <div className='mt-8'>
                  <h3 className='text-xl font-semibold text-gray-900 mb-4'>
                    Check out these special offers instead!
                  </h3>
                  <PromotionalBanners 
                    layout="grid"
                    limit={4}
                    autoPlay={false}
                    showTitle={false}
                    bannerTypes={['flash_sale', 'new_arrival', 'featured']}
                    className="no-products-banners"
                  />
                </div>
              </div>
            ) : (
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                    : 'space-y-6'
                }
              >
                {products.map((product, index) => (
                  <React.Fragment key={product.id}>
                    <ProductCard
                      product={product}
                      isListView={viewMode === 'list'}
                    />
                    {/* Insert inline banner every 8 products in grid view */}
                    {viewMode === 'grid' && (index + 1) % 8 === 0 && index < products.length - 1 && (
                      <div className='col-span-full my-8'>
                        <PromotionalBanners 
                          layout="grid"
                          limit={2}
                          autoPlay={false}
                          showTitle={false}
                          bannerTypes={['flash_sale', 'limited']}
                          className="inline-product-banners"
                        />
                      </div>
                    )}
                    {/* Insert inline banner every 6 products in list view */}
                    {viewMode === 'list' && (index + 1) % 6 === 0 && index < products.length - 1 && (
                      <div className='my-8'>
                        <PromotionalBanners 
                          layout="carousel"
                          limit={1}
                          autoPlay={true}
                          interval={5000}
                          showTitle={false}
                          bannerTypes={['promotion', 'featured']}
                          className="inline-product-banners-list"
                        />
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const CategoryPage: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CategoryPageContent />
    </Suspense>
  )
}

export default CategoryPage
