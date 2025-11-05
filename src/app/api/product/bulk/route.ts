import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/supabase/server'
import { scrapingDbService } from '@/lib/scraping-database-service'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Get the current authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // Check if user is admin or superadmin
    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    const userRole = (profile as any)?.role?.toLowerCase()
    if (userRole !== 'admin' && userRole !== 'superadmin') {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { action, ids } = body

    if (!action || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: 'Invalid action or product IDs' },
        { status: 400 }
      )
    }

    // Set up the scraping service with authenticated client
    scrapingDbService.setSupabaseClient(supabase)

    const results = []
    const errors = []

    switch (action) {
      case 'activate':
        for (const id of ids) {
          try {
            const { error } = await (supabase as any)
              .from('products')
              .update({ 
                is_active: true,
                updated_at: new Date().toISOString()
              })
              .eq('id', id)

            if (error) {
              errors.push({ id, error: error.message })
            } else {
              results.push({ id, success: true })
            }
          } catch (err) {
            errors.push({ id, error: (err as Error).message })
          }
        }
        break

      case 'deactivate':
        for (const id of ids) {
          try {
            const { error } = await (supabase as any)
              .from('products')
              .update({ 
                is_active: false,
                updated_at: new Date().toISOString()
              })
              .eq('id', id)

            if (error) {
              errors.push({ id, error: error.message })
            } else {
              results.push({ id, success: true })
            }
          } catch (err) {
            errors.push({ id, error: (err as Error).message })
          }
        }
        break

      case 'delete':
        for (const id of ids) {
          const { error } = await scrapingDbService.deleteProduct(id)
          
          if (error) {
            errors.push({ id, error: error.message || error })
          } else {
            results.push({ id, success: true })
          }
        }
        break

      default:
        return NextResponse.json(
          { error: 'Invalid bulk action' },
          { status: 400 }
        )
    }

    return NextResponse.json({
      message: `Bulk ${action} completed`,
      results,
      errors,
      summary: {
        total: ids.length,
        successful: results.length,
        failed: errors.length
      }
    })
  } catch (error) {
    console.error('Bulk API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}