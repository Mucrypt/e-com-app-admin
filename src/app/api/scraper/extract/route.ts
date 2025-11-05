import { NextRequest, NextResponse } from 'next/server'

// This is a mock extraction service for development
// In production, you would use Puppeteer, Playwright, or a third-party scraping service

export async function POST(request: NextRequest) {
  try {
    const { url, config, selectors } = await request.json()

    if (!url) {
      return NextResponse.json(
        { success: false, error: 'URL is required' },
        { status: 400 }
      )
    }

    console.log(`🔍 Mock extracting data from: ${url}`)

    // Simulate extraction delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))

    // Mock extracted data based on platform
    const mockData = generateMockData(url, config?.platform)

    return NextResponse.json({
      success: true,
      product: mockData,
      extracted_at: new Date().toISOString()
    })

  } catch (error) {
    console.error('❌ Error in mock extraction:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Extraction failed' 
      },
      { status: 500 }
    )
  }
}

function generateMockData(url: string, platform?: string) {
  const urlObj = new URL(url)
  const domain = urlObj.hostname

  // Generate realistic mock data based on platform
  const mockProducts = {
    amazon: {
      title: "Premium Wireless Bluetooth Headphones - Noise Cancelling Over-Ear Headphones with Microphone",
      description: "Experience superior sound quality with these premium wireless headphones featuring active noise cancellation, 30-hour battery life, and comfortable over-ear design. Perfect for music, calls, and travel.",
      price: "$89.99",
      original_price: "$129.99",
      images: [
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
        "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500",
        "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500"
      ],
      rating: "4.5 out of 5 stars",
      review_count: "2,847 customer reviews",
      brand: "TechAudio",
      availability: "In Stock"
    },
    alibaba: {
      title: "Wholesale Custom Logo Bluetooth Wireless Headphones Bulk Order",
      description: "High-quality wireless headphones available for wholesale. Customizable with your brand logo. MOQ: 100 pieces. Fast shipping worldwide.",
      price: "$15.50 - $25.30",
      original_price: "$35.00",
      images: [
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
        "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500"
      ],
      rating: "4.2",
      review_count: "156",
      brand: "Shenzhen Audio Tech",
      availability: "Available"
    },
    aliexpress: {
      title: "Gaming Wireless Headphones RGB LED Light Noise Cancelling Headset",
      description: "Professional gaming headphones with RGB lighting effects, superior sound quality, and comfortable design for long gaming sessions.",
      price: "US $24.99",
      original_price: "US $49.99",
      images: [
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
        "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500",
        "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500"
      ],
      rating: "4.3",
      review_count: "1,234",
      brand: "GameAudio Pro",
      availability: "In Stock"
    }
  }

  // Default to a generic product if platform not recognized
  const defaultProduct = {
    title: "Wireless Bluetooth Headphones",
    description: "High-quality wireless headphones with excellent sound quality and comfortable design.",
    price: "$45.99",
    original_price: "$69.99",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500"
    ],
    rating: "4.0",
    review_count: "500",
    brand: "AudioTech",
    availability: "In Stock"
  }

  if (platform && platform in mockProducts) {
    return (mockProducts as any)[platform]
  }

  // Try to detect platform from domain
  if (domain.includes('amazon')) {
    return mockProducts.amazon
  } else if (domain.includes('alibaba')) {
    return mockProducts.alibaba
  } else if (domain.includes('aliexpress')) {
    return mockProducts.aliexpress
  }

  return defaultProduct
}