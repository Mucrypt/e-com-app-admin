import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/supabase/server'

interface RouteParams {
  params: {
    id: string
  }
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    // Validate UUID format
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(id)) {
      return NextResponse.json(
        { error: 'Invalid banner ID format' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Get current banner and increment click count
    const { data: banner, error: fetchError } = await supabase
      .from('banners')
      .select('id, title, click_count')
      .eq('id', id)
      .single()

    if (fetchError) {
      console.error('❌ Error fetching banner:', fetchError)
      return NextResponse.json({ error: 'Banner not found' }, { status: 404 })
    }

    const newClickCount = (banner.click_count || 0) + 1

    // Update click count
    const { error: updateError } = await supabase
      .from('banners')
      .update({
        click_count: newClickCount,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)

    if (updateError) {
      console.error('❌ Error updating banner click count:', updateError)
      return NextResponse.json(
        { error: 'Failed to track click' },
        { status: 500 }
      )
    }

    console.log(`✅ Banner click tracked: ${banner.title} (${newClickCount} clicks)`)

    return NextResponse.json({
      success: true,
      message: 'Click tracked successfully',
      banner_id: id,
      click_count: newClickCount,
    })
  } catch (error) {
    console.error('❌ Unexpected error in banner click tracking:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
