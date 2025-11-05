'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { FaArrowLeft, FaImages, FaCog, FaEye, FaEdit } from 'react-icons/fa'
import { useUserRole } from '@/hooks/useUserRole'
import ProductImageGallery from '@/components/common/ProductImageGallery'
import ProductCard from '@/components/common/ProductCard'
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
  categories?: {
    id: string
    name: string
    slug: string
    color?: string
  }
}

const ImageGalleryDemoPage: React.FC = () => {
  const { hasAdminAccess, loading: roleLoading } = useUserRole()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [viewMode, setViewMode] = useState<'gallery' | 'cards'>('gallery')

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products?limit=6')
      if (response.ok) {
        const data = await response.json()
        setProducts(data.products || [])
        if (data.products && data.products.length > 0) {
          setSelectedProduct(data.products[0])
        }
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleProductUpdate = (updatedProduct: Product) => {
    setProducts(prev => 
      prev.map(p => p.id === updatedProduct.id ? updatedProduct : p)
    )
    if (selectedProduct?.id === updatedProduct.id) {
      setSelectedProduct(updatedProduct)
    }
  }

  const getProductImages = (product: Product): string[] => {
    return parseProductImages(product)
  }

  if (loading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                href="/products" 
                className="flex items-center space-x-2 text-gray-600 hover:text-indigo-600 transition-colors"
              >
                <FaArrowLeft className="w-4 h-4" />
                <span>Back to Products</span>
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
                <FaImages className="w-6 h-6 text-indigo-600" />
                <span>Image Gallery Demo</span>
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              {hasAdminAccess && (
                <div className="flex items-center space-x-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                  <FaCog className="w-4 h-4" />
                  <span>Admin Mode Active</span>
                </div>
              )}
              
              <div className="flex items-center bg-white rounded-lg border border-gray-200 p-1">
                <button
                  onClick={() => setViewMode('gallery')}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'gallery' 
                      ? 'bg-indigo-600 text-white' 
                      : 'text-gray-600 hover:text-indigo-600'
                  }`}
                >
                  Gallery View
                </button>
                <button
                  onClick={() => setViewMode('cards')}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'cards' 
                      ? 'bg-indigo-600 text-white' 
                      : 'text-gray-600 hover:text-indigo-600'
                  }`}
                >
                  Cards View
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {viewMode === 'gallery' ? (
          /* Gallery View */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Product Selector */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-32">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Select Product</h2>
                <div className="space-y-3">
                  {products.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => setSelectedProduct(product)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                        selectedProduct?.id === product.id
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-gray-200 hover:border-indigo-300'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 relative rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={product.image_url || '/images/placeholder-product.jpg'}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 truncate">{product.name}</h3>
                          <p className="text-sm text-gray-600">${product.price.toFixed(2)}</p>
                          <p className="text-xs text-gray-500">
                            {getProductImages(product).length} image(s)
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                {hasAdminAccess && (
                  <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                    <h3 className="font-medium text-yellow-800 mb-2">Admin Features</h3>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      <li>• Drag images to reorder</li>
                      <li>• Click star to set main image</li>
                      <li>• Click trash to delete images</li>
                      <li>• Add new images via file upload</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Image Gallery */}
            <div className="lg:col-span-2">
              {selectedProduct ? (
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {selectedProduct.name}
                    </h2>
                    <p className="text-gray-600">${selectedProduct.price.toFixed(2)}</p>
                  </div>

                  <ProductImageGallery
                    images={getProductImages(selectedProduct)}
                    title={selectedProduct.name}
                    onImageReorder={hasAdminAccess ? async (newOrder) => {
                      try {
                        const response = await fetch(`/api/product/${selectedProduct.id}/images`, {
                          method: 'PATCH',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ action: 'reorder', images: newOrder }),
                        })
                        if (response.ok) {
                          const data = await response.json()
                          handleProductUpdate(data.product)
                        }
                      } catch (error) {
                        console.error('Error reordering images:', error)
                      }
                    } : undefined}
                    onSetMainImage={hasAdminAccess ? async (imageIndex) => {
                      try {
                        const response = await fetch(`/api/product/${selectedProduct.id}/images`, {
                          method: 'PATCH',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ action: 'setMain', mainImageIndex: imageIndex }),
                        })
                        if (response.ok) {
                          const data = await response.json()
                          handleProductUpdate(data.product)
                        }
                      } catch (error) {
                        console.error('Error setting main image:', error)
                      }
                    } : undefined}
                    onDeleteImage={hasAdminAccess ? async (imageIndex) => {
                      if (confirm('Are you sure you want to delete this image?')) {
                        try {
                          const response = await fetch(`/api/product/${selectedProduct.id}/images`, {
                            method: 'PATCH',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ action: 'delete', imageIndex }),
                          })
                          if (response.ok) {
                            const data = await response.json()
                            handleProductUpdate(data.product)
                          }
                        } catch (error) {
                          console.error('Error deleting image:', error)
                        }
                      }
                    } : undefined}
                    onAddImages={hasAdminAccess ? async (files) => {
                      const formData = new FormData()
                      for (let i = 0; i < files.length; i++) {
                        formData.append('images', files[i])
                      }
                      try {
                        const response = await fetch(`/api/product/${selectedProduct.id}/images`, {
                          method: 'POST',
                          body: formData,
                        })
                        if (response.ok) {
                          const data = await response.json()
                          handleProductUpdate(data.product)
                          alert('Images uploaded successfully!')
                        }
                      } catch (error) {
                        console.error('Error uploading images:', error)
                      }
                    } : undefined}
                    allowManipulation={hasAdminAccess}
                    maxHeight="600px"
                    showThumbnails={true}
                    showImageCount={true}
                    autoPlay={false}
                  />
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                  <FaImages className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-900 mb-2">No Product Selected</h3>
                  <p className="text-gray-600">Select a product from the list to view its image gallery.</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Cards View */
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Products with Enhanced Image Galleries</h2>
              <p className="text-gray-600">
                Each product card includes image navigation, gallery view, and {hasAdminAccess ? 'admin manipulation features' : 'viewing capabilities'}.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  viewMode="grid"
                  showImageGallery={true}
                  allowImageManipulation={hasAdminAccess}
                  onWishlistToggle={(productId) => {
                    console.log('Toggle wishlist for product:', productId)
                  }}
                  onAddToCart={(productId) => {
                    console.log('Add to cart:', productId)
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Features Overview */}
        <div className="mt-16 bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Enhanced Image Gallery Features
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-blue-50 rounded-xl">
              <FaEye className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Multi-Image Navigation</h3>
              <p className="text-sm text-gray-600">Navigate through multiple product images with smooth transitions</p>
            </div>
            
            <div className="text-center p-6 bg-green-50 rounded-xl">
              <FaImages className="w-8 h-8 text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Fullscreen Gallery</h3>
              <p className="text-sm text-gray-600">View images in fullscreen mode with keyboard navigation</p>
            </div>
            
            <div className="text-center p-6 bg-purple-50 rounded-xl">
              <FaCog className="w-8 h-8 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Thumbnail Navigation</h3>
              <p className="text-sm text-gray-600">Quick access to any image via thumbnail gallery</p>
            </div>
            
            {hasAdminAccess && (
              <div className="text-center p-6 bg-yellow-50 rounded-xl">
                <FaEdit className="w-8 h-8 text-yellow-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Admin Controls</h3>
                <p className="text-sm text-gray-600">Reorder, delete, and manage product images with drag & drop</p>
              </div>
            )}
          </div>

          {!hasAdminAccess && (
            <div className="mt-8 p-6 bg-gray-50 border border-gray-200 rounded-xl text-center">
              <p className="text-gray-600">
                <strong>Note:</strong> Admin features like image manipulation are only available to admin users. 
                <Link href="/Authentication" className="text-indigo-600 hover:text-indigo-700 ml-1">
                  Sign in as admin
                </Link> to access these features.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ImageGalleryDemoPage