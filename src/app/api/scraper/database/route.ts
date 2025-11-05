import { NextRequest, NextResponse } from 'next/server'
import { scrapingDbService } from '@/lib/scraping-database-service'
import { createClient } from '@/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Get current user - require authentication for RLS compliance
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    // Check if user is SUPERADMIN (required for scraper functionality)
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profileError || !profile || (profile as any).role !== 'SUPERADMIN') {
      return NextResponse.json({ 
        error: `SUPERADMIN access required for scraper functionality. Current role: ${profile ? (profile as any).role : 'None'}` 
      }, { status: 403 })
    }

    console.log('✅ User authenticated as SUPERADMIN:', (profile as any).role)

    // Set up the database service with the authenticated supabase client
    scrapingDbService.setSupabaseClient(supabase)

    const body = await request.json()
    const { action, data } = body

    switch (action) {
      case 'store_product': {
        const { product, jobId } = data
        const result = await scrapingDbService.storeScrapedProduct(product, jobId)
        
        if (result.error) {
          return NextResponse.json({ error: result.error }, { status: 500 })
        }
        
        return NextResponse.json({ data: result.data })
      }

      case 'create_job': {
        const { urls, platform, settings } = data
        const result = await scrapingDbService.createScrapingJob(
          urls, 
          platform, 
          user.id,
          settings
        )
        
        if (result.error) {
          return NextResponse.json({ error: result.error }, { status: 500 })
        }
        
        return NextResponse.json({ data: result.data })
      }

      case 'update_job': {
        const { jobId, updates } = data
        const result = await scrapingDbService.updateScrapingJob(jobId, updates)
        
        if (result.error) {
          return NextResponse.json({ error: result.error }, { status: 500 })
        }
        
        return NextResponse.json({ data: result.data })
      }

      case 'import_product': {
        const { scrapedProductId, modifications } = data
        const result = await scrapingDbService.importScrapedProduct(
          scrapedProductId, 
          modifications
        )
        
        if (result.error) {
          return NextResponse.json({ error: result.error }, { status: 500 })
        }
        
        return NextResponse.json({ data: result.data })
      }

      case 'bulk_import': {
        const { scrapedProductIds, globalModifications } = data
        const result = await scrapingDbService.bulkImportScrapedProducts(
          scrapedProductIds,
          globalModifications
        )
        
        return NextResponse.json({ 
          data: result.data, 
          errors: result.errors 
        })
      }

      case 'bulk_delete': {
        const { scrapedProductIds } = data
        const result = await scrapingDbService.bulkDeleteScrapedProducts(scrapedProductIds)
        
        return NextResponse.json({ 
          data: result.data, 
          errors: result.errors 
        })
      }

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('Database API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Get current user - require authentication for RLS compliance
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    // Set up the database service with the authenticated supabase client
    scrapingDbService.setSupabaseClient(supabase)

    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')

    switch (action) {
      case 'get_scraped_products': {
        const platform = searchParams.get('platform') || undefined
        const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 50
        const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : 0
        
        const result = await scrapingDbService.getScrapedProducts({
          platform,
          limit,
          offset
        })
        
        if (result.error) {
          return NextResponse.json({ error: result.error }, { status: 500 })
        }
        
        return NextResponse.json({ data: result.data })
      }

      case 'get_jobs': {
        const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 50
        const result = await scrapingDbService.getUserScrapingJobs(user.id, limit)
        
        if (result.error) {
          return NextResponse.json({ error: result.error }, { status: 500 })
        }
        
        return NextResponse.json({ data: result.data })
      }

      case 'get_job': {
        const jobId = searchParams.get('jobId')
        
        if (!jobId) {
          return NextResponse.json({ error: 'Job ID required' }, { status: 400 })
        }
        
        const result = await scrapingDbService.getScrapingJob(jobId)
        
        if (result.error) {
          return NextResponse.json({ error: result.error }, { status: 500 })
        }
        
        return NextResponse.json({ data: result.data })
      }

      case 'get_statistics': {
        const result = await scrapingDbService.getImportStatistics(user.id)
        
        if (result.error) {
          return NextResponse.json({ error: result.error }, { status: 500 })
        }
        
        return NextResponse.json({ data: result.data })
      }

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('Database API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Get current user - require authentication for RLS compliance
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    // Set up the database service with the authenticated supabase client
    scrapingDbService.setSupabaseClient(supabase)

    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')

    if (!productId) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 })
    }

    const result = await scrapingDbService.deleteScrapedProduct(productId)
    
    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Database API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}