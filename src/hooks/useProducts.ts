'use client'
import { useState, useEffect, useMemo, useCallback, useRef } from 'react'

interface Product {
  id: string
  name: string
  price: number
  original_price?: number
  image_url?: string
  images?: string | Array<string | { url?: string }>
  rating?: number
  review_count?: number
  is_on_sale?: boolean
  is_featured?: boolean
  brand?: string
  short_description?: string
  description?: string
  sku?: string
  stock_quantity?: number
  is_active?: boolean
  categories?: {
    id: string
    name: string
    slug: string
    color?: string
  }
}

interface UseProductsOptions {
  featured?: boolean
  category?: string
  limit?: number
  sortBy?: string
  order?: 'asc' | 'desc'
  includeInactive?: boolean
  enablePrefetch?: boolean
  cacheTime?: number
  staleTime?: number
}

interface CacheEntry {
  data: Product[]
  timestamp: number
  expiresAt: number
  isStale: boolean
}

class ProductsCache {
  private cache = new Map<string, CacheEntry>()
  private prefetchQueue = new Set<string>()
  private readonly DEFAULT_CACHE_TIME = 5 * 60 * 1000 // 5 minutes
  private readonly DEFAULT_STALE_TIME = 2 * 60 * 1000 // 2 minutes

  generateCacheKey(options: UseProductsOptions): string {
    const {
      featured,
      category,
      limit = 12,
      sortBy = 'created_at',
      order = 'desc',
      includeInactive = false,
    } = options

    return `products:${JSON.stringify({
      featured,
      category,
      limit,
      sortBy,
      order,
      includeInactive,
    })}`
  }

  set(key: string, data: Product[], cacheTime?: number, staleTime?: number): void {
    const now = Date.now()
    const ttl = cacheTime || this.DEFAULT_CACHE_TIME
    const stale = staleTime ?? this.DEFAULT_STALE_TIME

    this.cache.set(key, {
      data,
      timestamp: now,
      expiresAt: now + ttl,
      isStale: false,
    })

    // Set stale flag after stale time
    setTimeout(() => {
      const entry = this.cache.get(key)
      if (entry) {
        entry.isStale = true
      }
    }, stale)
  }

  get(key: string): CacheEntry | null {
    const entry = this.cache.get(key)

    if (!entry) return null

    // Remove expired entries
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key)
      return null
    }

    return entry
  }

  invalidate(pattern?: string): void {
    if (!pattern) {
      this.cache.clear()
      return
    }

    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key)
      }
    }
  }

  prefetch(key: string, fetcher: () => Promise<Product[]>): void {
    if (this.prefetchQueue.has(key) || this.get(key)) {
      return
    }

    this.prefetchQueue.add(key)

    fetcher()
      .then((data) => {
        this.set(key, data)
        this.prefetchQueue.delete(key)
      })
      .catch((error) => {
        console.warn('Prefetch failed:', error)
        this.prefetchQueue.delete(key)
      })
  }

  getStats() {
    return {
      cacheSize: this.cache.size,
      prefetchQueueSize: this.prefetchQueue.size,
      entries: Array.from(this.cache.entries()).map(([key, entry]) => ({
        key,
        isStale: entry.isStale,
        age: Date.now() - entry.timestamp,
      })),
    }
  }
}

// Global cache instance
const productsCache = new ProductsCache()

// Request deduplication
const pendingRequests = new Map<string, Promise<Product[]>>()

export function useProducts(options: UseProductsOptions = {}) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isStale, setIsStale] = useState(false)
  const abortControllerRef = useRef<AbortController | null>(null)

  const {
    featured,
    category,
    limit = 12,
    sortBy = 'created_at',
    order = 'desc',
    includeInactive = false,
    enablePrefetch = true,
    cacheTime = 5 * 60 * 1000, // 5 minutes
    staleTime = 2 * 60 * 1000, // 2 minutes
  } = options

  // Memoized cache key
  const cacheKey = useMemo(
    () => productsCache.generateCacheKey(options),
    [options]
  )

  // Build API URL
  const apiUrl = useMemo(() => {
    const params = new URLSearchParams()

    if (featured !== undefined) params.append('featured', featured.toString())
    if (category) params.append('category', category)
    if (limit) params.append('limit', limit.toString())
    if (sortBy) params.append('sortBy', sortBy)
    if (order) params.append('order', order)
    if (includeInactive) params.append('include_inactive', 'true')

    return `/api/products?${params.toString()}`
  }, [featured, category, limit, sortBy, order, includeInactive])

  // Optimized fetch function with deduplication
  const fetchProducts = useCallback(
    async (url: string, signal?: AbortSignal): Promise<Product[]> => {
      // Check for pending request
      if (pendingRequests.has(url)) {
        return pendingRequests.get(url)!
      }

      const requestPromise = fetch(url, {
        signal,
        headers: {
          'Cache-Control': 'max-age=300', // 5 minutes browser cache
          Accept: 'application/json',
        },
      })
        .then(async (response) => {
          if (!response.ok) {
            throw new Error(
              `Failed to fetch products: ${response.status} ${response.statusText}`
            )
          }
          return response.json()
        })
        .finally(() => {
          pendingRequests.delete(url)
        })

      pendingRequests.set(url, requestPromise)
      return requestPromise
    },
    []
  )

  // Background refresh for stale data
  const backgroundRefresh = useCallback(async () => {
    try {
      const data = await fetchProducts(apiUrl)
      productsCache.set(cacheKey, data, cacheTime, staleTime)
      setProducts(data)
      setIsStale(false)
      console.log('🔄 Background refresh completed for:', cacheKey)
    } catch (error) {
      console.warn('Background refresh failed:', error)
    }
  }, [apiUrl, cacheKey, cacheTime, staleTime, fetchProducts])

  // Main effect
  useEffect(() => {
    const loadProducts = async () => {
      try {
        // Cancel previous request
        if (abortControllerRef.current) {
          abortControllerRef.current.abort()
        }

        abortControllerRef.current = new AbortController()
        const { signal } = abortControllerRef.current

        // Check cache first
        const cached = productsCache.get(cacheKey)

        if (cached) {
          setProducts(cached.data)
          setIsStale(cached.isStale)
          setLoading(false)
          setError(null)

          console.log(
            `🎯 Cache hit for: ${cacheKey} (stale: ${cached.isStale})`
          )

          // Background refresh if data is stale
          if (cached.isStale) {
            backgroundRefresh()
          }

          return
        }

        // Cache miss - fetch fresh data
        setLoading(true)
        setError(null)
        setIsStale(false)

        console.log('🔍 Cache miss, fetching from:', apiUrl)

        const data = await fetchProducts(apiUrl, signal)

        // Store in cache
        productsCache.set(cacheKey, data, cacheTime, staleTime)

        setProducts(data)
        console.log('✅ Fresh data loaded:', data?.length, 'products')
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          return // Request was cancelled
        }

        console.error('❌ useProducts error:', err)
        setError(
          err instanceof Error ? err.message : 'Failed to fetch products'
        )
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    loadProducts()

    // Cleanup
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [cacheKey, apiUrl, cacheTime, staleTime, fetchProducts, backgroundRefresh])

  // Prefetch related data
  useEffect(() => {
    if (!enablePrefetch || loading) return

    const prefetchRelated = () => {
      // Prefetch next page
      const nextPageOptions = { ...options, limit: limit + 12 }
      const nextPageKey = productsCache.generateCacheKey(nextPageOptions)

      if (!productsCache.get(nextPageKey)) {
        const nextPageParams = new URLSearchParams()
        if (featured !== undefined)
          nextPageParams.append('featured', featured.toString())
        if (category) nextPageParams.append('category', category)
        nextPageParams.append('limit', (limit + 12).toString())
        if (sortBy) nextPageParams.append('sortBy', sortBy)
        if (order) nextPageParams.append('order', order)
        if (includeInactive) nextPageParams.append('include_inactive', 'true')

        const nextPageUrl = `/api/products?${nextPageParams.toString()}`

        productsCache.prefetch(nextPageKey, () => fetchProducts(nextPageUrl))
      }

      // Prefetch featured products if not already loaded
      if (!featured) {
        const featuredOptions = { ...options, featured: true, limit: 8 }
        const featuredKey = productsCache.generateCacheKey(featuredOptions)

        if (!productsCache.get(featuredKey)) {
          const featuredParams = new URLSearchParams()
          featuredParams.append('featured', 'true')
          featuredParams.append('limit', '8')
          if (sortBy) featuredParams.append('sortBy', sortBy)
          if (order) featuredParams.append('order', order)

          const featuredUrl = `/api/products?${featuredParams.toString()}`

          productsCache.prefetch(featuredKey, () => fetchProducts(featuredUrl))
        }
      }
    }

    const prefetchTimeout = setTimeout(prefetchRelated, 1000)
    return () => clearTimeout(prefetchTimeout)
  }, [
    enablePrefetch,
    loading,
    products,
    options,
    limit,
    featured,
    category,
    sortBy,
    order,
    includeInactive,
    fetchProducts,
  ])

  // Manual refetch function
  const refetch = useCallback(async () => {
    productsCache.invalidate(cacheKey)
    setLoading(true)
    setError(null)
    setIsStale(false)

    try {
      const data = await fetchProducts(apiUrl)
      productsCache.set(cacheKey, data, cacheTime)
      setProducts(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products')
    } finally {
      setLoading(false)
    }
  }, [cacheKey, apiUrl, cacheTime, fetchProducts])

  // Cache management functions
  const invalidateCache = useCallback((pattern?: string) => {
    productsCache.invalidate(pattern)
  }, [])

  const getCacheStats = useCallback(() => {
    return productsCache.getStats()
  }, [])

  // Memoized products to prevent unnecessary re-renders
  const memoizedProducts = useMemo(() => products, [products])

  return {
    products: memoizedProducts,
    loading,
    error,
    isStale,
    refetch,
    invalidateCache,
    getCacheStats,
    cacheKey, // For debugging
  }
}

// Export cache instance for global cache management
export { productsCache }

// Hook for global cache management
export function useProductsCache() {
  return {
    invalidate: (pattern?: string) => productsCache.invalidate(pattern),
    getStats: () => productsCache.getStats(),
    clear: () => productsCache.invalidate(),
  }
}
