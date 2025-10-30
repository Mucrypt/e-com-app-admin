'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  FaPlus, 
  FaEdit, 
  FaEye, 
  FaTrash, 
  FaSearch, 
  FaFilter,
  FaSortAmountDown,
  FaImage,
  FaToggleOn,
  FaToggleOff,
  FaCalendarAlt,
  FaEyeSlash,
  FaMousePointer,
  FaBullhorn
} from 'react-icons/fa'
import { Banner } from '@/types/banner.types'

const BannersPage = () => {
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [sortBy, setSortBy] = useState('priority')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [currentPage, setCurrentPage] = useState(1)
  const [apiTotalPages, setApiTotalPages] = useState(1)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const bannersPerPage = 10

  // Fetch banners
  useEffect(() => {
    fetchBanners()
  }, [currentPage, searchTerm, filterStatus, filterType, sortBy, sortOrder])

  const fetchBanners = async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: bannersPerPage.toString(),
        search: searchTerm,
        status: filterStatus,
        type: filterType,
        sortBy: sortBy,
        sortOrder: sortOrder,
      })

      const response = await fetch(`/api/banners/admin?${params}`)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch banners: ${response.statusText}`)
      }

      const data = await response.json()
      setBanners(data.banners || [])
      setApiTotalPages(data.pagination?.totalPages || 1)
      console.log('✅ Banners fetched successfully:', data.banners?.length || 0)
    } catch (err) {
      console.error('❌ Error fetching banners:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch banners')
    } finally {
      setLoading(false)
    }
  }

  // Delete banner
  const deleteBanner = async (id: string) => {
    try {
      const response = await fetch(`/api/banners/admin/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete banner')
      }

      setBanners(prev => prev.filter(banner => banner.id !== id))
      setDeleteConfirm(null)
    } catch (err) {
      console.error('❌ Error deleting banner:', err)
      alert('Failed to delete banner')
    }
  }

  // Toggle banner status
  const toggleBannerStatus = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/banners/admin/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          is_active: !currentStatus,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update banner status')
      }

      setBanners(prev => 
        prev.map(banner => 
          banner.id === id 
            ? { ...banner, is_active: !currentStatus }
            : banner
        )
      )
    } catch (err) {
      console.error('❌ Error updating banner status:', err)
      alert('Failed to update banner status')
    }
  }

  // Filter and sort banners
  const filteredBanners = banners
    .filter(banner => {
      const matchesSearch = banner.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (banner.subtitle && banner.subtitle.toLowerCase().includes(searchTerm.toLowerCase()))
      
      const matchesType = filterType === 'all' || banner.banner_type === filterType
      
      const matchesStatus = filterStatus === 'all' || 
                           (filterStatus === 'active' && banner.is_active) ||
                           (filterStatus === 'inactive' && !banner.is_active)
      
      return matchesSearch && matchesType && matchesStatus
    })
    .sort((a, b) => {
      let aValue: any = a[sortBy as keyof Banner]
      let bValue: any = b[sortBy as keyof Banner]
      
      if (sortBy === 'priority') {
        aValue = a.priority || 0
        bValue = b.priority || 0
      }
      
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase()
        bValue = bValue.toLowerCase()
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

  // Pagination
  const totalPages = Math.ceil(filteredBanners.length / bannersPerPage)
  const startIndex = (currentPage - 1) * bannersPerPage
  const paginatedBanners = filteredBanners.slice(startIndex, startIndex + bannersPerPage)

  // Get banner type badge color
  const getBannerTypeColor = (type: string | null) => {
    const colors = {
      flash_sale: 'bg-red-100 text-red-800',
      new_arrival: 'bg-green-100 text-green-800',
      seasonal: 'bg-blue-100 text-blue-800',
      promotion: 'bg-purple-100 text-purple-800',
      featured: 'bg-yellow-100 text-yellow-800',
      limited: 'bg-orange-100 text-orange-800',
    }
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-300 rounded w-1/4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-16 bg-gray-300 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="text-red-600 mr-3">
                <FaImage className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-red-800">Error Loading Banners</h3>
                <p className="text-red-600">{error}</p>
              </div>
            </div>
            <button 
              onClick={fetchBanners}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="overflow-y-auto max-h-[calc(100vh-200px)] bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-4 lg:mb-0">
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <FaImage className="mr-3 text-blue-600" />
                Promotional Banners
              </h1>
              <p className="text-gray-600 mt-2">
                Manage promotional banners, sales campaigns, and featured content
              </p>
            </div>
            <Link
              href="/superadmin/content/banners/create"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm"
            >
              <FaPlus className="mr-2" />
              Create New Banner
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FaImage className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Banners</p>
                <p className="text-2xl font-bold text-gray-900">{banners.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <FaToggleOn className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Banners</p>
                <p className="text-2xl font-bold text-gray-900">
                  {banners.filter(b => b.is_active).length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <FaEyeSlash className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Impressions</p>
                <p className="text-2xl font-bold text-gray-900">
                  {banners.reduce((sum, b) => sum + (b.impression_count || 0), 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-lg">
                <FaMousePointer className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Clicks</p>
                <p className="text-2xl font-bold text-gray-900">
                  {banners.reduce((sum, b) => sum + (b.click_count || 0), 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search banners..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Type Filter */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="flash_sale">Flash Sale</option>
              <option value="new_arrival">New Arrival</option>
              <option value="seasonal">Seasonal</option>
              <option value="promotion">Promotion</option>
              <option value="featured">Featured</option>
              <option value="limited">Limited</option>
            </select>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            {/* Sort */}
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-')
                setSortBy(field)
                setSortOrder(order as 'asc' | 'desc')
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="priority-desc">Priority (High to Low)</option>
              <option value="priority-asc">Priority (Low to High)</option>
              <option value="title-asc">Title (A to Z)</option>
              <option value="title-desc">Title (Z to A)</option>
              <option value="created_at-desc">Newest First</option>
              <option value="created_at-asc">Oldest First</option>
            </select>
          </div>
        </div>

        {/* Banners Grid */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {banners.length === 0 ? (
            <div className="text-center py-12">
              <FaImage className="mx-auto w-12 h-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No banners found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || filterType !== 'all' || filterStatus !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Get started by creating your first promotional banner'}
              </p>
              <Link
                href="/superadmin/content/banners/create"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <FaPlus className="mr-2" />
                Create Banner
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {banners.map((banner) => (
                <div key={banner.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200">
                  {/* Banner Image */}
                  <div className="relative h-48 bg-gray-100">
                    {banner.image_url ? (
                      <img
                        src={banner.image_url}
                        alt={banner.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FaImage className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                    
                    {/* Status Badge */}
                    <div className="absolute top-2 left-2">
                      <button
                        onClick={() => toggleBannerStatus(banner.id, banner.is_active || false)}
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          banner.is_active
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                      >
                        {banner.is_active ? (
                          <>
                            <FaToggleOn className="mr-1" />
                            Active
                          </>
                        ) : (
                          <>
                            <FaToggleOff className="mr-1" />
                            Inactive
                          </>
                        )}
                      </button>
                    </div>

                    {/* Priority Badge */}
                    <div className="absolute top-2 right-2">
                      <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                        Priority: {banner.priority || 0}
                      </span>
                    </div>

                    {/* Banner Type Badge */}
                    {banner.banner_type && (
                      <div className="absolute bottom-2 left-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getBannerTypeColor(banner.banner_type)}`}>
                          {banner.banner_type.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Banner Content */}
                  <div className="p-4">
                    <div className="mb-3">
                      <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-1">
                        {banner.title}
                      </h3>
                      {banner.subtitle && (
                        <p className="text-xs text-gray-600 line-clamp-1">{banner.subtitle}</p>
                      )}
                    </div>

                    {/* Performance Stats */}
                    <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
                      <div className="text-center p-2 bg-gray-50 rounded">
                        <div className="flex items-center justify-center mb-1">
                          <FaEyeSlash className="mr-1 text-gray-500" />
                        </div>
                        <div className="font-semibold text-gray-900">
                          {(banner.impression_count || 0).toLocaleString()}
                        </div>
                        <div className="text-gray-500">Views</div>
                      </div>
                      <div className="text-center p-2 bg-gray-50 rounded">
                        <div className="flex items-center justify-center mb-1">
                          <FaMousePointer className="mr-1 text-gray-500" />
                        </div>
                        <div className="font-semibold text-gray-900">
                          {(banner.click_count || 0).toLocaleString()}
                        </div>
                        <div className="text-gray-500">Clicks</div>
                      </div>
                    </div>

                    {/* Meta Information */}
                    <div className="text-xs text-gray-500 mb-4">
                      <div>Created: {formatDate(banner.created_at || null)}</div>
                      {banner.start_date && (
                        <div>Starts: {formatDate(banner.start_date)}</div>
                      )}
                      {banner.end_date && (
                        <div>Ends: {formatDate(banner.end_date)}</div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Link
                          href={`/superadmin/content/banners/${banner.id}/view`}
                          className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                          title="View Banner"
                        >
                          <FaEye className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/superadmin/content/banners/${banner.id}/edit`}
                          className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded"
                          title="Edit Banner"
                        >
                          <FaEdit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => setDeleteConfirm(banner.id)}
                          className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                          title="Delete Banner"
                        >
                          <FaTrash className="w-4 h-4" />
                        </button>
                      </div>
                      
                      {/* CTA Button */}
                      {banner.cta_text && banner.cta_url && (
                        <a
                          href={banner.cta_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 truncate"
                          title={banner.cta_text}
                        >
                          {banner.cta_text}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white px-6 py-3 border-t border-gray-200 rounded-lg shadow-sm border border-gray-200 mt-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {((currentPage - 1) * bannersPerPage) + 1} to {Math.min(currentPage * bannersPerPage, (totalPages * bannersPerPage))} of {totalPages * bannersPerPage} results
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50"
                >
                  Previous
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-3 py-1 border rounded text-sm ${
                      currentPage === i + 1
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Delete Banner</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this banner? This action cannot be undone.
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={() => deleteBanner(deleteConfirm)}
                  className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default BannersPage