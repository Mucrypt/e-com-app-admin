// Enterprise-grade scraping infrastructure with advanced anti-detection
// Includes proxy rotation, CAPTCHA solving, browser fingerprinting, and stealth techniques

import { ScrapedProduct, SupportedPlatform } from '@/types/scraper.types'
import puppeteer from 'puppeteer-extra'
import StealthPlugin from 'puppeteer-extra-plugin-stealth'
import RecaptchaPlugin from 'puppeteer-extra-plugin-recaptcha'
import type { Browser, Page } from 'puppeteer'

// Configure plugins
puppeteer.use(StealthPlugin())

// Configure CAPTCHA plugin if API key is available
if (process.env.CAPTCHA_API_KEY) {
  puppeteer.use(RecaptchaPlugin({
    provider: {
      id: '2captcha',
      token: process.env.CAPTCHA_API_KEY
    },
    visualFeedback: true
  }))
}

export interface ProxyConfig {
  host: string
  port: number
  username?: string
  password?: string
  type: 'http' | 'https' | 'socks5'
}

export interface ScrapingSession {
  id: string
  proxy?: ProxyConfig
  browser?: Browser
  startTime: number
  requestCount: number
}

export interface BrowserFingerprintConfig {
  userAgent?: string
  viewport?: { width: number; height: number }
  timezone?: string
  locale?: string
  platform?: string
  webGL?: boolean
  canvas?: boolean
}

export interface EnterpriseScrapingConfig {
  // Proxy settings
  proxyRotation: boolean
  proxyPool?: ProxyConfig[]
  maxProxyRetries: number
  
  // Anti-detection settings
  randomizeFingerprint: boolean
  delayBetweenRequests: { min: number; max: number }
  maxConcurrentSessions: number
  
  // CAPTCHA solving
  solveCaptcha: boolean
  captchaTimeout: number
  
  // Performance settings
  enableCaching: boolean
  requestTimeout: number
  maxRetries: number
  
  // Monitoring
  enableMetrics: boolean
  logLevel: 'none' | 'basic' | 'detailed'
}

export class EnterpriseScrapingService {
  private config: EnterpriseScrapingConfig
  private sessions: Map<string, ScrapingSession> = new Map()
  private proxyPool: ProxyConfig[] = []
  private metrics = {
    totalRequests: 0,
    successfulRequests: 0,
    failedRequests: 0,
    captchasSolved: 0,
    proxyFailures: 0
  }

  constructor(config: Partial<EnterpriseScrapingConfig> = {}) {
    this.config = {
      proxyRotation: true,
      maxProxyRetries: 3,
      randomizeFingerprint: true,
      delayBetweenRequests: { min: 1000, max: 3000 },
      maxConcurrentSessions: 5,
      solveCaptcha: !!process.env.CAPTCHA_API_KEY,
      captchaTimeout: 30000,
      enableCaching: true,
      requestTimeout: 30000,
      maxRetries: 3,
      enableMetrics: true,
      logLevel: 'basic',
      ...config
    }

    if (config.proxyPool) {
      this.proxyPool = config.proxyPool
    }
  }

  // Add proxy to the rotation pool
  addProxy(proxy: ProxyConfig): void {
    this.proxyPool.push(proxy)
    this.log('basic', `Added proxy ${proxy.host}:${proxy.port} to pool`)
  }

  // Get a random proxy from the pool
  private getRandomProxy(): ProxyConfig | undefined {
    if (this.proxyPool.length === 0) return undefined
    const randomIndex = Math.floor(Math.random() * this.proxyPool.length)
    return this.proxyPool[randomIndex]
  }

  // Generate randomized browser fingerprint
  private generateBrowserFingerprint(): BrowserFingerprintConfig {
    const userAgents = [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    ]

    const viewports = [
      { width: 1920, height: 1080 },
      { width: 1366, height: 768 },
      { width: 1440, height: 900 },
      { width: 1536, height: 864 }
    ]

    return {
      userAgent: userAgents[Math.floor(Math.random() * userAgents.length)],
      viewport: viewports[Math.floor(Math.random() * viewports.length)],
      timezone: 'America/New_York',
      locale: 'en-US',
      platform: 'Win32',
      webGL: Math.random() > 0.5,
      canvas: Math.random() > 0.5
    }
  }

  // Create a new scraping session with advanced configurations
  async createSession(sessionId?: string): Promise<string> {
    const id = sessionId || `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    const proxy = this.config.proxyRotation ? this.getRandomProxy() : undefined

    try {
      // Launch browser with advanced anti-detection
      const launchOptions: any = {
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--disable-gpu',
          '--disable-background-timer-throttling',
          '--disable-backgrounding-occluded-windows',
          '--disable-renderer-backgrounding',
          '--disable-features=TranslateUI',
          '--disable-ipc-flooding-protection',
          '--window-size=1920,1080',
          '--disable-blink-features=AutomationControlled'
        ]
      }

      // Add proxy configuration
      if (proxy) {
        launchOptions.args.push(`--proxy-server=${proxy.type}://${proxy.host}:${proxy.port}`)
      }

      const browser = await puppeteer.launch(launchOptions)

      // Create session
      const session: ScrapingSession = {
        id,
        proxy,
        browser,
        startTime: Date.now(),
        requestCount: 0
      }

      this.sessions.set(id, session)
      this.log('basic', `Created scraping session ${id}`)

      return id
    } catch (error) {
      this.log('basic', `Failed to create session: ${error}`)
      throw error
    }
  }

  // Apply advanced anti-detection techniques to page
  private async applyAntiDetection(page: Page, fingerprint: BrowserFingerprintConfig): Promise<void> {
    // Set user agent
    if (fingerprint.userAgent) {
      await page.setUserAgent(fingerprint.userAgent)
    }

    // Set viewport
    if (fingerprint.viewport) {
      await page.setViewport(fingerprint.viewport)
    }

    // Override navigator properties
    await page.evaluateOnNewDocument((fpString: string) => {
      const fp = JSON.parse(fpString)
      
      // Override webdriver detection
      Object.defineProperty(navigator, 'webdriver', {
        get: () => undefined,
      })

      // Override plugins
      Object.defineProperty(navigator, 'plugins', {
        get: () => [1, 2, 3, 4, 5],
      })

      // Override language
      if (fp.locale) {
        Object.defineProperty(navigator, 'language', {
          get: () => fp.locale,
        })
      }

      // Override platform
      if (fp.platform) {
        Object.defineProperty(navigator, 'platform', {
          get: () => fp.platform,
        })
      }
    }, JSON.stringify(fingerprint))
  }

  // Enhanced scraping with enterprise features
  async scrapeProduct(url: string, sessionId?: string): Promise<ScrapedProduct> {
    const startTime = Date.now()
    this.metrics.totalRequests++

    try {
      // Create or get session
      const activeSessionId = sessionId || await this.createSession()
      const session = this.sessions.get(activeSessionId)
      
      if (!session || !session.browser) {
        throw new Error('No active browser session')
      }

      session.requestCount++
      
      // Create new page
      const page = await session.browser.newPage()

      try {
        // Apply anti-detection
        const fingerprint = this.config.randomizeFingerprint ? this.generateBrowserFingerprint() : {}
        await this.applyAntiDetection(page, fingerprint)

        // Set proxy authentication if needed
        if (session.proxy?.username && session.proxy?.password) {
          await page.authenticate({
            username: session.proxy.username,
            password: session.proxy.password
          })
        }

        // Add random delay
        const delay = Math.floor(
          Math.random() * (this.config.delayBetweenRequests.max - this.config.delayBetweenRequests.min) +
          this.config.delayBetweenRequests.min
        )
        await new Promise(resolve => setTimeout(resolve, delay))

        this.log('detailed', `Navigating to ${url} with session ${activeSessionId}`)

        // Navigate with timeout
        await page.goto(url, {
          waitUntil: 'networkidle0',
          timeout: this.config.requestTimeout
        })

        // Check for CAPTCHA and solve if enabled
        if (this.config.solveCaptcha) {
          try {
            // Type assertion for recaptcha plugin method
            await (page as any).solveRecaptchas()
            this.metrics.captchasSolved++
            this.log('basic', 'CAPTCHA solved successfully')
          } catch (captchaError) {
            this.log('basic', 'No CAPTCHA detected or solving failed')
          }
        }

        // Extract product data based on platform
        const platform = this.detectPlatform(url)
        const productData = await this.extractProductData(page, platform, url)

        await page.close()

        this.metrics.successfulRequests++
        const processingTime = Date.now() - startTime

        this.log('basic', `Successfully scraped product from ${platform} in ${processingTime}ms`)

        // Return properly typed product data
        const scrapedProduct: ScrapedProduct = {
          id: productData.id || `product_${Date.now()}`,
          title: productData.title || 'Unknown Product',
          description: productData.description || '',
          price: productData.price || 0,
          original_price: productData.original_price,
          currency: productData.currency || 'USD',
          availability: productData.availability || 'unknown',
          images: productData.images || [],
          category: productData.category,
          brand: productData.brand,
          rating: productData.rating,
          review_count: productData.review_count,
          specifications: productData.specifications || {},
          variants: productData.variants || [],
          seller_info: productData.seller_info,
          source_url: url,
          source_platform: platform,
          scraped_at: new Date().toISOString()
        }

        return scrapedProduct

      } finally {
        if (page && !page.isClosed()) {
          await page.close()
        }
      }

    } catch (error) {
      this.metrics.failedRequests++
      this.log('basic', `Scraping failed: ${error}`)
      
      // If proxy failed, try with different proxy
      if (this.config.proxyRotation && sessionId && String(error).includes('proxy')) {
        this.metrics.proxyFailures++
        this.log('basic', 'Proxy failure detected, retrying with new proxy')
        
        // Close current session and create new one
        await this.closeSession(sessionId)
        return this.scrapeProduct(url) // Retry with new session
      }

      throw error
    }
  }

  // Detect platform from URL
  private detectPlatform(url: string): SupportedPlatform {
    const hostname = new URL(url).hostname.toLowerCase()
    
    if (hostname.includes('amazon')) return 'amazon'
    if (hostname.includes('ebay')) return 'ebay'
    if (hostname.includes('alibaba') || hostname.includes('1688')) return 'alibaba'
    if (hostname.includes('aliexpress')) return 'aliexpress'
    if (hostname.includes('walmart')) return 'walmart'
    if (hostname.includes('shopify') || hostname.includes('myshopify')) return 'shopify'
    
    // Default to amazon for unknown platforms
    return 'amazon'
  }

  // Extract product data with platform-specific selectors
  private async extractProductData(page: Page, platform: SupportedPlatform, url: string): Promise<Partial<ScrapedProduct>> {
    return await page.evaluate((platform: SupportedPlatform, url: string) => {
      const selectors: Record<string, any> = {
        amazon: {
          title: '#productTitle, .product-title',
          price: '.a-price-current .a-offscreen, .a-price .a-offscreen',
          originalPrice: '.a-price.a-text-price .a-offscreen',
          description: '#feature-bullets ul, #productDescription',
          images: '#landingImage, .image.item img',
          rating: '.a-icon-alt, .cr-original-review-stars',
          reviewCount: '#acrCustomerReviewText',
          availability: '#availability span'
        },
        ebay: {
          title: '.x-item-title-label, h1#x-item-title-label',
          price: '.notranslate',
          description: '#desc_wrapper_ctr, .viSNotesCnt',
          images: '#icImg, .vi-image-panel img',
          condition: '.u-flL.condText'
        },
        alibaba: {
          title: '.ma-title h1, .product-title',
          price: '.ma-ref-price .price-value, .price',
          description: '.ma-product-params, .product-description',
          images: '.image-viewer img, .main-image img',
          moq: '.ma-ladder-price'
        },
        aliexpress: {
          title: '.product-title-text, h1',
          price: '.product-price-current, .price-current',
          description: '.product-description, .description',
          images: '.image-view img, .main-image img'
        },
        walmart: {
          title: '[data-testid="product-title"], h1',
          price: '[data-testid="price-current"], .price-current',
          description: '[data-testid="product-description"]',
          images: '.hero-image img, .product-image img'
        },
        shopify: {
          title: '.product-title, h1.title',
          price: '.price, .product-price',
          description: '.product-description, .description',
          images: '.product-image img, .featured-image img'
        }
      }

      const currentSelectors = selectors[platform] || selectors['amazon']
      
      // Generic extraction function
      const getText = (selector: string): string => {
        const element = document.querySelector(selector)
        return element?.textContent?.trim() || ''
      }

      const getPrice = (selector: string): number => {
        const text = getText(selector)
        const match = text.match(/[\d,]+\.?\d*/g)
        return match ? parseFloat(match[0].replace(/,/g, '')) : 0
      }

      const getImages = (selector: string): string[] => {
        const images = Array.from(document.querySelectorAll(selector))
        return images.map(img => (img as HTMLImageElement).src).filter(src => src && src.startsWith('http'))
      }

      return {
        title: getText(currentSelectors.title || 'h1, .title, .product-title'),
        price: getPrice(currentSelectors.price || '.price, .amount, .cost'),
        original_price: currentSelectors.originalPrice ? getPrice(currentSelectors.originalPrice) : undefined,
        description: getText(currentSelectors.description || '.description, .details'),
        images: getImages(currentSelectors.images || 'img'),
        rating: currentSelectors.rating ? parseFloat(getText(currentSelectors.rating)) : undefined,
        review_count: currentSelectors.reviewCount ? parseInt(getText(currentSelectors.reviewCount)) : undefined,
        availability: getText(currentSelectors.availability || '.availability, .stock'),
        source_url: url
      }
    }, platform, url)
  }

  // Close a specific session
  async closeSession(sessionId: string): Promise<void> {
    const session = this.sessions.get(sessionId)
    if (session?.browser) {
      await session.browser.close()
    }
    this.sessions.delete(sessionId)
    this.log('basic', `Closed session ${sessionId}`)
  }

  // Close all sessions
  async closeAllSessions(): Promise<void> {
    const promises = Array.from(this.sessions.keys()).map(id => this.closeSession(id))
    await Promise.all(promises)
    this.log('basic', 'All sessions closed')
  }

  // Get metrics
  getMetrics() {
    return {
      ...this.metrics,
      activeSessions: this.sessions.size,
      successRate: this.metrics.totalRequests > 0 ? 
        (this.metrics.successfulRequests / this.metrics.totalRequests * 100).toFixed(2) + '%' : '0%',
      averageRequestsPerSession: this.sessions.size > 0 ?
        Array.from(this.sessions.values()).reduce((sum, session) => sum + session.requestCount, 0) / this.sessions.size : 0
    }
  }

  // Logging utility
  private log(level: 'none' | 'basic' | 'detailed', message: string): void {
    if (this.config.logLevel === 'none') return
    if (level === 'detailed' && this.config.logLevel !== 'detailed') return
    
    console.log(`[EnterpriseScrapingService] ${message}`)
  }
}

// Export default instance
export const enterpriseScrapingService = new EnterpriseScrapingService()
