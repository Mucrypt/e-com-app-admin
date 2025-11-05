'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { 
  FaDownload, 
  FaPlus, 
  FaSearch, 
  FaFilter,
  FaSortAmountDown,
  FaUpload,
  FaEye,
  FaTrash,
  FaSync,
  FaCheck,
  FaTimes,
  FaExclamationTriangle,
  FaSpinner,
  FaGlobe,
  FaShoppingCart,
  FaClipboardList,
  FaLayerGroup,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaExternalLinkAlt,
  FaStar
} from 'react-icons/fa'
import { 
  ScrapingJob, 
  ScrapedProduct,
  SupportedPlatform,
  ScrapingSettings,
  UrlValidationResult,
  ScrapingApiResponse 
} from '@/types/scraper.types'
import { ScrapedProductsGrid } from '@/components/superAdmin/ScrapedProductsGrid'

// Toast notification component
const Toast = ({ message, type, onClose }: { message: string, type: 'success' | 'error' | 'info', onClose: () => void }) => (
  <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
    type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500'
  } text-white max-w-sm`}>
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        {type === 'success' && <FaCheck className="mr-2" />}
        {type === 'error' && <FaTimes className="mr-2" />}
        {type === 'info' && <FaExclamationTriangle className="mr-2" />}
        <span>{message}</span>
      </div>
      <button onClick={onClose} className="ml-4 hover:opacity-75">
        <FaTimes />
      </button>
    </div>
  </div>
)

const ProductScraperPage = () => {
  // State management
  const [activeTab, setActiveTab] = useState<'scrape' | 'jobs' | 'products'>('scrape')
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' | 'info' } | null>(null)
  
  // Scraping form state
  const [urls, setUrls] = useState<string[]>([''])
  const [scrapingSettings, setScrapingSettings] = useState<ScrapingSettings>({
    auto_import: false,
    default_status: 'draft',
    validate_images: true,
    download_images: false,
    max_images: 5,
    exclude_out_of_stock: true,
    override_existing: false
  })
  
  // Jobs state
  const [jobs, setJobs] = useState<ScrapingJob[]>([])
  const [jobsLoading, setJobsLoading] = useState(false)
  const [jobsFilter, setJobsFilter] = useState({
    status: 'all',
    platform: 'all'
  })
  
  // Products state
  const [scrapedProducts, setScrapedProducts] = useState<ScrapedProduct[]>([])
  const [productsLoading, setProductsLoading] = useState(false)
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set())
  const [selectedProductForView, setSelectedProductForView] = useState<ScrapedProduct | null>(null)
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('')
  const [filterPlatform, setFilterPlatform] = useState<SupportedPlatform | 'all'>('all')
  const [sortBy, setSortBy] = useState<'created_at' | 'title' | 'price'>('created_at')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  // Toast helper
  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 5000)
  }, [])

  // Fetch jobs
  const fetchJobs = useCallback(async () => {
    setJobsLoading(true)
    try {
      const response = await fetch('/api/scraper/jobs')
      const data: ScrapingApiResponse<{ jobs: ScrapingJob[] }> = await response.json()
      
      if (data.success && data.data) {
        setJobs(data.data.jobs)
      } else {
        showToast('Failed to fetch scraping jobs', 'error')
      }
    } catch (error) {
      console.error('❌ Error fetching jobs:', error)
      showToast('Error loading jobs', 'error')
    } finally {
      setJobsLoading(false)
    }
  }, [showToast])

  // Validate URL
  const validateUrl = async (url: string): Promise<UrlValidationResult> => {
    try {
      const response = await fetch('/api/scraper/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      })
      
      const data: ScrapingApiResponse<UrlValidationResult> = await response.json()
      return data.data || { valid: false, platform: null, error: 'Unknown error' }
    } catch (error) {
      return { valid: false, platform: null, error: 'Network error' }
    }
  }

  // Add new URL input
  const addUrlInput = () => {
    setUrls([...urls, ''])
  }

  // Remove URL input
  const removeUrlInput = (index: number) => {
    if (urls.length > 1) {
      setUrls(urls.filter((_, i) => i !== index))
    }
  }

  // Update URL value
  const updateUrl = (index: number, value: string) => {
    const newUrls = [...urls]
    newUrls[index] = value
    setUrls(newUrls)
  }

  // Start scraping job
  const startScraping = async () => {
    const validUrls = urls.filter(url => url.trim() !== '')
    
    if (validUrls.length === 0) {
      showToast('Please enter at least one URL', 'error')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/scraper/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          urls: validUrls,
          settings: scrapingSettings
        })
      })

      const data: ScrapingApiResponse<{ job_id: string }> = await response.json()
      
      if (data.success) {
        showToast(`Scraping job started successfully! Job ID: ${data.data?.job_id}`, 'success')
        setUrls(['']) // Reset form
        setActiveTab('jobs') // Switch to jobs tab
        await fetchJobs() // Refresh jobs
      } else {
        showToast(data.error || 'Failed to start scraping job', 'error')
      }
    } catch (error) {
      console.error('❌ Error starting scraping:', error)
      showToast('Error starting scraping job', 'error')
    } finally {
      setLoading(false)
    }
  }

  // Delete job
  const deleteJob = async (jobId: string) => {
    if (!confirm('Are you sure you want to delete this job? This action cannot be undone.')) {
      return
    }

    try {
      showToast('Deleting job...', 'info')
      
      const response = await fetch(`/api/scraper/jobs?job_id=${jobId}`, {
        method: 'DELETE'
      })
      
      const data: ScrapingApiResponse = await response.json()
      
      if (data.success) {
        showToast('Job deleted successfully', 'success')
        await fetchJobs() // Force refresh
      } else {
        showToast(`Failed to delete job: ${data.error}`, 'error')
      }
    } catch (error) {
      console.error('❌ Error deleting job:', error)
      showToast('Error deleting job', 'error')
    }
  }

  // Force fix ALL stuck jobs (more aggressive)
  const forceFixAllStuckJobs = async () => {
    if (!confirm('This will force-fix ALL stuck jobs. Continue?')) {
      return
    }

    try {
      showToast('Force-fixing all stuck jobs...', 'info')
      
      const response = await fetch('/api/scraper/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'force_fix_all_stuck_jobs' })
      })
      
      const data: ScrapingApiResponse = await response.json()
      
      if (data.success) {
        showToast('All stuck jobs have been fixed', 'success')
        await fetchJobs()
      } else {
        showToast('Failed to fix stuck jobs', 'error')
      }
    } catch (error) {
      console.error('❌ Error force-fixing stuck jobs:', error)
      showToast('Error fixing stuck jobs', 'error')
    }
  }

  // Fix stuck jobs
  const fixStuckJobs = async () => {
    try {
      const response = await fetch('/api/scraper/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'fix_stuck_jobs' })
      })
      
      const data: ScrapingApiResponse = await response.json()
      
      if (data.success) {
        showToast('Stuck jobs have been fixed', 'success')
        await fetchJobs()
      } else {
        showToast('Failed to fix stuck jobs', 'error')
      }
    } catch (error) {
      console.error('❌ Error fixing stuck jobs:', error)
      showToast('Error fixing stuck jobs', 'error')
    }
  }

  // Get platform badge color
  const getPlatformBadgeColor = (platform: SupportedPlatform) => {
    const colors = {
      amazon: 'bg-orange-100 text-orange-800',
      alibaba: 'bg-red-100 text-red-800',
      aliexpress: 'bg-yellow-100 text-yellow-800',
      ebay: 'bg-blue-100 text-blue-800',
      walmart: 'bg-indigo-100 text-indigo-800',
      shopify: 'bg-green-100 text-green-800',
      generic: 'bg-gray-100 text-gray-800'
    }
    return colors[platform] || colors.generic
  }

  // Get status badge color
  const getStatusBadgeColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      cancelled: 'bg-gray-100 text-gray-800'
    }
    return colors[status as keyof typeof colors] || colors.pending
  }

  // Load jobs on mount
  useEffect(() => {
    if (activeTab === 'jobs') {
      fetchJobs()
    }
  }, [activeTab, fetchJobs])

  return (
    <div className="overflow-y-auto max-h-[calc(100vh-200px)] bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Toast Notification */}
        {toast && (
          <Toast 
            message={toast.message} 
            type={toast.type} 
            onClose={() => setToast(null)} 
          />
        )}

        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-4 lg:mb-0">
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <FaDownload className="mr-3 text-blue-600" />
                Product Scraper
              </h1>
              <p className="text-gray-600 mt-2">
                Import products from e-commerce platforms like Amazon, Alibaba, AliExpress, and more
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => fetchJobs()}
                disabled={jobsLoading}
                className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 disabled:opacity-50"
              >
                <FaSync className={`mr-2 ${jobsLoading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <button
                onClick={fixStuckJobs}
                className="inline-flex items-center px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors duration-200"
              >
                <FaExclamationTriangle className="mr-2" />
                Fix Stuck Jobs
              </button>
              <button
                onClick={forceFixAllStuckJobs}
                className="inline-flex items-center px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-200"
              >
                <FaTimes className="mr-2" />
                Force Fix ALL
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FaClipboardList className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Jobs</p>
                <p className="text-2xl font-bold text-gray-900">{jobs.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <FaCheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed Jobs</p>
                <p className="text-2xl font-bold text-gray-900">
                  {jobs.filter(j => j.status === 'completed').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-lg">
                <FaShoppingCart className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Products Scraped</p>
                <p className="text-2xl font-bold text-gray-900">
                  {jobs.reduce((sum, job) => sum + job.successful_scrapes, 0)}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <FaUpload className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Products Imported</p>
                <p className="text-2xl font-bold text-gray-900">
                  {jobs.reduce((sum, job) => sum + job.imported_products, 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'scrape', label: 'New Scraping Job', icon: FaDownload },
                { id: 'jobs', label: 'Scraping Jobs', icon: FaClipboardList },
                { id: 'products', label: 'Scraped Products', icon: FaShoppingCart }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'scrape' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* URL Input Section */}
                  <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-900">Product URLs</h3>
                      <button
                        onClick={addUrlInput}
                        className="inline-flex items-center px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                      >
                        <FaPlus className="mr-1" />
                        Add URL
                      </button>
                    </div>
                    
                    {urls.map((url, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="flex-1">
                          <input
                            type="url"
                            value={url}
                            onChange={(e) => updateUrl(index, e.target.value)}
                            placeholder="https://amazon.com/product-url or https://alibaba.com/product-url"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        {urls.length > 1 && (
                          <button
                            onClick={() => removeUrlInput(index)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            <FaTrash />
                          </button>
                        )}
                      </div>
                    ))}
                    
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h4 className="font-medium text-blue-900 mb-2">Supported Platforms:</h4>
                      <div className="grid grid-cols-3 gap-2 text-sm text-blue-800">
                        <div>• Amazon</div>
                        <div>• Alibaba</div>
                        <div>• AliExpress</div>
                        <div>• eBay</div>
                        <div>• Walmart</div>
                        <div>• Shopify stores</div>
                      </div>
                    </div>
                  </div>

                  {/* Settings Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">Scraping Settings</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-700">Auto Import Products</label>
                        <input
                          type="checkbox"
                          checked={scrapingSettings.auto_import}
                          onChange={(e) => setScrapingSettings(prev => ({
                            ...prev,
                            auto_import: e.target.checked
                          }))}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Default Product Status
                        </label>
                        <select
                          value={scrapingSettings.default_status}
                          onChange={(e) => setScrapingSettings(prev => ({
                            ...prev,
                            default_status: e.target.value as 'draft' | 'active'
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="draft">Draft</option>
                          <option value="active">Active</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Max Images per Product
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="20"
                          value={scrapingSettings.max_images}
                          onChange={(e) => setScrapingSettings(prev => ({
                            ...prev,
                            max_images: parseInt(e.target.value)
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-700">Validate Images</label>
                        <input
                          type="checkbox"
                          checked={scrapingSettings.validate_images}
                          onChange={(e) => setScrapingSettings(prev => ({
                            ...prev,
                            validate_images: e.target.checked
                          }))}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-700">Exclude Out of Stock</label>
                        <input
                          type="checkbox"
                          checked={scrapingSettings.exclude_out_of_stock}
                          onChange={(e) => setScrapingSettings(prev => ({
                            ...prev,
                            exclude_out_of_stock: e.target.checked
                          }))}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    
                    <button
                      onClick={startScraping}
                      disabled={loading || urls.every(url => url.trim() === '')}
                      className="w-full inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <FaSpinner className="animate-spin mr-2" />
                          Starting Scraping...
                        </>
                      ) : (
                        <>
                          <FaDownload className="mr-2" />
                          Start Scraping
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'jobs' && (
              <div className="space-y-6">
                {/* Filters */}
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex-1 min-w-64">
                    <div className="relative">
                      <FaSearch className="absolute left-3 top-3 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search jobs..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  
                  <select
                    value={jobsFilter.status}
                    onChange={(e) => setJobsFilter(prev => ({ ...prev, status: e.target.value }))}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="completed">Completed</option>
                    <option value="failed">Failed</option>
                  </select>
                  
                  <select
                    value={jobsFilter.platform}
                    onChange={(e) => setJobsFilter(prev => ({ ...prev, platform: e.target.value }))}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Platforms</option>
                    <option value="amazon">Amazon</option>
                    <option value="alibaba">Alibaba</option>
                    <option value="aliexpress">AliExpress</option>
                    <option value="ebay">eBay</option>
                    <option value="walmart">Walmart</option>
                  </select>
                </div>

                {/* Jobs List */}
                {jobsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <FaSpinner className="animate-spin text-3xl text-gray-400" />
                  </div>
                ) : jobs.length === 0 ? (
                  <div className="text-center py-12">
                    <FaClipboardList className="mx-auto w-12 h-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No scraping jobs found</h3>
                    <p className="text-gray-600 mb-4">Start your first scraping job to see results here</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {jobs.map((job) => (
                      <div key={job.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-lg font-medium text-gray-900">Job #{job.id.slice(0, 8)}</h3>
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(job.status)}`}>
                                {job.status === 'processing' && <FaSpinner className="animate-spin mr-1" />}
                                {job.status === 'completed' && <FaCheckCircle className="mr-1" />}
                                {job.status === 'failed' && <FaTimesCircle className="mr-1" />}
                                {job.status === 'pending' && <FaClock className="mr-1" />}
                                {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                              </span>
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                              <div>
                                <span className="font-medium">URLs:</span> {job.total_urls}
                              </div>
                              <div>
                                <span className="font-medium">Success:</span> {job.successful_scrapes}
                              </div>
                              <div>
                                <span className="font-medium">Failed:</span> {job.failed_scrapes}
                              </div>
                              <div>
                                <span className="font-medium">Imported:</span> {job.imported_products}
                              </div>
                            </div>
                            
                            <div className="text-xs text-gray-500">
                              Created: {new Date(job.created_at).toLocaleString()}
                              {job.completed_at && (
                                <span className="ml-4">
                                  Completed: {new Date(job.completed_at).toLocaleString()}
                                </span>
                              )}
                            </div>
                            
                            {job.error_message && (
                              <div className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded">
                                {job.error_message}
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => {/* View details */}}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                              title="View Details"
                            >
                              <FaEye />
                            </button>
                            <button
                              onClick={() => deleteJob(job.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                              title="Delete Job"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'products' && (
              <div className="space-y-6">
                <ScrapedProductsGrid 
                  onProductSelect={(product) => {
                    if (product.imported_at && product.product_id) {
                      // Navigate to the imported product in the admin
                      window.open(`/superadmin/content/product/${product.product_id}/view`, '_blank')
                    } else {
                      // Show product details modal for non-imported products
                      setSelectedProductForView(product as ScrapedProduct)
                    }
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Product Detail Modal */}
        {selectedProductForView && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Product Details</h2>
                <button
                  onClick={() => setSelectedProductForView(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimes className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6 space-y-4">
                {/* Product Image */}
                {selectedProductForView.images && selectedProductForView.images.length > 0 && (
                  <div className="relative h-64 w-full bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={selectedProductForView.images[0]}
                      alt={selectedProductForView.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                {/* Product Info */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {selectedProductForView.title}
                  </h3>
                  
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPlatformBadgeColor(selectedProductForView.source_platform as SupportedPlatform)}`}>
                      {selectedProductForView.source_platform}
                    </span>
                    {selectedProductForView.brand && (
                      <span className="text-sm text-gray-600">Brand: {selectedProductForView.brand}</span>
                    )}
                  </div>
                  
                  {selectedProductForView.price && (
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold text-gray-900">
                        {selectedProductForView.currency || '$'}{selectedProductForView.price}
                      </span>
                      {selectedProductForView.original_price && selectedProductForView.original_price > selectedProductForView.price && (
                        <span className="text-lg text-gray-500 line-through">
                          {selectedProductForView.currency || '$'}{selectedProductForView.original_price}
                        </span>
                      )}
                    </div>
                  )}
                  
                  {selectedProductForView.rating && (
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(selectedProductForView.rating!)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">
                        {selectedProductForView.rating} ({selectedProductForView.review_count || 0} reviews)
                      </span>
                    </div>
                  )}
                  
                  {selectedProductForView.description && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {selectedProductForView.description}
                      </p>
                    </div>
                  )}
                  
                  <div className="flex gap-3 pt-4">
                    <a
                      href={selectedProductForView.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <FaExternalLinkAlt className="mr-2" />
                      View Original
                    </a>
                    <button
                      onClick={() => {
                        // Import this product
                        setSelectedProductForView(null)
                        // You can add import logic here
                      }}
                      className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <FaUpload className="mr-2" />
                      Import Product
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductScraperPage