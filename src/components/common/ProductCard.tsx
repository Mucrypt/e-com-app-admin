'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { 
  FaHeart, 
  FaRegHeart, 
  FaShoppingCart, 
  FaStar, 
  FaEye,
  FaImages,
  FaEdit,
  FaChevronLeft,
  FaChevronRight
} from 'react-icons/fa'
import { useAuth } from '@/hooks/useAuth'
import { useUserRole } from '@/hooks/useUserRole'
import ProductImageGallery from './ProductImageGallery'

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

interface ProductCardProps {
  product: Product
  isInWishlist?: boolean
  onWishlistToggle?: (productId: string) => void
  onAddToCart?: (productId: string) => void
  wishlistLoading?: boolean
  viewMode?: 'grid' | 'list'
  showImageGallery?: boolean
  allowImageManipulation?: boolean
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isInWishlist = false,
  onWishlistToggle,
  onAddToCart,
  wishlistLoading = false,
  viewMode = 'grid',
  showImageGallery = false,
  allowImageManipulation = false
}) => {
  const { hasAdminAccess } = useUserRole()
  const [showGallery, setShowGallery] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  const getProductImages = (): string[] => {
    const images: string[] = []
    if (product.image_url) images.push(product.image_url)
    
    if (product.images) {
      if (typeof product.images === 'string') {
        try {
          const parsedImages = JSON.parse(product.images)
          if (Array.isArray(parsedImages)) {
            // Add other images that aren't already the main image
            parsedImages.forEach(img => {
              if (img !== product.image_url) {
                images.push(img)
              }
            })
          }
        } catch (e) {
          // If it's just a string URL, add it if it's different from main
          if (product.images !== product.image_url) {
            images.push(product.images)
          }
        }
      } else if (Array.isArray(product.images)) {
        // Add other images that aren't already the main image
        product.images.forEach(img => {
          if (img !== product.image_url) {
            images.push(img)
          }
        })
      }
    }
    
    return images.length > 0 ? images : [product.image_url || '/images/placeholder-product.jpg']
  }

  const productImages = getProductImages()
  const hasMultipleImages = productImages.length > 1
  const hasDiscount = !!product.original_price && product.original_price > product.price
  const discountPercentage = hasDiscount 
    ? Math.round(((product.original_price! - product.price) / product.original_price!) * 100)
    : 0

  const handleImageNavigation = (direction: 'prev' | 'next') => {
    if (!hasMultipleImages) return
    
    setSelectedImageIndex(prev => {
      if (direction === 'next') {
        return (prev + 1) % productImages.length
      } else {
        return (prev - 1 + productImages.length) % productImages.length
      }
    })
  }

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onWishlistToggle?.(product.id)
  }

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onAddToCart?.(product.id)
  }

  const handleViewGallery = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setShowGallery(true)
  }

  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Product Image */}
          <div className="relative w-full md:w-48 h-48 flex-shrink-0">
            <div className="relative w-full h-full rounded-xl overflow-hidden group">
              <Image
                src={productImages[selectedImageIndex]}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, 192px"
              />
              
              {/* Image Navigation for Multiple Images */}
              {hasMultipleImages && (
                <>
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      handleImageNavigation('prev')
                    }}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <FaChevronLeft className="w-3 h-3" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      handleImageNavigation('next')
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <FaChevronRight className="w-3 h-3" />
                  </button>
                  
                  {/* Image Counter */}
                  <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                    {selectedImageIndex + 1}/{productImages.length}
                  </div>
                </>
              )}
              
              {/* Gallery Button */}
              {(showImageGallery || hasMultipleImages) && (
                <button
                  onClick={handleViewGallery}
                  className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  title="View all images"
                >
                  <FaImages className="w-3 h-3" />
                </button>
              )}
              
              {/* Badges */}
              {hasDiscount && (
                <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                  {discountPercentage}% OFF
                </div>
              )}
              {product.is_featured && (
                <div className="absolute top-8 left-2 bg-purple-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                  Featured
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex-1 space-y-4">
            <div>
              {product.categories && (
                <span 
                  className="inline-block text-xs px-2 py-1 rounded-full text-white font-medium mb-2"
                  style={{ backgroundColor: product.categories.color || '#6366f1' }}
                >
                  {product.categories.name}
                </span>
              )}
              <Link href={`/products/${product.id}`}>
                <h3 className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2">
                  {product.name}
                </h3>
              </Link>
              {product.short_description && (
                <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                  {product.short_description}
                </p>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, index) => (
                  <FaStar
                    key={index}
                    className={`w-4 h-4 ${
                      index < Math.floor(product.rating || 4.5)
                        ? 'text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">
                ({product.review_count || 0})
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-x-2">
                <span className="text-2xl font-bold text-blue-600">
                  ${product.price.toFixed(2)}
                </span>
                {hasDiscount && (
                  <span className="text-lg text-gray-500 line-through">
                    ${product.original_price!.toFixed(2)}
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleWishlistClick}
                  disabled={wishlistLoading}
                  className={`p-2 rounded-full transition-colors ${
                    isInWishlist 
                      ? 'text-red-500 hover:text-red-600' 
                      : 'text-gray-400 hover:text-red-500'
                  } ${wishlistLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isInWishlist ? <FaHeart className="w-5 h-5" /> : <FaRegHeart className="w-5 h-5" />}
                </button>
                
                <button
                  onClick={handleAddToCartClick}
                  disabled={product.stock_quantity === 0}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaShoppingCart className="w-4 h-4" />
                </button>
                
                <Link
                  href={`/products/${product.id}`}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-lg transition-colors"
                >
                  <FaEye className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Image Gallery Modal */}
        {showGallery && (
          <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
            <div className="relative w-full max-w-4xl">
              <ProductImageGallery
                images={productImages}
                title={product.name}
                allowManipulation={allowImageManipulation && hasAdminAccess}
                maxHeight="80vh"
                showThumbnails={true}
                showImageCount={true}
              />
              <button
                onClick={() => setShowGallery(false)}
                className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
              >
                <span className="sr-only">Close gallery</span>
                ✕
              </button>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Grid view
  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={productImages[selectedImageIndex]}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-110"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
        />
        
        {/* Image Navigation for Multiple Images */}
        {hasMultipleImages && (
          <>
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                handleImageNavigation('prev')
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <FaChevronLeft className="w-3 h-3" />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                handleImageNavigation('next')
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <FaChevronRight className="w-3 h-3" />
            </button>
            
            {/* Image Counter */}
            <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
              {selectedImageIndex + 1}/{productImages.length}
            </div>
          </>
        )}
        
        {/* Gallery Button */}
        {(showImageGallery || hasMultipleImages) && (
          <button
            onClick={handleViewGallery}
            className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            title="View all images"
          >
            <FaImages className="w-3 h-3" />
          </button>
        )}
        
        {/* Action Buttons */}
        <div className="absolute top-2 left-2 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleWishlistClick}
            disabled={wishlistLoading}
            className={`p-2 rounded-full transition-colors ${
              isInWishlist 
                ? 'bg-red-500 text-white' 
                : 'bg-white/80 text-gray-700 hover:bg-red-500 hover:text-white'
            } ${wishlistLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isInWishlist ? <FaHeart className="w-4 h-4" /> : <FaRegHeart className="w-4 h-4" />}
          </button>
          
          <Link
            href={`/products/${product.id}`}
            className="bg-white/80 hover:bg-blue-500 hover:text-white text-gray-700 p-2 rounded-full transition-colors"
          >
            <FaEye className="w-4 h-4" />
          </Link>
        </div>
        
        {/* Badges */}
        {hasDiscount && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
            {discountPercentage}% OFF
          </div>
        )}
        {product.is_featured && (
          <div className="absolute top-8 right-2 bg-purple-500 text-white text-xs px-2 py-1 rounded-full font-bold">
            Featured
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4 space-y-3">
        {product.categories && (
          <span 
            className="inline-block text-xs px-2 py-1 rounded-full text-white font-medium"
            style={{ backgroundColor: product.categories.color || '#6366f1' }}
          >
            {product.categories.name}
          </span>
        )}
        
        <Link href={`/products/${product.id}`}>
          <h3 className="font-bold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center space-x-1">
          {[...Array(5)].map((_, index) => (
            <FaStar
              key={index}
              className={`w-4 h-4 ${
                index < Math.floor(product.rating || 4.5)
                  ? 'text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          ))}
          <span className="text-sm text-gray-600 ml-1">
            ({product.review_count || 0})
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="space-x-2">
            <span className="text-xl font-bold text-blue-600">
              ${product.price.toFixed(2)}
            </span>
            {hasDiscount && (
              <span className="text-sm text-gray-500 line-through">
                ${product.original_price!.toFixed(2)}
              </span>
            )}
          </div>
          
          <button
            onClick={handleAddToCartClick}
            disabled={product.stock_quantity === 0}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Image Gallery Modal */}
      {showGallery && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl">
            <ProductImageGallery
              images={productImages}
              title={product.name}
              allowManipulation={allowImageManipulation && hasAdminAccess}
              maxHeight="80vh"
              showThumbnails={true}
              showImageCount={true}
            />
            <button
              onClick={() => setShowGallery(false)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors text-2xl"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductCard