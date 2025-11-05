// src/lib/cloudinary.ts

// Cloudinary configuration with better environment variable detection
const CLOUDINARY_CLOUD_NAME = 
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
  process.env.CLOUDINARY_CLOUD_NAME

const CLOUDINARY_UPLOAD_PRESET =
  process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 
  process.env.CLOUDINARY_UPLOAD_PRESET ||
  'ml_default' // Try Cloudinary's default unsigned preset first

const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`

console.log('🔧 Cloudinary Configuration:', {
  cloudName: CLOUDINARY_CLOUD_NAME,
  uploadPreset: CLOUDINARY_UPLOAD_PRESET,
  hasCloudName: !!CLOUDINARY_CLOUD_NAME,
  hasUploadPreset: !!CLOUDINARY_UPLOAD_PRESET,
  uploadUrl: CLOUDINARY_UPLOAD_URL
})

export async function uploadImageToCloudinary(file: File): Promise<string> {
  // Check if we have the required environment variables
  if (!CLOUDINARY_CLOUD_NAME) {
    throw new Error('Cloudinary is not configured. Please set CLOUDINARY_CLOUD_NAME environment variable.')
  }

  if (!CLOUDINARY_UPLOAD_PRESET) {
    throw new Error('Cloudinary upload preset is not configured. Please set CLOUDINARY_UPLOAD_PRESET environment variable.')
  }

  const data = new FormData()
  data.append('file', file)
  data.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)
  
  // Optional: Add folder organization
  data.append('folder', 'products')
  
  try {
    console.log('Uploading to Cloudinary:', {
      cloudName: CLOUDINARY_CLOUD_NAME,
      uploadPreset: CLOUDINARY_UPLOAD_PRESET,
      fileName: file.name,
      fileSize: file.size
    })

    const res = await fetch(CLOUDINARY_UPLOAD_URL, {
      method: 'POST',
      body: data,
    })
    
    const json = await res.json()
    
    // Log the response for debugging
    console.log('Cloudinary response:', json)
    
    if (!res.ok) {
      console.error('Cloudinary API error:', json)
      
      // Provide specific error messages for common issues
      if (json.error?.message?.includes('Invalid upload preset')) {
        throw new Error(`Upload preset "${CLOUDINARY_UPLOAD_PRESET}" does not exist. Please create it in your Cloudinary dashboard under Settings → Upload → Upload presets.`)
      }
      
      if (json.error?.message?.includes('Unauthorized')) {
        throw new Error(`Unauthorized upload. Make sure your upload preset "${CLOUDINARY_UPLOAD_PRESET}" is set to "Unsigned" mode.`)
      }
      
      throw new Error(`Cloudinary API error: ${json.error?.message || 'Upload failed'}`)
    }
    
    if (!json.secure_url) {
      console.error('No secure_url in response:', json)
      throw new Error(`Image upload failed: No secure URL returned`)
    }
    
    console.log('✅ Image uploaded successfully:', json.secure_url)
    return json.secure_url
  } catch (error) {
    console.error('❌ Cloudinary upload error:', error)
    console.error('Configuration:', {
      cloudName: CLOUDINARY_CLOUD_NAME,
      uploadPreset: CLOUDINARY_UPLOAD_PRESET,
      uploadUrl: CLOUDINARY_UPLOAD_URL
    })
    
    // Provide helpful error messages
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to connect to Cloudinary. Please check your internet connection.')
    }
    
    throw error
  }
}

// Helper function to validate Cloudinary configuration
export function validateCloudinaryConfig(): { isValid: boolean; errors: string[] } {
  const errors: string[] = []
  
  if (!CLOUDINARY_CLOUD_NAME) {
    errors.push('CLOUDINARY_CLOUD_NAME is not set')
  }
  
  if (!CLOUDINARY_UPLOAD_PRESET) {
    errors.push('CLOUDINARY_UPLOAD_PRESET is not set')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}
