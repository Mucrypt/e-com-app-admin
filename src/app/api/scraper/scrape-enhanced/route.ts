// Enhanced scraper API endpoint with professional APIs and AI
import { NextRequest, NextResponse } from 'next/server'
import { QuickUpgradeService } from '@/lib/quick-upgrade-service'
import { scrapingDbService } from '@/lib/scraping-database-service'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { urls, settings, use_professional_apis = true, use_ai_enhancement = true } = body

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Please provide an array of URLs to scrape'
      }, { status: 400 })
    }

    // Create enhanced scraper service
    const scraperService = new QuickUpgradeService({
      useProAPIs: use_professional_apis,
      useAI: use_ai_enhancement
    })

    // Create a new scraping job
    const job = await scrapingDbService.createScrapingJob(
      urls,
      'multi-platform',
      'system-user',
      {
        auto_import: settings?.auto_import || false,
        default_status: settings?.default_status || 'draft',
        validate_images: settings?.validate_images || true,
        max_images: settings?.max_images || 8,
        exclude_out_of_stock: settings?.exclude_out_of_stock || true,
        override_existing: settings?.override_existing || false,
        download_images: settings?.download_images || false
      }
    )

    if (job.error || !job.data) {
      return NextResponse.json({
        success: false,
        error: 'Failed to create scraping job: ' + job.error
      }, { status: 500 })
    }

    console.log(`🚀 Started enhanced scraping job: ${job.data.id}`)

    // Process URLs asynchronously
    processScrapingJobAsync(job.data.id, urls, scraperService, settings)

    return NextResponse.json({
      success: true,
      data: {
        job_id: job.data.id,
        message: `Started enhanced scraping job with ${urls.length} URLs`,
        features_enabled: {
          professional_apis: use_professional_apis && !!process.env.RAPIDAPI_KEY,
          ai_enhancement: use_ai_enhancement && !!process.env.OPENAI_API_KEY,
          rapid_api: !!process.env.RAPIDAPI_KEY,
          openai: !!process.env.OPENAI_API_KEY
        }
      }
    })

  } catch (error) {
    console.error('❌ Enhanced scraping API error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

/**
 * Process scraping job asynchronously with enhanced features
 */
async function processScrapingJobAsync(
  jobId: string, 
  urls: string[], 
  scraperService: QuickUpgradeService,
  settings: any
) {
  try {
    // Update job status to processing
    await scrapingDbService.updateScrapingJob(jobId, { status: 'processing' })
    
    const results = []
    let successCount = 0
    let failCount = 0

    console.log(`🔄 Processing ${urls.length} URLs with enhanced scraping...`)

    // Process URLs with enhanced scraping
    for (let i = 0; i < urls.length; i++) {
      const url = urls[i]
      
      try {
        console.log(`📡 Enhanced scraping ${i + 1}/${urls.length}: ${url}`)
        
        // Use enhanced scraping service
        const result = await scraperService.scrapeProductEnhanced(url)
        
        if (result.status === 'success' && result.product) {
          // Save scraped product to database
          const savedProduct = await scrapingDbService.storeScrapedProduct(result.product, jobId)
          
          if (savedProduct.data) {
            result.product.id = savedProduct.data.id
            successCount++
            
            // Auto-import if enabled
            if (settings?.auto_import) {
              try {
                await scrapingDbService.importScrapedProduct(savedProduct.data.id, {
                  category_id: settings.category_id,
                  is_active: settings.default_status === 'active'
                })
                console.log(`✅ Auto-imported product: ${result.product.title}`)
              } catch (importError) {
                console.warn(`⚠️ Auto-import failed for ${result.product.title}:`, importError)
              }
            }
            
            console.log(`✅ Enhanced scraping success: ${result.product.title}`)
          } else {
            failCount++
            console.error(`❌ Failed to save product: ${result.product.title}`)
          }
        } else {
          failCount++
          console.error(`❌ Enhanced scraping failed for ${url}: ${result.error}`)
        }
        
        results.push(result)
        
        // Update job progress
        await scrapingDbService.updateScrapingJob(jobId, {
          processed_urls: i + 1,
          successful_scrapes: successCount,
          failed_scrapes: failCount,
          results: results as any
        })
        
        // Add delay between requests to be respectful
        if (i < urls.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 2000))
        }
        
      } catch (error) {
        failCount++
        console.error(`❌ Error processing ${url}:`, error)
        
        results.push({
          url,
          status: 'failed' as const,
          error: error instanceof Error ? error.message : 'Unknown error',
          scraped_at: new Date().toISOString(),
          processing_time: 0
        })
      }
    }

    // Mark job as completed
    await scrapingDbService.updateScrapingJob(jobId, {
      status: 'completed',
      completed_at: new Date().toISOString(),
      total_urls: urls.length,
      processed_urls: urls.length,
      successful_scrapes: successCount,
      failed_scrapes: failCount,
      results: results as any
    })

    const successRate = urls.length > 0 ? (successCount / urls.length * 100).toFixed(1) : '0'
    
    console.log(`🎉 Enhanced scraping job completed: ${jobId}`)
    console.log(`📊 Results: ${successCount}/${urls.length} successful (${successRate}% success rate)`)
    console.log(`🚀 Professional APIs: ${!!process.env.RAPIDAPI_KEY ? 'Enabled' : 'Disabled'}`)
    console.log(`🤖 AI Enhancement: ${!!process.env.OPENAI_API_KEY ? 'Enabled' : 'Disabled'}`)

  } catch (error) {
    console.error(`❌ Enhanced scraping job failed: ${jobId}`, error)
    
    await scrapingDbService.updateScrapingJob(jobId, {
      status: 'failed',
      error_message: error instanceof Error ? error.message : 'Unknown error',
      completed_at: new Date().toISOString()
    })
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const jobId = searchParams.get('job_id')

    if (jobId) {
      // Get specific job details
      const job = await scrapingDbService.getScrapingJob(jobId)
      
      if (!job) {
        return NextResponse.json({
          success: false,
          error: 'Job not found'
        }, { status: 404 })
      }

      return NextResponse.json({
        success: true,
        data: { job }
      })
    } else {
      // Get all jobs for system user
      const jobs = await scrapingDbService.getUserScrapingJobs('system-user', 100)
      
      return NextResponse.json({
        success: true,
        data: { 
          jobs: jobs.data || [],
          system_status: {
            professional_apis_available: !!process.env.RAPIDAPI_KEY,
            ai_enhancement_available: !!process.env.OPENAI_API_KEY,
            amazon_api_available: !!(process.env.AMAZON_ACCESS_KEY && process.env.AMAZON_SECRET_KEY),
            ebay_api_available: !!process.env.EBAY_APP_ID
          }
        }
      })
    }

  } catch (error) {
    console.error('❌ Get scraping jobs error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}