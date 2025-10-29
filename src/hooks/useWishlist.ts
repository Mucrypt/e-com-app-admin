import { useState, useEffect, useCallback } from 'react'
import { 
  WishlistItemWithProduct, 
  WishlistCollectionWithStats,
  WishlistResponse,
  AddToWishlistRequest,
  UpdateWishlistItemRequest,
  CreateCollectionRequest,
  BulkOperationRequest,
  BulkOperationResponse,
  UseWishlistOptions,
  UseWishlistReturn,
  WishlistSortBy,
  WishlistSortOrder,
  WishlistFilters
} from '@/types/wishlist.types'

export const useWishlist = (options: UseWishlistOptions = {}): UseWishlistReturn => {
  const {
    collection_id,
    limit = 50,
    sort_by = WishlistSortBy.CREATED_AT,
    sort_order = WishlistSortOrder.DESC,
    filters = {},
    auto_fetch = true
  } = options

  // State
  const [items, setItems] = useState<WishlistItemWithProduct[]>([])
  const [collections, setCollections] = useState<WishlistCollectionWithStats[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    limit,
    offset: 0,
    hasMore: false
  })

  // Helper function to build query params
  const buildQueryParams = useCallback((additionalParams: Record<string, any> = {}) => {
    const params = new URLSearchParams()
    
    if (collection_id) params.append('collection_id', collection_id)
    params.append('limit', limit.toString())
    params.append('offset', pagination.offset.toString())
    params.append('sort_by', sort_by)
    params.append('sort_order', sort_order)
    
    // Add filters
    Object.entries({ ...filters, ...additionalParams }).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString())
      }
    })
    
    return params.toString()
  }, [collection_id, limit, pagination.offset, sort_by, sort_order, filters])

  // Fetch wishlist items
  const fetchWishlist = useCallback(async (isLoadMore = false) => {
    try {
      setLoading(true)
      setError(null)

      const queryParams = buildQueryParams()
      const response = await fetch(`/api/wishlist?${queryParams}`)
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch wishlist')
      }

      const data: WishlistResponse = await response.json()
      
      if (isLoadMore) {
        setItems(prev => [...prev, ...data.items])
      } else {
        setItems(data.items)
      }
      
      setCollections(data.collections)
      setPagination(data.pagination)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }, [buildQueryParams])

  // Add item to wishlist
  const addToWishlist = useCallback(async (request: AddToWishlistRequest): Promise<WishlistItemWithProduct | null> => {
    try {
      setError(null)

      const response = await fetch('/api/wishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to add item to wishlist')
      }

      const data = await response.json()
      const newItem = data.item

      // Update local state
      setItems(prev => [newItem, ...prev])
      
      // Refresh collections to update stats
      await fetchWishlist()

      return newItem
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add item to wishlist')
      return null
    }
  }, [fetchWishlist])

  // Remove item from wishlist
  const removeFromWishlist = useCallback(async (itemId: string, hardDelete = false): Promise<boolean> => {
    try {
      setError(null)

      const queryParams = hardDelete ? '?hard=true' : ''
      const response = await fetch(`/api/wishlist/${itemId}${queryParams}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to remove item from wishlist')
      }

      // Update local state
      setItems(prev => prev.filter(item => item.id !== itemId))
      
      // Refresh collections to update stats
      await fetchWishlist()

      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove item from wishlist')
      return false
    }
  }, [fetchWishlist])

  // Update wishlist item
  const updateWishlistItem = useCallback(async (
    itemId: string, 
    updates: UpdateWishlistItemRequest
  ): Promise<WishlistItemWithProduct | null> => {
    try {
      setError(null)

      const response = await fetch(`/api/wishlist/${itemId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update wishlist item')
      }

      const data = await response.json()
      const updatedItem = data.item

      // Update local state
      setItems(prev => prev.map(item => 
        item.id === itemId ? updatedItem : item
      ))

      return updatedItem
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update wishlist item')
      return null
    }
  }, [])

  // Move items to cart
  const moveToCart = useCallback(async (itemIds: string[]): Promise<boolean> => {
    try {
      setError(null)

      const response = await fetch('/api/wishlist/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'add_to_cart',
          item_ids: itemIds,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to move items to cart')
      }

      // Optionally remove items from wishlist after adding to cart
      // This depends on your business logic
      
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to move items to cart')
      return false
    }
  }, [])

  // Bulk operations
  const bulkOperation = useCallback(async (request: BulkOperationRequest): Promise<BulkOperationResponse | null> => {
    try {
      setError(null)

      const response = await fetch('/api/wishlist/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Bulk operation failed')
      }

      const data: BulkOperationResponse = await response.json()

      // Refresh data after bulk operation
      await fetchWishlist()

      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bulk operation failed')
      return null
    }
  }, [fetchWishlist])

  // Create new collection
  const createCollection = useCallback(async (request: CreateCollectionRequest) => {
    try {
      setError(null)

      const response = await fetch('/api/wishlist/collections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create collection')
      }

      const data = await response.json()
      const newCollection = data.collection

      // Update local state
      setCollections(prev => [...prev, { ...newCollection, item_count: 0, purchased_count: 0, in_stock_count: 0, on_sale_count: 0, total_value: 0, total_savings: 0 }])

      return newCollection
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create collection')
      return null
    }
  }, [])

  // Utility functions
  const isInWishlist = useCallback((productId: string): boolean => {
    return items.some(item => item.product_id === productId)
  }, [items])

  const getWishlistItem = useCallback((productId: string): WishlistItemWithProduct | null => {
    return items.find(item => item.product_id === productId) || null
  }, [items])

  const refresh = useCallback(async () => {
    setPagination(prev => ({ ...prev, offset: 0 }))
    await fetchWishlist(false)
  }, [fetchWishlist])

  const loadMore = useCallback(async () => {
    if (pagination.hasMore && !loading) {
      setPagination(prev => ({ ...prev, offset: prev.offset + prev.limit }))
      await fetchWishlist(true)
    }
  }, [fetchWishlist, pagination.hasMore, loading])

  // Auto-fetch on mount and when dependencies change
  useEffect(() => {
    if (auto_fetch) {
      fetchWishlist()
    }
  }, [auto_fetch, collection_id, sort_by, sort_order, JSON.stringify(filters)])

  return {
    items,
    collections,
    loading,
    error,
    pagination,
    
    // Actions
    addToWishlist,
    removeFromWishlist,
    updateWishlistItem,
    moveToCart,
    bulkOperation,
    
    // Collection actions
    createCollection,
    
    // Utility functions
    isInWishlist,
    getWishlistItem,
    refresh,
    loadMore,
  }
}