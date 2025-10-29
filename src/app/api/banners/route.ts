import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/supabase/server'

// Define explicit interface to bypass type generation issues
interface BannerInsertData {
  title: string
  subtitle?: string | null
  description?: string | null
  image_url?: string | null
  background_color?: string | null
  text_color?: string | null
  sort_order?: number | null
  is_active?: boolean | null
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    const active = searchParams.get('active') !== 'false'

    const supabase = await createClient()

    let query = supabase.from('banners').select('*')

    // Filter by active status
    if (active) {
      query = query.eq('is_active', true)
    }

    // Order by sort_order (asc) - using fields that exist in current schema
    query = query.order('sort_order', { ascending: true })
    query = query.limit(limit)

    const { data: banners, error } = await query

    if (error) {
      console.error('❌ Error fetching banners:', error)
      return NextResponse.json(
        { error: 'Failed to fetch banners', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(banners || [])
  } catch (error) {
    console.error('❌ Unexpected error in banners API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

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
    if (body.subtitle && typeof body.subtitle !== 'string') {
      return NextResponse.json(
        { error: 'Subtitle must be a string' },
        { status: 400 }
      )
    }

    if (body.description && typeof body.description !== 'string') {
      return NextResponse.json(
        { error: 'Description must be a string' },
        { status: 400 }
      )
    }

    if (body.image_url && typeof body.image_url !== 'string') {
      return NextResponse.json(
        { error: 'Image URL must be a string' },
        { status: 400 }
      )
    }

    // Validate color fields (basic hex color validation)
    if (
      body.background_color &&
      !/^#[0-9A-F]{6}$/i.test(body.background_color)
    ) {
      return NextResponse.json(
        { error: 'Background color must be a valid hex color (e.g., #6366f1)' },
        { status: 400 }
      )
    }

    if (body.text_color && !/^#[0-9A-F]{6}$/i.test(body.text_color)) {
      return NextResponse.json(
        { error: 'Text color must be a valid hex color (e.g., #ffffff)' },
        { status: 400 }
      )
    }

    // Validate numeric fields
    if (
      body.sort_order !== undefined &&
      (typeof body.sort_order !== 'number' ||
        !Number.isInteger(body.sort_order))
    ) {
      return NextResponse.json(
        { error: 'Sort order must be an integer' },
        { status: 400 }
      )
    }

    // Prepare banner data using explicit interface
    const bannerData: BannerInsertData = {
      title: body.title.trim(),
      subtitle: body.subtitle?.trim() || null,
      description: body.description?.trim() || null,
      image_url: body.image_url?.trim() || null,
      background_color: body.background_color || '#6366f1',
      text_color: body.text_color || '#ffffff',
      sort_order: body.sort_order !== undefined ? Number(body.sort_order) : 0,
      is_active: body.is_active !== undefined ? Boolean(body.is_active) : true,
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
