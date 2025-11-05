import { useState } from 'react'

interface ImageManipulationHookProps {
  productId: string
  onImageUpdate?: (updatedProduct: any) => void
}

export const useImageManipulation = ({ productId, onImageUpdate }: ImageManipulationHookProps) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleImageReorder = async (newOrder: string[]) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/product/${productId}/images`, {
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
        onImageUpdate?.(data.product)
        return { success: true, product: data.product }
      } else {
        throw new Error('Failed to reorder images')
      }
    } catch (err) {
      const errorMessage = 'Failed to reorder images'
      setError(errorMessage)
      console.error('Error reordering images:', err)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const handleSetMainImage = async (imageIndex: number) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/product/${productId}/images`, {
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
        onImageUpdate?.(data.product)
        return { success: true, product: data.product }
      } else {
        throw new Error('Failed to set main image')
      }
    } catch (err) {
      const errorMessage = 'Failed to set main image'
      setError(errorMessage)
      console.error('Error setting main image:', err)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteImage = async (imageIndex: number) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/product/${productId}/images`, {
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
        onImageUpdate?.(data.product)
        return { success: true, product: data.product }
      } else {
        throw new Error('Failed to delete image')
      }
    } catch (err) {
      const errorMessage = 'Failed to delete image'
      setError(errorMessage)
      console.error('Error deleting image:', err)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const handleAddImages = async (files: FileList) => {
    setLoading(true)
    setError(null)
    
    const formData = new FormData()
    for (let i = 0; i < files.length; i++) {
      formData.append('images', files[i])
    }

    try {
      const response = await fetch(`/api/product/${productId}/images`, {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        onImageUpdate?.(data.product)
        return { success: true, product: data.product, uploadedUrls: data.uploadedUrls }
      } else {
        throw new Error('Failed to upload images')
      }
    } catch (err) {
      const errorMessage = 'Failed to upload images'
      setError(errorMessage)
      console.error('Error uploading images:', err)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    error,
    handleImageReorder,
    handleSetMainImage,
    handleDeleteImage,
    handleAddImages,
  }
}

export default useImageManipulation