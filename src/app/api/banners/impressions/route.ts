import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { banner_ids } = await request.json()

    if (!Array.isArray(banner_ids) || banner_ids.length === 0) {
      return NextResponse.json(
        { error: 'banner_ids must be a non-empty array' },
        { status: 400 }
      )
    }

    // Validate UUID format for all banner IDs
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    for (const id of banner_ids) {
      if (!uuidRegex.test(id)) {
        return NextResponse.json(
          { error: 'Invalid banner ID format' },
          { status: 400 }
        )
      }
    }

    // Get current banners and increment impression count for each
    const updates = []
    for (const id of banner_ids) {
      const { data: banner, error: fetchError } = await supabase
        .from('banners')
        .select('id, impression_count')
        .eq('id', id)
        .single()

      if (!fetchError && banner) {
        const newImpressionCount = (banner.impression_count || 0) + 1
        
        const { error: updateError } = await supabase
          .from('banners')
          .update({
            impression_count: newImpressionCount,
            updated_at: new Date().toISOString()
          })
          .eq('id', id)

        if (!updateError) {
          updates.push({ id, impression_count: newImpressionCount })
        }
      }
    }

    console.log(`✅ Banner impressions tracked for ${updates.length} banners`)

    return NextResponse.json({ 
      success: true,
      tracked_banners: updates.length,
      banner_updates: updates
    })

  } catch (error) {
    console.error('❌ Error in impressions API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}