import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const sortBy = searchParams.get('sortBy') || 'created_at'
    const order = searchParams.get('order') || 'desc'
    const limit = parseInt(searchParams.get('limit') || '20')
    const page = parseInt(searchParams.get('page') || '1')
    const minPrice = parseFloat(searchParams.get('minPrice') || '0')
    const maxPrice = parseFloat(searchParams.get('maxPrice') || '10000')
    const rating = parseInt(searchParams.get('rating') || '0')
    const onSale = searchParams.get('onSale') === 'true'
    const inStock = searchParams.get('inStock') === 'true'
    const featured = searchParams.get('featured')
    const search = searchParams.get('search')
    const includeInactive = searchParams.get('includeInactive') === 'true'

    console.log('🔍 API: Filtering by category:', category) // Debug log

    const supabase = await createClient()

    let query = supabase.from('products').select(`
        *,
        categories (
          id,
          name,
          slug,
          color
        )
      `)

    // Filter by category (handle both slug and ID)
    if (category && category !== '' && category !== 'all') {
      console.log('🏷️ API: Applying category filter for:', category)

      // Check if it's a UUID (ID) or slug
      const isUUID =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
          category
        )

      if (isUUID) {
        // Direct category ID filter
        query = query.eq('category_id', category)
        console.log('🆔 API: Filtering by category ID:', category)
      } else {
        // Get category ID by slug first
        const { data: categoryData, error: categoryError } = await supabase
          .from('categories')
          .select('id, name')
          .eq('slug', category)
          .eq('is_active', true)
          .maybeSingle()

        if (categoryError) {
          console.log('❌ API: Category lookup error:', categoryError)
          return NextResponse.json([], { status: 200 }) // Return empty array if category not found
        }

        if (categoryData) {
          query = query.eq('category_id', categoryData.id)
          console.log(
            '🏷️ API: Found category:',
            categoryData.name,
            'ID:',
            categoryData.id
          )
        } else {
          console.log('❌ API: Category not found for slug:', category)
          return NextResponse.json([], { status: 200 }) // Return empty array if category not found
        }
      }
    } else {
      console.log('📋 API: No category filter applied, showing all products')
    }

    // Active products only (unless specifically including inactive)
    if (!includeInactive) {
      query = query.eq('is_active', true)
    }

    // Price range filter
    if (minPrice > 0) {
      query = query.gte('price', minPrice)
    }
    if (maxPrice < 10000) {
      query = query.lte('price', maxPrice)
    }

    // Rating filter
    if (rating > 0) {
      query = query.gte('rating', rating)
    }

    // On sale filter
    if (onSale) {
      query = query.not('original_price', 'is', null)
      query = query.gt('original_price', 'price')
    }

    // In stock filter
    if (inStock) {
      query = query.gt('stock_quantity', 0)
    }

    // Featured filter
    if (featured === 'true') {
      query = query.eq('is_featured', true)
    }

    // Search filter
    if (search) {
      query = query.or(
        `name.ilike.%${search}%,description.ilike.%${search}%,short_description.ilike.%${search}%`
      )
    }

    // Sorting
    switch (sortBy) {
      case 'price_low_to_high':
        query = query.order('price', { ascending: true })
        break
      case 'price_high_to_low':
        query = query.order('price', { ascending: false })
        break
      case 'rating':
        query = query.order('rating', { ascending: false })
        break
      case 'bestselling':
        query = query.order('review_count', { ascending: false })
        break
      case 'newest':
        query = query.order('created_at', { ascending: false })
        break
      case 'name':
        query = query.order('name', { ascending: true })
        break
      default:
        query = query.order('created_at', { ascending: order === 'asc' })
    }

    // Pagination
    const offset = (page - 1) * limit
    query = query.range(offset, offset + limit - 1)

    const { data: products, error } = await query

    if (error) {
      console.error('❌ API: Products fetch error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch products', details: error.message },
        { status: 500 }
      )
    }

    console.log(
      `✅ API: Found ${products?.length || 0} products for category: ${
        category || 'all'
      }`
    )

    return NextResponse.json(products || [])
  } catch (error) {
    console.error('❌ API: General error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
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

    const userRole = profile?.role?.toLowerCase()
    if (userRole !== 'admin' && userRole !== 'superadmin') {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      )
    }

    const productData = await request.json()

    // Create the product
    const { data: product, error } = await supabase
      .from('products')
      .insert({
        ...productData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error('Product creation error:', error)
      return NextResponse.json(
        { error: 'Failed to create product' },
        { status: 500 }
      )
    }

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
