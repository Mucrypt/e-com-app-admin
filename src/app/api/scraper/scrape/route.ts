import { NextRequest, NextResponse } from 'next/server'
import { ProductScraperService } from '@/lib/scraper-service'
import { scrapingDbService } from '@/lib/scraping-database-service'
import { createClient } from '@/supabase/server'
import { ScrapingSettings } from '@/types/scraper.types'

export async function POST(request: NextRequest) {
  try {
    const { urls, settings }: { urls: string[], settings: ScrapingSettings } = await request.json()

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return NextResponse.json(
        { success: false, error: 'URLs array is required' },
        { status: 400 }
      )
    }

    if (urls.length > 50) {
      return NextResponse.json(
        { success: false, error: 'Maximum 50 URLs allowed per batch' },
        { status: 400 }
      )
    }

    // Get authenticated user
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Check if user is SUPERADMIN
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (userError || !userData || (userData as any).role !== 'SUPERADMIN') {
      return NextResponse.json(
        { success: false, error: 'SUPERADMIN access required for scraping operations' },
        { status: 403 }
      )
    }

    console.log('🔍 Starting scraping job with', urls.length, 'URLs')

    const scraperService = ProductScraperService.getInstance()
    
    // Set up the database service with the authenticated supabase client
    scrapingDbService.setSupabaseClient(supabase)
    
    // Create scraping job in database with authenticated SUPERADMIN user
    const jobResult = await scrapingDbService.createScrapingJob(
      urls,
      'amazon', // Platform detection can be improved later
      user.id, // Use authenticated user ID
      settings
    )

    if (jobResult.error) {
      return NextResponse.json(
        { success: false, error: jobResult.error },
        { status: 500 }
      )
    }

    const jobId = jobResult.data!.id

    // Start scraping in background
    setTimeout(async () => {
      try {
        // Update job status to processing
        await scrapingDbService.updateScrapingJob(jobId, { status: 'processing' })

        const results = await scraperService.scrapeMultipleProducts(urls, {
          delay: 2000 // Add delay to avoid rate limiting
        })

        // Store each successful product in database
        let successfulScrapes = 0
        let failedScrapes = 0

        for (const result of results) {
          if (result.status === 'success' && result.product) {
            try {
              const storeResult = await scrapingDbService.storeScrapedProduct(result.product, jobId)
              if (!storeResult.error) {
                successfulScrapes++
              } else {
                console.error('Failed to store product:', storeResult.error)
                failedScrapes++
              }
            } catch (error) {
              console.error('Error storing product:', error)
              failedScrapes++
            }
          } else {
            failedScrapes++
          }
        }

        // Update job with final results
        await scrapingDbService.updateScrapingJob(jobId, {
          status: 'completed',
          processed_urls: results.length,
          successful_scrapes: successfulScrapes,
          failed_scrapes: failedScrapes,
          completed_at: new Date().toISOString()
        })

        console.log(`✅ Scraping job ${jobId} completed: ${successfulScrapes} successful, ${failedScrapes} failed`)

      } catch (error) {
        console.error(`❌ Scraping job ${jobId} failed:`, error)
        await scrapingDbService.updateScrapingJob(jobId, {
          status: 'failed',
          error_message: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    }, 100)

    return NextResponse.json({
      success: true,
      data: {
        job_id: jobId,
        status: 'processing',
        total_urls: urls.length,
        message: 'Scraping job started successfully'
      }
    })

  } catch (error) {
    console.error('❌ Error starting scraping job:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to start scraping job' 
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const jobId = searchParams.get('job_id')

    if (!jobId) {
      return NextResponse.json(
        { success: false, error: 'job_id parameter is required' },
        { status: 400 }
      )
    }

    // For development, we'll return mock job status
    // In production, you would query the database
    console.log('📊 Getting job status for:', jobId)

    // For now, return mock job status
    // In production, you would query the database
    const mockJob = {
      id: jobId,
      status: 'completed',
      total_urls: 5,
      processed_urls: 5,
      successful_scrapes: 4,
      failed_scrapes: 1,
      imported_products: 0,
      created_at: new Date(Date.now() - 300000).toISOString(),
      completed_at: new Date().toISOString(),
      results: []
    }

    return NextResponse.json({
      success: true,
      data: mockJob
    })

  } catch (error) {
    console.error('❌ Error getting job status:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to get job status' 
      },
      { status: 500 }
    )
  }
}