'use client'

import { useState, useEffect } from 'react'
import { useAppLoading } from '@/providers/app-loading-provider'

interface UseAsyncLoadingOptions {
  loadingMessage?: string
  minLoadingTime?: number // Minimum time to show loading (for UX)
}

export function useAsyncLoading(options: UseAsyncLoadingOptions = {}) {
  const { setPageLoading } = useAppLoading()
  const [isLoading, setIsLoading] = useState(false)
  const { minLoadingTime = 500 } = options

  const startLoading = () => {
    setIsLoading(true)
    setPageLoading(true)
  }

  const stopLoading = () => {
    // Ensure minimum loading time for better UX
    setTimeout(() => {
      setIsLoading(false)
      setPageLoading(false)
    }, minLoadingTime)
  }

  return {
    isLoading,
    startLoading,
    stopLoading,
  }
}

// Hook for API calls with loading
/**
 * A custom React hook for managing API calls with loading states, error handling, and data management.
 * 
 * @template T - The type of data returned by the API call
 * 
 * @returns An object containing:
 * - `data`: The result of the API call, or null if no call has been made or if an error occurred
 * - `error`: Any error that occurred during the API call, or null if no error
 * - `isLoading`: Boolean indicating whether an API call is currently in progress
 * - `execute`: Function to execute an API call with automatic loading state and error handling
 * - `reset`: Function to reset the data and error states to null
 * 
 * @example
 * ```typescript
 * const { data, error, isLoading, execute, reset } = useApiCall<User>();
 * 
 * const fetchUser = async () => {
 *   return await execute(() => api.getUser(userId));
 * };
 * ```
 */
export function useApiCall<T>() {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const { isLoading, startLoading, stopLoading } = useAsyncLoading()

  const execute = async (apiCall: () => Promise<T>) => {
    try {
      startLoading()
      setError(null)
      const result = await apiCall()
      setData(result)
      return result
    } catch (err) {
      const error = err instanceof Error ? err : new Error('An error occurred')
      setError(error)
      throw error
    } finally {
      stopLoading()
    }
  }

  const reset = () => {
    setData(null)
    setError(null)
  }

  return {
    data,
    error,
    isLoading,
    execute,
    reset,
  }
}

// Hook for component mounting with loading
export function useMountLoading(callback?: () => Promise<void>) {
  const { startLoading, stopLoading } = useAsyncLoading()

  useEffect(() => {
    const mount = async () => {
      startLoading()
      try {
        if (callback) {
          await callback()
        }
      } finally {
        stopLoading()
      }
    }

    mount()
  }, [callback, startLoading, stopLoading])
}