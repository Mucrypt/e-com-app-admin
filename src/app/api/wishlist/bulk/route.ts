import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/supabase/server'

// POST /api/wishlist/bulk - Perform bulk operations on wishlist items
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { action, item_ids, collection_id, priority, notes } = body

    if (!action || !item_ids || !Array.isArray(item_ids) || item_ids.length === 0) {
      return NextResponse.json({ 
        error: 'Action and item_ids array are required' 
      }, { status: 400 })
    }

    // Verify all items belong to the user
    const { data: userItems, error: verifyError } = await supabase
      .from('wishlist_items')
      .select('id')
      .eq('user_id', user.id)
      .in('id', item_ids)

    if (verifyError || !userItems || userItems.length !== item_ids.length) {
      return NextResponse.json({ 
        error: 'Some items not found or do not belong to user' 
      }, { status: 400 })
    }

    let result: any = { success: true, affected_items: 0 }

    switch (action) {
      case 'delete':
        const { error: deleteError } = await supabase
          .from('wishlist_items')
          .update({ 
            is_deleted: true,
            updated_at: new Date().toISOString()
          })
          .in('id', item_ids)

        if (deleteError) {
          console.error('Error bulk deleting items:', deleteError)
          return NextResponse.json({ error: 'Failed to delete items' }, { status: 500 })
        }
        result.affected_items = item_ids.length
        result.message = `${item_ids.length} items deleted successfully`
        break

      case 'move_to_collection':
        if (!collection_id) {
          return NextResponse.json({ 
            error: 'collection_id is required for move operation' 
          }, { status: 400 })
        }

        const { error: moveError } = await supabase
          .from('wishlist_items')
          .update({ 
            collection_id,
            updated_at: new Date().toISOString()
          })
          .in('id', item_ids)

        if (moveError) {
          console.error('Error moving items to collection:', moveError)
          return NextResponse.json({ error: 'Failed to move items to collection' }, { status: 500 })
        }
        result.affected_items = item_ids.length
        result.message = `${item_ids.length} items moved to collection successfully`
        break

      case 'update_priority':
        if (priority === undefined) {
          return NextResponse.json({ 
            error: 'priority is required for update_priority operation' 
          }, { status: 400 })
        }

        const { error: priorityError } = await supabase
          .from('wishlist_items')
          .update({ 
            priority,
            updated_at: new Date().toISOString()
          })
          .in('id', item_ids)

        if (priorityError) {
          console.error('Error updating item priorities:', priorityError)
          return NextResponse.json({ error: 'Failed to update item priorities' }, { status: 500 })
        }
        result.affected_items = item_ids.length
        result.message = `${item_ids.length} items priority updated successfully`
        break

      case 'mark_purchased':
        const { error: purchaseError } = await supabase
          .from('wishlist_items')
          .update({ 
            is_purchased: true,
            purchased_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .in('id', item_ids)

        if (purchaseError) {
          console.error('Error marking items as purchased:', purchaseError)
          return NextResponse.json({ error: 'Failed to mark items as purchased' }, { status: 500 })
        }
        result.affected_items = item_ids.length
        result.message = `${item_ids.length} items marked as purchased successfully`
        break

      case 'add_to_cart':
        // This would typically integrate with your cart system
        // For now, we'll just return a success message
        result.affected_items = item_ids.length
        result.message = `${item_ids.length} items would be added to cart`
        result.cart_items = item_ids
        break

      default:
        return NextResponse.json({ 
          error: 'Invalid action. Supported actions: delete, move_to_collection, update_priority, mark_purchased, add_to_cart' 
        }, { status: 400 })
    }

    return NextResponse.json(result)

  } catch (error) {
    console.error('Error in wishlist bulk operation:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}