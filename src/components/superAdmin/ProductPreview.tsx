'use client'

import React, { useState, useEffect } from 'react'
import { 
  FaEdit, 
  FaEye,
  FaTrash,
  FaUpload,
  FaCheck,
  FaTimes,
  FaExternalLinkAlt,
  FaImage,
  FaStar,
  FaGlobe,
  FaBoxes,
  FaSpinner,
  FaChevronLeft,
  FaChevronRight
} from 'react-icons/fa'
import { ScrapedProduct, SupportedPlatform } from '@/types/scraper.types'

interface ProductPreviewProps {
  product: ScrapedProduct
  onEdit: (product: ScrapedProduct) => void
  onImport: (product: ScrapedProduct) => void
  onDelete: (productId: string) => void
  onClose: () => void
  categories?: Array<{ id: string; name: string }>
}

const ProductPreview: React.FC<ProductPreviewProps> = ({
  product,
  onEdit,
  onImport,
  onDelete,
  onClose,
  categories = []
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editedProduct, setEditedProduct] = useState<ScrapedProduct>(product)
  const [selectedCategory, setSelectedCategory] = useState('')
  const [priceMarkup, setPriceMarkup] = useState(0)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [loading, setLoading] = useState(false)

  // Platform badge colors
  const getPlatformBadgeColor = (platform: SupportedPlatform) => {
    const colors = {
      amazon: 'bg-orange-100 text-orange-800',
      alibaba: 'bg-red-100 text-red-800',
      aliexpress: 'bg-yellow-100 text-yellow-800',
      ebay: 'bg-blue-100 text-blue-800',
      walmart: 'bg-indigo-100 text-indigo-800',
      shopify: 'bg-green-100 text-green-800',
      generic: 'bg-gray-100 text-gray-800'
    }
    return colors[platform] || colors.generic
  }

  // Calculate marked up price
  const getMarkedUpPrice = (price?: number) => {
    if (!price) return undefined
    if (priceMarkup === 0) return price
    return price * (1 + priceMarkup / 100)
  }

  // Handle save changes
  const handleSave = () => {
    const updatedProduct = {
      ...editedProduct,
      price: getMarkedUpPrice(editedProduct.price),
      original_price: editedProduct.price // Keep original as reference
    }
    onEdit(updatedProduct)
    setIsEditing(false)
  }

  // Handle import
  const handleImport = async () => {
    setLoading(true)
    try {
      const productToImport = {
        ...editedProduct,
        price: getMarkedUpPrice(editedProduct.price),
        category: selectedCategory || editedProduct.category
      }
      await onImport(productToImport)
    } finally {
      setLoading(false)
    }
  }

  // Next/Previous image navigation
  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === editedProduct.images.length - 1 ? 0 : prev + 1
    )
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? editedProduct.images.length - 1 : prev - 1
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <h2 className="text-xl font-semibold text-gray-900">Product Preview</h2>
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPlatformBadgeColor(product.source_platform)}`}>
              {product.source_platform.toUpperCase()}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <FaEdit className="mr-1" />
              {isEditing ? 'View' : 'Edit'}
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              <FaTimes className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
            {/* Left Column - Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                {editedProduct.images.length > 0 ? (
                  <>
                    <img
                      src={editedProduct.images[currentImageIndex]}
                      alt={editedProduct.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'
                      }}
                    />
                    {editedProduct.images.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
                        >
                          <FaChevronLeft />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
                        >
                          <FaChevronRight />
                        </button>
                        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                          {currentImageIndex + 1} / {editedProduct.images.length}
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FaImage className="w-12 h-12 text-gray-400" />
                  </div>
                )}
              </div>

              {/* Image Thumbnails */}
              {editedProduct.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {editedProduct.images.slice(0, 8).map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 ${
                        currentImageIndex === index ? 'border-blue-500' : 'border-transparent'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${editedProduct.title} ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200'
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Source Link */}
              <a
                href={product.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <FaExternalLinkAlt className="mr-2" />
                View Original Product
              </a>
            </div>

            {/* Right Column - Product Details */}
            <div className="space-y-6">
              {/* Basic Info */}
              <div>
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Product Title
                      </label>
                      <input
                        type="text"
                        value={editedProduct.title}
                        onChange={(e) => setEditedProduct(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        value={editedProduct.description || ''}
                        onChange={(e) => setEditedProduct(prev => ({ ...prev, description: e.target.value }))}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{editedProduct.title}</h3>
                    {editedProduct.description && (
                      <p className="text-gray-600 text-sm leading-relaxed">{editedProduct.description}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Price and Brand */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Price
                  </label>
                  {isEditing ? (
                    <input
                      type="number"
                      step="0.01"
                      value={editedProduct.price || ''}
                      onChange={(e) => setEditedProduct(prev => ({ 
                        ...prev, 
                        price: parseFloat(e.target.value) || undefined 
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <div className="text-lg font-semibold text-gray-900">
                      {editedProduct.currency || '$'}{editedProduct.price?.toFixed(2) || 'N/A'}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Brand
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedProduct.brand || ''}
                      onChange={(e) => setEditedProduct(prev => ({ ...prev, brand: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <div className="text-gray-900">{editedProduct.brand || 'N/A'}</div>
                  )}
                </div>
              </div>

              {/* Rating and Reviews */}
              {(editedProduct.rating || editedProduct.review_count) && (
                <div className="flex items-center space-x-4">
                  {editedProduct.rating && (
                    <div className="flex items-center space-x-1">
                      <FaStar className="text-yellow-400" />
                      <span className="font-medium">{editedProduct.rating}</span>
                    </div>
                  )}
                  {editedProduct.review_count && (
                    <div className="text-sm text-gray-600">
                      {editedProduct.review_count.toLocaleString()} reviews
                    </div>
                  )}
                </div>
              )}

              {/* Import Settings */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                <h4 className="font-medium text-gray-900">Import Settings</h4>
                
                {/* Category Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Category...</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Markup */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price Markup (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="1000"
                    step="5"
                    value={priceMarkup}
                    onChange={(e) => setPriceMarkup(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  {priceMarkup > 0 && editedProduct.price && (
                    <div className="mt-1 text-sm text-gray-600">
                      New price: {editedProduct.currency || '$'}{getMarkedUpPrice(editedProduct.price)?.toFixed(2)}
                    </div>
                  )}
                </div>
              </div>

              {/* Specifications */}
              {editedProduct.specifications && Object.keys(editedProduct.specifications).length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Specifications</h4>
                  <div className="bg-gray-50 rounded-lg p-3 space-y-1 max-h-32 overflow-y-auto">
                    {Object.entries(editedProduct.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between text-sm">
                        <span className="text-gray-600">{key}:</span>
                        <span className="text-gray-900 font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col space-y-3 pt-4 border-t border-gray-200">
                {isEditing && (
                  <div className="flex space-x-3">
                    <button
                      onClick={handleSave}
                      className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      <FaCheck className="mr-2" />
                      Save Changes
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false)
                        setEditedProduct(product)
                      }}
                      className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                    >
                      <FaTimes className="mr-2" />
                      Cancel
                    </button>
                  </div>
                )}
                
                <button
                  onClick={handleImport}
                  disabled={loading || !selectedCategory}
                  className="w-full inline-flex items-center justify-center px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" />
                      Importing...
                    </>
                  ) : (
                    <>
                      <FaUpload className="mr-2" />
                      Import to Store
                    </>
                  )}
                </button>
                
                <button
                  onClick={() => onDelete(product.id || '')}
                  className="w-full inline-flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  <FaTrash className="mr-2" />
                  Delete Product
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductPreview