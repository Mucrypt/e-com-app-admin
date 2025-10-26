'use client'
import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { FaSearch, FaStar,  FaEdit } from 'react-icons/fa'
import { toast } from 'sonner'
import Image from 'next/image'
import Link from 'next/link'

interface Product {
  id: string
  name: string
  price: number
  original_price?: number
  image_url?: string
  images?: Array<string | { url?: string }>
  is_featured: boolean
  is_active: boolean
  created_at: string
  categories?: {
    name: string
    color?: string
  }
}

export default function FeaturedProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = products.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredProducts(filtered)
    } else {
      setFilteredProducts(products)
    }
  }, [searchQuery, products])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/products?limit=100')

      if (!response.ok) {
        throw new Error('Failed to fetch products')
      }

      const data = await response.json()
      setProducts(data)
    } catch (error) {
      console.error('Error fetching products:', error)
      toast.error('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const toggleFeatured = async (
    productId: string,
    currentFeatured: boolean
  ) => {
    try {
      setUpdating(productId)

      const response = await fetch(`/api/product/${productId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          is_featured: !currentFeatured,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update product')
      }

      // Update local state
      setProducts((prev) =>
        prev.map((product) =>
          product.id === productId
            ? { ...product, is_featured: !currentFeatured }
            : product
        )
      )

      toast.success(
        `Product ${
          !currentFeatured ? 'added to' : 'removed from'
        } featured products`
      )
    } catch (error) {
      console.error('Error updating product:', error)
      toast.error('Failed to update product')
    } finally {
      setUpdating(null)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price)
  }

  const getProductImage = (product: Product) => {
    if (product.image_url) return product.image_url
    if (
      product.images &&
      Array.isArray(product.images) &&
      product.images.length > 0
    ) {
      const first = product.images[0]
      if (typeof first === 'string') return first
      return first.url ?? '/placeholder-product.jpg'
    }
    return '/placeholder-product.jpg'
  }

  const featuredProducts = products.filter((p) => p.is_featured)

  if (loading) {
    return (
      <div className='space-y-6 p-6  '>
        <div className='flex justify-center items-center h-64'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600'></div>
        </div>
      </div>
    )
  }

  return (
    <div className='space-y-6 p-6 overflow-y-auto  max-h-[calc(100vh-200px)]'>
      {/* Header */}
      <div className='flex justify-between items-center'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>
            Featured Products Management
          </h1>
          <p className='text-gray-600'>
            Manage which products appear in the featured section
          </p>
        </div>
        <div className='flex items-center gap-4'>
          <Badge variant='secondary' className='text-lg px-3 py-1'>
            <FaStar className='mr-1' />
            {featuredProducts.length} Featured
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium text-gray-600'>
              Total Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{products.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium text-gray-600'>
              Featured Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-yellow-600'>
              {featuredProducts.length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium text-gray-600'>
              Active Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-green-600'>
              {products.filter((p) => p.is_active).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className='pt-6'>
          <div className='relative'>
            <FaSearch className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
            <Input
              placeholder='Search products...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='pl-10'
            />
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      <Card>
        <CardHeader>
          <CardTitle>All Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className='border rounded-lg p-4 hover:shadow-md transition-shadow'
              >
                {/* Product Image */}
                <div className='aspect-square relative mb-3 bg-gray-100 rounded-lg overflow-hidden'>
                  <Image
                    src={getProductImage(product)}
                    alt={product.name}
                    fill
                    className='object-cover'
                  />
                  {product.is_featured && (
                    <div className='absolute top-2 left-2 bg-yellow-500 text-white p-1 rounded'>
                      <FaStar className='text-xs' />
                    </div>
                  )}
                  {!product.is_active && (
                    <div className='absolute inset-0 bg-red-500 bg-opacity-20 flex items-center justify-center'>
                      <Badge variant='destructive'>Inactive</Badge>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className='space-y-2'>
                  <h3
                    className='font-medium text-sm line-clamp-2'
                    title={product.name}
                  >
                    {product.name}
                  </h3>

                  {product.categories && (
                    <Badge
                      variant='outline'
                      className='text-xs'
                      style={{
                        borderColor: product.categories.color || '#6366f1',
                        color: product.categories.color || '#6366f1',
                      }}
                    >
                      {product.categories.name}
                    </Badge>
                  )}

                  <div className='flex items-center justify-between'>
                    <span className='font-bold text-sm'>
                      {formatPrice(product.price)}
                    </span>
                    {product.original_price && (
                      <span className='text-xs text-gray-500 line-through'>
                        {formatPrice(product.original_price)}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className='flex items-center justify-between pt-2'>
                    <div className='flex items-center space-x-2'>
                      <Switch
                        checked={product.is_featured}
                        onCheckedChange={() => {
                          void toggleFeatured(product.id, product.is_featured)
                        }}
                        disabled={updating === product.id}
                      />
                      <span className='text-xs text-gray-600'>
                        {product.is_featured ? 'Featured' : 'Regular'}
                      </span>
                    </div>

                    <Link
                      href={`/superadmin/content/product/${product.id}/edit`}
                    >
                      <Button variant='outline' size='sm'>
                        <FaEdit className='text-xs' />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className='text-center py-8'>
              <p className='text-gray-500'>No products found</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <Link href='/superadmin/content/product/create'>
              <Button className='w-full'>Add New Product</Button>
            </Link>

            <Button
              variant='outline'
              onClick={fetchProducts}
              disabled={loading}
            >
              Refresh Products
            </Button>

            <Button
              variant='outline'
              onClick={() => {
                const featured = products.filter((p) => p.is_featured)
                console.log('Featured Products:', featured)
                toast.success(
                  `${featured.length} featured products logged to console`
                )
              }}
            >
              Export Featured List
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
