import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/supabase/server'
import { scrapingDbService } from '@/lib/scraping-database-service'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const { data: product, error } = await supabase
      .from('products')
      .select(
        `
        *,
        categories (
          id,
          name,
          slug,
          color
        ),
        featured_products (
          id,
          sort_order
        )
      `
      )
      .eq('id', id)
      .single()

    if (error) {
      console.error('Product fetch error:', error)
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Add is_featured based on featured_products relationship
    const productWithFeatured = {
      ...(product as any),
      is_featured:
        (product as any).featured_products && (product as any).featured_products.length > 0,
    }

    return NextResponse.json(productWithFeatured)
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    console.log('Attempting to update product with ID:', id)

    // Get the current authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // Check if user is admin or superadmin
    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    const userRole = (profile as any)?.role?.toLowerCase()
    if (userRole !== 'admin' && userRole !== 'superadmin') {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      )
    }

    const updates = await request.json()
    console.log('Updating product:', id, 'with data:', updates)

    // Define valid product update fields to prevent schema errors
    const validProductFields = [
      'name', 'description', 'short_description', 'price', 'original_price',
      'image_url', 'images', 'brand', 'sku', 'weight', 'rating', 'review_count',
      'is_active', 'in_stock', 'stock_quantity', 'category_id', 'tags',
      'meta_title', 'meta_description', 'meta_keywords'
    ]

    // Filter out invalid fields
    const filteredUpdates = Object.fromEntries(
      Object.entries(updates).filter(([key]) => 
        validProductFields.includes(key) || key === 'is_featured'
      )
    )

    console.log('Filtered updates:', filteredUpdates)

    // Check if product exists
    const { data: existingProduct, error: checkError } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single()

    if (checkError || !existingProduct) {
      console.error('Product not found during check:', checkError)
      return NextResponse.json(
        {
          error: 'Product not found',
          requestedId: id,
        },
        { status: 404 }
      )
    }

    console.log('Found existing product:', (existingProduct as any).name)

    // Handle featured status using featured_products table
    if ('is_featured' in filteredUpdates) {
      const shouldBeFeatured = filteredUpdates.is_featured

      // Check if already featured
      const { data: featuredRecord } = await supabase
        .from('featured_products')
        .select('*')
        .eq('product_id', id)
        .single()

      if (shouldBeFeatured && !featuredRecord) {
        // Add to featured products
        const { error: featuredError } = await supabase
          .from('featured_products')
          .insert({
            product_id: id,
            sort_order: 999, // You can adjust this logic
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          } as any)

        if (featuredError) {
          console.error('Error adding to featured:', featuredError)
          return NextResponse.json(
            { error: 'Failed to add to featured products' },
            { status: 500 }
          )
        }
      } else if (!shouldBeFeatured && featuredRecord) {
        // Remove from featured products
        const { error: removeError } = await supabase
          .from('featured_products')
          .delete()
          .eq('product_id', id)

        if (removeError) {
          console.error('Error removing from featured:', removeError)
          return NextResponse.json(
            { error: 'Failed to remove from featured products' },
            { status: 500 }
          )
        }
      }

      // Remove is_featured from updates since we handle it separately
      delete filteredUpdates.is_featured
    }

    // Update other product fields if any
    let updatedProduct: any = existingProduct
    if (Object.keys(filteredUpdates).length > 0) {
      const { data, error } = await (supabase as any)
        .from('products')
        .update({
          ...filteredUpdates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Product update error:', error)
        return NextResponse.json(
          { error: 'Failed to update product', details: error },
          { status: 500 }
        )
      }
      updatedProduct = data
    }

    // Get updated featured status
    const { data: newFeaturedRecord } = await supabase
      .from('featured_products')
      .select('*')
      .eq('product_id', id)
      .single()

    const result = {
      ...updatedProduct,
      is_featured: !!newFeaturedRecord,
    }

    console.log(
      'Product updated successfully:',
      result.name,
      'Featured:',
      result.is_featured
    )
    return NextResponse.json(result)
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    // Get the current authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // Check if user is admin or superadmin
    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    const userRole = (profile as any)?.role?.toLowerCase()
    if (userRole !== 'admin' && userRole !== 'superadmin') {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      )
    }

    const updates = await request.json()

    // Define valid product update fields to prevent schema errors
    const validProductFields = [
      'name', 'description', 'short_description', 'price', 'original_price',
      'image_url', 'images', 'brand', 'sku', 'weight', 'rating', 'review_count',
      'is_active', 'in_stock', 'stock_quantity', 'category_id', 'tags',
      'meta_title', 'meta_description', 'meta_keywords'
    ]

    // Filter out invalid fields
    const filteredUpdates = Object.fromEntries(
      Object.entries(updates).filter(([key]) => validProductFields.includes(key))
    )

    console.log('PUT - Filtered updates:', filteredUpdates)

    // Update the product
    const { data, error } = await (supabase as any)
      .from('products')
      .update({
        ...filteredUpdates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Product update error:', error)
      return NextResponse.json(
        { error: 'Failed to update product' },
        { status: 500 }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    // Get the current authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // Check if user is admin or superadmin
    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    const userRole = (profile as any)?.role?.toLowerCase()
    if (userRole !== 'admin' && userRole !== 'superadmin') {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      )
    }

    // Set up the scraping service with authenticated client
    scrapingDbService.setSupabaseClient(supabase)

    // Use the service to delete the product and clean up relationships
    const { error } = await scrapingDbService.deleteProduct(id)

    if (error) {
      console.error('Product delete error:', error)
      return NextResponse.json(
        { error: 'Failed to delete product' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Product deleted successfully',
      id: id,
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
