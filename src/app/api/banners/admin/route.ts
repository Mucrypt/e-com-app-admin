import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/supabase/server'

// GET: Fetch all banners for admin (no filtering, includes inactive)
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    
    // Admin parameters
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || 'all' // all, active, inactive
    const type = searchParams.get('type') || 'all'
    const sortBy = searchParams.get('sortBy') || 'created_at'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    const offset = (page - 1) * limit

    let query = supabase.from('banners').select('*', { count: 'exact' })

    // Search filter
    if (search) {
      query = query.or(`title.ilike.%${search}%,subtitle.ilike.%${search}%,description.ilike.%${search}%`)
    }

    // Status filter
    if (status !== 'all') {
      query = query.eq('is_active', status === 'active')
    }

    // Type filter
    if (type !== 'all') {
      query = query.eq('banner_type', type)
    }

    // Sorting
    const ascending = sortOrder === 'asc'
    query = query.order(sortBy, { ascending })

    // Pagination
    query = query.range(offset, offset + limit - 1)

    const { data: banners, error, count } = await query

    if (error) {
      console.error('❌ Error fetching banners:', error)
      return NextResponse.json({ error: 'Failed to fetch banners' }, { status: 500 })
    }

    console.log(`✅ Fetched ${banners?.length || 0} banners for admin`)

    return NextResponse.json({
      banners: banners || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
      filters: {
        search,
        status,
        type,
        sortBy,
        sortOrder,
      },
    })
  } catch (error) {
    console.error('❌ Error in GET /api/banners/admin:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST: Create a new banner (admin only)
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    // Validate required fields
    if (!body.title?.trim()) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    // Prepare insert data
    const insertData = {
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
      start_date: body.start_date || null,
      end_date: body.end_date || null,
      priority: parseInt(body.priority) || 5,
      sort_order: parseInt(body.sort_order) || 0,
      is_active: body.is_active !== false,
      target_audience: body.target_audience || 'all',
      tags: body.tags || null,
      meta_data: body.meta_data || {},
      click_count: 0,
      impression_count: 0,
    }

    // Insert banner into database
    const { data: banner, error } = await supabase
      .from('banners')
      .insert([insertData])
      .select()
      .single()

    if (error) {
      console.error('❌ Error creating banner:', error)
      return NextResponse.json({ error: 'Failed to create banner' }, { status: 500 })
    }

    console.log('✅ Banner created successfully:', banner.title)
    return NextResponse.json(banner, { status: 201 })
  } catch (error) {
    console.error('❌ Error in POST /api/banners/admin:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
