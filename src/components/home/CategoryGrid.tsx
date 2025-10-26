'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { FaBox } from 'react-icons/fa'

interface Category {
  id: string
  name: string
  slug: string
  image_url?: string | null
  color?: string | null
  description?: string | null
  is_active?: boolean | null
}

interface CategoryGridProps {
  title?: string
  subtitle?: string
  limit?: number
}

const CategoryGrid: React.FC<CategoryGridProps> = ({
  title = 'Shop by Category',
  subtitle = 'Discover our product categories',
  limit = 8,
}) => {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(
          `/api/categories?limit=${limit}&active=true`
        )

        if (!response.ok) {
          throw new Error(`Failed to fetch categories: ${response.status}`)
        }

        const data = await response.json()

        setCategories(data || [])
      } catch (err) {
        console.error('❌ Error fetching categories:', err)
        setError('Failed to load categories')
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [limit])

  const getCategoryImage = (category: Category): string | null => {
    if (category.image_url) {
      return category.image_url
    }
    return null
  }

  const getCategoryColor = (category: Category): string => {
    return category.color || '#6366f1' // Default indigo color
  }

  if (loading) {
    return (
      <section className='py-16 bg-gray-50'>
        <div className='container mx-auto px-4'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl font-bold text-gray-900 mb-4'>{title}</h2>
            <p className='text-gray-600'>{subtitle}</p>
          </div>
          <div className='flex justify-center'>
            <div className='animate-pulse'>Loading categories...</div>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className='py-16 bg-gray-50'>
        <div className='container mx-auto px-4'>
          <div className='text-center'>
            <h2 className='text-3xl font-bold text-gray-900 mb-4'>{title}</h2>
            <div className='bg-red-50 border border-red-200 rounded-lg p-4 max-w-md mx-auto'>
              <p className='text-red-600'>{error}</p>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (categories.length === 0) {
    return (
      <section className='py-16 bg-gray-50'>
        <div className='container mx-auto px-4'>
          <div className='text-center'>
            <h2 className='text-3xl font-bold text-gray-900 mb-4'>{title}</h2>
            <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-md mx-auto'>
              <p className='text-yellow-800'>No categories found</p>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className='py-16 bg-gray-50'>
      <div className='container mx-auto px-4'>
        <div className='text-center mb-12'>
          <h2 className='text-3xl font-bold text-gray-900 mb-4'>{title}</h2>
          <p className='text-gray-600'>{subtitle}</p>
        </div>

        <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6'>
          {categories.map((category) => {
            const categoryImage = getCategoryImage(category)
            const categoryColor = getCategoryColor(category)

            return (
              <Link
                key={category.id}
                href={`/products?category=${category.slug}`} // This is correct
                className='group block'
              >
                <div className='relative overflow-hidden rounded-xl bg-white shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1'>
                  <div
                    className='aspect-square relative overflow-hidden'
                    style={{
                      backgroundColor: categoryImage
                        ? 'transparent'
                        : categoryColor,
                    }}
                  >
                    {categoryImage ? (
                      <Image
                        src={categoryImage}
                        alt={category.name}
                        fill
                        className='object-cover group-hover:scale-110 transition-transform duration-300'
                        sizes='(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw'
                        onLoad={() => {}}
                        onError={(e) => {
                          console.error(
                            '❌ Category image failed to load:',
                            category.name,
                            categoryImage,
                            e
                          )
                        }}
                      />
                    ) : (
                      <div className='w-full h-full flex flex-col items-center justify-center text-white'>
                        <FaBox className='text-4xl mb-2 opacity-80' />
                        <span className='text-sm opacity-80'>No image</span>
                      </div>
                    )}

                    {/* Color Overlay */}
                    <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent' />
                  </div>

                  <div className='absolute bottom-0 left-0 right-0 p-4'>
                    <h3 className='text-white font-semibold text-lg text-center group-hover:text-white transition-colors'>
                      {category.name}
                    </h3>
                    {category.description && (
                      <p className='text-white/80 text-sm text-center mt-1 line-clamp-2'>
                        {category.description}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default CategoryGrid
