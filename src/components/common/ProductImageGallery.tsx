'use client'
import React, { useState, useCallback } from 'react'
import Image from 'next/image'
import { 
  FaChevronLeft, 
  FaChevronRight, 
  FaExpand, 
  FaStar, 
  FaEye,
  FaEdit,
  FaTrash,
  FaArrowUp,
  FaArrowDown,
  FaImage,
  FaTimes
} from 'react-icons/fa'

interface ProductImageGalleryProps {
  images: string[]
  title: string
  onImageReorder?: (newOrder: string[]) => void
  onSetMainImage?: (imageIndex: number) => void
  onDeleteImage?: (imageIndex: number) => void
  onAddImages?: (files: FileList) => void
  allowManipulation?: boolean
  className?: string
  maxHeight?: string
  showThumbnails?: boolean
  autoPlay?: boolean
  showImageCount?: boolean
}

const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({
  images = [],
  title,
  onImageReorder,
  onSetMainImage,
  onDeleteImage,
  onAddImages,
  allowManipulation = false,
  className = '',
  maxHeight = '500px',
  showThumbnails = true,
  autoPlay = false,
  showImageCount = true
}) => {
  const [selectedImage, setSelectedImage] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

  // Ensure we have at least one image
  const galleryImages = images.length > 0 ? images : ['/images/placeholder-product.jpg']

  const nextImage = useCallback(() => {
    setSelectedImage((prev) => (prev + 1) % galleryImages.length)
  }, [galleryImages.length])

  const prevImage = useCallback(() => {
    setSelectedImage((prev) => (prev - 1 + galleryImages.length) % galleryImages.length)
  }, [galleryImages.length])

  // Handle keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isFullscreen) {
        if (e.key === 'ArrowRight') nextImage()
        if (e.key === 'ArrowLeft') prevImage()
        if (e.key === 'Escape') setIsFullscreen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isFullscreen, nextImage, prevImage])

  // Auto-play functionality
  React.useEffect(() => {
    if (autoPlay && galleryImages.length > 1 && !isFullscreen) {
      const interval = setInterval(nextImage, 3000)
      return () => clearInterval(interval)
    }
  }, [autoPlay, galleryImages.length, isFullscreen, nextImage])

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    if (!allowManipulation) return
    setDraggedIndex(index)
    setIsDragging(true)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault()
    if (!allowManipulation || draggedIndex === null) return

    if (draggedIndex !== dropIndex) {
      const newImages = [...galleryImages]
      const draggedImage = newImages[draggedIndex]
      newImages.splice(draggedIndex, 1)
      newImages.splice(dropIndex, 0, draggedImage)
      
      onImageReorder?.(newImages)
      
      // Update selected image if needed
      if (selectedImage === draggedIndex) {
        setSelectedImage(dropIndex)
      } else if (selectedImage === dropIndex) {
        setSelectedImage(draggedIndex)
      }
    }

    setDraggedIndex(null)
    setIsDragging(false)
  }

  const handleSetMainImage = (index: number) => {
    onSetMainImage?.(index)
    setSelectedImage(0) // New main image becomes first
  }

  const handleDeleteImage = (index: number) => {
    if (galleryImages.length <= 1) return // Don't delete last image
    onDeleteImage?.(index)
    
    // Adjust selected image if needed
    if (selectedImage >= index && selectedImage > 0) {
      setSelectedImage(selectedImage - 1)
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && onAddImages) {
      onAddImages(files)
    }
  }

  return (
    <div className={`relative ${className}`}>
      {/* Main Image Display */}
      <div 
        className="relative bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-200"
        style={{ height: maxHeight }}
      >
        <div className="relative w-full h-full group">
          <Image
            src={galleryImages[selectedImage]}
            alt={`${title} - Image ${selectedImage + 1}`}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={selectedImage === 0}
          />

          {/* Image Count Badge */}
          {showImageCount && galleryImages.length > 1 && (
            <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
              {selectedImage + 1} / {galleryImages.length}
            </div>
          )}

          {/* Navigation Arrows */}
          {galleryImages.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100"
                aria-label="Previous image"
              >
                <FaChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100"
                aria-label="Next image"
              >
                <FaChevronRight className="w-4 h-4" />
              </button>
            </>
          )}

          {/* Action Buttons */}
          <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={() => setIsFullscreen(true)}
              className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
              aria-label="View fullscreen"
            >
              <FaExpand className="w-4 h-4" />
            </button>
            
            {allowManipulation && (
              <>
                <button
                  onClick={() => handleSetMainImage(selectedImage)}
                  className="bg-blue-500/80 hover:bg-blue-600 text-white p-2 rounded-full transition-colors"
                  title="Set as main image"
                  aria-label="Set as main image"
                >
                  <FaStar className="w-4 h-4" />
                </button>
                
                {galleryImages.length > 1 && (
                  <button
                    onClick={() => handleDeleteImage(selectedImage)}
                    className="bg-red-500/80 hover:bg-red-600 text-white p-2 rounded-full transition-colors"
                    title="Delete image"
                    aria-label="Delete image"
                  >
                    <FaTrash className="w-4 h-4" />
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Thumbnail Gallery */}
      {showThumbnails && galleryImages.length > 1 && (
        <div className="mt-4 flex space-x-3 overflow-x-auto pb-2">
          {galleryImages.map((image, index) => (
            <div
              key={index}
              className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 cursor-pointer ${
                selectedImage === index
                  ? 'border-blue-500 shadow-lg scale-110'
                  : 'border-gray-200 hover:border-blue-300'
              } ${isDragging && draggedIndex === index ? 'opacity-50' : ''}`}
              onClick={() => setSelectedImage(index)}
              draggable={allowManipulation}
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
            >
              <Image
                src={image}
                alt={`${title} thumbnail ${index + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
              
              {/* Manipulation Controls */}
              {allowManipulation && (
                <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity duration-200 flex items-center justify-center space-x-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleSetMainImage(index)
                    }}
                    className="bg-blue-500 hover:bg-blue-600 text-white p-1 rounded"
                    title="Set as main"
                  >
                    <FaStar className="w-3 h-3" />
                  </button>
                  
                  {galleryImages.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteImage(index)
                      }}
                      className="bg-red-500 hover:bg-red-600 text-white p-1 rounded"
                      title="Delete"
                    >
                      <FaTrash className="w-3 h-3" />
                    </button>
                  )}
                </div>
              )}
              
              {/* Main Image Indicator */}
              {index === 0 && (
                <div className="absolute top-1 left-1 bg-yellow-500 text-white rounded-full p-1">
                  <FaStar className="w-2 h-2" />
                </div>
              )}
            </div>
          ))}
          
          {/* Add Images Button */}
          {allowManipulation && onAddImages && (
            <label className="flex-shrink-0 w-20 h-20 rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors cursor-pointer flex items-center justify-center bg-gray-50 hover:bg-gray-100">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <FaImage className="w-6 h-6 text-gray-400" />
            </label>
          )}
        </div>
      )}

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
          <div className="relative w-full h-full flex items-center justify-center p-4">
            <Image
              src={galleryImages[selectedImage]}
              alt={`${title} - Image ${selectedImage + 1}`}
              fill
              className="object-contain"
              sizes="100vw"
            />
            
            {/* Close Button */}
            <button
              onClick={() => setIsFullscreen(false)}
              className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors"
              aria-label="Close fullscreen"
            >
              <FaTimes className="w-6 h-6" />
            </button>
            
            {/* Navigation in Fullscreen */}
            {galleryImages.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-4 rounded-full transition-colors"
                  aria-label="Previous image"
                >
                  <FaChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-4 rounded-full transition-colors"
                  aria-label="Next image"
                >
                  <FaChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
            
            {/* Image Counter in Fullscreen */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full">
              {selectedImage + 1} / {galleryImages.length}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductImageGallery