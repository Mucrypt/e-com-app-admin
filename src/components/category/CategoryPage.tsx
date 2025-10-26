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
} from 'react-icons/fa'

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

  // Helper function to get product image
  const getProductImage = (product: Product): string => {
    if (product.image_url && product.image_url.trim() !== '') {
      return product.image_url
    }

    if (product.images) {
      if (typeof product.images === 'string' && product.images.trim() !== '') {
        return product.images
      }
      if (Array.isArray(product.images) && product.images.length > 0) {
        const firstImage = product.images[0]
        if (firstImage && firstImage.trim() !== '') {
          return firstImage
        }
      }
    }

    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjZjNmNGY2Ii8+Cjx0ZXh0IHg9IjIwMCIgeT0iMjAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOWNhM2FmIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTYiPk5vIEltYWdlPC90ZXh0Pgo8L3N2Zz4K'
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

    const handleAddToWishlist = (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      console.log('❤️ Add to wishlist clicked for:', product.name)
      // Add wishlist functionality here
    }

    const handleAddToCart = (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      console.log('🛒 Add to cart clicked for:', product.name)
      // Add cart functionality here
    }

    if (isListView) {
      return (
        <Link href={`/products/${product.id}`} className='block'>
          <div className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden product-card-hover group cursor-pointer hover:shadow-lg transition-all duration-300'>
            {/* List view content - same as before but with event handlers */}
            <div className='flex'>
              <div className='w-48 h-48 flex-shrink-0'>
                <Image
                  src={productImage}
                  alt={product.name}
                  width={192}
                  height={192}
                  className='w-full h-full object-cover'
                />
              </div>
              <div className='flex-1 p-6'>
                <div className='flex justify-between items-start mb-4'>
                  <div className='flex-1'>
                    <h3 className='text-xl font-semibold text-gray-900 hover:text-indigo-600 transition-colors mb-2'>
                      {product.name}
                    </h3>
                    {product.categories && (
                      <span className='inline-block bg-gray-100 text-gray-600 px-2 py-1 rounded text-sm'>
                        {product.categories.name}
                      </span>
                    )}
                  </div>
                  <div className='flex space-x-2'>
                    <button
                      className='bg-white text-gray-800 p-2 rounded-full hover:bg-gray-100 transition-colors shadow border'
                      aria-label='Quick view'
                      title='Quick view'
                      onClick={handleQuickView}
                    >
                      <FaEye className='w-4 h-4' />
                    </button>
                    <button
                      className='bg-white text-red-600 p-2 rounded-full hover:bg-red-50 transition-colors shadow border'
                      aria-label='Add to wishlist'
                      title='Add to wishlist'
                      onClick={handleAddToWishlist}
                    >
                      <FaHeart className='w-4 h-4' />
                    </button>
                    <button
                      className='bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 transition-colors shadow'
                      aria-label='Add to cart'
                      title='Add to cart'
                      onClick={handleAddToCart}
                    >
                      <FaShoppingCart className='w-4 h-4' />
                    </button>
                  </div>
                </div>

                {product.short_description && (
                  <p className='text-gray-600 mb-4 line-clamp-2'>
                    {product.short_description}
                  </p>
                )}

                {product.rating && (
                  <div className='flex items-center mb-4'>
                    <div className='flex items-center'>
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
                    {hasDiscount && (
                      <span className='bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-medium'>
                        -{discountPercentage}% OFF
                      </span>
                    )}
                  </div>

                  <div className='flex items-center text-sm text-gray-600'>
                    <span
                      className={`px-2 py-1 rounded ${
                        product.stock_quantity > 0
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {product.stock_quantity > 0 ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Link>
      )
    }

    // Grid view
    return (
      <Link href={`/products/${product.id}`} className='block'>
        <div className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer'>
          <div className='relative w-full h-64 overflow-hidden'>
            <Image
              src={productImage}
              alt={product.name}
              fill
              className='object-cover group-hover:scale-105 transition-transform duration-300'
              sizes='(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw'
              priority={false}
              unoptimized={true}
            />

            {hasDiscount && (
              <div className='absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-medium z-30'>
                -{discountPercentage}%
              </div>
            )}

            {product.is_featured && (
              <div className='absolute top-3 right-3 bg-indigo-500 text-white px-2 py-1 rounded-md text-xs font-medium z-30'>
                Featured
              </div>
            )}

            <div className='absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center z-20'>
              <div className='bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-xl border border-white/20 transform scale-90 group-hover:scale-100 transition-transform duration-300'>
                <div className='flex space-x-3'>
                  <button
                    className='bg-gray-100 text-gray-800 p-2 rounded-full hover:bg-gray-200 transition-colors'
                    aria-label='Quick view'
                    title='Quick view'
                    onClick={handleQuickView}
                  >
                    <FaEye className='w-4 h-4' />
                  </button>
                  <button
                    className='bg-red-50 text-red-600 p-2 rounded-full hover:bg-red-100 transition-colors'
                    aria-label='Add to wishlist'
                    title='Add to wishlist'
                    onClick={handleAddToWishlist}
                  >
                    <FaHeart className='w-4 h-4' />
                  </button>
                  <button
                    className='bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 transition-colors'
                    aria-label='Add to cart'
                    title='Add to cart'
                    onClick={handleAddToCart}
                  >
                    <FaShoppingCart className='w-4 h-4' />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className='p-4'>
            <h3 className='font-semibold text-gray-900 hover:text-indigo-600 transition-colors mb-2 line-clamp-2'>
              {product.name}
            </h3>

            {product.rating && (
              <div className='flex items-center mb-2'>
                <div className='flex items-center'>
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
                <span className='text-xs text-gray-600 ml-1'>
                  ({product.review_count || 0})
                </span>
              </div>
            )}

            <div className='flex items-center justify-between'>
              <div className='flex items-center space-x-2'>
                <span className='text-lg font-bold text-gray-900'>
                  ${product.price.toFixed(2)}
                </span>
                {hasDiscount && (
                  <span className='text-sm text-gray-500 line-through'>
                    ${product.original_price!.toFixed(2)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </Link>
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
                <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-8 max-w-md mx-auto'>
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
              </div>
            ) : (
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                    : 'space-y-6'
                }
              >
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    isListView={viewMode === 'list'}
                  />
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
