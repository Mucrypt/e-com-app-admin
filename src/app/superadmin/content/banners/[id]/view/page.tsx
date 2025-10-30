'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'
import { 
  FaArrowLeft, 
  FaEdit, 
  FaTrash, 
  FaEye, 
  FaEyeSlash,
  FaCopy,
  FaExternalLinkAlt,
  FaChartLine,
  FaCalendarAlt,
  FaTag,
  FaPalette,
  FaImage,
  FaInfoCircle,
  FaSpinner,
  FaCheckCircle,
  FaTimesCircle
} from 'react-icons/fa'
import { Banner } from '@/types/banner.types'

const ViewBannerPage = () => {
  const router = useRouter()
  const params = useParams()
  const bannerId = params.id as string

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [banner, setBanner] = useState<Banner | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [copying, setCopying] = useState(false)

  // Fetch banner data
  useEffect(() => {
    const fetchBanner = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`/api/banners/admin/${bannerId}`)
        
        if (!response.ok) {
          throw new Error(`Failed to fetch banner: ${response.statusText}`)
        }

        const bannerData = await response.json()
        setBanner(bannerData)
      } catch (err) {
        console.error('❌ Error fetching banner:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch banner')
      } finally {
        setLoading(false)
      }
    }

    if (bannerId) {
      fetchBanner()
    }
  }, [bannerId])

  // Delete banner
  const handleDelete = async () => {
    if (!banner || !confirm('Are you sure you want to delete this banner? This action cannot be undone.')) {
      return
    }

    try {
      setDeleting(true)
      setError(null)

      const response = await fetch(`/api/banners/admin/${bannerId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete banner')
      }

      router.push('/superadmin/content/banners')
    } catch (err) {
      console.error('❌ Error deleting banner:', err)
      setError(err instanceof Error ? err.message : 'Failed to delete banner')
    } finally {
      setDeleting(false)
    }
  }

  // Toggle banner status
  const toggleStatus = async () => {
    if (!banner) return

    try {
      const response = await fetch(`/api/banners/admin/${bannerId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          is_active: !banner.is_active,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update banner status')
      }

      setBanner(prev => prev ? { ...prev, is_active: !prev.is_active } : null)
    } catch (err) {
      console.error('❌ Error toggling banner status:', err)
      setError(err instanceof Error ? err.message : 'Failed to update banner status')
    }
  }

  // Copy banner URL
  const copyBannerUrl = async () => {
    if (!banner?.cta_url) return

    try {
      setCopying(true)
      await navigator.clipboard.writeText(banner.cta_url)
      setTimeout(() => setCopying(false), 2000)
    } catch (err) {
      console.error('Failed to copy URL:', err)
      setCopying(false)
    }
  }

  // Get position classes for preview
  const getPositionClasses = () => {
    if (!banner) return 'text-center items-center justify-center'
    
    switch (banner.position) {
      case 'center':
        return 'text-center items-center justify-center'
      case 'right':
        return 'text-right items-end justify-end'
      case 'left':
      default:
        return 'text-left items-start justify-start'
    }
  }

  // Get preview styles
  const getPreviewStyles = () => {
    if (!banner) return {}
    
    const styles: React.CSSProperties = {}

    if (banner.background_color) {
      styles.backgroundColor = banner.background_color
    }

    if (banner.gradient_from && banner.gradient_to) {
      styles.background = `linear-gradient(135deg, ${banner.gradient_from} 0%, ${banner.gradient_to} 100%)`
    }

    if (banner.text_color) {
      styles.color = banner.text_color
    }

    return styles
  }

  // Format date
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'Not set'
    return new Date(dateString).toLocaleString()
  }

  // Get status badge
  const getStatusBadge = () => {
    if (!banner) return null

    const now = new Date()
    const startDate = banner.start_date ? new Date(banner.start_date) : null
    const endDate = banner.end_date ? new Date(banner.end_date) : null

    if (!banner.is_active) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
          <FaTimesCircle className="mr-1" />
          Inactive
        </span>
      )
    }

    if (startDate && now < startDate) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
          <FaCalendarAlt className="mr-1" />
          Scheduled
        </span>
      )
    }

    if (endDate && now > endDate) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
          <FaTimesCircle className="mr-1" />
          Expired
        </span>
      )
    }

    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
        <FaCheckCircle className="mr-1" />
        Active
      </span>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <FaSpinner className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Loading Banner</h3>
          <p className="text-gray-600">Please wait while we fetch the banner details...</p>
        </div>
      </div>
    )
  }

  if (error && !banner) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="text-red-600 mr-3">
                <FaImage className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-red-800">Error Loading Banner</h3>
                <p className="text-red-600">{error}</p>
              </div>
            </div>
            <div className="mt-4 flex space-x-4">
              <button 
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Retry
              </button>
              <Link
                href="/superadmin/content/banners"
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Back to Banners
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!banner) return null

  return (
    <div className="overflow-y-auto max-h-[calc(100vh-200px)] bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link
                href="/superadmin/content/banners"
                className="mr-4 p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg"
              >
                <FaArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <div className="flex items-center space-x-4">
                  <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                    <FaImage className="mr-3 text-blue-600" />
                    {banner.title}
                  </h1>
                  {getStatusBadge()}
                </div>
                <p className="text-gray-600 mt-2">
                  Banner Details and Analytics
                </p>
                <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                  <span>ID: {banner.id}</span>
                  <span>•</span>
                  <span>Created: {formatDate(banner.created_at || '')}</span>
                  <span>•</span>
                  <span>Updated: {formatDate(banner.updated_at || '')}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleStatus}
                className={`inline-flex items-center px-4 py-2 border rounded-lg font-medium transition-colors ${
                  banner.is_active
                    ? 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                    : 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                }`}
              >
                {banner.is_active ? (
                  <>
                    <FaEyeSlash className="mr-2" />
                    Deactivate
                  </>
                ) : (
                  <>
                    <FaEye className="mr-2" />
                    Activate
                  </>
                )}
              </button>
              <Link
                href={`/superadmin/content/banners/${bannerId}/edit`}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white border border-blue-600 rounded-lg hover:bg-blue-700"
              >
                <FaEdit className="mr-2" />
                Edit
              </Link>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="inline-flex items-center px-4 py-2 bg-red-600 text-white border border-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {deleting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <FaTrash className="mr-2" />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="text-red-600 mr-3">
                <FaInfoCircle className="w-5 h-5" />
              </div>
              <div className="text-red-800">{error}</div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Banner Preview */}
          <div className="lg:col-span-2 space-y-6">
            {/* Preview Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <FaEye className="mr-2 text-blue-600" />
                Banner Preview
              </h2>
              
              <div className="space-y-4">
                {/* Desktop Preview */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Desktop View</h3>
                  <div
                    className="relative h-80 rounded-lg overflow-hidden flex"
                    style={getPreviewStyles()}
                  >
                    {/* Background Image */}
                    {banner.image_url && (
                      <div className="absolute inset-0">
                        <img
                          src={banner.image_url}
                          alt={banner.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
                      </div>
                    )}

                    {/* Content */}
                    <div className={`relative z-10 flex flex-col p-8 w-full ${getPositionClasses()}`}>
                      <div className="space-y-4">
                        {/* Badge */}
                        {banner.banner_type && (
                          <span className="inline-block px-3 py-1 bg-red-500 text-white text-sm font-bold rounded-full">
                            {banner.banner_type.replace('_', ' ').toUpperCase()}
                          </span>
                        )}

                        {/* Title */}
                        <h3 className="text-3xl font-bold leading-tight">
                          {banner.title}
                        </h3>

                        {/* Subtitle */}
                        {banner.subtitle && (
                          <h4 className="text-xl font-medium opacity-90">
                            {banner.subtitle}
                          </h4>
                        )}

                        {/* Description */}
                        {banner.description && (
                          <p className="text-base opacity-80 max-w-lg">
                            {banner.description}
                          </p>
                        )}

                        {/* CTA Button */}
                        {banner.cta_text && (
                          <button className="inline-flex items-center px-6 py-3 bg-white text-gray-900 font-semibold rounded-full hover:bg-gray-100 transition-colors">
                            {banner.cta_text}
                            {banner.cta_url && <FaExternalLinkAlt className="ml-2" />}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mobile Preview */}
                {banner.mobile_image_url && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Mobile View</h3>
                    <div className="max-w-sm mx-auto">
                      <div
                        className="relative h-64 rounded-lg overflow-hidden flex"
                        style={getPreviewStyles()}
                      >
                        <div className="absolute inset-0">
                          <img
                            src={banner.mobile_image_url}
                            alt={`${banner.title} - Mobile`}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-30"></div>
                        </div>

                        <div className={`relative z-10 flex flex-col p-4 w-full ${getPositionClasses()}`}>
                          <div className="space-y-2">
                            {banner.banner_type && (
                              <span className="inline-block px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                                {banner.banner_type.replace('_', ' ').toUpperCase()}
                              </span>
                            )}
                            <h3 className="text-lg font-bold leading-tight">
                              {banner.title}
                            </h3>
                            {banner.subtitle && (
                              <h4 className="text-sm font-medium opacity-90">
                                {banner.subtitle}
                              </h4>
                            )}
                            {banner.cta_text && (
                              <button className="inline-flex items-center px-4 py-2 bg-white text-gray-900 text-sm font-semibold rounded-full">
                                {banner.cta_text}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Banner Details */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <FaInfoCircle className="mr-2 text-green-600" />
                Banner Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Title</h3>
                  <p className="text-gray-900">{banner.title}</p>
                </div>

                {banner.subtitle && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Subtitle</h3>
                    <p className="text-gray-900">{banner.subtitle}</p>
                  </div>
                )}

                {banner.description && (
                  <div className="md:col-span-2">
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Description</h3>
                    <p className="text-gray-900">{banner.description}</p>
                  </div>
                )}

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Banner Type</h3>
                  <p className="text-gray-900 capitalize">
                    {banner.banner_type ? banner.banner_type.replace('_', ' ') : 'None'}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Content Position</h3>
                  <p className="text-gray-900 capitalize">{banner.position}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Priority</h3>
                  <p className="text-gray-900">{banner.priority}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Sort Order</h3>
                  <p className="text-gray-900">{banner.sort_order}</p>
                </div>

                {banner.cta_text && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Call to Action</h3>
                    <p className="text-gray-900">{banner.cta_text}</p>
                  </div>
                )}

                {banner.cta_url && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">CTA URL</h3>
                    <div className="flex items-center space-x-2">
                      <p className="text-gray-900 truncate flex-1">{banner.cta_url}</p>
                      <button
                        onClick={copyBannerUrl}
                        className="text-blue-600 hover:text-blue-800"
                        title="Copy URL"
                      >
                        {copying ? <FaCheckCircle /> : <FaCopy />}
                      </button>
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Target Audience</h3>
                  <p className="text-gray-900 capitalize">
                    {banner.target_audience?.replace('_', ' ') || 'All Users'}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Status</h3>
                  <p className="text-gray-900">{banner.is_active ? 'Active' : 'Inactive'}</p>
                </div>

                {banner.tags && banner.tags.length > 0 && (
                  <div className="md:col-span-2">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {banner.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                        >
                          <FaTag className="mr-1" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Design & Scheduling */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Design */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <FaPalette className="mr-2 text-pink-600" />
                  Design Settings
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Background Color</h3>
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-8 h-8 rounded border border-gray-300"
                        style={{ backgroundColor: banner.background_color || undefined }}
                      ></div>
                      <span className="text-gray-900">{banner.background_color}</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Text Color</h3>
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-8 h-8 rounded border border-gray-300"
                        style={{ backgroundColor: banner.text_color || undefined }}
                      ></div>
                      <span className="text-gray-900">{banner.text_color}</span>
                    </div>
                  </div>

                  {banner.gradient_from && banner.gradient_to && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Gradient</h3>
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-16 h-8 rounded border border-gray-300"
                          style={{
                            background: `linear-gradient(135deg, ${banner.gradient_from} 0%, ${banner.gradient_to} 100%)`
                          }}
                        ></div>
                        <span className="text-gray-900 text-sm">
                          {banner.gradient_from} → {banner.gradient_to}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Scheduling */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <FaCalendarAlt className="mr-2 text-orange-600" />
                  Scheduling
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Start Date</h3>
                    <p className="text-gray-900">{formatDate(banner.start_date)}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">End Date</h3>
                    <p className="text-gray-900">{formatDate(banner.end_date)}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Created</h3>
                    <p className="text-gray-900">{formatDate(banner.created_at || '')}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Last Updated</h3>
                    <p className="text-gray-900">{formatDate(banner.updated_at || '')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Analytics Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-6">
              {/* Performance Stats */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <FaChartLine className="mr-2 text-blue-600" />
                  Performance
                </h2>
                
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">
                      {(banner.impression_count || 0).toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">Total Impressions</div>
                  </div>

                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">
                      {(banner.click_count || 0).toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">Total Clicks</div>
                  </div>

                  {banner.impression_count && banner.impression_count > 0 && (
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600">
                        {(((banner.click_count || 0) / banner.impression_count) * 100).toFixed(2)}%
                      </div>
                      <div className="text-sm text-gray-500">Click-Through Rate</div>
                    </div>
                  )}

                  <div className="border-t pt-4">
                    <div className="text-center">
                      <div className="text-lg font-semibold text-gray-900">
                        Priority: {banner.priority}/10
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${((banner.priority || 0) / 10) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                
                <div className="space-y-3">
                  <Link
                    href={`/superadmin/content/banners/${bannerId}/edit`}
                    className="w-full inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <FaEdit className="mr-2" />
                    Edit Banner
                  </Link>

                  <button
                    onClick={toggleStatus}
                    className={`w-full inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium ${
                      banner.is_active
                        ? 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'
                        : 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100'
                    }`}
                  >
                    {banner.is_active ? (
                      <>
                        <FaEyeSlash className="mr-2" />
                        Deactivate
                      </>
                    ) : (
                      <>
                        <FaEye className="mr-2" />
                        Activate
                      </>
                    )}
                  </button>

                  {banner.cta_url && (
                    <a
                      href={banner.cta_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                    >
                      <FaExternalLinkAlt className="mr-2" />
                      Visit URL
                    </a>
                  )}

                  <Link
                    href="/superadmin/content/banners"
                    className="w-full inline-flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                  >
                    <FaArrowLeft className="mr-2" />
                    Back to Banners
                  </Link>
                </div>
              </div>

              {/* Meta Information */}
              {banner.meta_data && Object.keys(banner.meta_data).length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Meta Data</h2>
                  
                  <div className="space-y-3 text-sm">
                    {banner.meta_data.badge && (
                      <div>
                        <span className="font-medium text-gray-500">Badge:</span>
                        <span className="ml-2 text-gray-900">{banner.meta_data.badge}</span>
                      </div>
                    )}
                    {banner.meta_data.animation && (
                      <div>
                        <span className="font-medium text-gray-500">Animation:</span>
                        <span className="ml-2 text-gray-900 capitalize">{banner.meta_data.animation}</span>
                      </div>
                    )}
                    {banner.meta_data.theme && (
                      <div>
                        <span className="font-medium text-gray-500">Theme:</span>
                        <span className="ml-2 text-gray-900 capitalize">{banner.meta_data.theme}</span>
                      </div>
                    )}
                    {banner.meta_data.urgency && (
                      <div>
                        <span className="font-medium text-gray-500">Urgency:</span>
                        <span className="ml-2 text-gray-900 capitalize">{banner.meta_data.urgency}</span>
                      </div>
                    )}
                    {banner.meta_data.duration && (
                      <div>
                        <span className="font-medium text-gray-500">Duration:</span>
                        <span className="ml-2 text-gray-900">{banner.meta_data.duration}ms</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ViewBannerPage