// src/lib/cache.ts
class AdvancedCache<T = unknown> {
  private cache = new Map<string, T>()
  private timestamps = new Map<string, number>()
  private readonly TTL = 5 * 60 * 1000 // 5 minutes

  set(key: string, value: T, customTTL?: number) {
    this.cache.set(key, value)
    this.timestamps.set(key, Date.now() + (customTTL ?? this.TTL))
  }

  get(key: string): T | null {
    const expires = this.timestamps.get(key)
    if (expires === undefined || expires < Date.now()) {
      this.cache.delete(key)
      this.timestamps.delete(key)
      return null
    }
    return this.cache.get(key) ?? null
  }

  prefetch(keys: string[], fetcher: (key: string) => Promise<T>) {
    keys.forEach(async (key) => {
      if (!this.get(key)) {
        const data = await fetcher(key)
        this.set(key, data)
      }
    })
  }
}

export const appCache = new AdvancedCache()
