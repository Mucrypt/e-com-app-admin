import { useState, useEffect, useRef } from 'react'

interface CacheEntry<T> {
  data: T
  timestamp: number
  expiryTime: number
}

class APICache {
  private cache = new Map<string, CacheEntry<any>>()
  private readonly DEFAULT_CACHE_TIME = 60000 // 1 minute

  set<T>(key: string, data: T, cacheTime?: number): void {
    const timestamp = Date.now()
    const expiryTime = timestamp + (cacheTime || this.DEFAULT_CACHE_TIME)
    this.cache.set(key, { data, timestamp, expiryTime })
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key)
    if (!entry) return null

    const now = Date.now()
    if (now > entry.expiryTime) {
      this.cache.delete(key)
      return null
    }

    return entry.data as T
  }

  clear(): void {
    this.cache.clear()
  }

  delete(key: string): void {
    this.cache.delete(key)
  }
}

const apiCache = new APICache()

interface UseCachedAPIOptions {
  cacheTime?: number
  enabled?: boolean
  retryOnError?: boolean
}

export function useCachedAPI<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: UseCachedAPIOptions = {}
) {
  const { cacheTime, enabled = true, retryOnError = false } = options
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const requestInProgress = useRef(false)
  const retryCount = useRef(0)

  useEffect(() => {
    if (!enabled) return

    const fetchData = async () => {
      // Prevent multiple simultaneous requests
      if (requestInProgress.current) return

      // Check cache first
      const cachedData = apiCache.get<T>(key)
      if (cachedData) {
        setData(cachedData)
        setError(null)
        return
      }

      requestInProgress.current = true
      setLoading(true)
      setError(null)

      try {
        const result = await fetcher()
        apiCache.set(key, result, cacheTime)
        setData(result)
        retryCount.current = 0
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred'
        setError(errorMessage)
        
        // Retry logic
        if (retryOnError && retryCount.current < 3) {
          retryCount.current++
          setTimeout(() => {
            requestInProgress.current = false
            fetchData()
          }, 1000 * retryCount.current) // Exponential backoff
          return
        }
      } finally {
        setLoading(false)
        requestInProgress.current = false
      }
    }

    fetchData()
  }, [key, enabled, cacheTime, retryOnError, fetcher])

  const refresh = () => {
    apiCache.delete(key)
    setData(null)
    setError(null)
  }

  return { data, loading, error, refresh }
}

export { apiCache }