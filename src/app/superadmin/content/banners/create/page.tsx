'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  FaArrowLeft, 
  FaSave, 
  FaImage, 
  FaEye, 
  FaPalette,
  FaCalendarAlt,
  FaTag,
  FaBullhorn,
  FaInfoCircle
} from 'react-icons/fa'
import { Banner } from '@/types/banner.types'

const CreateBannerPage = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [previewMode, setPreviewMode] = useState(false)

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    image_url: '',
    mobile_image_url: '',
    cta_text: '',
    cta_url: '',
    background_color: '#1e40af',
    text_color: '#ffffff',
    gradient_from: '',
    gradient_to: '',
    position: 'center' as 'left' | 'center' | 'right',
    banner_type: '' as '' | 'flash_sale' | 'new_arrival' | 'seasonal' | 'promotion' | 'featured' | 'limited',
    start_date: '',
    end_date: '',
    priority: 5,
    sort_order: 0,
    is_active: true,
    target_audience: 'all',
    tags: [] as string[],
    meta_data: {
      badge: '',
      animation: 'fadeIn',
      highlight: '',
      urgency: 'medium',
      countdown: false,
      theme: 'modern',
      duration: 6000,
    }
  })

  const [tagInput, setTagInput] = useState('')

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({ ...prev, [name]: checked }))
    } else if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: parseInt(value) || 0 }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  // Handle meta data changes
  const handleMetaDataChange = (key: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      meta_data: { ...prev.meta_data, [key]: value }
    }))
  }

  // Add tag
  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }))
      setTagInput('')
    }
  }

  // Remove tag
  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  // Handle tag input key press
  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag()
    }
  }

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title.trim()) {
      setError('Title is required')
      return
    }

    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/banners', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags.length > 0 ? formData.tags : null,
          gradient_from: formData.gradient_from || null,
          gradient_to: formData.gradient_to || null,
          start_date: formData.start_date || null,
          end_date: formData.end_date || null,
          banner_type: formData.banner_type || null,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create banner')
      }

      router.push('/superadmin/content/banners')
    } catch (err) {
      console.error('❌ Error creating banner:', err)
      setError(err instanceof Error ? err.message : 'Failed to create banner')
    } finally {
      setLoading(false)
    }
  }

  // Get preview styles
  const getPreviewStyles = () => {
    const styles: React.CSSProperties = {}

    if (formData.background_color) {
      styles.backgroundColor = formData.background_color
    }

    if (formData.gradient_from && formData.gradient_to) {
      styles.background = `linear-gradient(135deg, ${formData.gradient_from} 0%, ${formData.gradient_to} 100%)`
    }

    if (formData.text_color) {
      styles.color = formData.text_color
    }

    return styles
  }

  // Get position classes
  const getPositionClasses = () => {
    switch (formData.position) {
      case 'center':
        return 'text-center items-center justify-center'
      case 'right':
        return 'text-right items-end justify-end'
      case 'left':
      default:
        return 'text-left items-start justify-start'
    }
  }

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
                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                  <FaImage className="mr-3 text-blue-600" />
                  Create New Banner
                </h1>
                <p className="text-gray-600 mt-2">
                  Design and configure a new promotional banner
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                type="button"
                onClick={() => setPreviewMode(!previewMode)}
                className={`inline-flex items-center px-4 py-2 border rounded-lg font-medium transition-colors ${
                  previewMode
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                <FaEye className="mr-2" />
                {previewMode ? 'Edit Mode' : 'Preview'}
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form */}
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <FaInfoCircle className="mr-2 text-blue-600" />
                  Basic Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter banner title"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subtitle
                    </label>
                    <input
                      type="text"
                      name="subtitle"
                      value={formData.subtitle}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter banner subtitle"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter banner description"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Banner Type
                    </label>
                    <select
                      name="banner_type"
                      value={formData.banner_type}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select type</option>
                      <option value="flash_sale">Flash Sale</option>
                      <option value="new_arrival">New Arrival</option>
                      <option value="seasonal">Seasonal</option>
                      <option value="promotion">Promotion</option>
                      <option value="featured">Featured</option>
                      <option value="limited">Limited Time</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Content Position
                    </label>
                    <select
                      name="position"
                      value={formData.position}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="left">Left</option>
                      <option value="center">Center</option>
                      <option value="right">Right</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priority (1-10)
                    </label>
                    <input
                      type="number"
                      name="priority"
                      value={formData.priority}
                      onChange={handleInputChange}
                      min="1"
                      max="10"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sort Order
                    </label>
                    <input
                      type="number"
                      name="sort_order"
                      value={formData.sort_order}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="is_active"
                        checked={formData.is_active}
                        onChange={handleInputChange}
                        className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        Active (banner will be visible on the website)
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Images */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <FaImage className="mr-2 text-green-600" />
                  Images
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Desktop Image URL
                    </label>
                    <input
                      type="url"
                      name="image_url"
                      value={formData.image_url}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://example.com/image.jpg"
                    />
                    {formData.image_url && (
                      <div className="mt-2">
                        <img
                          src={formData.image_url}
                          alt="Preview"
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mobile Image URL (optional)
                    </label>
                    <input
                      type="url"
                      name="mobile_image_url"
                      value={formData.mobile_image_url}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://example.com/mobile-image.jpg"
                    />
                    {formData.mobile_image_url && (
                      <div className="mt-2">
                        <img
                          src={formData.mobile_image_url}
                          alt="Mobile Preview"
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Call to Action */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <FaBullhorn className="mr-2 text-purple-600" />
                  Call to Action
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Button Text
                    </label>
                    <input
                      type="text"
                      name="cta_text"
                      value={formData.cta_text}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Shop Now"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Button URL
                    </label>
                    <input
                      type="url"
                      name="cta_url"
                      value={formData.cta_url}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="/products"
                    />
                  </div>
                </div>
              </div>

              {/* Design & Colors */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <FaPalette className="mr-2 text-pink-600" />
                  Design & Colors
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Background Color
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        name="background_color"
                        value={formData.background_color}
                        onChange={handleInputChange}
                        className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={formData.background_color}
                        onChange={(e) => setFormData(prev => ({ ...prev, background_color: e.target.value }))}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Text Color
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        name="text_color"
                        value={formData.text_color}
                        onChange={handleInputChange}
                        className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={formData.text_color}
                        onChange={(e) => setFormData(prev => ({ ...prev, text_color: e.target.value }))}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gradient From (optional)
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        name="gradient_from"
                        value={formData.gradient_from}
                        onChange={handleInputChange}
                        className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={formData.gradient_from}
                        onChange={(e) => setFormData(prev => ({ ...prev, gradient_from: e.target.value }))}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        placeholder="#ff0000"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gradient To (optional)
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        name="gradient_to"
                        value={formData.gradient_to}
                        onChange={handleInputChange}
                        className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={formData.gradient_to}
                        onChange={(e) => setFormData(prev => ({ ...prev, gradient_to: e.target.value }))}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        placeholder="#0000ff"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Scheduling */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <FaCalendarAlt className="mr-2 text-orange-600" />
                  Scheduling
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date (optional)
                    </label>
                    <input
                      type="datetime-local"
                      name="start_date"
                      value={formData.start_date}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date (optional)
                    </label>
                    <input
                      type="datetime-local"
                      name="end_date"
                      value={formData.end_date}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <FaTag className="mr-2 text-yellow-600" />
                  Tags & Targeting
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Target Audience
                    </label>
                    <select
                      name="target_audience"
                      value={formData.target_audience}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="all">All Users</option>
                      <option value="new_customers">New Customers</option>
                      <option value="returning_customers">Returning Customers</option>
                      <option value="vip_customers">VIP Customers</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Add Tags
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyPress={handleTagKeyPress}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter tag and press Enter"
                      />
                      <button
                        type="button"
                        onClick={addTag}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        Add
                      </button>
                    </div>
                    
                    {formData.tags.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {formData.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                          >
                            {tag}
                            <button
                              type="button"
                              onClick={() => removeTag(tag)}
                              className="ml-2 text-blue-600 hover:text-blue-800"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
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

              {/* Submit Button */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <Link
                    href="/superadmin/content/banners"
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Creating...
                      </>
                    ) : (
                      <>
                        <FaSave className="mr-2" />
                        Create Banner
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Preview */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <FaEye className="mr-2 text-blue-600" />
                  Live Preview
                </h2>
                
                <div className="relative">
                  <div
                    className="relative h-64 rounded-lg overflow-hidden flex"
                    style={getPreviewStyles()}
                  >
                    {/* Background Image */}
                    {formData.image_url && (
                      <div className="absolute inset-0">
                        <img
                          src={formData.image_url}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
                      </div>
                    )}

                    {/* Content */}
                    <div className={`relative z-10 flex flex-col p-4 w-full ${getPositionClasses()}`}>
                      <div className="space-y-2">
                        {/* Badge */}
                        {formData.banner_type && (
                          <span className="inline-block px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                            {formData.banner_type.replace('_', ' ').toUpperCase()}
                          </span>
                        )}

                        {/* Title */}
                        {formData.title && (
                          <h3 className="text-lg font-bold leading-tight">
                            {formData.title}
                          </h3>
                        )}

                        {/* Subtitle */}
                        {formData.subtitle && (
                          <h4 className="text-sm font-medium opacity-90">
                            {formData.subtitle}
                          </h4>
                        )}

                        {/* Description */}
                        {formData.description && (
                          <p className="text-xs opacity-80 line-clamp-2">
                            {formData.description}
                          </p>
                        )}

                        {/* CTA Button */}
                        {formData.cta_text && (
                          <button className="inline-flex items-center px-3 py-1 bg-white text-gray-900 text-xs font-semibold rounded-full">
                            {formData.cta_text}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 text-sm text-gray-600 space-y-2">
                  <div><strong>Type:</strong> {formData.banner_type || 'None'}</div>
                  <div><strong>Position:</strong> {formData.position}</div>
                  <div><strong>Priority:</strong> {formData.priority}</div>
                  <div><strong>Status:</strong> {formData.is_active ? 'Active' : 'Inactive'}</div>
                  {formData.tags.length > 0 && (
                    <div><strong>Tags:</strong> {formData.tags.join(', ')}</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateBannerPage