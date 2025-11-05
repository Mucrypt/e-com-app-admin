import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Download, 
  Package, 
  Star, 
  ExternalLink, 
  ShoppingCart, 
  Database,
  Eye,
  Import,
  Trash2,
  CheckCircle
} from 'lucide-react'
import Image from 'next/image'
import { toast } from 'sonner'

interface ScrapedProduct {
  id: string
  title: string
  description?: string
  price?: number
  original_price?: number
  currency?: string
  images?: string[]
  rating?: number
  review_count?: number
  brand?: string
  category?: string
  availability?: string
  source_url: string
  source_platform: string
  scraped_at?: string
  imported_at?: string
  product_id?: string
  specifications?: Record<string, any>
  discount_percentage?: number
  sku?: string
  weight?: number
  dimensions?: Record<string, any>
  shipping_info?: Record<string, any>
  seller_info?: Record<string, any>
  variants?: any[]
}

interface ScrapedProductsGridProps {
  onProductSelect?: (product: ScrapedProduct) => void
  selectedProducts?: string[]
  onSelectionChange?: (selected: string[]) => void
}

export function ScrapedProductsGrid({ 
  onProductSelect, 
  selectedProducts = [],
  onSelectionChange 
}: ScrapedProductsGridProps) {
  const [products, setProducts] = useState<ScrapedProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<{
    platform?: string
    imported?: boolean
  }>({})

  useEffect(() => {
    fetchScrapedProducts()
  }, [filter])

  const fetchScrapedProducts = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        action: 'get_scraped_products',
        ...(filter.platform && { platform: filter.platform }),
        limit: '50'
      })
      
      const response = await fetch(`/api/scraper/database?${params}`)
      const result = await response.json()
      
      if (response.ok) {
        let filteredProducts = result.data || []
        
        if (filter.imported !== undefined) {
          filteredProducts = filteredProducts.filter((p: ScrapedProduct) => 
            filter.imported ? !!p.imported_at : !p.imported_at
          )
        }
        
        setProducts(filteredProducts)
      } else {
        toast.error('Failed to fetch products')
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      toast.error('Error loading products')
    } finally {
      setLoading(false)
    }
  }

  const handleProductImport = async (productId: string) => {
    try {
      const response = await fetch('/api/scraper/database', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'import_product',
          data: { scrapedProductId: productId }
        })
      })
      
      const result = await response.json()
      
      if (response.ok) {
        toast.success('Product imported successfully!')
        fetchScrapedProducts() // Refresh the list
      } else {
        toast.error(result.error || 'Failed to import product')
      }
    } catch (error) {
      console.error('Error importing product:', error)
      toast.error('Error importing product')
    }
  }

  const handleBulkImport = async () => {
    if (selectedProducts.length === 0) {
      toast.error('No products selected')
      return
    }

    try {
      const response = await fetch('/api/scraper/database', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'bulk_import',
          data: { 
            scrapedProductIds: selectedProducts,
            globalModifications: {
              status: 'draft',
              is_featured: false
            }
          }
        })
      })
      
      const result = await response.json()
      
      if (response.ok) {
        toast.success(`Imported ${result.data.length} products successfully!`)
        if (result.errors.length > 0) {
          toast.warning(`${result.errors.length} products failed to import`)
        }
        onSelectionChange?.([])
        fetchScrapedProducts()
      } else {
        toast.error('Failed to import products')
      }
    } catch (error) {
      console.error('Error importing products:', error)
      toast.error('Error importing products')
    }
  }

  const handleProductDelete = async (productId: string) => {
    try {
      const response = await fetch(`/api/scraper/database?productId=${productId}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        toast.success('Product deleted successfully!')
        fetchScrapedProducts()
      } else {
        toast.error('Failed to delete product')
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      toast.error('Error deleting product')
    }
  }

  const toggleProductSelection = (productId: string) => {
    const newSelection = selectedProducts.includes(productId)
      ? selectedProducts.filter(id => id !== productId)
      : [...selectedProducts, productId]
    
    onSelectionChange?.(newSelection)
  }

  const getPlatformColor = (platform: string) => {
    const colors: Record<string, string> = {
      amazon: 'bg-orange-100 text-orange-800',
      alibaba: 'bg-blue-100 text-blue-800',
      aliexpress: 'bg-red-100 text-red-800',
      ebay: 'bg-yellow-100 text-yellow-800',
      walmart: 'bg-blue-100 text-blue-800',
      shopify: 'bg-green-100 text-green-800'
    }
    return colors[platform.toLowerCase()] || 'bg-gray-100 text-gray-800'
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="h-48 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filter Bar */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={!filter.platform ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter({ ...filter, platform: undefined })}
          >
            All Platforms
          </Button>
          {['amazon', 'alibaba', 'aliexpress', 'ebay', 'walmart'].map(platform => (
            <Button
              key={platform}
              variant={filter.platform === platform ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter({ ...filter, platform })}
            >
              {platform.charAt(0).toUpperCase() + platform.slice(1)}
            </Button>
          ))}
        </div>
        
        <div className="flex gap-2">
          <Button
            variant={filter.imported === false ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter({ ...filter, imported: false })}
          >
            Not Imported ({products.filter(p => !p.imported_at).length})
          </Button>
          <Button
            variant={filter.imported === true ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter({ ...filter, imported: true })}
          >
            <CheckCircle className="h-4 w-4 mr-1" />
            Imported ({products.filter(p => !!p.imported_at).length})
          </Button>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedProducts.length > 0 && (
        <div className="flex gap-2 p-4 bg-blue-50 rounded-lg">
          <span className="text-sm font-medium">
            {selectedProducts.length} product(s) selected
          </span>
          <Button 
            size="sm" 
            onClick={handleBulkImport}
            className="ml-auto"
          >
            <Import className="h-4 w-4 mr-1" />
            Import Selected
          </Button>
        </div>
      )}

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card 
            key={product.id} 
            className={`relative overflow-hidden transition-all hover:shadow-lg ${
              selectedProducts.includes(product.id!) ? 'ring-2 ring-blue-500' : ''
            }`}
          >
            {/* Selection Checkbox */}
            <div className="absolute top-2 left-2 z-10">
              <input
                type="checkbox"
                checked={selectedProducts.includes(product.id!)}
                onChange={() => toggleProductSelection(product.id!)}
                className="h-4 w-4 text-blue-600 rounded"
              />
            </div>

            {/* Import Status */}
            {product.imported_at && (
              <div className="absolute top-2 right-2 z-10">
                <Badge className="bg-green-100 text-green-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Imported
                </Badge>
              </div>
            )}

            <CardContent className="p-0">
              {/* Product Images Gallery */}
              <div className="relative h-48 w-full bg-gray-100">
                {product.images && product.images.length > 0 ? (
                  <div className="relative h-full w-full">
                    {/* Main Image */}
                    <div className="relative h-full w-full">
                      <Image
                        src={product.images[0]}
                        alt={product.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                    
                    {/* Image Count Badge */}
                    {product.images.length > 1 && (
                      <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                        </svg>
                        {product.images.length}
                      </div>
                    )}
                    
                    {/* Image Thumbnails Overlay */}
                    {product.images.length > 1 && (
                      <div className="absolute bottom-2 left-2 right-2">
                        <div className="flex gap-1 overflow-x-auto scrollbar-hide">
                          {product.images.slice(0, 6).map((img, idx) => (
                            <div
                              key={idx}
                              className="flex-shrink-0 w-8 h-8 rounded border border-white/50 overflow-hidden"
                            >
                              <Image
                                src={img}
                                alt={`${product.title} image ${idx + 1}`}
                                width={32}
                                height={32}
                                className="object-cover w-full h-full"
                              />
                            </div>
                          ))}
                          {product.images.length > 6 && (
                            <div className="flex-shrink-0 w-8 h-8 rounded border border-white/50 bg-black/70 flex items-center justify-center text-white text-xs">
                              +{product.images.length - 6}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Package className="h-12 w-12 text-gray-400" />
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div className="p-4 space-y-3">
                {/* Platform and Brand */}
                <div className="flex items-center justify-between">
                  <Badge className={getPlatformColor(product.source_platform)}>
                    {product.source_platform}
                  </Badge>
                  {product.brand && (
                    <span className="text-xs text-gray-500">{product.brand}</span>
                  )}
                </div>

                {/* Title */}
                <h3 className="font-semibold text-sm line-clamp-2 min-h-[2.5rem]">
                  {product.title}
                </h3>

                {/* Price and Rating */}
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    {product.price && (
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-lg">
                          {product.currency || '$'}{product.price}
                        </span>
                        {product.original_price && product.original_price > product.price && (
                          <span className="text-sm text-gray-500 line-through">
                            {product.currency || '$'}{product.original_price}
                          </span>
                        )}
                      </div>
                    )}
                    {product.discount_percentage && (
                      <Badge variant="destructive" className="text-xs">
                        -{product.discount_percentage}%
                      </Badge>
                    )}
                  </div>
                  
                  {product.rating && (
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{product.rating}</span>
                      {product.review_count && (
                        <span className="text-gray-500">({product.review_count})</span>
                      )}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(product.source_url, '_blank')}
                    className="flex-1"
                  >
                    <ExternalLink className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  
                  {!product.imported_at ? (
                    <Button
                      size="sm"
                      onClick={() => handleProductImport(product.id!)}
                      className="flex-1"
                    >
                      <Import className="h-4 w-4 mr-1" />
                      Import
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onProductSelect?.(product)}
                      className="flex-1"
                      title="View product details"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  )}
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleProductDelete(product.id!)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12">
          <Database className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-500">
            Start scraping products to see them here
          </p>
        </div>
      )}
    </div>
  )
}