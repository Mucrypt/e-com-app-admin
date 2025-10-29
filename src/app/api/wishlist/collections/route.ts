import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/supabase/server'

// GET /api/wishlist/collections - Get user's wishlist collections
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: collections, error } = await supabase
      .from('wishlist_collection_stats')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching wishlist collections:', error)
      return NextResponse.json({ error: 'Failed to fetch collections' }, { status: 500 })
    }

    return NextResponse.json({ collections: collections || [] })

  } catch (error) {
    console.error('Error in wishlist collections GET:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/wishlist/collections - Create new collection
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, description, emoji, color, is_public = false } = body

    if (!name || name.trim().length === 0) {
      return NextResponse.json({ error: 'Collection name is required' }, { status: 400 })
    }

    // Check if collection name already exists for this user
    const { data: existingCollection } = await supabase
      .from('wishlist_collections')
      .select('id')
      .eq('user_id', user.id)
      .eq('name', name.trim())
      .single()

    if (existingCollection) {
      return NextResponse.json({ 
        error: 'A collection with this name already exists' 
      }, { status: 409 })
    }

    // Create new collection
    const { data: newCollection, error: createError } = await supabase
      .from('wishlist_collections')
      .insert({
        name: name.trim(),
        description: description?.trim() || null,
        emoji: emoji || null,
        color: color || null,
        is_public,
        is_default: false,
        user_id: user.id
      })
      .select()
      .single()

    if (createError) {
      console.error('Error creating wishlist collection:', createError)
      return NextResponse.json({ error: 'Failed to create collection' }, { status: 500 })
    }

    return NextResponse.json({ 
      collection: newCollection,
      message: 'Collection created successfully' 
    }, { status: 201 })

  } catch (error) {
    console.error('Error in wishlist collections POST:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}