'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  FaArrowLeft,
  FaTimes,
  FaCloudUploadAlt,
  FaPalette,
  FaIcons,
  FaSortNumericDown,
  FaLayerGroup,
  FaCheck,
  FaExclamationTriangle,
} from 'react-icons/fa'
import { v4 as uuidv4 } from 'uuid'
import { uploadImageToCloudinary } from '@/lib/cloudinary'
import { useCategories } from '@/hooks/useCategories'
import Image from 'next/image'
import ColorPicker from '@/components/common/ColorPicker'
import IconSelector from '@/components/common/IconSelector'
import ParentCategorySelector from '@/components/superAdmin/ParentCategorySelector'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import { motion, AnimatePresence } from 'framer-motion'

export default function CreateCategoryPage() {
  const router = useRouter()
  const { categories } = useCategories()
  // Map categories to ensure parent_id is string | undefined
  const mappedCategories = categories.map((cat) => ({
    ...cat,
    parent_id: cat.parent_id === null ? undefined : cat.parent_id,
  }))

  const [form, setForm] = useState({
    name: '',
    slug: '',
    description: '',
    color: '#3B82F6',
    icon: 'shopping-bag',
    image_url: '',
    sort_order: 0,
    is_active: true,
    parent_id: '',
    meta_title: '',
    meta_description: '',
    seo_keywords: '',
  })

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [activeTab, setActiveTab] = useState('basic')
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [showIconSelector, setShowIconSelector] = useState(false)
  const [showParentSelector, setShowParentSelector] = useState(false)

  // Auto-generate slug from name
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target
    setForm((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
      ...(name === 'name' && {
        slug: value
          .toLowerCase()
          .replace(/[^\u0000-\u007f]+/g, '')
          .replace(/[\s]+/g, '-')
          .replace(/[^a-z0-9-]/g, ''),
      }),
    }))
  }

  // Image upload preview
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (file.size > 2 * 1024 * 1024) {
        setError('Image size should be less than 2MB')
        return
      }
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => setImagePreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setImageFile(null)
    setImagePreview(null)
    setForm((prev) => ({ ...prev, image_url: '' }))
  }

  // Submit handler
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    let imageUrl = form.image_url

    try {
      if (imageFile) {
        imageUrl = await uploadImageToCloudinary(imageFile)
      }

      // Prepare category data
      const category = {
        id: uuidv4(),
        name: form.name,
        slug: form.slug,
        description: form.description,
        image_url: imageUrl,
        icon: form.icon,
        color: form.color,
        is_active: form.is_active,
        sort_order: Number(form.sort_order),
        parent_id: form.parent_id || null,
        meta_title: form.meta_title,
        meta_description: form.meta_description,
        seo_keywords: form.seo_keywords,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_deleted: false,
        modified_by: null,
        modified_at: null,
      }

      // Insert into Supabase
      const res = await fetch('/api/category', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(category),
      })

      if (!res.ok) throw new Error('Failed to create category')

      setLoading(false)
      setSuccess('Category created successfully!')

      // Redirect after 2 seconds
      setTimeout(() => {
        router.push('/superadmin/content/category')
      }, 2000)
    } catch (err) {
      const error = err as Error
      setError(error.message || 'Error creating category')
      setLoading(false)
    }
  }

  return (
    <div className='space-y-6 p-6 overflow-y-auto max-h-[calc(100vh-200px)]'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='flex items-center mb-8'>
          <button
            onClick={() => router.back()}
            className='flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200 mr-6'
          >
            <FaArrowLeft className='mr-2' />
            <span className='font-medium'>Back to Categories</span>
          </button>
          <h1 className='text-3xl font-extrabold text-gray-900 dark:text-white'>
            Create New Category
          </h1>
        </div>

        {/* Success Message */}
        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className='mb-6 bg-green-50 border border-green-200 rounded-lg p-4'
            >
              <div className='flex items-center'>
                <FaCheck className='text-green-500 mr-3' />
                <div>
                  <h3 className='text-sm font-medium text-green-800'>
                    {success}
                  </h3>
                  <p className='text-sm text-green-700 mt-1'>
                    Redirecting to categories list...
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className='mb-6 bg-red-50 border border-red-200 rounded-lg p-4'
            >
              <div className='flex items-center'>
                <FaExclamationTriangle className='text-red-500 mr-3' />
                <div>
                  <h3 className='text-sm font-medium text-red-800'>Error</h3>
                  <p className='text-sm text-red-700 mt-1'>{error}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className='bg-white dark:bg-gray-800 shadow-xl rounded-lg overflow-hidden'>
          {/* Form Tabs */}
          <div className='border-b border-gray-200 dark:border-gray-700'>
            <nav className='flex -mb-px'>
              <button
                type='button'
                onClick={() => setActiveTab('basic')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'basic'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Basic Information
              </button>
              <button
                type='button'
                onClick={() => setActiveTab('visual')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'visual'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Visual Identity
              </button>
              <button
                type='button'
                onClick={() => setActiveTab('seo')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'seo'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                SEO Settings
              </button>
            </nav>
          </div>

          <form onSubmit={handleSubmit} className='p-8'>
            {/* Basic Information Tab */}
            {activeTab === 'basic' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                  <div className='space-y-6'>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                        Category Name *
                      </label>
                      <input
                        name='name'
                        value={form.name}
                        onChange={handleChange}
                        required
                        placeholder='e.g. Electronics, Fashion, Home & Garden'
                        className='w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white'
                      />
                    </div>

                    <div>
                      <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                        Slug *
                      </label>
                      <div className='relative'>
                        <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400'>
                          /category/
                        </div>
                        <input
                          name='slug'
                          value={form.slug}
                          onChange={handleChange}
                          required
                          placeholder='e.g. electronics'
                          className='w-full pl-24 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white'
                        />
                      </div>
                    </div>

                    <div>
                      <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                        Parent Category
                      </label>
                      <div className='relative'>
                        <button
                          type='button'
                          onClick={() =>
                            setShowParentSelector(!showParentSelector)
                          }
                          className='w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-left flex items-center justify-between'
                        >
                          <span>
                            {form.parent_id
                              ? categories.find((c) => c.id === form.parent_id)
                                  ?.name || 'Select parent'
                              : 'No parent (root category)'}
                          </span>
                          <FaLayerGroup className='text-gray-400' />
                        </button>
                        {showParentSelector && (
                          <ParentCategorySelector
                            categories={mappedCategories}
                            selectedId={form.parent_id}
                            onSelect={(id) => {
                              setForm((prev) => ({ ...prev, parent_id: id }))
                              setShowParentSelector(false)
                            }}
                            onClose={() => setShowParentSelector(false)}
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                      Description
                    </label>
                    <textarea
                      name='description'
                      value={form.description}
                      onChange={handleChange}
                      rows={5}
                      placeholder='Describe this category for customers and search engines...'
                      className='w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white'
                    />
                    <p className='mt-1 text-xs text-gray-500 dark:text-gray-400'>
                      Maximum 500 characters. This will appear in category
                      listings.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Visual Identity Tab */}
            {activeTab === 'visual' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                  <div className='space-y-6'>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                        Category Image
                      </label>
                      <div className='mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg'>
                        <div className='space-y-1 text-center'>
                          {imagePreview ? (
                            <div className='relative'>
                              <Image
                                src={imagePreview}
                                alt='Category preview'
                                width={192}
                                height={192}
                                className='mx-auto h-48 w-48 object-cover rounded-lg shadow-md'
                              />
                              <button
                                type='button'
                                onClick={removeImage}
                                className='absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 -mt-2 -mr-2 shadow-lg hover:bg-red-600 transition-colors'
                                aria-label='Remove image'
                              >
                                <FaTimes className='h-4 w-4' />
                                <span className='sr-only'>Remove image</span>
                              </button>
                            </div>
                          ) : (
                            <>
                              <FaCloudUploadAlt className='mx-auto h-12 w-12 text-gray-400' />
                              <div className='flex text-sm text-gray-600 dark:text-gray-400'>
                                <label
                                  htmlFor='category-image'
                                  className='relative cursor-pointer bg-white dark:bg-gray-700 rounded-md font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 focus-within:outline-none'
                                >
                                  <span>Upload a file</span>
                                  <input
                                    id='category-image'
                                    name='category-image'
                                    type='file'
                                    accept='image/*'
                                    onChange={handleImageChange}
                                    className='sr-only'
                                  />
                                </label>
                                <p className='pl-1'>or drag and drop</p>
                              </div>
                              <p className='text-xs text-gray-500 dark:text-gray-400'>
                                PNG, JPG, GIF up to 2MB
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                        Sort Order
                      </label>
                      <div className='relative'>
                        <FaSortNumericDown className='absolute left-3 top-3.5 text-gray-400' />
                        <input
                          name='sort_order'
                          type='number'
                          value={form.sort_order}
                          onChange={handleChange}
                          className='w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white'
                          title='Sort order for category display'
                          placeholder='Enter sort order'
                        />
                      </div>
                    </div>

                    <div className='flex items-center'>
                      <input
                        id='is_active'
                        name='is_active'
                        type='checkbox'
                        checked={form.is_active}
                        onChange={handleChange}
                        className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded'
                      />
                      <label
                        htmlFor='is_active'
                        className='ml-2 block text-sm text-gray-700 dark:text-gray-300'
                      >
                        Active Category
                      </label>
                    </div>
                  </div>

                  <div className='space-y-6'>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                        Category Color
                      </label>
                      <div className='relative'>
                        <button
                          type='button'
                          onClick={() => setShowColorPicker(!showColorPicker)}
                          className='w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-left flex items-center justify-between'
                        >
                          <div className='flex items-center'>
                            <div
                              className='w-6 h-6 rounded-full mr-3 border border-gray-300'
                              style={{ backgroundColor: form.color }}
                            ></div>
                            <span>{form.color}</span>
                          </div>
                          <FaPalette className='text-gray-400' />
                        </button>
                        {showColorPicker && (
                          <ColorPicker
                            color={form.color}
                            onChange={(color) => {
                              setForm((prev) => ({ ...prev, color }))
                              setShowColorPicker(false)
                            }}
                            onClose={() => setShowColorPicker(false)}
                          />
                        )}
                      </div>
                    </div>

                    <div>
                      <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                        Category Icon
                      </label>
                      <div className='relative'>
                        <button
                          type='button'
                          onClick={() => setShowIconSelector(!showIconSelector)}
                          className='w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-left flex items-center justify-between'
                        >
                          <div className='flex items-center'>
                            <span className='mr-3'>
                              <i className={`fas fa-${form.icon}`}></i>
                            </span>
                            <span>{form.icon}</span>
                          </div>
                          <FaIcons className='text-gray-400' />
                        </button>
                        {showIconSelector && (
                          <IconSelector
                            selectedIcon={form.icon}
                            onSelect={(icon) => {
                              setForm((prev) => ({ ...prev, icon }))
                              setShowIconSelector(false)
                            }}
                            onClose={() => setShowIconSelector(false)}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* SEO Settings Tab */}
            {activeTab === 'seo' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className='space-y-6'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                      Meta Title
                    </label>
                    <input
                      name='meta_title'
                      value={form.meta_title}
                      onChange={handleChange}
                      placeholder='Optimized title for search engines (50-60 chars)'
                      className='w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white'
                    />
                    <div className='mt-1 flex justify-end'>
                      <span className='text-xs text-gray-500 dark:text-gray-400'>
                        {form.meta_title.length}/60 characters
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                      Meta Description
                    </label>
                    <textarea
                      name='meta_description'
                      value={form.meta_description}
                      onChange={handleChange}
                      rows={3}
                      placeholder='Brief description for search results (150-160 chars)'
                      className='w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white'
                    />
                    <div className='mt-1 flex justify-end'>
                      <span className='text-xs text-gray-500 dark:text-gray-400'>
                        {form.meta_description.length}/160 characters
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                      SEO Keywords
                    </label>
                    <input
                      name='seo_keywords'
                      value={form.seo_keywords}
                      onChange={handleChange}
                      placeholder='Comma-separated keywords (e.g. electronics, gadgets, tech)'
                      className='w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white'
                    />
                    <p className='mt-1 text-xs text-gray-500 dark:text-gray-400'>
                      These help search engines understand your category
                      content.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Form Navigation and Submit */}
            <div className='mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-between'>
              <div className='flex space-x-3'>
                <button
                  type='button'
                  onClick={() =>
                    setActiveTab(
                      activeTab === 'basic'
                        ? 'seo'
                        : activeTab === 'visual'
                        ? 'basic'
                        : 'visual'
                    )
                  }
                  className='px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                >
                  {activeTab === 'basic'
                    ? 'Next: Visual Identity'
                    : activeTab === 'visual'
                    ? 'Next: SEO Settings'
                    : 'Back to Visual Identity'}
                </button>
              </div>

              <div className='flex space-x-3'>
                <button
                  type='button'
                  onClick={() => router.back()}
                  className='px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  disabled={loading}
                  className='inline-flex justify-center px-6 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed'
                  aria-label={loading ? 'Creating category' : 'Create category'}
                >
                  {loading ? (
                    <>
                      <LoadingSpinner message='Loading...' />
                      Creating...
                    </>
                  ) : (
                    'Create Category'
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
