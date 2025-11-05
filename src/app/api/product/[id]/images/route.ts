import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { action, images, mainImageIndex, imageIndex } = body
    const productId = params.id

    // Get current product
    const { data: product, error: fetchError } = await supabase
      .from('products')
      .select('images, image_url')
      .eq('id', productId)
      .single()

    if (fetchError || !product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    let updatedImages = product.images || []
    let updatedMainImage = product.image_url

    switch (action) {
      case 'reorder':
        if (!Array.isArray(images)) {
          return NextResponse.json({ error: 'Invalid images array' }, { status: 400 })
        }
        updatedImages = images
        updatedMainImage = images[0] || product.image_url
        break

      case 'setMain':
        if (typeof mainImageIndex !== 'number' || mainImageIndex < 0 || mainImageIndex >= updatedImages.length) {
          return NextResponse.json({ error: 'Invalid main image index' }, { status: 400 })
        }
        
        // Move selected image to first position
        const mainImage = updatedImages[mainImageIndex]
        updatedImages = [mainImage, ...updatedImages.filter((_: string, index: number) => index !== mainImageIndex)]
        updatedMainImage = mainImage
        break

      case 'delete':
        if (typeof imageIndex !== 'number' || imageIndex < 0 || imageIndex >= updatedImages.length) {
          return NextResponse.json({ error: 'Invalid image index' }, { status: 400 })
        }
        
        if (updatedImages.length <= 1) {
          return NextResponse.json({ error: 'Cannot delete the last image' }, { status: 400 })
        }
        
        updatedImages = updatedImages.filter((_: string, index: number) => index !== imageIndex)
        
        // If we deleted the main image, set the first remaining as main
        if (imageIndex === 0) {
          updatedMainImage = updatedImages[0] || product.image_url
        }
        break

      case 'add':
        if (!Array.isArray(images)) {
          return NextResponse.json({ error: 'Invalid images array' }, { status: 400 })
        }
        updatedImages = [...updatedImages, ...images]
        break

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    // Update product in database
    const { data: updatedProduct, error: updateError } = await supabase
      .from('products')
      .update({
        images: updatedImages,
        image_url: updatedMainImage,
        updated_at: new Date().toISOString()
      })
      .eq('id', productId)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating product images:', updateError)
      return NextResponse.json({ error: 'Failed to update product images' }, { status: 500 })
    }

    return NextResponse.json({
      message: 'Product images updated successfully',
      product: updatedProduct
    })

  } catch (error) {
    console.error('Error in product images API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const files = formData.getAll('images') as File[]
    const productId = params.id

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No images provided' }, { status: 400 })
    }

    // Get current product
    const { data: product, error: fetchError } = await supabase
      .from('products')
      .select('images')
      .eq('id', productId)
      .single()

    if (fetchError || !product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    const uploadedUrls: string[] = []

    // Upload each file to Supabase Storage
    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        continue // Skip non-image files
      }

      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}-${file.name}`
      const filePath = `products/${productId}/${fileName}`

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file)

      if (!uploadError && uploadData) {
        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath)
        
        uploadedUrls.push(publicUrl)
      }
    }

    if (uploadedUrls.length === 0) {
      return NextResponse.json({ error: 'Failed to upload images' }, { status: 500 })
    }

    // Update product with new images
    const updatedImages = [...(product.images || []), ...uploadedUrls]
    
    const { data: updatedProduct, error: updateError } = await supabase
      .from('products')
      .update({
        images: updatedImages,
        updated_at: new Date().toISOString()
      })
      .eq('id', productId)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating product with new images:', updateError)
      return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
    }

    return NextResponse.json({
      message: 'Images uploaded successfully',
      uploadedUrls,
      product: updatedProduct
    })

  } catch (error) {
    console.error('Error uploading product images:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}