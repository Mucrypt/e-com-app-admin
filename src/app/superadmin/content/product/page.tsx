'use client'
import { useState } from 'react'
import {
  FaSearch,
  FaEye,
  FaEdit,
  FaTrash,
  FaPlus,
  FaFilter,
  FaChevronDown,
  FaChevronUp,
  FaImage,
  FaChevronLeft,
  FaChevronRight,
} from 'react-icons/fa'
import Image from 'next/image'
import Link from 'next/link'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import { motion, AnimatePresence } from 'framer-motion'
import { useProducts } from '@/hooks/useProducts'
import { Tables } from '@/types/database.types'

// Use the database type instead of defining a local interface
type Product = Tables<'products'> & {
  categories?: {
    id: string
    name: string
    slug: string
    color?: string
  }
}

interface UseProductsResult {
  products: Product[]
  loading: boolean
  error: string | null
  refetch?: () => void
}

export default function SuperAdminProductPage() {
  const { products, loading, error, refetch } =
    useProducts() as unknown as UseProductsResult

  // State management
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<string[]>([])
  const [bulkAction, setBulkAction] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    status: 'all',
    sort: 'newest',
    resultsPerPage: 25,
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  // Filter and sort products
  const filteredProducts = products
    .filter(
      (prod: Product) =>
        prod.name.toLowerCase().includes(search.toLowerCase()) ||
        (prod.description &&
          prod.description.toLowerCase().includes(search.toLowerCase())) ||
        (prod.sku && prod.sku.toLowerCase().includes(search.toLowerCase())) ||
        (prod.brand && prod.brand.toLowerCase().includes(search.toLowerCase()))
    )
    .filter(
      (prod: Product) =>
        filters.status === 'all' ||
        (filters.status === 'active' && prod.is_active) ||
        (filters.status === 'inactive' && !prod.is_active)
    )
    .sort((a: Product, b: Product) => {
      if (filters.sort === 'newest')
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
      if (filters.sort === 'oldest')
        return (
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        )
      if (filters.sort === 'name-asc') return a.name.localeCompare(b.name)
      if (filters.sort === 'name-desc') return b.name.localeCompare(a.name)
      if (filters.sort === 'price-asc') return a.price - b.price
      if (filters.sort === 'price-desc') return b.price - a.price
      return 0
    })

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / filters.resultsPerPage)
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * filters.resultsPerPage,
    currentPage * filters.resultsPerPage
  )

  // Selection management
  const toggleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  const toggleSelectAll = () => {
    if (selected.length === paginatedProducts.length) {
      setSelected([])
    } else {
      setSelected(paginatedProducts.map((prod) => prod.id))
    }
  }

  // Bulk actions
  const handleBulkAction = async () => {
    if (!bulkAction || selected.length === 0) return

    try {
      setIsLoading(true)
      const res = await fetch('/api/product/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: bulkAction,
          ids: selected,
        }),
      })

      if (!res.ok) throw new Error('Bulk action failed')

      if (refetch) refetch()
      setSelected([])
      setBulkAction('')
    } catch (err) {
      console.error('Bulk action error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  // Status badge component
  const StatusBadge = ({ active }: { active: boolean | null }) => (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        active
          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      }`}
    >
      {active ? 'Active' : 'Inactive'}
    </span>
  )

  // Product image component
  const ProductImage = ({ image_url }: { image_url?: string | null }) =>
    image_url ? (
      <Image
        src={image_url}
        alt='Product'
        width={40}
        height={40}
        className='rounded-lg object-cover'
      />
    ) : (
      <div className='h-10 w-10 rounded-lg bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-gray-400'>
        <FaImage className='text-xl' />
      </div>
    )

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price)
  }

  return (
    <div className='space-y-6 px-4 sm:px-6 lg:px-8 py-8 overflow-y-auto max-h-[calc(100vh-200px)]'>
      <div className='max-w-7xl mx-auto'>
        {/* Header */}
        <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8'>
          <div>
            <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>
              Product Management
            </h1>
            <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
              Manage your products and inventory
            </p>
          </div>
          <div className='flex flex-wrap gap-3'>
            <Link href='/superadmin/content/product/create'>
              <button className='flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-4 py-2.5 rounded-lg shadow-md transition-all duration-200'>
                <FaPlus className='text-sm' />
                <span>Add Product</span>
              </button>
            </Link>
          </div>
        </div>

        {/* Filters and Search */}
        <div className='bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6'>
          <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
            <div className='relative flex-grow max-w-xl'>
              <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                <FaSearch className='text-gray-400' />
              </div>
              <input
                type='text'
                placeholder='Search products by name, description, SKU or brand...'
                className='block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className='flex items-center space-x-2 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors'
            >
              <FaFilter />
              <span>Filters</span>
              {showFilters ? (
                <FaChevronUp size={12} />
              ) : (
                <FaChevronDown size={12} />
              )}
            </button>
          </div>

          {/* Expanded Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className='overflow-hidden'
              >
                <div className='mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 grid grid-cols-1 md:grid-cols-3 gap-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                      Status
                    </label>
                    <select
                      value={filters.status}
                      onChange={(e) =>
                        setFilters({ ...filters, status: e.target.value })
                      }
                      className='w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white'
                      title='Filter by status'
                    >
                      <option value='all'>All Statuses</option>
                      <option value='active'>Active Only</option>
                      <option value='inactive'>Inactive Only</option>
                    </select>
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                      Sort By
                    </label>
                    <select
                      value={filters.sort}
                      onChange={(e) =>
                        setFilters({ ...filters, sort: e.target.value })
                      }
                      className='w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white'
                      title='Sort products'
                    >
                      <option value='newest'>Newest First</option>
                      <option value='oldest'>Oldest First</option>
                      <option value='name-asc'>Name (A-Z)</option>
                      <option value='name-desc'>Name (Z-A)</option>
                      <option value='price-asc'>Price (Low to High)</option>
                      <option value='price-desc'>Price (High to Low)</option>
                    </select>
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                      Results Per Page
                    </label>
                    <select
                      value={filters.resultsPerPage}
                      onChange={(e) => {
                        setFilters({
                          ...filters,
                          resultsPerPage: Number(e.target.value),
                        })
                        setCurrentPage(1)
                      }}
                      className='w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white'
                      title='Results Per Page'
                    >
                      <option value={10}>10 per page</option>
                      <option value={25}>25 per page</option>
                      <option value={50}>50 per page</option>
                      <option value={100}>100 per page</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bulk Actions */}
        <AnimatePresence>
          {selected.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className='bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg border border-blue-200 dark:border-blue-800 mb-6'
            >
              <div className='flex flex-col md:flex-row md:items-center gap-4'>
                <div className='text-blue-800 dark:text-blue-200 font-medium'>
                  {selected.length}{' '}
                  {selected.length === 1 ? 'product' : 'products'} selected
                </div>
                <div className='flex-1 flex flex-wrap gap-3'>
                  <select
                    value={bulkAction}
                    onChange={(e) => setBulkAction(e.target.value)}
                    className='border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white'
                    title='Bulk actions'
                  >
                    <option value=''>Choose action...</option>
                    <option value='activate'>Activate</option>
                    <option value='deactivate'>Deactivate</option>
                    <option value='delete'>Delete</option>
                  </select>
                  <button
                    onClick={handleBulkAction}
                    disabled={!bulkAction || isLoading}
                    className={`px-4 py-2 rounded-lg shadow-sm text-sm font-medium ${
                      bulkAction
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {isLoading ? 'Processing...' : 'Apply'}
                  </button>
                  <button
                    onClick={() => setSelected([])}
                    className='px-4 py-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium'
                  >
                    Clear Selection
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div className='bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden'>
          {loading ? (
            <div className='flex justify-center items-center h-64'>
              <LoadingSpinner message='Loading products...' />
            </div>
          ) : error ? (
            <div className='p-6 text-red-500 font-medium'>{error}</div>
          ) : filteredProducts.length === 0 ? (
            <div className='p-6 text-center'>
              <div className='text-gray-500 dark:text-gray-400 mb-4'>
                No products found matching your criteria
              </div>
              <Link href='/superadmin/content/product/create-products'>
                <button className='px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg'>
                  Create New Product
                </button>
              </Link>
            </div>
          ) : (
            <>
              {/* Table */}
              <div className='overflow-x-auto'>
                <table className='min-w-full divide-y divide-gray-200 dark:divide-gray-700'>
                  <thead className='bg-gray-50 dark:bg-gray-700'>
                    <tr>
                      <th
                        scope='col'
                        className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-12'
                      >
                        <input
                          type='checkbox'
                          checked={
                            selected.length > 0 &&
                            selected.length === paginatedProducts.length
                          }
                          onChange={toggleSelectAll}
                          className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded'
                          title='Select all products'
                        />
                      </th>
                      <th
                        scope='col'
                        className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'
                      >
                        Product
                      </th>
                      <th
                        scope='col'
                        className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'
                      >
                        SKU
                      </th>
                      <th
                        scope='col'
                        className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'
                      >
                        Brand
                      </th>
                      <th
                        scope='col'
                        className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'
                      >
                        Price
                      </th>
                      <th
                        scope='col'
                        className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'
                      >
                        Stock
                      </th>
                      <th
                        scope='col'
                        className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'
                      >
                        Status
                      </th>
                      <th
                        scope='col'
                        className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'
                      >
                        Last Updated
                      </th>
                      <th
                        scope='col'
                        className='px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className='bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700'>
                    {paginatedProducts.map((prod) => (
                      <tr
                        key={prod.id}
                        className='hover:bg-gray-50 dark:hover:bg-gray-700/50'
                      >
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <input
                            type='checkbox'
                            checked={selected.includes(prod.id)}
                            onChange={() => toggleSelect(prod.id)}
                            className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded'
                            title={`Select ${prod.name}`}
                          />
                        </td>
                        <td className='px-6 py-4'>
                          <div className='flex items-center'>
                            <div className='flex-shrink-0 h-10 w-10 mr-3'>
                              <ProductImage image_url={prod.image_url} />
                            </div>
                            <div>
                              <div className='text-sm font-medium text-gray-900 dark:text-white'>
                                {prod.name}
                              </div>
                              <div className='text-sm text-gray-500 dark:text-gray-400 line-clamp-1'>
                                {prod.description || 'No description'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className='px-6 py-4 text-sm text-gray-500 dark:text-gray-400'>
                          {prod.sku || 'N/A'}
                        </td>
                        <td className='px-6 py-4 text-sm text-gray-500 dark:text-gray-400'>
                          {prod.brand || 'N/A'}
                        </td>
                        <td className='px-6 py-4 text-sm text-gray-500 dark:text-gray-400'>
                          {formatPrice(prod.price)}
                        </td>
                        <td className='px-6 py-4 text-sm text-gray-500 dark:text-gray-400'>
                          {prod.stock_quantity !== null
                            ? prod.stock_quantity
                            : 'N/A'}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <StatusBadge active={prod.is_active} />
                        </td>
                        <td className='px-6 py-4 text-sm text-gray-500 dark:text-gray-400'>
                          {new Date(prod.updated_at).toLocaleDateString()}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                          <div className='flex justify-end space-x-1'>
                            <Link
                              href={`/superadmin/content/product/${prod.id}/view`}
                            >
                              <button
                                className='text-blue-600 hover:text-blue-900 dark:hover:text-blue-400 p-1 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/30'
                                title='View'
                              >
                                <FaEye />
                              </button>
                            </Link>
                            <Link
                              href={`/superadmin/content/product/${prod.id}/edit`}
                            >
                              <button
                                className='text-green-600 hover:text-green-900 dark:hover:text-green-400 p-1 rounded-full hover:bg-green-50 dark:hover:bg-green-900/30'
                                title='Edit'
                              >
                                <FaEdit />
                              </button>
                            </Link>
                            <button
                              onClick={() => {
                                if (
                                  confirm(
                                    `Are you sure you want to delete "${prod.name}"?`
                                  )
                                ) {
                                  // TODO: Implement delete functionality
                                }
                              }}
                              className='text-red-600 hover:text-red-900 dark:hover:text-red-400 p-1 rounded-full hover:bg-red-50 dark:hover:bg-red-900/30'
                              title='Delete'
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className='bg-gray-50 dark:bg-gray-700 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6'>
                <div className='flex-1 flex justify-between sm:hidden'>
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className='relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50'
                  >
                    Previous
                  </button>
                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                    className='ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50'
                  >
                    Next
                  </button>
                </div>
                <div className='hidden sm:flex-1 sm:flex sm:items-center sm:justify-between'>
                  <div>
                    <p className='text-sm text-gray-700 dark:text-gray-300'>
                      Showing{' '}
                      <span className='font-medium'>
                        {(currentPage - 1) * filters.resultsPerPage + 1}
                      </span>{' '}
                      to{' '}
                      <span className='font-medium'>
                        {Math.min(
                          currentPage * filters.resultsPerPage,
                          filteredProducts.length
                        )}
                      </span>{' '}
                      of{' '}
                      <span className='font-medium'>
                        {filteredProducts.length}
                      </span>{' '}
                      results
                    </p>
                  </div>
                  <div>
                    <nav
                      className='relative z-0 inline-flex rounded-md shadow-sm -space-x-px'
                      aria-label='Pagination'
                    >
                      <button
                        onClick={() => setCurrentPage(1)}
                        disabled={currentPage === 1}
                        className='relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 dark:bg-gray-600 dark:border-gray-500 dark:text-gray-300'
                      >
                        <span className='sr-only'>First</span>
                        <FaChevronLeft className='h-4 w-4' />
                      </button>
                      <button
                        onClick={() =>
                          setCurrentPage((p) => Math.max(1, p - 1))
                        }
                        disabled={currentPage === 1}
                        className='relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 dark:bg-gray-600 dark:border-gray-500 dark:text-gray-300'
                      >
                        Previous
                      </button>
                      {Array.from(
                        { length: Math.min(5, totalPages) },
                        (_, i) => {
                          let pageNum
                          if (totalPages <= 5) {
                            pageNum = i + 1
                          } else if (currentPage <= 3) {
                            pageNum = i + 1
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i
                          } else {
                            pageNum = currentPage - 2 + i
                          }
                          return (
                            <button
                              key={pageNum}
                              onClick={() => setCurrentPage(pageNum)}
                              className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                currentPage === pageNum
                                  ? 'z-10 bg-blue-50 border-blue-500 text-blue-600 dark:bg-blue-900/30 dark:border-blue-700 dark:text-blue-400'
                                  : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50 dark:bg-gray-600 dark:border-gray-500 dark:text-gray-300'
                              }`}
                            >
                              {pageNum}
                            </button>
                          )
                        }
                      )}
                      <button
                        onClick={() =>
                          setCurrentPage((p) => Math.min(totalPages, p + 1))
                        }
                        disabled={currentPage === totalPages}
                        className='relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 dark:bg-gray-600 dark:border-gray-500 dark:text-gray-300'
                      >
                        Next
                      </button>
                      <button
                        onClick={() => setCurrentPage(totalPages)}
                        disabled={currentPage === totalPages}
                        className='relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 dark:bg-gray-600 dark:border-gray-500 dark:text-gray-300'
                      >
                        <span className='sr-only'>Last</span>
                        <FaChevronRight className='h-4 w-4' />
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
