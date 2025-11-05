'use client'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import {
  FaArrowLeft,
  FaTimes,
  FaCloudUploadAlt,
  FaBarcode,
  FaWarehouse,
  FaWeight,
  FaCheck,
  FaExclamationTriangle,
  FaCalendarAlt,
} from 'react-icons/fa'
import { uploadImageToCloudinary } from '@/lib/cloudinary'
import { useCategories } from '@/hooks/useCategories'
import { useProductsCache } from '@/hooks/useProducts'
import Image from 'next/image'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import { motion, AnimatePresence } from 'framer-motion'

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const { categories } = useCategories()
  const { invalidate: invalidateProductsCache } = useProductsCache()

  const [form, setForm] = useState({
    id: '',
    name: '',
    description: '',
    price: 0,
    image_url: '',
    images: [] as string[],
    category_id: '',
    is_active: true,
    stock: 0,
    sku: '',
    brand: '',
    weight: 0,
    meta_title: '',
    meta_description: '',
    is_featured: false,
    is_on_sale: false,
    original_price: 0,
    sale_starts_at: '',
    sale_ends_at: '',
  })

  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [activeTab, setActiveTab] = useState('basic')

  // Fetch product data on mount
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/product/${params.id}`)
        const text = await res.text()
        try {
          const data = JSON.parse(text)
          if (res.ok) {
            setForm({
              id: data.id,
              name: data.name,
              description: data.description || '',
              price: data.price || 0,
              image_url: data.image_url || '',
              images: data.images || [],
              category_id: data.category_id || '',
              is_active: data.is_active,
              stock: data.stock || 0,
              sku: data.sku || '',
              brand: data.brand || '',
              weight: data.weight || 0,
              meta_title: data.meta_title || '',
              meta_description: data.meta_description || '',
              is_featured: data.is_featured || false,
              is_on_sale: data.is_on_sale || false,
              original_price: data.original_price || 0,
              sale_starts_at: data.sale_starts_at || '',
              sale_ends_at: data.sale_ends_at || '',
            })
            // Set image previews from existing images
            const existingImages = [
              ...(data.images || []),
              ...(data.image_url ? [data.image_url] : [])
            ].filter(Boolean)
            setImagePreviews(existingImages)
            setError('')
          } else {
            setError(data.error || 'Error fetching product')
          }
        } catch {
          setError('API did not return valid JSON. Raw response: ' + text)
        }
      } catch (err) {
        setError((err as Error).message || 'Error loading product')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchProduct()
    }
  }, [params.id])

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target
    setForm((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox'
          ? (e.target as HTMLInputElement).checked
          : type === 'number'
          ? parseFloat(value) || 0
          : value,
    }))
  }

  // Multiple image upload handling
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      const validFiles: File[] = []
      const newPreviews: string[] = []

      files.forEach(file => {
        if (file.size > 2 * 1024 * 1024) {
          setError(`Image ${file.name} is too large. Maximum size is 2MB.`)
          return
        }
        validFiles.push(file)
        
        const reader = new FileReader()
        reader.onloadend = () => {
          newPreviews.push(reader.result as string)
          if (newPreviews.length === validFiles.length) {
            setImagePreviews(prev => [...prev, ...newPreviews])
          }
        }
        reader.readAsDataURL(file)
      })

      setImageFiles(prev => [...prev, ...validFiles])
    }
  }

  const removeImage = (index: number) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index))
    setImageFiles(prev => prev.filter((_, i) => i !== index))
    
    // Update form images array
    setForm(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
      image_url: index === 0 ? (prev.images[1] || '') : prev.image_url
    }))
  }

  const setMainImage = (index: number) => {
    const mainImageUrl = imagePreviews[index]
    setForm(prev => ({
      ...prev,
      image_url: mainImageUrl
    }))
  }

  // Submit handler
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      // Upload new images to Cloudinary
      const uploadedImageUrls: string[] = []
      for (const file of imageFiles) {
        try {
          const url = await uploadImageToCloudinary(file)
          uploadedImageUrls.push(url)
        } catch (err) {
          console.error('Failed to upload image:', err)
          if (err instanceof Error && err.message.includes('Cloudinary is not configured')) {
            setError('Cloudinary is not configured. Please set up your Cloudinary credentials in environment variables.')
          } else {
            setError(`Failed to upload image: ${file.name}. ${err instanceof Error ? err.message : 'Unknown error'}`)
          }
          setLoading(false)
          return
        }
      }

      // Combine existing images with newly uploaded ones
      const existingImages = imagePreviews.filter(url => !url.startsWith('data:'))
      const allImages = [...existingImages, ...uploadedImageUrls]
      
      // Set main image (first image or existing image_url)
      const mainImageUrl = form.image_url || allImages[0] || ''

      // Prepare product data (excluding fields not in database schema)
      const product = {
        id: form.id,
        name: form.name,
        description: form.description,
        price: form.price,
        image_url: mainImageUrl,
        images: allImages,
        category_id: form.category_id || null,
        is_active: form.is_active,
        stock_quantity: form.stock, // Map stock to stock_quantity
        sku: form.sku,
        brand: form.brand,
        weight: form.weight,
        meta_title: form.meta_title,
        meta_description: form.meta_description,
        is_featured: form.is_featured,
        original_price: form.original_price,
        updated_at: new Date().toISOString(),
      }

      // Update in Supabase
      const res = await fetch(`/api/product/${form.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      })

      if (!res.ok) throw new Error('Failed to update product')

      // Invalidate products cache to refresh the list
      invalidateProductsCache('products')

      setLoading(false)
      setSuccess('Product updated successfully!')

      // Redirect after 2 seconds
      setTimeout(() => {
        router.push('/superadmin/content/product')
      }, 2000)
    } catch (err) {
      const error = err as Error
      setError(error.message || 'Error updating product')
      setLoading(false)
    }
  }


  if (loading && !form.id) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <LoadingSpinner message='Loading product data...' />
      </div>
    )
  }

  return (
    <div className='space-y-6 p-6 overflow-y-auto max-h-[calc(100vh-200px)]'>
      <div className='flex items-center mb-8'>
        <button
          onClick={() => router.back()}
          className='flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200 mr-6'
        >
          <FaArrowLeft className='mr-2' />
          <span className='font-medium'>Back to Products</span>
        </button>
        <h1 className='text-3xl font-extrabold text-gray-900 dark:text-white'>
          Edit Product
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
              Inventory
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
                      placeholder='e.g. Premium Headphones'
                      className='w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white'
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                      Category
                    </label>
                    <select
                      title='Select a category'
                      name='category_id'
                      value={form.category_id}
                      onChange={handleChange}
                      className='w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white'
                    >
                      <option value=''>Select a category</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                      Price *
                    </label>
                    <div className='relative'>
                      <span className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500'>
                        $
                      </span>
                      <input
                        title='Enter the product price'
                        name='price'
                        type='number'
                        step='0.01'
                        min='0'
                        value={form.price}
                        onChange={handleChange}
                        required
                        className='w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white'
                      />
                    </div>
                  </div>

                  <div className='flex items-center space-x-4'>
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
                        Active
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
                        Featured
                      </label>
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
                  </div>

                  {form.is_on_sale && (
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                          Original Price
                        </label>
                        <div className='relative'>
                          <span className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500'>
                            $
                          </span>
                          <input
                            title='Enter the product original price'
                            name='original_price'
                            type='number'
                            step='0.01'
                            min='0'
                            value={form.original_price}
                            onChange={handleChange}
                            className='w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white'
                          />
                        </div>
                      </div>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                          Sale Starts
                        </label>
                        <div className='relative'>
                          <FaCalendarAlt className='absolute left-3 top-3.5 text-gray-400' />
                          <input
                            title='Select the sale start date'
                            name='sale_starts_at'
                            type='date'
                            value={form.sale_starts_at}
                            onChange={handleChange}
                            className='w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white'
                          />
                        </div>
                      </div>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                          Sale Ends
                        </label>
                        <div className='relative'>
                          <FaCalendarAlt className='absolute left-3 top-3.5 text-gray-400' />
                          <input
                            title='Select the sale end date'
                            name='sale_ends_at'
                            type='date'
                            value={form.sale_ends_at}
                            onChange={handleChange}
                            className='w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white'
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                    Description
                  </label>
                  <textarea
                    name='description'
                    value={form.description}
                    onChange={handleChange}
                    rows={8}
                    placeholder='Detailed product description...'
                    className='w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white'
                  />
                  <p className='mt-1 text-xs text-gray-500 dark:text-gray-400'>
                    Maximum 2000 characters.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Inventory Tab */}
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
                      SKU
                    </label>
                    <div className='relative'>
                      <FaBarcode className='absolute left-3 top-3.5 text-gray-400' />
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
                      Brand
                    </label>
                    <input
                      name='brand'
                      value={form.brand}
                      onChange={handleChange}
                      placeholder='e.g. Sony, Nike, Apple'
                      className='w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white'
                    />
                  </div>
                </div>

                <div className='space-y-6'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                      Stock Quantity
                    </label>
                    <div className='relative'>
                      <FaWarehouse className='absolute left-3 top-3.5 text-gray-400' />
                      <input
                        title='Enter the product stock quantity'
                        name='stock'
                        type='number'
                        min='0'
                        value={form.stock}
                        onChange={handleChange}
                        className='w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white'
                      />
                    </div>
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                      Weight (kg)
                    </label>
                    <div className='relative'>
                      <FaWeight className='absolute left-3 top-3.5 text-gray-400' />
                      <input
                        title='Enter the product weight'
                        name='weight'
                        type='number'
                        step='0.01'
                        min='0'
                        value={form.weight}
                        onChange={handleChange}
                        className='w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white'
                      />
                    </div>
                  </div>
                </div>

                <div className='space-y-6 col-span-2'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3'>
                      Product Images
                    </label>
                    
                    {/* Existing Images Grid */}
                    {imagePreviews.length > 0 && (
                      <div className='mb-4'>
                        <h4 className='text-sm font-medium text-gray-600 dark:text-gray-400 mb-2'>
                          Current Images ({imagePreviews.length})
                        </h4>
                        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                          {imagePreviews.map((preview, index) => (
                            <div key={index} className='relative group'>
                              <Image
                                src={preview}
                                alt={`Product image ${index + 1}`}
                                width={150}
                                height={150}
                                className='w-full h-32 object-cover rounded-lg shadow-md'
                              />
                              
                              {/* Image Actions */}
                              <div className='absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center space-x-2'>
                                <button
                                  type='button'
                                  onClick={() => setMainImage(index)}
                                  className='px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors'
                                  title='Set as main image'
                                >
                                  Main
                                </button>
                                <button
                                  type='button'
                                  onClick={() => removeImage(index)}
                                  className='px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition-colors'
                                  title='Remove image'
                                >
                                  Remove
                                </button>
                              </div>
                              
                              {/* Main Image Indicator */}
                              {form.image_url === preview && (
                                <div className='absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded'>
                                  Main
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Upload New Images */}
                    <div className='mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg'>
                      <div className='space-y-1 text-center'>
                        <FaCloudUploadAlt className='mx-auto h-12 w-12 text-gray-400' />
                        <div className='flex text-sm text-gray-600 dark:text-gray-400'>
                          <label
                            htmlFor='product-images'
                            className='relative cursor-pointer bg-white dark:bg-gray-700 rounded-md font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 focus-within:outline-none'
                          >
                            <span>Upload images</span>
                            <input
                              id='product-images'
                              name='product-images'
                              type='file'
                              accept='image/*'
                              multiple
                              onChange={handleImageChange}
                              className='sr-only'
                            />
                          </label>
                          <p className='pl-1'>or drag and drop</p>
                        </div>
                        <p className='text-xs text-gray-500 dark:text-gray-400'>
                          PNG, JPG, GIF up to 2MB each. Select multiple files.
                        </p>
                        <p className='text-xs text-gray-500 dark:text-gray-400'>
                          First image will be set as main product image.
                        </p>
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
                      ? 'inventory'
                      : activeTab === 'inventory'
                      ? 'seo'
                      : 'basic'
                  )
                }
                className='px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
              >
                {activeTab === 'basic'
                  ? 'Next: Inventory'
                  : activeTab === 'inventory'
                  ? 'Next: SEO Settings'
                  : 'Back to Basic Info'}
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
                aria-label={loading ? 'Updating product' : 'Update product'}
              >
                {loading ? (
                  <>
                    <LoadingSpinner message='Loading...' />
                    Updating...
                  </>
                ) : (
                  'Update Product'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
