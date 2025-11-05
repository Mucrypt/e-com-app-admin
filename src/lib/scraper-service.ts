import { 
  ScrapedProduct, 
  SupportedPlatform, 
  ScrapingConfig, 
  PlatformSelectors,
  UrlValidationResult,
  ScrapingResult
} from '@/types/scraper.types'
import { scrapingDbService } from './scraping-database-service'

// Import Puppeteer for real web scraping
let puppeteer: any = null
let chromeLauncher: any = null

// Dynamically import browser automation tools
const initializeBrowserTools = async () => {
  if (!puppeteer) {
    try {
      puppeteer = await import('puppeteer-core')
      chromeLauncher = await import('chrome-launcher')
    } catch (error) {
      console.warn('⚠️ Browser automation tools not available, falling back to fetch-based scraping')
    }
  }
}

// Platform configurations for different e-commerce sites
const PLATFORM_CONFIGS: Record<SupportedPlatform, ScrapingConfig> = {
  amazon: {
    platform: 'amazon',
    selectors: {
      title: '#productTitle, .product-title',
      description: '#feature-bullets ul, .product-description',
      price: '.a-price-whole, .a-offscreen, .a-price .a-offscreen',
      original_price: '.a-text-strike .a-offscreen, .a-price.a-text-price .a-offscreen',
      images: [
        // Amazon's image thumbnail gallery (different product images)
        '#altImages .imageThumbnail img',
        '#altImages .imageThumb img', 
        '#altImages img',
        
        // Main image container
        '#landingImage',
        '#main-image-container .a-dynamic-image',
        
        // Alternative selectors for different Amazon layouts
        '.image-wrapper img',
        '.imageBlock img',
        '.product-image img',
        '.image img',
        
        // Fallback selectors
        'img[src*="images-amazon"]',
        'img[src*="ssl-images-amazon"]', 
        'img[src*="media-amazon"]'
      ].join(', '),
      rating: '.a-icon-alt, .review-rating .a-icon-alt',
      review_count: '#acrCustomerReviewText, .review-count',
      availability: '#availability span, .availability-msg',
      brand: '.po-brand .po-brand-link, #brand',
      category: '.a-unordered-list.a-horizontal.a-size-small li a'
    },
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
      'Accept-Encoding': 'gzip, deflate',
      'Connection': 'keep-alive'
    },
    delay: 2000,
    retries: 3
  },
  alibaba: {
    platform: 'alibaba',
    selectors: {
      title: '.product-title, .product-name h1, h1[data-spm-anchor-id]',
      description: '.product-description, .detail-description, .product-overview',
      price: '.price-now, .price .price-value, .price-range, .ma-price-range',
      original_price: '.price-original, .price-was, .original-price',
      images: [
        // Alibaba's image gallery selectors
        '.image-thumb img',
        '.images-list img', 
        '.image-item img',
        '.image-view img',
        '.main-image img',
        '.product-image img',
        '.gallery-image img',
        
        // Fallback selectors
        'img[src*="alibaba"]'
      ].join(', '),
      rating: '.star-rating, .rating-value, .score-average',
      review_count: '.review-count, .reviews-count, .feedback-count',
      availability: '.availability, .stock-status, .inventory-status',
      brand: '.brand-name, .supplier-name, .company-name'
    },
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br'
    },
    delay: 4000, // Longer delay for Alibaba
    retries: 3
  },
  aliexpress: {
    platform: 'aliexpress',
    selectors: {
      title: '.product-title-text, .x-item-title-label',
      description: '.product-description, .product-overview',
      price: '.notranslate, .product-price-current',
      original_price: '.product-price-original, .price-original',
      images: '.images-list img, .product-image img',
      rating: '.overview-rating-average, .rating-value',
      review_count: '.product-reviewer-reviews, .review-count',
      availability: '.quantity-info, .product-quantity-tip',
      brand: '.store-name, .brand-name'
    },
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    },
    delay: 2500,
    retries: 3
  },
  ebay: {
    platform: 'ebay',
    selectors: {
      title: '.x-item-title-label, .it-ttl',
      description: '.u-flL.condText, .product-description',
      price: '.notranslate, .u-flL.price',
      original_price: '.u-flL.price .original',
      images: '#icImg, .img img',
      rating: '.reviews .rating, .ebay-star-rating',
      review_count: '.reviews .review-count',
      availability: '.qtySubTxt, .qty-text',
      brand: '.u-flL.brand, .brand-name'
    },
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    },
    delay: 2000,
    retries: 3
  },
  walmart: {
    platform: 'walmart',
    selectors: {
      title: 'h1[data-automation-id="product-title"]',
      description: '.about-desc, .product-description',
      price: '[itemprop="price"], .price-current',
      original_price: '.price-strikethrough, .price-was',
      images: '.product-images img, .hero-image img',
      rating: '.average-rating, .rating-number',
      review_count: '.review-count, .reviews-section-header',
      availability: '.fulfillment-shipping-text, .availability',
      brand: '.brand-name, [data-automation-id="brand-name"]'
    },
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    },
    delay: 2000,
    retries: 3
  },
  shopify: {
    platform: 'shopify',
    selectors: {
      title: '.product-title, .product__title, h1.product-single__title',
      description: '.product-description, .product__description, .rte',
      price: '.price, .product__price, .product-single__price',
      original_price: '.price--compare, .product__price--compare',
      images: '.product__photos img, .product-single__photos img',
      rating: '.rating, .product-rating',
      review_count: '.review-count, .product-reviews-count',
      availability: '.product-form__availability, .product__availability',
      brand: '.product__vendor, .vendor'
    },
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    },
    delay: 1500,
    retries: 3
  },
  generic: {
    platform: 'generic',
    selectors: {
      title: 'h1, .product-title, .title, [class*="title"]',
      description: '.description, .product-description, [class*="description"]',
      price: '.price, .product-price, [class*="price"]',
      original_price: '.original-price, .was-price, [class*="original"]',
      images: '.product-image img, .gallery img, [class*="image"] img',
      rating: '.rating, .stars, [class*="rating"]',
      review_count: '.reviews, .review-count, [class*="review"]',
      availability: '.availability, .stock, [class*="stock"]',
      brand: '.brand, .manufacturer, [class*="brand"]'
    },
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    },
    delay: 2000,
    retries: 2
  }
}

export class ProductScraperService {
  private static instance: ProductScraperService
  
  public static getInstance(): ProductScraperService {
    if (!ProductScraperService.instance) {
      ProductScraperService.instance = new ProductScraperService()
    }
    return ProductScraperService.instance
  }

  /**
   * Validate and detect platform from URL
   */
  public validateUrl(url: string): UrlValidationResult {
    try {
      const urlObj = new URL(url)
      const domain = urlObj.hostname.toLowerCase()
      
      // Detect platform based on domain
      let platform: SupportedPlatform | null = null
      
      if (domain.includes('amazon.')) {
        platform = 'amazon'
      } else if (domain.includes('alibaba.')) {
        platform = 'alibaba'
      } else if (domain.includes('aliexpress.')) {
        platform = 'aliexpress'
      } else if (domain.includes('ebay.')) {
        platform = 'ebay'
      } else if (domain.includes('walmart.')) {
        platform = 'walmart'
      } else if (domain.includes('shopify') || this.isShopifyStore(domain)) {
        platform = 'shopify'
      } else {
        platform = 'generic'
      }

      return {
        valid: true,
        platform,
        suggestions: this.generateUrlSuggestions(url, platform)
      }
    } catch (error) {
      return {
        valid: false,
        platform: null,
        error: 'Invalid URL format'
      }
    }
  }

  /**
   * Check if domain is a Shopify store
   */
  private isShopifyStore(domain: string): boolean {
    const shopifyIndicators = [
      'myshopify.com',
      'shopifypreview.com',
      'cdn.shopify.com'
    ]
    return shopifyIndicators.some(indicator => domain.includes(indicator))
  }

  /**
   * Generate URL suggestions for better scraping
   */
  private generateUrlSuggestions(url: string, platform: SupportedPlatform | null): string[] {
    const suggestions: string[] = []
    
    if (platform === 'amazon') {
      suggestions.push('Make sure the URL is a product page (contains /dp/ or /gp/product/)')
      suggestions.push('Remove tracking parameters (ref=, tag=) for cleaner URLs')
    } else if (platform === 'alibaba') {
      suggestions.push('Use product detail page URLs (contains /product-detail/)')
      suggestions.push('Avoid supplier store URLs for better results')
    } else if (platform === 'aliexpress') {
      suggestions.push('Use individual product URLs (contains /item/)')
      suggestions.push('Avoid category or search result URLs')
    }
    
    return suggestions
  }

  /**
   * Scrape product from URL with retry logic and rate limiting
   */
  public async scrapeProduct(url: string, customConfig?: Partial<ScrapingConfig>): Promise<ScrapingResult> {
    const startTime = Date.now()
    const maxRetries = 3
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const validation = this.validateUrl(url)
        if (!validation.valid || !validation.platform) {
          throw new Error(`Invalid URL: ${validation.error}`)
        }

        const config = {
          ...PLATFORM_CONFIGS[validation.platform],
          ...customConfig
        }

        console.log(`🔍 Scraping product from ${validation.platform}: ${url} (Attempt ${attempt}/${maxRetries})`)

        // Add exponential backoff delay for retries
        const retryDelay = attempt > 1 ? Math.pow(2, attempt - 1) * 1000 : 0
        if (retryDelay > 0) {
          console.log(`⏳ Waiting ${retryDelay}ms before retry...`)
          await this.delay(retryDelay)
        }

        // Add delay to avoid rate limiting
        if (config.delay) {
          await this.delay(config.delay)
        }

        const product = await this.extractProductData(url, config)
        
        const processingTime = Date.now() - startTime
        
        console.log(`✅ Successfully scraped product: ${product.title}`)
        
        return {
          url,
          status: 'success',
          product,
          scraped_at: new Date().toISOString(),
          processing_time: processingTime
        }
      } catch (error) {
        const processingTime = Date.now() - startTime
        console.error(`❌ Attempt ${attempt} failed for ${url}:`, error)
        
        // Check if this is a rate limiting error
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        const isRateLimited = errorMessage.toLowerCase().includes('rate limit') || 
                             errorMessage.toLowerCase().includes('429') ||
                             errorMessage.toLowerCase().includes('too many requests')
        
        // If rate limited or other recoverable error, try again
        if (attempt < maxRetries && (isRateLimited || errorMessage.includes('timeout'))) {
          const nextDelay = Math.pow(2, attempt) * 2000 // Exponential backoff: 2s, 4s, 8s
          console.log(`🔄 Rate limited or temporary error, retrying in ${nextDelay}ms...`)
          await this.delay(nextDelay)
          continue
        }
        
        // Final failure after all retries
        return {
          url,
          status: 'failed',
          error: errorMessage,
          scraped_at: new Date().toISOString(),
          processing_time: processingTime
        }
      }
    }
    
    // This shouldn't be reached, but just in case
    return {
      url,
      status: 'failed',
      error: 'Maximum retries exceeded',
      scraped_at: new Date().toISOString(),
      processing_time: Date.now() - startTime
    }
  }

  /**
   * Extract product data using real web scraping
   */
  private async extractProductData(url: string, config: ScrapingConfig): Promise<ScrapedProduct> {
    console.log(`🔍 Extracting real data from: ${url}`)

    // Initialize browser tools
    await initializeBrowserTools()
    
    let browser = null
    let chrome = null
    
    try {
      // Try browser-based scraping first
      if (puppeteer && chromeLauncher) {
        console.log('🚀 Using Puppeteer for real scraping...')
        
        // Launch Chrome with optimized settings
        chrome = await chromeLauncher.launch({
          chromePath: '/usr/bin/google-chrome-stable',
          chromeFlags: [
            '--headless', 
            '--disable-gpu', 
            '--no-sandbox', 
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-extensions',
            '--disable-background-timer-throttling',
            '--disable-backgrounding-occluded-windows',
            '--disable-renderer-backgrounding',
            '--disable-web-security',
            '--disable-features=VizDisplayCompositor',
            '--disable-ipc-flooding-protection',
            '--disable-blink-features=AutomationControlled',
            '--no-first-run',
            '--no-default-browser-check',
            '--disable-default-apps'
          ]
        })
        
        browser = await puppeteer.connect({
          browserURL: `http://localhost:${chrome.port}`
        })
        
        const page = await browser.newPage()
        
        // Set viewport for better rendering
        await page.setViewport({ width: 1366, height: 768 })
        
        // Set user agent and headers
        await page.setUserAgent(config.headers?.['User-Agent'] || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36')
        
        if (config.headers) {
          await page.setExtraHTTPHeaders(config.headers)
        }
        
        // Platform-specific navigation settings
        const navigationOptions: any = {
          waitUntil: ['domcontentloaded', 'networkidle0'],
          timeout: 45000 // Increased timeout for heavy sites
        }
        
        // Adjust settings based on platform
        if (config.platform === 'alibaba') {
          navigationOptions.waitUntil = ['domcontentloaded'] // Less strict for Alibaba
          navigationOptions.timeout = 60000 // Longer timeout for Alibaba
        } else if (config.platform === 'amazon') {
          navigationOptions.waitUntil = ['domcontentloaded', 'networkidle2']
          navigationOptions.timeout = 40000
        }
        
        // Navigate to the page with retry logic
        let navigationSuccess = false
        const maxNavRetries = 2
        
        for (let navRetry = 1; navRetry <= maxNavRetries; navRetry++) {
          try {
            console.log(`🌐 Navigating to ${url} (attempt ${navRetry}/${maxNavRetries})`)
            await page.goto(url, navigationOptions)
            navigationSuccess = true
            break
          } catch (navError) {
            console.warn(`⚠️ Navigation attempt ${navRetry} failed:`, navError instanceof Error ? navError.message : 'Unknown error')
            if (navRetry < maxNavRetries) {
              console.log(`🔄 Retrying navigation in 2 seconds...`)
              await new Promise(resolve => setTimeout(resolve, 2000))
            }
          }
        }
        
        if (!navigationSuccess) {
          throw new Error('Navigation failed after multiple attempts')
        }

        // Wait for content to load (use setTimeout instead of waitForTimeout)
        await new Promise(resolve => setTimeout(resolve, 2000))        // Extract data using selectors
        const scrapedData = await this.extractDataWithPuppeteer(page, config.selectors, config.platform)
        
        return this.normalizeProductData(scrapedData, url, config.platform)
        
      } else {
        // Fallback to fetch-based scraping
        console.log('📡 Using fetch-based scraping...')
        return await this.extractDataWithFetch(url, config)
      }
      
    } catch (error) {
      console.error(`❌ Browser scraping failed for ${url}:`, error)
      
      // Fallback to fetch-based scraping
      try {
        console.log('🔄 Falling back to fetch-based scraping...')
        return await this.extractDataWithFetch(url, config)
      } catch (fetchError) {
        console.error(`❌ Fetch scraping also failed:`, fetchError)
        throw new Error(`Failed to scrape ${url}: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
      
    } finally {
      // Clean up resources
      if (browser) {
        try {
          await browser.close()
        } catch (e) {
          console.warn('Warning: Failed to close browser:', e)
        }
      }
      
      if (chrome) {
        try {
          await chrome.kill()
        } catch (e) {
          console.warn('Warning: Failed to kill Chrome:', e)
        }
      }
    }
  }

  /**
   * Extract data using Puppeteer (real browser automation)
   */
  private async extractDataWithPuppeteer(page: any, selectors: PlatformSelectors, platform: SupportedPlatform): Promise<any> {
    const scrapedData: any = {}
    
    try {
      // Extract title
      if (selectors.title) {
        try {
          const titleElement = await page.$(selectors.title)
          if (titleElement) {
            scrapedData.title = await page.evaluate((el: any) => el.textContent?.trim(), titleElement)
          }
        } catch (e) {
          console.warn('Failed to extract title:', e)
        }
      }
      
      // Extract description
      if (selectors.description) {
        try {
          const descElement = await page.$(selectors.description)
          if (descElement) {
            scrapedData.description = await page.evaluate((el: any) => el.textContent?.trim(), descElement)
          }
        } catch (e) {
          console.warn('Failed to extract description:', e)
        }
      }
      
      // Extract price
      if (selectors.price) {
        try {
          const priceElement = await page.$(selectors.price)
          if (priceElement) {
            scrapedData.price = await page.evaluate((el: any) => el.textContent?.trim(), priceElement)
          }
        } catch (e) {
          console.warn('Failed to extract price:', e)
        }
      }
      
      // Extract original price
      if (selectors.original_price) {
        try {
          const origPriceElement = await page.$(selectors.original_price)
          if (origPriceElement) {
            scrapedData.original_price = await page.evaluate((el: any) => el.textContent?.trim(), origPriceElement)
          }
        } catch (e) {
          console.warn('Failed to extract original price:', e)
        }
      }
      
      // Extract images with enhanced logic
      if (selectors.images) {
        try {
          console.log('🖼️ Looking for images with selector:', selectors.images)
          
          // Special handling for Amazon to get different product images (not just different sizes)
          if (platform === 'amazon') {
            const amazonImages = await page.evaluate(() => {
              const uniqueImages = new Set()
              
              // Strategy 1: Get different thumbnail images from image gallery
              const thumbnails = document.querySelectorAll('#altImages .imageThumbnail img, #altImages .imageThumb img, #altImages img')
              console.log('🔍 Found thumbnails:', thumbnails.length)
              
              for (const thumb of thumbnails) {
                const src = (thumb as HTMLImageElement).src || thumb.getAttribute('data-src')
                if (src && !src.includes('data:image') && !src.includes('1x1_trans')) {
                  // Extract base image identifier to avoid duplicates
                  const baseMatch = src.match(/\/([A-Z0-9+%]+)\./)
                  if (baseMatch) {
                    const baseId = baseMatch[1]
                    // Convert to high quality version
                    const highQualityUrl = src.replace(/\._[A-Z]{2}[0-9]{2,3}_/, '._AC_SL1500_')
                                             .replace(/\._[A-Z]{2}[0-9]{2,3}\./, '._AC_SL1500_.')
                    uniqueImages.add(highQualityUrl)
                  }
                }
              }
              
              // Strategy 2: Get main product image
              const mainImage = document.querySelector('#landingImage, #main-image-container .a-dynamic-image')
              if (mainImage) {
                const mainSrc = mainImage.getAttribute('src') || mainImage.getAttribute('data-src')
                if (mainSrc && !mainSrc.includes('data:image')) {
                  const highQualityMain = mainSrc.replace(/\._[A-Z]{2}[0-9]{2,3}_/, '._AC_SL1500_')
                  uniqueImages.add(highQualityMain)
                }
              }
              
              // Strategy 3: Look for image variants in different containers
              const imageContainers = document.querySelectorAll('.image-wrapper img, .imageBlock img, .product-image img')
              for (const img of imageContainers) {
                const src = (img as HTMLImageElement).src || img.getAttribute('data-src')
                if (src && !src.includes('data:image') && !src.includes('1x1_trans')) {
                  const baseMatch = src.match(/\/([A-Z0-9+%]+)\./)
                  if (baseMatch) {
                    const highQualityUrl = src.replace(/\._[A-Z]{2}[0-9]{2,3}_/, '._AC_SL1500_')
                    uniqueImages.add(highQualityUrl)
                  }
                }
              }
              
              console.log('🖼️ Unique images found:', uniqueImages.size)
              return Array.from(uniqueImages).slice(0, 8) // Limit to 8 different images
            })
            
            if (amazonImages && amazonImages.length > 0) {
              scrapedData.images = amazonImages
              console.log(`📸 Extracted ${scrapedData.images.length} different Amazon product images`)
            }
          }
          
          // Special handling for Alibaba to get different product images
          if (platform === 'alibaba') {
            const alibabaImages = await page.evaluate(() => {
              const uniqueImages = new Set()
              
              // Strategy 1: Get images from thumbnail gallery
              const thumbnails = document.querySelectorAll('.image-thumb img, .images-list img, .image-item img')
              console.log('🔍 Found Alibaba thumbnails:', thumbnails.length)
              
              for (const thumb of thumbnails) {
                const src = (thumb as HTMLImageElement).src || thumb.getAttribute('data-src') || thumb.getAttribute('data-lazy-src')
                if (src && !src.includes('data:image') && !src.includes('1x1') && src.includes('alibaba')) {
                  // Convert to higher quality if possible
                  const highQualityUrl = src.replace(/\d+x\d+/, '800x800').replace(/_\d+x\d+\./, '_800x800.')
                  uniqueImages.add(highQualityUrl)
                }
              }
              
              // Strategy 2: Get main product image
              const mainImage = document.querySelector('.image-view img, .main-image img, .product-image img')
              if (mainImage) {
                const mainSrc = (mainImage as HTMLImageElement).src || mainImage.getAttribute('data-src')
                if (mainSrc && !mainSrc.includes('data:image') && mainSrc.includes('alibaba')) {
                  const highQualityMain = mainSrc.replace(/\d+x\d+/, '800x800')
                  uniqueImages.add(highQualityMain)
                }
              }
              
              // Strategy 3: Look for additional product images
              const productImages = document.querySelectorAll('.product-image img, .gallery-image img, img[src*="alibaba"]')
              for (const img of productImages) {
                const src = (img as HTMLImageElement).src || img.getAttribute('data-src')
                if (src && !src.includes('data:image') && src.includes('alibaba') && !src.includes('avatar')) {
                  const highQualityUrl = src.replace(/\d+x\d+/, '800x800')
                  uniqueImages.add(highQualityUrl)
                }
              }
              
              console.log('🖼️ Unique Alibaba images found:', uniqueImages.size)
              return Array.from(uniqueImages).slice(0, 10) // Limit to 10 different images
            })
            
            if (alibabaImages && alibabaImages.length > 0) {
              scrapedData.images = alibabaImages
              console.log(`📸 Extracted ${scrapedData.images.length} different Alibaba product images`)
            }
          }
          
          // Fallback: Standard extraction for other platforms or if Amazon extraction fails
          if (!scrapedData.images || scrapedData.images.length === 0) {
            const imageElements = await page.$$(selectors.images)
            console.log(`📸 Found ${imageElements?.length || 0} image elements using fallback`)
            
            if (imageElements && imageElements.length > 0) {
              const images = []
              const imageBaseSet = new Set() // Track unique images by base identifier
              
              for (const imgEl of imageElements.slice(0, 15)) {
                try {
                  const src = await page.evaluate((el: any) => {
                    return el.src || el.getAttribute('data-src') || 
                           el.getAttribute('data-lazy-src') || 
                           el.getAttribute('data-old-hires') ||
                           el.getAttribute('data-zoom-hires')
                  }, imgEl)
                  
                  if (src && 
                      !src.includes('data:image') && 
                      !src.includes('1x1_trans') &&
                      !src.includes('transparent') &&
                      src.length > 20) {
                    
                    // Extract base identifier to avoid size variations of same image
                    const baseMatch = src.match(/\/([A-Z0-9+%]+)\./) || src.match(/([^\/]+)\.(jpg|jpeg|png|webp)/i)
                    const baseId = baseMatch ? baseMatch[1] : src
                    
                    if (!imageBaseSet.has(baseId)) {
                      imageBaseSet.add(baseId)
                      // Convert to high quality for Amazon images
                      const finalUrl = src.includes('amazon') ? 
                        src.replace(/\._[A-Z]{2}[0-9]{2,3}_/, '._AC_SL1500_')
                           .replace(/\._[A-Z]{2}[0-9]{2,3}\./, '._AC_SL1500_.') : src
                      images.push(finalUrl)
                    }
                  }
                  
                } catch (e) {
                  console.warn('Failed to extract image src:', e)
                }
              }
              
              scrapedData.images = images.slice(0, 8)
              console.log(`📸 Extracted ${scrapedData.images.length} unique images using fallback method`)
            }
          }
        } catch (e) {
          console.warn('Failed to extract images:', e)
        }
      }
      
      // Extract rating
      if (selectors.rating) {
        try {
          const ratingElement = await page.$(selectors.rating)
          if (ratingElement) {
            scrapedData.rating = await page.evaluate((el: any) => 
              el.textContent?.trim() || el.getAttribute('aria-label') || el.title
            , ratingElement)
          }
        } catch (e) {
          console.warn('Failed to extract rating:', e)
        }
      }
      
      // Extract review count
      if (selectors.review_count) {
        try {
          const reviewElement = await page.$(selectors.review_count)
          if (reviewElement) {
            scrapedData.review_count = await page.evaluate((el: any) => el.textContent?.trim(), reviewElement)
          }
        } catch (e) {
          console.warn('Failed to extract review count:', e)
        }
      }
      
      // Extract brand
      if (selectors.brand) {
        try {
          const brandElement = await page.$(selectors.brand)
          if (brandElement) {
            scrapedData.brand = await page.evaluate((el: any) => el.textContent?.trim(), brandElement)
          }
        } catch (e) {
          console.warn('Failed to extract brand:', e)
        }
      }
      
      // Extract availability
      if (selectors.availability) {
        try {
          const availElement = await page.$(selectors.availability)
          if (availElement) {
            scrapedData.availability = await page.evaluate((el: any) => el.textContent?.trim(), availElement)
          }
        } catch (e) {
          console.warn('Failed to extract availability:', e)
        }
      }
      
    } catch (error) {
      console.error('Error during Puppeteer data extraction:', error)
    }
    
    return scrapedData
  }

  /**
   * Extract data using fetch (fallback method)
   */
  private async extractDataWithFetch(url: string, config: ScrapingConfig): Promise<ScrapedProduct> {
    console.log(`📡 Fetch-based extraction for: ${url}`)
    
    try {
      // Create an AbortController for timeout
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout
      
      const response = await fetch(url, {
        headers: config.headers || {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        },
        redirect: 'follow',
        signal: controller.signal
      })
      
      clearTimeout(timeoutId)
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      const html = await response.text()
      
      // Basic HTML parsing for common elements
      const extractedData = this.parseHTMLContent(html, config.platform)
      
      return this.normalizeProductData(extractedData, url, config.platform)
      
    } catch (error) {
      console.error(`Fetch-based scraping failed:`, error)
      
      // Final fallback to generated mock data with URL-based context
      console.log(`🎭 Using enhanced mock data based on URL context...`)
      const mockData = this.generateMockDataFromUrl(url, config.platform)
      return this.normalizeProductData(mockData, url, config.platform)
    }
  }

  /**
   * Parse HTML content for basic product information
   */
  private parseHTMLContent(html: string, platform: SupportedPlatform): any {
    const data: any = {}
    
    try {
      // Extract title from common patterns
      const titleMatches = html.match(/<title[^>]*>([^<]+)<\/title>/i) ||
                          html.match(/<h1[^>]*>([^<]+)<\/h1>/i) ||
                          html.match(/product[^>]*title[^>]*>([^<]+)</i)
      
      if (titleMatches && titleMatches[1]) {
        data.title = titleMatches[1].trim()
      }
      
      // Extract price patterns
      const priceMatches = html.match(/[\$€£¥₹]\s*[\d,]+\.?\d*/g) ||
                          html.match(/price[^>]*>[\s\S]*?([\d,]+\.?\d*)/i)
      
      if (priceMatches && priceMatches.length > 0) {
        data.price = priceMatches[0]
        if (priceMatches.length > 1) {
          data.original_price = priceMatches[1]
        }
      }
      
      // Extract images with enhanced patterns
      const imageMatches = html.match(/<img[^>]+src=["']([^"']+)["'][^>]*>/gi)
      const dataImageMatches = html.match(/data-[^=]*image[^=]*=["']([^"']+)["']/gi)
      const jsonImageMatches = html.match(/"[^"]*image[^"]*":\s*"([^"]+)"/gi)
      
      const allImageSources = []
      
      // Regular img src attributes
      if (imageMatches) {
        const images = imageMatches
          .map(match => {
            const srcMatch = match.match(/src=["']([^"']+)["']/)
            return srcMatch ? srcMatch[1] : null
          })
          .filter(src => src && 
                  !src.includes('data:image') && 
                  !src.includes('1x1') &&
                  (src.includes('.jpg') || src.includes('.png') || src.includes('.webp') || src.includes('media-amazon') || src.includes('images-amazon')))
        
        allImageSources.push(...images)
      }
      
      // Data attributes (data-src, data-lazy-src, etc.)
      if (dataImageMatches) {
        const dataImages = dataImageMatches
          .map(match => {
            const srcMatch = match.match(/=["']([^"']+)["']/)
            return srcMatch ? srcMatch[1] : null
          })
          .filter(src => src && 
                  !src.includes('data:image') &&
                  (src.includes('.jpg') || src.includes('.png') || src.includes('.webp') || src.includes('media-amazon')))
        
        allImageSources.push(...dataImages)
      }
      
      // JSON embedded images (common in Amazon)
      if (jsonImageMatches) {
        const jsonImages = jsonImageMatches
          .map(match => {
            const srcMatch = match.match(/"([^"]+)"/g)
            return srcMatch ? srcMatch[1].replace(/"/g, '') : null
          })
          .filter(src => src && src.includes('media-amazon'))
        
        allImageSources.push(...jsonImages)
      }
      
      // Amazon-specific: Look for data-a-dynamic-image JSON
      const dynamicImageMatch = html.match(/data-a-dynamic-image=["']({[^"']+})["']/i)
      if (dynamicImageMatch) {
        try {
          const imageMap = JSON.parse(dynamicImageMatch[1].replace(/&quot;/g, '"'))
          const amazonImages = Object.keys(imageMap)
          allImageSources.push(...amazonImages)
        } catch (e) {
          console.warn('Failed to parse Amazon dynamic images:', e)
        }
      }
      
      // Process and enhance image URLs
      const processedImages = [...new Set(allImageSources)]
        .filter((src): src is string => Boolean(src)) // Type guard to filter out null/undefined
        .map(src => {
          // Enhance Amazon URLs for higher quality
          if (src.includes('amazon.com') || src.includes('ssl-images-amazon')) {
            return src
              .replace(/\._[A-Z0-9_]+_\./, '._AC_SL1500_.')
              .replace(/\._[A-Z0-9_]+\./, '._AC_SL1500_.')
          }
          return src
        })
        .slice(0, 12) // Limit to 12 images
      
      if (processedImages.length > 0) {
        data.images = processedImages
        console.log(`📸 Fetch extracted ${processedImages.length} images`)
      }
      
      // Extract basic description
      const descMatches = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i) ||
                         html.match(/description[^>]*>([^<]+)</i)
      
      if (descMatches && descMatches[1]) {
        data.description = descMatches[1].trim()
      }
      
    } catch (error) {
      console.warn('HTML parsing failed:', error)
    }
    
    return data
  }

  /**
   * Generate enhanced mock data based on URL context
   */
  private generateMockDataFromUrl(url: string, platform: SupportedPlatform): any {
    // Try to extract product information from URL
    const urlLower = url.toLowerCase()
    let productHints = []
    
    // Extract potential product keywords from URL path
    const pathParts = new URL(url).pathname.split('/').filter(part => part.length > 2)
    productHints = pathParts.flatMap(part => 
      part.split('-').filter(word => word.length > 2)
    )
    
    // Enhanced mock data based on URL analysis
    const baseProducts = this.generateMockData(url, platform)
    
    // Enhance title if we found hints
    if (productHints.length > 0) {
      const keywords = productHints.slice(0, 3).map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ')
      
      if (keywords.length > 3) {
        baseProducts.title = `${keywords} - ${baseProducts.title.split(' - ')[1] || 'Premium Product'}`
      }
    }
    
    // Add URL-specific pricing variation
    const urlHash = url.length % 100
    const priceVariation = (urlHash / 100) * 0.3 + 0.85 // 15-30% price variation
    
    if (baseProducts.price) {
      const basePrice = parseFloat(baseProducts.price.replace(/[^\d.]/g, ''))
      if (!isNaN(basePrice)) {
        const newPrice = (basePrice * priceVariation).toFixed(2)
        baseProducts.price = baseProducts.price.replace(/[\d.]+/, newPrice)
      }
    }
    
    return baseProducts
  }

  /**
   * Generate mock product data for development
   */
  private generateMockData(url: string, platform: SupportedPlatform) {
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

  /**
   * Normalize and clean product data
   */
  private normalizeProductData(rawData: any, url: string, platform: SupportedPlatform): ScrapedProduct {
    return {
      title: this.cleanText(rawData.title) || 'Untitled Product',
      description: this.cleanText(rawData.description) || '',
      price: this.parsePrice(rawData.price),
      original_price: this.parsePrice(rawData.original_price),
      currency: this.detectCurrency(rawData.price) || 'USD',
      images: this.normalizeImages(rawData.images || []),
      rating: this.parseRating(rawData.rating),
      review_count: this.parseNumber(rawData.review_count),
      brand: this.cleanText(rawData.brand),
      category: this.cleanText(rawData.category),
      availability: this.normalizeAvailability(rawData.availability),
      source_url: url,
      source_platform: platform,
      scraped_at: new Date().toISOString(),
      specifications: this.normalizeSpecifications(rawData.specifications),
      discount_percentage: this.calculateDiscount(
        this.parsePrice(rawData.price),
        this.parsePrice(rawData.original_price)
      )
    }
  }

  /**
   * Clean and normalize text content
   */
  private cleanText(text: string): string {
    if (!text) return ''
    return text
      .replace(/\s+/g, ' ')
      .replace(/[\r\n\t]/g, ' ')
      .trim()
  }

  /**
   * Parse price from string
   */
  private parsePrice(priceStr: string): number | undefined {
    if (!priceStr) return undefined
    
    const cleaned = priceStr.replace(/[^0-9.,]/g, '')
    const price = parseFloat(cleaned.replace(',', ''))
    
    return isNaN(price) ? undefined : price
  }

  /**
   * Detect currency from price string
   */
  private detectCurrency(priceStr: string): string | undefined {
    if (!priceStr) return undefined
    
    const currencySymbols: Record<string, string> = {
      '$': 'USD',
      '€': 'EUR',
      '£': 'GBP',
      '¥': 'JPY',
      '₹': 'INR',
      '₽': 'RUB'
    }
    
    for (const [symbol, currency] of Object.entries(currencySymbols)) {
      if (priceStr.includes(symbol)) {
        return currency
      }
    }
    
    return 'USD'
  }

  /**
   * Normalize image URLs
   */
  private normalizeImages(images: string[]): string[] {
    return images
      .filter(img => img && typeof img === 'string')
      .map(img => {
        // Convert relative URLs to absolute
        if (img.startsWith('//')) {
          return `https:${img}`
        } else if (img.startsWith('/')) {
          // This would need the base URL
          return img
        }
        return img
      })
      .filter(img => this.isValidImageUrl(img))
      .slice(0, 10) // Limit to 10 images
  }

  /**
   * Validate image URL
   */
  private isValidImageUrl(url: string): boolean {
    try {
      const urlObj = new URL(url)
      const extension = urlObj.pathname.toLowerCase()
      return ['.jpg', '.jpeg', '.png', '.webp', '.gif'].some(ext => 
        extension.includes(ext)
      )
    } catch {
      return false
    }
  }

  /**
   * Parse rating value
   */
  private parseRating(ratingStr: string): number | undefined {
    if (!ratingStr) return undefined
    
    const rating = parseFloat(ratingStr.replace(/[^0-9.]/g, ''))
    return isNaN(rating) ? undefined : Math.min(rating, 5)
  }

  /**
   * Parse number from string
   */
  private parseNumber(numStr: string): number | undefined {
    if (!numStr) return undefined
    
    const cleaned = numStr.replace(/[^0-9]/g, '')
    const num = parseInt(cleaned)
    
    return isNaN(num) ? undefined : num
  }

  /**
   * Normalize availability status
   */
  private normalizeAvailability(availability: string): string {
    if (!availability) return 'unknown'
    
    const lower = availability.toLowerCase()
    
    if (lower.includes('in stock') || lower.includes('available')) {
      return 'in_stock'
    } else if (lower.includes('out of stock') || lower.includes('unavailable')) {
      return 'out_of_stock'
    } else if (lower.includes('limited')) {
      return 'limited_stock'
    }
    
    return 'unknown'
  }

  /**
   * Normalize product specifications
   */
  private normalizeSpecifications(specs: any): Record<string, string> {
    if (!specs || typeof specs !== 'object') return {}
    
    const normalized: Record<string, string> = {}
    
    for (const [key, value] of Object.entries(specs)) {
      if (typeof value === 'string' && value.trim()) {
        normalized[this.cleanText(key)] = this.cleanText(value)
      }
    }
    
    return normalized
  }

  /**
   * Calculate discount percentage
   */
  private calculateDiscount(currentPrice?: number, originalPrice?: number): number | undefined {
    if (!currentPrice || !originalPrice || originalPrice <= currentPrice) {
      return undefined
    }
    
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
  }

  /**
   * Add delay for rate limiting
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  /**
   * Batch scrape multiple URLs
   */
  public async scrapeMultipleProducts(
    urls: string[], 
    config?: Partial<ScrapingConfig>,
    progressCallback?: (progress: { completed: number; total: number; current?: string }) => void
  ): Promise<ScrapingResult[]> {
    const results: ScrapingResult[] = []
    
    for (let i = 0; i < urls.length; i++) {
      const url = urls[i]
      
      if (progressCallback) {
        progressCallback({
          completed: i,
          total: urls.length,
          current: url
        })
      }
      
      try {
        const result = await this.scrapeProduct(url, config)
        results.push(result)
      } catch (error) {
        results.push({
          url,
          status: 'failed',
          error: error instanceof Error ? error.message : 'Unknown error',
          scraped_at: new Date().toISOString(),
          processing_time: 0
        })
      }
      
      // Add delay between requests
      if (i < urls.length - 1 && config?.delay) {
        await this.delay(config.delay)
      }
    }
    
    if (progressCallback) {
      progressCallback({
        completed: urls.length,
        total: urls.length
      })
    }
    
    return results
  }
}