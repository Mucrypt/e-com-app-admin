// Quick integration service for immediate quality improvements
// Works with your existing system while adding professional API support

import { ScrapedProduct, SupportedPlatform, ScrapingResult } from '@/types/scraper.types'

export interface QuickAPIConfig {
  rapidAPIKey?: string
  openAIKey?: string
  useAI?: boolean
  useProAPIs?: boolean
}

export class QuickUpgradeService {
  private rapidAPIKey: string
  private openAIKey: string
  private useAI: boolean
  private useProAPIs: boolean

  constructor(config: QuickAPIConfig = {}) {
    this.rapidAPIKey = config.rapidAPIKey || process.env.RAPIDAPI_KEY || ''
    this.openAIKey = config.openAIKey || process.env.OPENAI_API_KEY || ''
    this.useAI = config.useAI ?? true
    this.useProAPIs = config.useProAPIs ?? true
  }

  /**
   * Enhanced product scraping with API fallbacks and AI enhancement
   */
  async scrapeProductEnhanced(url: string): Promise<ScrapingResult> {
    const startTime = Date.now()
    
    try {
      console.log(`🚀 Enhanced scraping for: ${url}`)
      
      // Step 1: Try professional APIs first
      if (this.useProAPIs && this.rapidAPIKey) {
        try {
          const apiProduct = await this.tryProfessionalAPIs(url)
          if (apiProduct) {
            const enhanced = this.useAI ? await this.enhanceWithAI(apiProduct) : apiProduct
            
            return {
              url,
              status: 'success',
              product: enhanced,
              scraped_at: new Date().toISOString(),
              processing_time: Date.now() - startTime
            }
          }
        } catch (error) {
          console.warn('⚠️ Professional API failed, falling back to scraping:', error)
        }
      }
      
      // Step 2: Enhanced web scraping with better selectors
      try {
        const scrapedProduct = await this.enhancedWebScraping(url)
        const enhanced = this.useAI ? await this.enhanceWithAI(scrapedProduct) : scrapedProduct
        
        return {
          url,
          status: 'success',
          product: enhanced,
          scraped_at: new Date().toISOString(),
          processing_time: Date.now() - startTime
        }
      } catch (error) {
        console.error('❌ Enhanced scraping failed:', error)
        
        return {
          url,
          status: 'failed',
          error: error instanceof Error ? error.message : 'Unknown error',
          scraped_at: new Date().toISOString(),
          processing_time: Date.now() - startTime
        }
      }
      
    } catch (error) {
      return {
        url,
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        scraped_at: new Date().toISOString(),
        processing_time: Date.now() - startTime
      }
    }
  }

  /**
   * Try professional APIs for high-quality data
   */
  private async tryProfessionalAPIs(url: string): Promise<ScrapedProduct | null> {
    const domain = new URL(url).hostname.toLowerCase()
    
    if (domain.includes('amazon.')) {
      return await this.getAmazonProductViaAPI(url)
    }
    
    if (domain.includes('aliexpress.')) {
      return await this.getAliExpressProductViaAPI(url)
    }
    
    if (domain.includes('ebay.')) {
      return await this.getEbayProductViaAPI(url)
    }
    
    return null
  }

  /**
   * Amazon product via RapidAPI
   */
  private async getAmazonProductViaAPI(url: string): Promise<ScrapedProduct | null> {
    if (!this.rapidAPIKey) return null
    
    const asin = this.extractASINFromUrl(url)
    if (!asin) return null
    
    try {
      const response = await fetch('https://amazon-product-details1.p.rapidapi.com/product/details', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-RapidAPI-Key': this.rapidAPIKey,
          'X-RapidAPI-Host': 'amazon-product-details1.p.rapidapi.com'
        },
        body: JSON.stringify({
          asin: asin,
          country: 'US'
        })
      })

      if (!response.ok) throw new Error(`API response: ${response.status}`)
      
      const data = await response.json()
      
      if (data.status === 'success' && data.product) {
        const product = data.product
        
        return {
          title: product.title || 'Amazon Product',
          description: product.description || product.feature_bullets?.join(' ') || '',
          price: product.price?.current || product.price?.value || undefined,
          original_price: product.price?.original || product.price?.before || undefined,
          currency: 'USD',
          images: this.normalizeImages(product.images || []),
          brand: product.brand,
          rating: product.rating || undefined,
          review_count: product.reviews_count || undefined,
          source_url: url,
          source_platform: 'amazon',
          scraped_at: new Date().toISOString()
        }
      }
      
      return null
    } catch (error) {
      console.error('❌ Amazon API error:', error)
      return null
    }
  }

  /**
   * AliExpress product via RapidAPI
   */
  private async getAliExpressProductViaAPI(url: string): Promise<ScrapedProduct | null> {
    if (!this.rapidAPIKey) return null
    
    const productId = this.extractAliExpressProductId(url)
    if (!productId) return null
    
    try {
      const response = await fetch(`https://aliexpress-product-details.p.rapidapi.com/product?product_id=${productId}`, {
        headers: {
          'X-RapidAPI-Key': this.rapidAPIKey,
          'X-RapidAPI-Host': 'aliexpress-product-details.p.rapidapi.com'
        }
      })

      if (!response.ok) throw new Error(`API response: ${response.status}`)
      
      const data = await response.json()
      
      if (data.success && data.data) {
        const product = data.data
        
        return {
          title: product.title || 'AliExpress Product',
          description: product.description || '',
          price: product.price?.current || undefined,
          original_price: product.price?.original || undefined,
          currency: 'USD',
          images: this.normalizeImages(product.images || []),
          brand: product.store?.name || undefined,
          rating: product.rating?.average || undefined,
          review_count: product.rating?.count || undefined,
          source_url: url,
          source_platform: 'aliexpress',
          scraped_at: new Date().toISOString()
        }
      }
      
      return null
    } catch (error) {
      console.error('❌ AliExpress API error:', error)
      return null
    }
  }

  /**
   * eBay product via RapidAPI
   */
  private async getEbayProductViaAPI(url: string): Promise<ScrapedProduct | null> {
    if (!this.rapidAPIKey) return null
    
    const itemId = this.extractEbayItemId(url)
    if (!itemId) return null
    
    try {
      const response = await fetch(`https://ebay-products-search.p.rapidapi.com/item/${itemId}`, {
        headers: {
          'X-RapidAPI-Key': this.rapidAPIKey,
          'X-RapidAPI-Host': 'ebay-products-search.p.rapidapi.com'
        }
      })

      if (!response.ok) throw new Error(`API response: ${response.status}`)
      
      const data = await response.json()
      
      if (data.success && data.item) {
        const item = data.item
        
        return {
          title: item.title || 'eBay Item',
          description: item.description || '',
          price: item.price?.value || undefined,
          currency: item.price?.currency || 'USD',
          images: this.normalizeImages(item.images || []),
          source_url: url,
          source_platform: 'ebay',
          scraped_at: new Date().toISOString()
        }
      }
      
      return null
    } catch (error) {
      console.error('❌ eBay API error:', error)
      return null
    }
  }

  /**
   * Enhanced web scraping with better techniques
   */
  private async enhancedWebScraping(url: string): Promise<ScrapedProduct> {
    const domain = new URL(url).hostname.toLowerCase()
    
    // Use your existing scraper service but with enhanced user agents and headers
    const headers = {
      'User-Agent': this.getRandomUserAgent(),
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'none',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache'
    }
    
    // Add delay to avoid rate limiting
    await this.delay(Math.random() * 2000 + 1000)
    
    try {
      const response = await fetch(url, { 
        headers,
        redirect: 'follow'
      })
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      const html = await response.text()
      
      // Enhanced extraction based on platform
      if (domain.includes('amazon.')) {
        return this.extractAmazonData(html, url)
      } else if (domain.includes('alibaba.')) {
        return this.extractAlibabaData(html, url)
      } else if (domain.includes('aliexpress.')) {
        return this.extractAliExpressData(html, url)
      } else {
        return this.extractGenericData(html, url)
      }
      
    } catch (error) {
      console.error('❌ Web scraping failed:', error)
      throw new Error(`Web scraping failed: ${error}`)
    }
  }

  /**
   * Enhanced Amazon data extraction
   */
  private extractAmazonData(html: string, url: string): ScrapedProduct {
    // Extract title
    const titleMatch = html.match(/<span[^>]*id="productTitle"[^>]*>([^<]+)<\/span>/i) ||
                     html.match(/<h1[^>]*class="[^"]*product[^"]*title[^"]*"[^>]*>([^<]+)<\/h1>/i)
    const title = titleMatch ? titleMatch[1].trim() : 'Amazon Product'
    
    // Extract price - multiple patterns
    const priceMatches = html.match(/\$[\d,]+\.?\d*/g) || []
    const prices = priceMatches.map(p => parseFloat(p.replace(/[\$,]/g, ''))).filter(p => p > 0)
    const price = prices.length > 0 ? Math.min(...prices) : undefined
    const originalPrice = prices.length > 1 ? Math.max(...prices) : undefined
    
    // Extract images with enhanced patterns
    const imageMatches = html.match(/https:\/\/[^"'\s]*(?:images-amazon|media-amazon)[^"'\s]*\.(?:jpg|jpeg|png|webp)/gi) || []
    const uniqueImages = [...new Set(imageMatches)]
      .filter(img => !img.includes('1x1') && !img.includes('transparent'))
      .map(img => img.replace(/\._[A-Z0-9_]+_\./, '._AC_SL1500_.'))
      .slice(0, 8)
    
    // Extract rating
    const ratingMatch = html.match(/(\d+\.?\d*)\s*out of 5/i) || html.match(/rating[^>]*>(\d+\.?\d*)/i)
    const rating = ratingMatch ? parseFloat(ratingMatch[1]) : undefined
    
    // Extract brand
    const brandMatch = html.match(/brand[^>]*>([^<]+)</i) || html.match(/Brand:\s*([^<\n]+)/i)
    const brand = brandMatch ? brandMatch[1].trim() : undefined
    
    return {
      title,
      description: this.extractDescription(html),
      price,
      original_price: originalPrice,
      currency: 'USD',
      images: uniqueImages,
      rating,
      brand,
      source_url: url,
      source_platform: 'amazon',
      scraped_at: new Date().toISOString()
    }
  }

  /**
   * Enhanced Alibaba data extraction
   */
  private extractAlibabaData(html: string, url: string): ScrapedProduct {
    const titleMatch = html.match(/<h1[^>]*>([^<]+)<\/h1>/i) || html.match(/product[^>]*title[^>]*>([^<]+)</i)
    const title = titleMatch ? titleMatch[1].trim() : 'Alibaba Product'
    
    const priceMatches = html.match(/\$[\d,]+\.?\d*(?:\s*-\s*\$[\d,]+\.?\d*)?/g) || []
    const prices = priceMatches.flatMap(p => 
      p.match(/\$[\d,]+\.?\d*/g)?.map(price => parseFloat(price.replace(/[\$,]/g, ''))) || []
    ).filter(p => p > 0)
    
    const price = prices.length > 0 ? Math.min(...prices) : undefined
    
    // Alibaba-specific image extraction
    const imageMatches = html.match(/https:\/\/[^"'\s]*(?:alicdn|alibaba)[^"'\s]*\.(?:jpg|jpeg|png|webp)/gi) || []
    const uniqueImages = [...new Set(imageMatches)]
      .filter(img => !img.includes('avatar') && !img.includes('1x1'))
      .map(img => img.replace(/\d+x\d+/, '800x800'))
      .slice(0, 10)
    
    return {
      title,
      description: this.extractDescription(html),
      price,
      currency: 'USD',
      images: uniqueImages,
      source_url: url,
      source_platform: 'alibaba',
      scraped_at: new Date().toISOString()
    }
  }

  /**
   * Enhanced AliExpress data extraction
   */
  private extractAliExpressData(html: string, url: string): ScrapedProduct {
    const titleMatch = html.match(/<h1[^>]*>([^<]+)<\/h1>/i) || html.match(/product[^>]*title[^>]*>([^<]+)</i)
    const title = titleMatch ? titleMatch[1].trim() : 'AliExpress Product'
    
    const priceMatches = html.match(/US \$[\d,]+\.?\d*/g) || html.match(/\$[\d,]+\.?\d*/g) || []
    const prices = priceMatches.map(p => parseFloat(p.replace(/[^\d.]/g, ''))).filter(p => p > 0)
    const price = prices.length > 0 ? Math.min(...prices) : undefined
    
    const imageMatches = html.match(/https:\/\/[^"'\s]*alicdn[^"'\s]*\.(?:jpg|jpeg|png|webp)/gi) || []
    const uniqueImages = [...new Set(imageMatches)]
      .filter(img => !img.includes('1x1') && img.includes('alicdn'))
      .slice(0, 8)
    
    return {
      title,
      description: this.extractDescription(html),
      price,
      currency: 'USD',
      images: uniqueImages,
      source_url: url,
      source_platform: 'aliexpress',
      scraped_at: new Date().toISOString()
    }
  }

  /**
   * Generic data extraction for other platforms
   */
  private extractGenericData(html: string, url: string): ScrapedProduct {
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i) || html.match(/<h1[^>]*>([^<]+)<\/h1>/i)
    const title = titleMatch ? titleMatch[1].trim().split('|')[0].trim() : 'Product'
    
    const priceMatches = html.match(/[\$€£¥₹]\s*[\d,]+\.?\d*/g) || []
    const price = priceMatches.length > 0 && priceMatches[0] ? parseFloat(priceMatches[0].replace(/[^\d.]/g, '')) : undefined
    
    const imageMatches = html.match(/<img[^>]+src=["']([^"']+)["'][^>]*>/gi) || []
    const images = imageMatches
      .map(match => {
        const srcMatch = match.match(/src=["']([^"']+)["']/)
        return srcMatch ? srcMatch[1] : null
      })
      .filter((src): src is string => src !== null && src.includes('.') && !src.includes('data:'))
      .slice(0, 5)
    
    return {
      title,
      description: this.extractDescription(html),
      price,
      currency: 'USD',
      images,
      source_url: url,
      source_platform: 'generic',
      scraped_at: new Date().toISOString()
    }
  }

  /**
   * AI-powered product enhancement
   */
  private async enhanceWithAI(product: ScrapedProduct): Promise<ScrapedProduct> {
    if (!this.openAIKey || !this.useAI) return product
    
    try {
      const enhancedDescription = await this.generateEnhancedDescription(product)
      return {
        ...product,
        description: enhancedDescription || product.description
      }
    } catch (error) {
      console.warn('⚠️ AI enhancement failed:', error)
      return product
    }
  }

  /**
   * Generate enhanced description using AI
   */
  private async generateEnhancedDescription(product: ScrapedProduct): Promise<string | undefined> {
    if (!this.openAIKey) return undefined
    
    const prompt = `Improve this product description for e-commerce:

Title: ${product.title}
Current Description: ${product.description || 'No description available'}
Price: ${product.currency || '$'}${product.price || 'Not specified'}

Create a compelling, professional product description (100-200 words) that:
1. Highlights key benefits and features
2. Uses persuasive language
3. Includes relevant keywords
4. Has a clear structure

Return only the enhanced description text.`

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.openAIKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 400,
          temperature: 0.7
        })
      })

      if (!response.ok) throw new Error(`OpenAI API error: ${response.status}`)
      
      const data = await response.json()
      return data.choices?.[0]?.message?.content?.trim()
    } catch (error) {
      console.error('❌ OpenAI API error:', error)
      return undefined
    }
  }

  // Utility methods
  private extractASINFromUrl(url: string): string | null {
    const patterns = [
      /\/dp\/([A-Z0-9]{10})/,
      /\/gp\/product\/([A-Z0-9]{10})/,
      /asin=([A-Z0-9]{10})/i
    ]
    
    for (const pattern of patterns) {
      const match = url.match(pattern)
      if (match) return match[1]
    }
    
    return null
  }

  private extractAliExpressProductId(url: string): string | null {
    const match = url.match(/item\/([0-9]+)/)
    return match ? match[1] : null
  }

  private extractEbayItemId(url: string): string | null {
    const match = url.match(/itm\/([0-9]+)/)
    return match ? match[1] : null
  }

  private extractDescription(html: string): string {
    const descMatches = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i) ||
                      html.match(/description[^>]*>([^<]+)</i)
    
    return descMatches ? descMatches[1].trim() : ''
  }

  private normalizeImages(images: any[]): string[] {
    if (!Array.isArray(images)) return []
    
    return images
      .map(img => {
        if (typeof img === 'string') return img
        if (img && typeof img === 'object') return img.url || img.src || img.large || img.medium
        return null
      })
      .filter((url): url is string => Boolean(url))
      .filter(url => url.startsWith('http') && !url.includes('data:'))
      .slice(0, 8)
  }

  private getRandomUserAgent(): string {
    const userAgents = [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:120.0) Gecko/20100101 Firefox/120.0',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15'
    ]
    
    return userAgents[Math.floor(Math.random() * userAgents.length)]
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}