'use client'

import React, { useState, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Heart,
  Grid3X3,
  List,
  Filter,
  SortAsc,
  SortDesc,
  Search,
  ShoppingCart,
  Share2,
  MoreVertical,
  Trash2,
  Edit3,
  Star,
  TrendingUp,
  TrendingDown,
  Package,
  DollarSign,
  Calendar,
  Eye,
  Plus,
  Check,
  X,
  Loader2,
  AlertTriangle,
  RefreshCw
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useWishlist } from '@/hooks/useWishlist'
import { WishlistSortBy, WishlistSortOrder, WishlistItemWithProduct, WishlistBulkAction } from '@/types/wishlist.types'

// Types for local component state
interface ViewMode {
  type: 'grid' | 'list'
}

interface FilterState {
  search: string
  priceRange: [number, number]
  inStock: boolean | null
  onSale: boolean | null
  collection: string | null
}

interface SortState {
  field: WishlistSortBy
  order: WishlistSortOrder
}

const WishlistPage: React.FC = () => {
  // Local state
  const [viewMode, setViewMode] = useState<ViewMode>({ type: 'grid' })
  const [showFilters, setShowFilters] = useState(false)
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState('')
  const [sortState, setSortState] = useState<SortState>({
    field: WishlistSortBy.CREATED_AT,
    order: WishlistSortOrder.DESC
  })
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    priceRange: [0, 1000],
    inStock: null,
    onSale: null,
    collection: null
  })

  // Wishlist hook
  const {
    items,
    collections,
    loading,
    error,
    pagination,
    addToWishlist,
    removeFromWishlist,
    updateWishlistItem,
    moveToCart,
    bulkOperation,
    createCollection,
    isInWishlist,
    refresh,
    loadMore
  } = useWishlist({
    limit: 20,
    sort_by: sortState.field,
    sort_order: sortState.order,
    filters: {
      search: searchQuery,
      price_min: filters.priceRange[0],
      price_max: filters.priceRange[1],
      in_stock: filters.inStock ?? undefined,
      on_sale: filters.onSale ?? undefined,
      collection_id: filters.collection ?? undefined
    }
  })

  // Filter and search items locally for instant feedback
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      if (searchQuery && !item.product_name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false
      }
      return true
    })
  }, [items, searchQuery])

  // Statistics
  const stats = useMemo(() => {
    const totalItems = items.length
    const totalValue = items.reduce((sum, item) => sum + (item.current_price || 0), 0)
    const inStockItems = items.filter(item => item.in_stock).length
    const onSaleItems = items.filter(item => item.is_on_sale).length
    const totalSavings = items.reduce((sum, item) => {
      const originalPrice = item.original_price || item.current_price || 0
      const currentPrice = item.current_price || 0
      return sum + (originalPrice - currentPrice)
    }, 0)

    return {
      totalItems,
      totalValue,
      inStockItems,
      onSaleItems,
      totalSavings
    }
  }, [items])

  // Handlers
  const handleSort = useCallback((field: WishlistSortBy) => {
    setSortState(prev => ({
      field,
      order: prev.field === field && prev.order === WishlistSortOrder.ASC 
        ? WishlistSortOrder.DESC 
        : WishlistSortOrder.ASC
    }))
  }, [])

  const handleSelectItem = useCallback((itemId: string) => {
    setSelectedItems(prev => {
      const newSelected = new Set(prev)
      if (newSelected.has(itemId)) {
        newSelected.delete(itemId)
      } else {
        newSelected.add(itemId)
      }
      return newSelected
    })
  }, [])

  const handleSelectAll = useCallback(() => {
    if (selectedItems.size === filteredItems.length) {
      setSelectedItems(new Set())
    } else {
      setSelectedItems(new Set(filteredItems.map(item => item.id)))
    }
  }, [selectedItems.size, filteredItems])

  const handleBulkAddToCart = useCallback(async () => {
    if (selectedItems.size === 0) return
    
    const success = await moveToCart(Array.from(selectedItems))
    if (success) {
      setSelectedItems(new Set())
    }
  }, [selectedItems, moveToCart])

  const handleBulkRemove = useCallback(async () => {
    if (selectedItems.size === 0) return
    
    const result = await bulkOperation({
      action: WishlistBulkAction.DELETE,
      item_ids: Array.from(selectedItems)
    })
    
    if (result) {
      setSelectedItems(new Set())
    }
  }, [selectedItems, bulkOperation])

  const handleRemoveItem = useCallback(async (itemId: string) => {
    await removeFromWishlist(itemId)
  }, [removeFromWishlist])

  const handleAddToCart = useCallback(async (item: WishlistItemWithProduct) => {
    await moveToCart([item.id])
  }, [moveToCart])

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg max-w-md">
          <AlertTriangle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Database Setup Required</h2>
          <p className="text-gray-600 mb-4">
            It looks like the wishlist database tables haven't been created yet. 
            Please run the SQL schema in your Supabase dashboard to set up the wishlist system.
          </p>
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-700 mb-2">
              <strong>Error:</strong> {error}
            </p>
            <p className="text-xs text-gray-500">
              You can find the SQL schema in <code>wishlist_schema.sql</code> in your project root.
            </p>
          </div>
          <div className="flex gap-3 justify-center">
            <button
              onClick={refresh}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </button>
            <Link
              href="/products"
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl shadow-lg">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
                <p className="text-gray-600">Items you love, saved for later</p>
              </div>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={refresh}
              disabled={loading}
              className="bg-white border-2 border-gray-200 text-gray-700 px-4 py-2 rounded-xl hover:border-gray-300 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </motion.button>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <Package className="w-5 h-5 text-blue-500 mb-2" />
              <div className="text-2xl font-bold text-gray-900">{stats.totalItems}</div>
              <div className="text-sm text-gray-600">Total Items</div>
            </div>
            
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <DollarSign className="w-5 h-5 text-green-500 mb-2" />
              <div className="text-2xl font-bold text-gray-900">${stats.totalValue.toFixed(2)}</div>
              <div className="text-sm text-gray-600">Total Value</div>
            </div>
            
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <Check className="w-5 h-5 text-emerald-500 mb-2" />
              <div className="text-2xl font-bold text-gray-900">{stats.inStockItems}</div>
              <div className="text-sm text-gray-600">In Stock</div>
            </div>
            
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <TrendingDown className="w-5 h-5 text-orange-500 mb-2" />
              <div className="text-2xl font-bold text-gray-900">{stats.onSaleItems}</div>
              <div className="text-sm text-gray-600">On Sale</div>
            </div>
            
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <Star className="w-5 h-5 text-yellow-500 mb-2" />
              <div className="text-2xl font-bold text-gray-900">${stats.totalSavings.toFixed(2)}</div>
              <div className="text-sm text-gray-600">Potential Savings</div>
            </div>
          </div>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search your wishlist..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3">
              {/* Sort */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleSort(WishlistSortBy.CREATED_AT)}
                  className={`px-3 py-2 rounded-lg border transition-colors ${
                    sortState.field === WishlistSortBy.CREATED_AT
                      ? 'bg-pink-50 border-pink-200 text-pink-700'
                      : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleSort(WishlistSortBy.CURRENT_PRICE)}
                  className={`px-3 py-2 rounded-lg border transition-colors ${
                    sortState.field === WishlistSortBy.CURRENT_PRICE
                      ? 'bg-pink-50 border-pink-200 text-pink-700'
                      : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <DollarSign className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSortState(prev => ({
                    ...prev,
                    order: prev.order === WishlistSortOrder.ASC ? WishlistSortOrder.DESC : WishlistSortOrder.ASC
                  }))}
                  className="px-3 py-2 rounded-lg border border-gray-200 text-gray-700 hover:border-gray-300 transition-colors"
                >
                  {sortState.order === WishlistSortOrder.ASC ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
                </button>
              </div>

              {/* View Mode */}
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode({ type: 'grid' })}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode.type === 'grid'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode({ type: 'list' })}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode.type === 'list'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Bulk Actions */}
          <AnimatePresence>
            {selectedItems.size > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 pt-4 border-t border-gray-200"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    {selectedItems.size} item{selectedItems.size !== 1 ? 's' : ''} selected
                  </span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleBulkAddToCart}
                      className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add to Cart
                    </button>
                    <button
                      onClick={handleBulkRemove}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Remove
                    </button>
                    <button
                      onClick={() => setSelectedItems(new Set())}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Content */}
        {loading && items.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-pink-500" />
          </div>
        ) : filteredItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Your wishlist is empty</h3>
            <p className="text-gray-600 mb-6">Start exploring and save items you love!</p>
            <Link
              href="/products"
              className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-6 py-3 rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all transform hover:scale-105"
            >
              Browse Products
            </Link>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {/* Select All */}
            {filteredItems.length > 0 && (
              <div className="mb-4">
                <button
                  onClick={handleSelectAll}
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {selectedItems.size === filteredItems.length ? 'Deselect All' : 'Select All'}
                </button>
              </div>
            )}

            {/* Items Grid/List */}
            {viewMode.type === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredItems.map((item, index) => (
                  <WishlistItemCard
                    key={item.id}
                    item={item}
                    index={index}
                    isSelected={selectedItems.has(item.id)}
                    onSelect={() => handleSelectItem(item.id)}
                    onRemove={() => handleRemoveItem(item.id)}
                    onAddToCart={() => handleAddToCart(item)}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredItems.map((item, index) => (
                  <WishlistItemRow
                    key={item.id}
                    item={item}
                    index={index}
                    isSelected={selectedItems.has(item.id)}
                    onSelect={() => handleSelectItem(item.id)}
                    onRemove={() => handleRemoveItem(item.id)}
                    onAddToCart={() => handleAddToCart(item)}
                  />
                ))}
              </div>
            )}

            {/* Load More */}
            {pagination.hasMore && (
              <div className="text-center mt-8">
                <button
                  onClick={loadMore}
                  disabled={loading}
                  className="bg-white border-2 border-gray-200 text-gray-700 px-6 py-3 rounded-xl hover:border-gray-300 transition-colors disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Plus className="w-4 h-4 mr-2" />
                  )}
                  Load More
                </button>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  )
}

// Wishlist Item Card Component
interface WishlistItemCardProps {
  item: WishlistItemWithProduct
  index: number
  isSelected: boolean
  onSelect: () => void
  onRemove: () => void
  onAddToCart: () => void
}

const WishlistItemCard: React.FC<WishlistItemCardProps> = ({
  item,
  index,
  isSelected,
  onSelect,
  onRemove,
  onAddToCart
}) => {
  const [imageLoaded, setImageLoaded] = useState(false)
  const isOnSale = item.is_on_sale
  const isInStock = item.in_stock

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`bg-white rounded-2xl shadow-sm border-2 transition-all duration-300 hover:shadow-md hover:scale-105 ${
        isSelected ? 'border-pink-200 ring-2 ring-pink-100' : 'border-gray-100'
      }`}
    >
      <div className="relative overflow-hidden rounded-t-2xl">
        {/* Selection Checkbox */}
        <div className="absolute top-3 left-3 z-10">
          <button
            onClick={onSelect}
            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
              isSelected
                ? 'bg-pink-500 border-pink-500 text-white'
                : 'bg-white border-gray-300 hover:border-pink-400'
            }`}
          >
            {isSelected && <Check className="w-3 h-3" />}
          </button>
        </div>

        {/* Badges */}
        <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
          {isOnSale && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              Sale
            </span>
          )}
          {!isInStock && (
            <span className="bg-gray-500 text-white text-xs px-2 py-1 rounded-full">
              Out of Stock
            </span>
          )}
        </div>

        {/* Product Image */}
        <div className="aspect-square relative bg-gray-100">
          <Image
            src={item.image_url || '/placeholder-product.jpg'}
            alt={item.product_name}
            fill
            className={`object-cover transition-all duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
          />
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Package className="w-8 h-8 text-gray-400" />
            </div>
          )}
        </div>

        {/* Hover Actions */}
        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          <button
            onClick={onAddToCart}
            disabled={!isInStock}
            className="bg-white text-gray-900 p-3 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
          <Link
            href={`/products/${item.product_id}`}
            className="bg-white text-gray-900 p-3 rounded-full hover:bg-gray-100 transition-colors"
          >
            <Eye className="w-5 h-5" />
          </Link>
          <button
            onClick={onRemove}
            className="bg-red-500 text-white p-3 rounded-full hover:bg-red-600 transition-colors"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
          {item.product_name}
        </h3>
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {isOnSale && item.original_price ? (
              <>
                <span className="text-lg font-bold text-red-500">
                  ${item.current_price?.toFixed(2)}
                </span>
                <span className="text-sm text-gray-500 line-through">
                  ${item.original_price?.toFixed(2)}
                </span>
              </>
            ) : (
              <span className="text-lg font-bold text-gray-900">
                ${item.current_price?.toFixed(2)}
              </span>
            )}
          </div>
        </div>

        <div className="text-xs text-gray-500">
          Added {new Date(item.created_at).toLocaleDateString()}
        </div>
      </div>
    </motion.div>
  )
}

// Wishlist Item Row Component
interface WishlistItemRowProps {
  item: WishlistItemWithProduct
  index: number
  isSelected: boolean
  onSelect: () => void
  onRemove: () => void
  onAddToCart: () => void
}

const WishlistItemRow: React.FC<WishlistItemRowProps> = ({
  item,
  index,
  isSelected,
  onSelect,
  onRemove,
  onAddToCart
}) => {
  const isOnSale = item.is_on_sale
  const isInStock = item.in_stock

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`bg-white rounded-2xl shadow-sm border-2 transition-all duration-300 hover:shadow-md ${
        isSelected ? 'border-pink-200 ring-2 ring-pink-100' : 'border-gray-100'
      }`}
    >
      <div className="flex items-center p-6 gap-6">
        {/* Checkbox */}
        <button
          onClick={onSelect}
          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
            isSelected
              ? 'bg-pink-500 border-pink-500 text-white'
              : 'bg-white border-gray-300 hover:border-pink-400'
          }`}
        >
          {isSelected && <Check className="w-3 h-3" />}
        </button>

        {/* Product Image */}
        <div className="w-20 h-20 relative bg-gray-100 rounded-xl overflow-hidden">
          <Image
            src={item.image_url || '/placeholder-product.jpg'}
            alt={item.product_name}
            fill
            className="object-cover"
          />
        </div>

        {/* Product Info */}
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">
                {item.product_name}
              </h3>
              <div className="flex items-center gap-3 mb-2">
                {isOnSale && item.original_price ? (
                  <>
                    <span className="text-lg font-bold text-red-500">
                      ${item.current_price?.toFixed(2)}
                    </span>
                    <span className="text-sm text-gray-500 line-through">
                      ${item.original_price?.toFixed(2)}
                    </span>
                  </>
                ) : (
                  <span className="text-lg font-bold text-gray-900">
                    ${item.current_price?.toFixed(2)}
                  </span>
                )}
                {isOnSale && (
                  <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full">
                    Sale
                  </span>
                )}
                {!isInStock && (
                  <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                    Out of Stock
                  </span>
                )}
              </div>
              <div className="text-sm text-gray-500">
                Added on {new Date(item.created_at).toLocaleDateString()}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={onAddToCart}
                disabled={!isInStock}
                className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
              >
                <ShoppingCart className="w-4 h-4" />
              </button>
              <Link
                href={`/products/${item.product_id}`}
                className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Eye className="w-4 h-4" />
              </Link>
              <button
                onClick={onRemove}
                className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default WishlistPage
