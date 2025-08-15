'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  FaArrowLeft,
  FaTimes,
  FaCloudUploadAlt,
  FaBox,
  FaTags,
  FaDollarSign,
  FaWeight,
  FaBarcode,
  FaLayerGroup,
  FaCheck,
  FaExclamationTriangle,
} from 'react-icons/fa'
import { v4 as uuidv4 } from 'uuid'
import { uploadImageToCloudinary } from '@/lib/cloudinary'
import { useCategories } from '@/hooks/useCategories'
import Image from 'next/image'
import ParentCategorySelector from '@/components/superAdmin/ParentCategorySelector'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import { motion, AnimatePresence } from 'framer-motion'

export default function CreateProductPage() {
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
    short_description: '',
    price: 0,
    original_price: 0,
    cost_price: 0,
    image_url: '',
    images: [] as string[],
    category_id: '',
    is_active: true,
    in_stock: true,
    stock_quantity: 0,
    min_stock_level: 5,
    sku: '',
    barcode: '',
    weight: 0,
    dimensions: { length: 0, width: 0, height: 0 },
    is_featured: false,
    is_on_sale: false,
    sale_starts_at: '',
    sale_ends_at: '',
    brand: '',
    tags: [] as string[],
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
  const [showCategorySelector, setShowCategorySelector] = useState(false)

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

  // Handle number inputs
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: value === '' ? '' : Number(value),
    }))
  }

  // Handle dimension changes
  const handleDimensionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({
      ...prev,
      dimensions: {
        ...prev.dimensions,
        [name]: value === '' ? '' : Number(value),
      },
    }))
  }

  // Handle tags input
  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    setForm((prev) => ({
      ...prev,
      tags: value.split(',').map((tag) => tag.trim()),
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

      // Prepare product data
      const product = {
        id: uuidv4(),
        name: form.name,
        slug: form.slug,
        description: form.description,
        short_description: form.short_description,
        price: Number(form.price),
        original_price: Number(form.original_price) || Number(form.price),
        cost_price: Number(form.cost_price) || 0,
        image_url: imageUrl,
        images: form.images,
        category_id: form.category_id || null,
        is_active: form.is_active,
        in_stock: form.in_stock,
        stock_quantity: Number(form.stock_quantity) || 0,
        min_stock_level: Number(form.min_stock_level) || 5,
        sku: form.sku,
        barcode: form.barcode,
        weight: Number(form.weight) || 0,
        dimensions: form.dimensions,
        is_featured: form.is_featured,
        is_on_sale: form.is_on_sale,
        sale_starts_at: form.sale_starts_at || null,
        sale_ends_at: form.sale_ends_at || null,
        brand: form.brand,
        tags: form.tags,
        meta_title: form.meta_title,
        meta_description: form.meta_description,
        seo_keywords: form.seo_keywords,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      // Insert into Supabase
      const res = await fetch('/api/product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      })

      if (!res.ok) throw new Error('Failed to create product')

      setLoading(false)
      setSuccess('Product created successfully!')

      // Redirect after 2 seconds
      setTimeout(() => {
        router.push('/superadmin/content/product')
      }, 2000)
    } catch (err) {
      const error = err as Error
      setError(error.message || 'Error creating product')
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
            <span className='font-medium'>Back to Products</span>
          </button>
          <h1 className='text-3xl font-extrabold text-gray-900 dark:text-white'>
            Create New Product
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
                    Redirecting to products list...
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
                onClick={() => setActiveTab('inventory')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'inventory'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Inventory & Pricing
              </button>
              <button
                type='button'
                onClick={() => setActiveTab('shipping')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'shipping'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Shipping
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
                        Product Name *
                      </label>
                      <input
                        name='name'
                        value={form.name}
                        onChange={handleChange}
                        required
                        placeholder='e.g. Premium Wireless Headphones'
                        className='w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white'
                      />
                    </div>

                    <div>
                      <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                        Slug *
                      </label>
                      <div className='relative'>
                        <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400'>
                          /product/
                        </div>
                        <input
                          name='slug'
                          value={form.slug}
                          onChange={handleChange}
                          required
                          placeholder='e.g. premium-wireless-headphones'
                          className='w-full pl-20 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white'
                        />
                      </div>
                    </div>

                    <div>
                      <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                        Category
                      </label>
                      <div className='relative'>
                        <button
                          type='button'
                          onClick={() =>
                            setShowCategorySelector(!showCategorySelector)
                          }
                          className='w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-left flex items-center justify-between'
                        >
                          <span>
                            {form.category_id
                              ? categories.find(
                                  (c) => c.id === form.category_id
                                )?.name || 'Select category'
                              : 'No category selected'}
                          </span>
                          <FaLayerGroup className='text-gray-400' />
                        </button>
                        {showCategorySelector && (
                          <ParentCategorySelector
                            categories={mappedCategories}
                            selectedId={form.category_id}
                            onSelect={(id) => {
                              setForm((prev) => ({ ...prev, category_id: id }))
                              setShowCategorySelector(false)
                            }}
                            onClose={() => setShowCategorySelector(false)}
                          />
                        )}
                      </div>
                    </div>

                    <div>
                      <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                        Brand
                      </label>
                      <input
                        name='brand'
                        value={form.brand}
                        onChange={handleChange}
                        placeholder='e.g. Sony, Apple, Samsung'
                        className='w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white'
                      />
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
                        Active Product
                      </label>
                    </div>

                    <div className='flex items-center'>
                      <input
                        id='is_featured'
                        name='is_featured'
                        type='checkbox'
                        checked={form.is_featured}
                        onChange={handleChange}
                        className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded'
                      />
                      <label
                        htmlFor='is_featured'
                        className='ml-2 block text-sm text-gray-700 dark:text-gray-300'
                      >
                        Featured Product
                      </label>
                    </div>
                  </div>

                  <div className='space-y-6'>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                        Short Description
                      </label>
                      <textarea
                        name='short_description'
                        value={form.short_description}
                        onChange={handleChange}
                        rows={3}
                        placeholder='Brief description for product listings (max 150 characters)'
                        className='w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white'
                        maxLength={150}
                      />
                      <p className='mt-1 text-xs text-gray-500 dark:text-gray-400'>
                        {form.short_description.length}/150 characters
                      </p>
                    </div>

                    <div>
                      <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                        Full Description
                      </label>
                      <textarea
                        name='description'
                        value={form.description}
                        onChange={handleChange}
                        rows={5}
                        placeholder='Detailed product description...'
                        className='w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white'
                      />
                    </div>

                    <div>
                      <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                        Product Image
                      </label>
                      <div className='mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg'>
                        <div className='space-y-1 text-center'>
                          {imagePreview ? (
                            <div className='relative'>
                              <Image
                                src={imagePreview}
                                alt='Product preview'
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
                                  htmlFor='product-image'
                                  className='relative cursor-pointer bg-white dark:bg-gray-700 rounded-md font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 focus-within:outline-none'
                                >
                                  <span>Upload a file</span>
                                  <input
                                    id='product-image'
                                    name='product-image'
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
                  </div>
                </div>
              </motion.div>
            )}

            {/* Inventory & Pricing Tab */}
            {activeTab === 'inventory' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                  <div className='space-y-6'>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                        SKU (Stock Keeping Unit)
                      </label>
                      <div className='relative'>
                        <FaBox className='absolute left-3 top-3.5 text-gray-400' />
                        <input
                          name='sku'
                          value={form.sku}
                          onChange={handleChange}
                          placeholder='e.g. PROD-12345'
                          className='w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white'
                        />
                      </div>
                    </div>

                    <div>
                      <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                        Barcode (ISBN, UPC, etc.)
                      </label>
                      <div className='relative'>
                        <FaBarcode className='absolute left-3 top-3.5 text-gray-400' />
                        <input
                          name='barcode'
                          value={form.barcode}
                          onChange={handleChange}
                          placeholder='e.g. 123456789012'
                          className='w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white'
                        />
                      </div>
                    </div>

                    <div>
                      <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                        Current Stock Quantity
                      </label>
                      <input
                        name='stock_quantity'
                        type='number'
                        min='0'
                        value={form.stock_quantity}
                        onChange={handleNumberChange}
                        placeholder='Enter stock quantity'
                        className='w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white'
                      />
                    </div>

                    <div>
                      <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                        Low Stock Threshold
                      </label>
                      <input
                        name='min_stock_level'
                        type='number'
                        min='0'
                        value={form.min_stock_level}
                        onChange={handleNumberChange}
                        placeholder='Enter low stock threshold'
                        className='w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white'
                      />
                    </div>

                    {/* Removed duplicate and fixed checkbox: add onChange handler */}
                    <div className='flex items-center'>
                      <input
                        id='in_stock'
                        name='in_stock'
                        type='checkbox'
                        checked={form.in_stock}
                        onChange={handleChange}
                        className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded'
                      />
                      <label
                        htmlFor='in_stock'
                        className='ml-2 block text-sm text-gray-700 dark:text-gray-300'
                      >
                        In Stock
                      </label>
                    </div>

                    <div className='flex items-center'>
                      <input
                        id='in_stock'
                        name='in_stock'
                        type='checkbox'
                        checked={form.in_stock}
                        onChange={handleChange}
                        className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded'
                      />
                      <label
                        htmlFor='in_stock'
                        className='ml-2 block text-sm text-gray-700 dark:text-gray-300'
                      >
                        In Stock
                      </label>
                    </div>
                  </div>

                  <div className='space-y-6'>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                        Price *
                      </label>
                      <div className='relative'>
                        <FaDollarSign className='absolute left-3 top-3.5 text-gray-400' />
                        <input
                          name='price'
                          type='number'
                          min='0'
                          step='0.01'
                          value={form.price}
                          onChange={handleNumberChange}
                          required
                          placeholder='0.00'
                          className='w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white'
                        />
                      </div>
                    </div>

                    <div>
                      <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                        Original Price
                      </label>
                      <div className='relative'>
                        <FaDollarSign className='absolute left-3 top-3.5 text-gray-400' />
                        <input
                          name='original_price'
                          type='number'
                          min='0'
                          step='0.01'
                          value={form.original_price}
                          onChange={handleNumberChange}
                          placeholder='0.00'
                          className='w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white'
                        />
                      </div>
                    </div>

                    <div>
                      <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                        Cost Price
                      </label>
                      <div className='relative'>
                        <FaDollarSign className='absolute left-3 top-3.5 text-gray-400' />
                        <input
                          name='cost_price'
                          type='number'
                          min='0'
                          step='0.01'
                          value={form.cost_price}
                          onChange={handleNumberChange}
                          placeholder='0.00'
                          className='w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white'
                        />
                      </div>
                    </div>

                    <div className='flex items-center'>
                      <input
                        id='is_on_sale'
                        name='is_on_sale'
                        type='checkbox'
                        checked={form.is_on_sale}
                        onChange={handleChange}
                        className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded'
                      />
                      <label
                        htmlFor='is_on_sale'
                        className='ml-2 block text-sm text-gray-700 dark:text-gray-300'
                      >
                        On Sale
                      </label>
                    </div>

                    {form.is_on_sale && (
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <div>
                          <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                            Sale Start Date
                          </label>
                          <input
                            id='sale_starts_at'
                            name='sale_starts_at'
                            type='datetime-local'
                            value={form.sale_starts_at}
                            onChange={handleChange}
                            placeholder='Select sale start date and time'
                            className='w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white'
                          />
                        </div>
                        <div>
                          <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                            Sale End Date
                          </label>
                          <input
                            title='Select sale end date and time'
                            name='sale_ends_at'
                            type='datetime-local'
                            value={form.sale_ends_at}
                            onChange={handleChange}
                            className='w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white'
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Shipping Tab */}
            {activeTab === 'shipping' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                  <div className='space-y-6'>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                        Weight (kg)
                      </label>
                      <div className='relative'>
                        <FaWeight className='absolute left-3 top-3.5 text-gray-400' />
                        <input
                          title='Enter weight in kilograms'
                          name='weight'
                          type='number'
                          min='0'
                          step='0.01'
                          value={form.weight}
                          onChange={handleNumberChange}
                          className='w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white'
                        />
                      </div>
                    </div>
                  </div>

                  <div className='space-y-6'>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                        Dimensions (cm)
                      </label>
                      <div className='grid grid-cols-3 gap-3'>
                        <div>
                          <label className='block text-xs text-gray-500 dark:text-gray-400 mb-1'>
                            Length
                          </label>
                          <input
                            title='Enter length in centimeters'
                            name='length'
                            type='number'
                            min='0'
                            step='0.1'
                            value={form.dimensions.length}
                            onChange={handleDimensionChange}
                            className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white'
                          />
                        </div>
                        <div>
                          <label className='block text-xs text-gray-500 dark:text-gray-400 mb-1'>
                            Width
                          </label>
                          <input
                            title='Enter width in centimeters'
                            name='width'
                            type='number'
                            min='0'
                            step='0.1'
                            value={form.dimensions.width}
                            onChange={handleDimensionChange}
                            className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white'
                          />
                        </div>
                        <div>
                          <label className='block text-xs text-gray-500 dark:text-gray-400 mb-1'>
                            Height
                          </label>
                          <input
                            title='Enter height in centimeters'
                            name='height'
                            type='number'
                            min='0'
                            step='0.1'
                            value={form.dimensions.height}
                            onChange={handleDimensionChange}
                            className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white'
                          />
                        </div>
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
                      placeholder='Comma-separated keywords (e.g. headphones, wireless, audio)'
                      className='w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white'
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                      Product Tags
                    </label>
                    <div className='relative'>
                      <FaTags className='absolute left-3 top-3.5 text-gray-400' />
                      <input
                        name='tags'
                        value={form.tags.join(', ')}
                        onChange={handleTagsChange}
                        placeholder='Comma-separated tags (e.g. electronics, audio, wireless)'
                        className='w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white'
                      />
                    </div>
                    <div className='mt-2 flex flex-wrap gap-2'>
                      {form.tags.map((tag, index) => (
                        <span
                          key={index}
                          className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
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
                        : activeTab === 'inventory'
                        ? 'basic'
                        : activeTab === 'shipping'
                        ? 'inventory'
                        : 'shipping'
                    )
                  }
                  className='px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                >
                  {activeTab === 'basic'
                    ? 'Next: Inventory & Pricing'
                    : activeTab === 'inventory'
                    ? 'Next: Shipping'
                    : activeTab === 'shipping'
                    ? 'Next: SEO Settings'
                    : 'Back to Basic Information'}
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
                  aria-label={loading ? 'Creating product' : 'Create product'}
                >
                  {loading ? (
                    <>
                      <LoadingSpinner message='Loading...' />
                      Creating...
                    </>
                  ) : (
                    'Create Product'
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
