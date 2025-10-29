import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/supabase/server'

// GET /api/wishlist/[id] - Get specific wishlist item
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: item, error } = await supabase
      .from('wishlist_items_with_products')
      .select('*')
      .eq('id', params.id)
      .eq('user_id', user.id)
      .single()

    if (error) {
      console.error('Error fetching wishlist item:', error)
      return NextResponse.json({ error: 'Wishlist item not found' }, { status: 404 })
    }

    return NextResponse.json({ item })

  } catch (error) {
    console.error('Error in wishlist item GET:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH /api/wishlist/[id] - Update wishlist item
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { 
      collection_id,
      notes,
      priority,
      price_alert_threshold,
      quantity_wanted,
      tags
    } = body

    // Check if item exists and belongs to user
    const { data: existingItem, error: checkError } = await supabase
      .from('wishlist_items')
      .select('id, user_id')
      .eq('id', params.id)
      .eq('user_id', user.id)
      .single()

    if (checkError || !existingItem) {
      return NextResponse.json({ error: 'Wishlist item not found' }, { status: 404 })
    }

    // Update item
    const { data: updatedItem, error: updateError } = await supabase
      .from('wishlist_items')
      .update({
        collection_id,
        notes,
        priority,
        price_alert_threshold,
        quantity_wanted,
        tags,
        updated_at: new Date().toISOString()
      })
      .eq('id', params.id)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating wishlist item:', updateError)
      return NextResponse.json({ error: 'Failed to update wishlist item' }, { status: 500 })
    }

    // Get the full item details
    const { data: itemWithDetails } = await supabase
      .from('wishlist_items_with_products')
      .select('*')
      .eq('id', updatedItem.id)
      .single()

    return NextResponse.json({ 
      item: itemWithDetails,
      message: 'Item updated successfully' 
    })

  } catch (error) {
    console.error('Error in wishlist item PATCH:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/wishlist/[id] - Remove item from wishlist
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const hardDelete = searchParams.get('hard') === 'true'
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if item exists and belongs to user
    const { data: existingItem, error: checkError } = await supabase
      .from('wishlist_items')
      .select('id, user_id')
      .eq('id', params.id)
      .eq('user_id', user.id)
      .single()

    if (checkError || !existingItem) {
      return NextResponse.json({ error: 'Wishlist item not found' }, { status: 404 })
    }

    if (hardDelete) {
      // Permanently delete the item
      const { error: deleteError } = await supabase
        .from('wishlist_items')
        .delete()
        .eq('id', params.id)

      if (deleteError) {
        console.error('Error deleting wishlist item:', deleteError)
        return NextResponse.json({ error: 'Failed to delete wishlist item' }, { status: 500 })
      }
    } else {
      // Soft delete - mark as deleted
      const { error: deleteError } = await supabase
        .from('wishlist_items')
        .update({ 
          is_deleted: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', params.id)

      if (deleteError) {
        console.error('Error deleting wishlist item:', deleteError)
        return NextResponse.json({ error: 'Failed to delete wishlist item' }, { status: 500 })
      }
    }

    return NextResponse.json({ message: 'Item removed from wishlist successfully' })

  } catch (error) {
    console.error('Error in wishlist item DELETE:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}