import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/supabase/server'

// Create a typed version for banners to avoid TypeScript issues
async function createPermissiveClient() {
  const client = await createClient()
  return client as any
}

// GET: Fetch a single banner for admin
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createPermissiveClient()
    const { id: bannerId } = await params

    if (!bannerId) {
      return NextResponse.json({ error: 'Banner ID is required' }, { status: 400 })
    }

    // Fetch banner by ID
    const { data: banner, error } = await supabase
      .from('banners')
      .select('*')
      .eq('id', bannerId)
      .single()

    if (error) {
      console.error('❌ Error fetching banner:', error)
      return NextResponse.json({ error: 'Banner not found' }, { status: 404 })
    }

    if (!banner) {
      return NextResponse.json({ error: 'Banner not found' }, { status: 404 })
    }

    console.log('✅ Banner fetched successfully:', banner.title)
    return NextResponse.json(banner)
  } catch (error) {
    console.error('❌ Error in GET /api/banners/admin/[id]:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PATCH: Update a banner
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createPermissiveClient()
    const { id: bannerId } = await params
    const body = await request.json()

    if (!bannerId) {
      return NextResponse.json({ error: 'Banner ID is required' }, { status: 400 })
    }

    // If it's a status-only update (from the toggle switch)
    if (body.is_active !== undefined && Object.keys(body).length === 1) {
      const updateData = {
        is_active: body.is_active,
        updated_at: new Date().toISOString(),
      }

      const { data: banner, error } = await supabase
        .from('banners')
        .update(updateData)
        .eq('id', bannerId)
        .select()
        .single()

      if (error) {
        console.error('❌ Error updating banner status:', error)
        return NextResponse.json({ error: 'Failed to update banner status' }, { status: 500 })
      }

      if (!banner) {
        return NextResponse.json({ error: 'Banner not found' }, { status: 404 })
      }

      console.log('✅ Banner status updated successfully:', banner.title, 'Active:', banner.is_active)
      return NextResponse.json(banner)
    }

    // If it's a placement-only update (from the placement dropdown)
    if (body.placement !== undefined && Object.keys(body).length <= 2) {
      const updateData = {
        placement: body.placement,
        placement_priority: body.placement_priority || 1,
        updated_at: new Date().toISOString(),
      }

      const { data: banner, error } = await supabase
        .from('banners')
        .update(updateData)
        .eq('id', bannerId)
        .select()
        .single()

      if (error) {
        console.error('❌ Error updating banner placement:', error)
        return NextResponse.json({ error: 'Failed to update banner placement' }, { status: 500 })
      }

      if (!banner) {
        return NextResponse.json({ error: 'Banner not found' }, { status: 404 })
      }

      console.log('✅ Banner placement updated successfully:', banner.title)
      return NextResponse.json(banner)
    }

    // Full banner update
    if (!body.title?.trim()) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    // Prepare update data
    const updateData = {
      title: body.title.trim(),
      subtitle: body.subtitle?.trim() || null,
      description: body.description?.trim() || null,
      image_url: body.image_url?.trim() || null,
      mobile_image_url: body.mobile_image_url?.trim() || null,
      cta_text: body.cta_text?.trim() || null,
      cta_url: body.cta_url?.trim() || null,
      background_color: body.background_color || '#1e40af',
      text_color: body.text_color || '#ffffff',
      gradient_from: body.gradient_from?.trim() || null,
      gradient_to: body.gradient_to?.trim() || null,
      position: body.position || 'center',
      banner_type: body.banner_type || null,
      placement: body.placement || null,
      placement_priority: body.placement_priority || null,
      start_date: body.start_date || null,
      end_date: body.end_date || null,
      priority: parseInt(body.priority) || 5,
      sort_order: parseInt(body.sort_order) || 0,
      is_active: body.is_active !== false,
      target_audience: body.target_audience || 'all',
      tags: body.tags || null,
      meta_data: body.meta_data || {},
      updated_at: new Date().toISOString(),
    }

    // Update banner in database
    const { data: banner, error } = await supabase
      .from('banners')
      .update(updateData)
      .eq('id', bannerId)
      .select()
      .single()

    if (error) {
      console.error('❌ Error updating banner:', error)
      return NextResponse.json({ error: 'Failed to update banner' }, { status: 500 })
    }

    if (!banner) {
      return NextResponse.json({ error: 'Banner not found' }, { status: 404 })
    }

    console.log('✅ Banner updated successfully:', banner.title)
    return NextResponse.json(banner)
  } catch (error) {
    console.error('❌ Error in PATCH /api/banners/admin/[id]:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE: Delete a banner
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createPermissiveClient()
    const { id: bannerId } = await params

    if (!bannerId) {
      return NextResponse.json({ error: 'Banner ID is required' }, { status: 400 })
    }

    // First check if banner exists
    const { data: existingBanner, error: fetchError } = await supabase
      .from('banners')
      .select('id, title')
      .eq('id', bannerId)
      .single()

    if (fetchError || !existingBanner) {
      return NextResponse.json({ error: 'Banner not found' }, { status: 404 })
    }

    // Delete banner from database
    const { error } = await supabase
      .from('banners')
      .delete()
      .eq('id', bannerId)

    if (error) {
      console.error('❌ Error deleting banner:', error)
      return NextResponse.json({ error: 'Failed to delete banner' }, { status: 500 })
    }

    console.log('✅ Banner deleted successfully:', existingBanner.title)
    return NextResponse.json({ message: 'Banner deleted successfully' })
  } catch (error) {
    console.error('❌ Error in DELETE /api/banners/admin/[id]:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}