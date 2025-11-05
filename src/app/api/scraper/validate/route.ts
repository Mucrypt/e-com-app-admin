import { NextRequest, NextResponse } from 'next/server'
import { ProductScraperService } from '@/lib/scraper-service'

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json(
        { success: false, error: 'URL is required' },
        { status: 400 }
      )
    }

    const scraperService = ProductScraperService.getInstance()
    const validation = scraperService.validateUrl(url)

    return NextResponse.json({
      success: true,
      data: validation
    })
  } catch (error) {
    console.error('❌ Error validating URL:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to validate URL' 
      },
      { status: 500 }
    )
  }
}