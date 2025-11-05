import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/supabase/server'

// Define explicit interface to match the new database schema
interface BannerInsertData {
  title: string
  subtitle?: string | null
  description?: string | null
  image_url?: string | null
  mobile_image_url?: string | null
  cta_text?: string | null
  cta_url?: string | null
  background_color?: string | null
  text_color?: string | null
  gradient_from?: string | null
  gradient_to?: string | null
  position?: string | null
  banner_type?: string | null
  start_date?: string | null
  end_date?: string | null
  priority?: number | null
  sort_order?: number | null
  is_active?: boolean | null
  target_audience?: string | null
  tags?: string[] | null
  meta_data?: any | null
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    const active = searchParams.get('active')
    const placement = searchParams.get('placement')
    const types = searchParams.get('types')

    console.log('🔍 Banners API - Query params:', { limit, active, placement, types })

    const supabase = await createClient()

    let query = supabase.from('banners').select('*')

    // Filter by active status if specified
    if (active === 'true') {
      query = query.eq('is_active', true)
    } else if (active === 'false') {
      query = query.eq('is_active', false)
    }

    // Filter by placement if specified
    if (placement && placement !== 'all') {
      query = query.eq('placement', placement)
    }

    // Filter by banner types if specified
    if (types && types !== 'all') {
      const typeArray = types.split(',').map(t => t.trim())
      query = query.in('banner_type', typeArray)
    }

    // Order by priority (desc) then sort_order (asc)
    query = query.order('priority', { ascending: false, nullsFirst: false })
    query = query.order('sort_order', { ascending: true, nullsFirst: false })
    
    // Apply limit
    if (limit > 0) {
      query = query.limit(limit)
    }

    console.log('🔍 Executing query...')
    const { data: banners, error } = await query

    if (error) {
      console.error('❌ Error fetching banners:', error)
      return NextResponse.json(
        { error: 'Failed to fetch banners', details: error.message },
        { status: 500 }
      )
    }

    console.log('✅ Fetched banners:', banners?.length || 0)
    return NextResponse.json(banners || [])
  } catch (error) {
    console.error('❌ Unexpected error in banners API:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
        details: error instanceof Error ? error.stack : 'No details available'
      },
      { status: 500 }
    )
  }
}

/**
 * Creates a new banner in the database.
 * 
 * This endpoint handles banner creation with comprehensive validation for all fields including
 * required string fields, optional fields, color formats, dates, numeric values, and enums.
 * 
 * @param request - The NextRequest object containing the banner data in JSON format
 * 
 * @returns A NextResponse containing:
 * - On success (201): The created banner object
 * - On validation error (400): Error message with details about invalid fields
 * - On conflict (409): Error message when banner title already exists
 * - On server error (500): Generic error message
 * 
 * @throws {SyntaxError} When the request body contains invalid JSON
 * 
 * @example
 * ```json
 * {
 *   "title": "Summer Sale",
 *   "subtitle": "50% off all items",
 *   "description": "Limited time offer",
 *   "image_url": "https://example.com/banner.jpg",
 *   "cta_text": "Shop Now",
 *   "cta_url": "/sale",
 *   "background_color": "#ff6b6b",
 *   "position": "center",
 *   "banner_type": "promotion",
 *   "start_date": "2024-01-01T00:00:00Z",
 *   "end_date": "2024-01-31T23:59:59Z",
 *   "priority": 1,
 *   "is_active": true
 * }
 * ```
 * 
 * @remarks
 * - Title is required and must be a non-empty string
 * - Color fields must be valid hex colors (e.g., #6366f1)
 * - Position must be one of: 'left', 'center', 'right'
 * - Banner type must be one of: 'flash_sale', 'new_arrival', 'seasonal', 'promotion', 'featured', 'limited'
 * - Date fields must be valid ISO date strings
 * - Numeric fields (priority, sort_order) must be integers
 * - Tags field accepts arrays only
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    // Validate required fields
    if (!body.title || typeof body.title !== 'string') {
      return NextResponse.json(
        { error: 'Title is required and must be a string' },
        { status: 400 }
      )
    }

    // Validate optional string fields
    const stringFields = ['subtitle', 'description', 'image_url', 'mobile_image_url', 'cta_text', 'cta_url', 'position', 'banner_type', 'target_audience']
    for (const field of stringFields) {
      if (body[field] && typeof body[field] !== 'string') {
        return NextResponse.json(
          { error: `${field} must be a string` },
          { status: 400 }
        )
      }
    }

    // Validate color fields (basic hex color validation)
    const colorFields = ['background_color', 'text_color', 'gradient_from', 'gradient_to']
    for (const field of colorFields) {
      if (body[field] && !/^#[0-9A-F]{6}$/i.test(body[field])) {
        return NextResponse.json(
          { error: `${field} must be a valid hex color (e.g., #6366f1)` },
          { status: 400 }
        )
      }
    }

    // Validate date fields
    const dateFields = ['start_date', 'end_date']
    for (const field of dateFields) {
      if (body[field] && isNaN(Date.parse(body[field]))) {
        return NextResponse.json(
          { error: `${field} must be a valid ISO date string` },
          { status: 400 }
        )
      }
    }

    // Validate numeric fields
    const numericFields = ['priority', 'sort_order']
    for (const field of numericFields) {
      if (body[field] !== undefined && (typeof body[field] !== 'number' || !Number.isInteger(body[field]))) {
        return NextResponse.json(
          { error: `${field} must be an integer` },
          { status: 400 }
        )
      }
    }

    // Validate position enum
    const validPositions = ['left', 'center', 'right']
    if (body.position && !validPositions.includes(body.position)) {
      return NextResponse.json(
        { error: `Position must be one of: ${validPositions.join(', ')}` },
        { status: 400 }
      )
    }

    // Validate banner_type enum
    const validBannerTypes = ['flash_sale', 'new_arrival', 'seasonal', 'promotion', 'featured', 'limited']
    if (body.banner_type && !validBannerTypes.includes(body.banner_type)) {
      return NextResponse.json(
        { error: `Banner type must be one of: ${validBannerTypes.join(', ')}` },
        { status: 400 }
      )
    }

    // Prepare banner data using explicit interface
    const bannerData: BannerInsertData = {
      title: body.title.trim(),
      subtitle: body.subtitle?.trim() || null,
      description: body.description?.trim() || null,
      image_url: body.image_url?.trim() || null,
      mobile_image_url: body.mobile_image_url?.trim() || null,
      cta_text: body.cta_text?.trim() || null,
      cta_url: body.cta_url?.trim() || null,
      background_color: body.background_color || null,
      text_color: body.text_color || null,
      gradient_from: body.gradient_from || null,
      gradient_to: body.gradient_to || null,
      position: body.position || 'left',
      banner_type: body.banner_type || null,
      start_date: body.start_date || null,
      end_date: body.end_date || null,
      priority: body.priority !== undefined ? Number(body.priority) : 5,
      sort_order: body.sort_order !== undefined ? Number(body.sort_order) : 0,
      is_active: body.is_active !== undefined ? Boolean(body.is_active) : true,
      target_audience: body.target_audience || null,
      tags: Array.isArray(body.tags) ? body.tags : null,
      meta_data: body.meta_data || null,
    }

    // Use type assertion to bypass TypeScript type generation issues
    const { data: banner, error } = await (supabase as any)
      .from('banners')
      .insert([bannerData] as any)
      .select()
      .single()

    if (error) {
      console.error('❌ Error creating banner:', error)

      // Handle specific database errors
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'A banner with this title already exists' },
          { status: 409 }
        )
      }

      return NextResponse.json(
        { error: 'Failed to create banner', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(banner, { status: 201 })
  } catch (error) {
    console.error('❌ Unexpected error in banner creation:', error)

    // Handle JSON parsing errors
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
