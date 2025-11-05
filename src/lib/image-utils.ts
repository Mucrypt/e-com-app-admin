/**
 * Utility functions for handling product images across different data formats
 */

export interface ProductWithImages {
  id: string
  image_url?: string | null // Allow null values
  images?: string[] | string | null // Can be JSON string, array, or null
}

/**
 * Parse and extract all product images from various formats
 * Handles both JSON strings and arrays, ensuring no duplicates
 */
export function getProductImages(product: ProductWithImages): string[] {
  if (!product) return []

  const images: string[] = []
  const seenImages = new Set<string>()
  
  // Add main image first
  if (product.image_url && !isPlaceholderUrl(product.image_url)) {
    images.push(product.image_url)
    seenImages.add(product.image_url)
  }
  
  // Process additional images
  if (product.images) {
    if (Array.isArray(product.images)) {
      // Already an array - add images that aren't duplicates or placeholders
      product.images.forEach(img => {
        if (img && !seenImages.has(img) && !isPlaceholderUrl(img)) {
          images.push(img)
          seenImages.add(img)
        }
      })
    } else if (typeof product.images === 'string') {
      try {
        // Try parsing as JSON first
        const parsedImages = JSON.parse(product.images)
        if (Array.isArray(parsedImages)) {
          parsedImages.forEach(img => {
            if (img && !seenImages.has(img) && !isPlaceholderUrl(img)) {
              images.push(img)
              seenImages.add(img)
            }
          })
        }
      } catch (e) {
        // If parsing fails, treat as single URL if not duplicate or placeholder
        if (product.images && !seenImages.has(product.images) && !isPlaceholderUrl(product.images)) {
          images.push(product.images)
          seenImages.add(product.images)
        }
      }
    }
  }
  
  // Return only real images, no fallbacks
  return images
}

/**
 * Check if a URL is a placeholder image
 */
function isPlaceholderUrl(url: string): boolean {
  return url.includes('placeholder') || 
         url.includes('via.placeholder.com') ||
         url.includes('placehold') ||
         url.startsWith('data:image') ||
         url.includes('placeholder-product')
}

/**
 * Get the main image URL for a product
 */
export function getMainProductImage(product: ProductWithImages): string | null {
  const images = getProductImages(product)
  return images.length > 0 ? images[0] : null
}

/**
 * Get additional images (excluding the main image)
 */
export function getAdditionalProductImages(product: ProductWithImages): string[] {
  const allImages = getProductImages(product)
  return allImages.slice(1) // Return all except the first (main) image
}

/**
 * Check if product has multiple images
 */
export function hasMultipleImages(product: ProductWithImages): boolean {
  return getProductImages(product).length > 1
}

/**
 * Get image count for a product
 */
export function getImageCount(product: ProductWithImages): number {
  return getProductImages(product).length
}

/**
 * Validate if an image URL is accessible
 * Returns a promise that resolves to true if image loads, false otherwise
 */
export function validateImageUrl(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve(true)
    img.onerror = () => resolve(false)
    img.src = url
    
    // Timeout after 5 seconds
    setTimeout(() => resolve(false), 5000)
  })
}

/**
 * Filter out invalid/broken image URLs
 */
export async function getValidProductImages(product: ProductWithImages): Promise<string[]> {
  const allImages = getProductImages(product)
  const validImages: string[] = []
  
  for (const imageUrl of allImages) {
    if (!isPlaceholderUrl(imageUrl)) {
      const isValid = await validateImageUrl(imageUrl)
      if (isValid) {
        validImages.push(imageUrl)
      }
    }
  }
  
  return validImages
}

/**
 * Format images for database storage (as JSON string)
 */
export function formatImagesForStorage(images: string[]): string {
  return JSON.stringify(images.filter(img => img && img.trim() !== ''))
}

/**
 * Create a product image object for consistent handling
 */
export function createProductImageObject(
  mainImage: string,
  additionalImages: string[] = []
): { image_url: string; images: string } {
  const allImages = [mainImage, ...additionalImages].filter(img => img && img.trim() !== '')
  return {
    image_url: mainImage,
    images: formatImagesForStorage(allImages.slice(1)) // Store additional images only
  }
}

export default {
  getProductImages,
  getMainProductImage,
  getAdditionalProductImages,
  hasMultipleImages,
  getImageCount,
  validateImageUrl,
  getValidProductImages,
  formatImagesForStorage,
  createProductImageObject
}