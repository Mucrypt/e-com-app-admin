// Immediate upgrade API - works with your existing system
import { NextRequest, NextResponse } from 'next/server'
import { QuickUpgradeService } from '@/lib/quick-upgrade-service'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { url } = body

    if (!url) {
      return NextResponse.json({
        success: false,
        error: 'URL is required'
      }, { status: 400 })
    }

    console.log(`🚀 Quick enhanced scraping for: ${url}`)

    // Create enhanced scraper service
    const scraperService = new QuickUpgradeService({
      useProAPIs: !!process.env.RAPIDAPI_KEY,
      useAI: !!process.env.OPENAI_API_KEY
    })

    // Scrape the product with enhancements
    const result = await scraperService.scrapeProductEnhanced(url)

    // Return the enhanced result
    return NextResponse.json({
      success: result.status === 'success',
      data: result.product,
      error: result.error,
      processing_time: result.processing_time,
      features_used: {
        professional_api: result.product ? 'Used if available' : 'Fallback to scraping',
        ai_enhancement: !!process.env.OPENAI_API_KEY,
        enhanced_extraction: true
      },
      system_capabilities: {
        rapidapi_available: !!process.env.RAPIDAPI_KEY,
        openai_available: !!process.env.OPENAI_API_KEY,
        cloudinary_available: !!process.env.CLOUDINARY_CLOUD_NAME
      }
    })

  } catch (error) {
    console.error('❌ Quick scraping error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}