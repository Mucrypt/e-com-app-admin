import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/supabase/server'

// GET /api/wishlist - Get user's wishlist items
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Query parameters
    const collectionId = searchParams.get('collection_id')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')
    const sortBy = searchParams.get('sort_by') || 'created_at'
    const sortOrder = searchParams.get('sort_order') || 'desc'
    const priority = searchParams.get('priority')
    const inStock = searchParams.get('in_stock')
    const onSale = searchParams.get('on_sale')

    // Build query
    let query = supabase
      .from('wishlist_items_with_products')
      .select('*')
      .eq('user_id', user.id)
      .order(sortBy as any, { ascending: sortOrder === 'asc' })
      .range(offset, offset + limit - 1)

    // Apply filters
    if (collectionId) {
      query = query.eq('collection_id', collectionId)
    }
    if (priority) {
      query = query.eq('priority', parseInt(priority))
    }
    if (inStock !== null) {
      query = query.eq('in_stock', inStock === 'true')
    }
    if (onSale !== null) {
      query = query.eq('is_on_sale', onSale === 'true')
    }

    const { data: items, error } = await query

    if (error) {
      console.error('Error fetching wishlist items:', error)
      return NextResponse.json({ error: 'Failed to fetch wishlist items' }, { status: 500 })
    }

    // Get collections for context
    const { data: collections } = await supabase
      .from('wishlist_collection_stats')
      .select('*')
      .eq('user_id', user.id)

    return NextResponse.json({
      items: items || [],
      collections: collections || [],
      pagination: {
        limit,
        offset,
        hasMore: items?.length === limit
      }
    })

  } catch (error) {
    console.error('Error in wishlist GET:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/wishlist - Add item to wishlist
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { 
      product_id, 
      collection_id, 
      notes, 
      priority = 1, 
      price_alert_threshold,
      quantity_wanted = 1,
      added_from,
      tags 
    } = body

    if (!product_id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 })
    }

    // Check if product exists and is not deleted
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('id, name, price')
      .eq('id', product_id)
      .or('is_deleted.is.null,is_deleted.eq.false')
      .single()

    if (productError || !product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Check if item already exists in wishlist
    const { data: existingItem } = await supabase
      .from('wishlist_items')
      .select('id')
      .eq('user_id', user.id)
      .eq('product_id', product_id)
      .single()

    if (existingItem) {
      return NextResponse.json({ error: 'Item already in wishlist' }, { status: 409 })
    }

    // If no collection_id provided, get or create default collection
    let targetCollectionId = collection_id
    if (!targetCollectionId) {
      const { data: defaultCollection, error: collectionError } = await supabase
        .from('wishlist_collections')
        .select('id')
        .eq('user_id', user.id)
        .eq('is_default', true)
        .single()

      if (collectionError || !defaultCollection) {
        // Create default collection
        const { data: newCollection, error: createError } = await (supabase as any)
          .from('wishlist_collections')
          .insert({
            name: 'My Wishlist',
            description: 'Your default wishlist collection',
            is_default: true,
            user_id: user.id
          })
          .select('id')
          .single()

        if (createError || !newCollection) {
          console.error('Error creating default collection:', createError)
          return NextResponse.json({ error: 'Failed to create wishlist collection' }, { status: 500 })
        }
        targetCollectionId = (newCollection as any).id
      } else {
        targetCollectionId = (defaultCollection as any).id
      }
    }

    // Add item to wishlist
    const { data: newItem, error: insertError } = await (supabase as any)
      .from('wishlist_items')
      .insert({
        user_id: user.id,
        product_id,
        collection_id: targetCollectionId,
        notes,
        priority,
        price_alert_threshold,
        quantity_wanted,
        added_from,
        tags
      })
      .select()
      .single()

    if (insertError) {
      console.error('Error adding item to wishlist:', insertError)
      return NextResponse.json({ error: 'Failed to add item to wishlist' }, { status: 500 })
    }

    // Get the full item details
    const { data: itemWithDetails } = await supabase
      .from('wishlist_items_with_products')
      .select('*')
      .eq('id', (newItem as any).id)
      .single()

    return NextResponse.json({ 
      item: itemWithDetails,
      message: 'Item added to wishlist successfully' 
    }, { status: 201 })

  } catch (error) {
    console.error('Error in wishlist POST:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}