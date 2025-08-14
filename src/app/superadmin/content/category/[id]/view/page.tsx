'use client'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import {
  FaArrowLeft,
  FaEdit,
  FaTrash,
  FaLayerGroup,
  FaCalendarAlt,
  FaCheckCircle,
  FaTimesCircle,
} from 'react-icons/fa'
import Image from 'next/image'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import { motion } from 'framer-motion'

export default function ViewCategoryPage() {
  const router = useRouter()
  const params = useParams()
  type Category = {
    id: string
    name: string
    description?: string
    color?: string
    icon?: string
    parent_id?: string
    image_url?: string
    is_active: boolean
    sort_order?: number
    meta_title?: string
    meta_description?: string
    seo_keywords?: string
    slug?: string
    created_at: string
    updated_at: string
  }

  const [category, setCategory] = useState<Category | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Fetch category data
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await fetch(`/api/category/${params.id}`)
        if (!res.ok) throw new Error('Failed to fetch category')
        const data = await res.json()
        setCategory(data)
      } catch (err) {
        const error = err as Error
        setError(error.message || 'Error loading category')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchCategory()
    }
  }, [params.id])

  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <LoadingSpinner message='Loading category details...' />
      </div>
    )
  }

  if (error) {
    return (
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
          <div className='flex items-center'>
            <FaTimesCircle className='text-red-500 mr-3' />
            <div>
              <h3 className='text-sm font-medium text-red-800'>Error</h3>
              <p className='text-sm text-red-700 mt-1'>{error}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!category) {
    return (
      <div className='container mx-auto p-4 md:p-6 overflow-auto'>
        <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-4'>
          <div className='flex items-center'>
            <FaTimesCircle className='text-yellow-500 mr-3' />
            <div>
              <h3 className='text-sm font-medium text-yellow-800'>Not Found</h3>
              <p className='text-sm text-yellow-700 mt-1'>Category not found</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='space-y-6 p-6 overflow-y-auto max-h-[calc(100vh-200px)]'>
      <div className='flex items-center justify-between mb-8'>
        <button
          onClick={() => router.back()}
          className='flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200'
        >
          <FaArrowLeft className='mr-2' />
          <span className='font-medium'>Back to Categories</span>
        </button>

        <div className='flex space-x-3'>
          <button
            onClick={() =>
              router.push(`/superadmin/content/category/${category.id}/edit`)
            }
            className='flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors'
          >
            <FaEdit className='text-sm' />
            <span>Edit Category</span>
          </button>
          <button
            onClick={() => {
              // TODO: Implement delete functionality
              if (confirm('Are you sure you want to delete this category?')) {
                // Delete logic here
              }
            }}
            className='flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors'
          >
            <FaTrash className='text-sm' />
            <span>Delete</span>
          </button>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className='bg-white dark:bg-gray-800 shadow-xl rounded-lg overflow-hidden'
      >
        {/* Header Section */}
        <div className='px-8 py-6 border-b border-gray-200 dark:border-gray-700'>
          <div className='flex items-start justify-between'>
            <div>
              <h1 className='text-3xl font-extrabold text-gray-900 dark:text-white'>
                {category.name}
              </h1>
              <div className='flex items-center mt-2'>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    category.is_active
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}
                >
                  {category.is_active ? (
                    <FaCheckCircle className='mr-1' />
                  ) : (
                    <FaTimesCircle className='mr-1' />
                  )}
                  {category.is_active ? 'Active' : 'Inactive'}
                </span>
                <span className='ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'>
                  Sort Order: {category.sort_order}
                </span>
              </div>
            </div>

            {category.image_url && (
              <div className='relative h-24 w-24 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700'>
                <Image
                  src={category.image_url}
                  alt={category.name}
                  fill
                  className='object-cover'
                />
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8 p-8'>
          {/* Basic Information */}
          <div className='md:col-span-2 space-y-6'>
            <div>
              <h2 className='text-lg font-medium text-gray-900 dark:text-white mb-4'>
                Category Details
              </h2>

              <div className='bg-gray-50 dark:bg-gray-700 rounded-lg p-6'>
                <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                  <div>
                    <h3 className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                      Description
                    </h3>
                    <p className='mt-1 text-sm text-gray-900 dark:text-white'>
                      {category.description || 'No description provided'}
                    </p>
                  </div>

                  <div>
                    <h3 className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                      Color
                    </h3>
                    <div className='mt-1 flex items-center'>
                      <div
                        className='h-6 w-6 rounded-full border border-gray-300 mr-2'
                        style={{ backgroundColor: category.color }}
                      ></div>
                      <span className='text-sm text-gray-900 dark:text-white'>
                        {category.color}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                      Icon
                    </h3>
                    <p className='mt-1 text-sm text-gray-900 dark:text-white'>
                      {category.icon || 'No icon set'}
                    </p>
                  </div>

                  <div>
                    <h3 className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                      Parent Category
                    </h3>
                    <p className='mt-1 text-sm text-gray-900 dark:text-white'>
                      {category.parent_id ? (
                        <span className='inline-flex items-center'>
                          <FaLayerGroup className='mr-1' />
                          {/* You might want to fetch and display parent category name */}
                          {category.parent_id}
                        </span>
                      ) : (
                        'Root category (no parent)'
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* SEO Information */}
            <div>
              <h2 className='text-lg font-medium text-gray-900 dark:text-white mb-4'>
                SEO Information
              </h2>

              <div className='bg-gray-50 dark:bg-gray-700 rounded-lg p-6'>
                <div className='space-y-4'>
                  <div>
                    <h3 className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                      Meta Title
                    </h3>
                    <p className='mt-1 text-sm text-gray-900 dark:text-white'>
                      {category.meta_title || 'Not set'}
                    </p>
                  </div>

                  <div>
                    <h3 className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                      Meta Description
                    </h3>
                    <p className='mt-1 text-sm text-gray-900 dark:text-white'>
                      {category.meta_description || 'Not set'}
                    </p>
                  </div>

                  <div>
                    <h3 className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                      SEO Keywords
                    </h3>
                    <p className='mt-1 text-sm text-gray-900 dark:text-white'>
                      {category.seo_keywords || 'Not set'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Metadata */}
          <div className='space-y-6'>
            <div>
              <h2 className='text-lg font-medium text-gray-900 dark:text-white mb-4'>
                System Information
              </h2>

              <div className='bg-gray-50 dark:bg-gray-700 rounded-lg p-6'>
                <div className='space-y-4'>
                  <div>
                    <h3 className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                      Category ID
                    </h3>
                    <p className='mt-1 text-sm text-gray-900 dark:text-white font-mono'>
                      {category.id}
                    </p>
                  </div>

                  <div>
                    <h3 className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                      Slug
                    </h3>
                    <p className='mt-1 text-sm text-gray-900 dark:text-white'>
                      {category.slug}
                    </p>
                  </div>

                  <div>
                    <h3 className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                      Created
                    </h3>
                    <p className='mt-1 text-sm text-gray-900 dark:text-white flex items-center'>
                      <FaCalendarAlt className='mr-1' />
                      {new Date(category.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  <div>
                    <h3 className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                      Last Updated
                    </h3>
                    <p className='mt-1 text-sm text-gray-900 dark:text-white flex items-center'>
                      <FaCalendarAlt className='mr-1' />
                      {new Date(category.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <h2 className='text-lg font-medium text-gray-900 dark:text-white mb-4'>
                Quick Actions
              </h2>

              <div className='space-y-2'>
                <button
                  onClick={() =>
                    router.push(
                      `/superadmin/content/category/${category.id}/edit`
                    )
                  }
                  className='w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                >
                  <FaEdit className='mr-2' />
                  Edit Category
                </button>

                <button
                  onClick={() => {
                    if (
                      confirm('Are you sure you want to delete this category?')
                    ) {
                      // TODO: Implement delete functionality
                    }
                  }}
                  className='w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
                >
                  <FaTrash className='mr-2' />
                  Delete Category
                </button>

                <button
                  onClick={() => {
                    setCategory((prev) =>
                      prev ? { ...prev, is_active: !prev.is_active } : prev
                    )
                    // TODO: Implement status toggle API call
                  }}
                  className={`w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    category.is_active
                      ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                      : 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
                  }`}
                >
                  {category.is_active ? (
                    <FaTimesCircle className='mr-2' />
                  ) : (
                    <FaCheckCircle className='mr-2' />
                  )}
                  {category.is_active ? 'Deactivate' : 'Activate'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
