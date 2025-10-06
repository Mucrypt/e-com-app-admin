// components/home/FeaturedProducts.tsx
'use client'
import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Heart, Star, ShoppingCart, Eye } from 'lucide-react'

const products = [
  {
    id: 1,
    name: 'Modern Leather Sofa',
    price: 1299,
    originalPrice: 1599,
    image: '/images/products/sofa.jpg',
    rating: 4.8,
    reviews: 124,
    isNew: true,
    isHot: false,
    discount: 20,
  },
  {
    id: 2,
    name: 'Minimalist Coffee Table',
    price: 299,
    originalPrice: 399,
    image: '/images/products/coffee-table.jpg',
    rating: 4.6,
    reviews: 89,
    isNew: false,
    isHot: true,
    discount: 25,
  },
  {
    id: 3,
    name: 'Ergonomic Office Chair',
    price: 499,
    originalPrice: 599,
    image: '/images/products/office-chair.jpg',
    rating: 4.9,
    reviews: 203,
    isNew: true,
    isHot: false,
    discount: 15,
  },
  {
    id: 4,
    name: 'Smart LED Floor Lamp',
    price: 159,
    originalPrice: 199,
    image: '/images/products/lamp.jpg',
    rating: 4.7,
    reviews: 67,
    isNew: false,
    isHot: true,
    discount: 20,
  },
  {
    id: 5,
    name: 'King Size Memory Foam Mattress',
    price: 899,
    originalPrice: 1199,
    image: '/images/products/mattress.jpg',
    rating: 4.8,
    reviews: 156,
    isNew: false,
    isHot: false,
    discount: 25,
  },
  {
    id: 6,
    name: 'Designer Bookshelf',
    price: 459,
    originalPrice: 599,
    image: '/images/products/bookshelf.jpg',
    rating: 4.5,
    reviews: 78,
    isNew: true,
    isHot: false,
    discount: 23,
  },
]

const FeaturedProducts = () => {
  const [favorites, setFavorites] = useState<number[]>([])

  const toggleFavorite = (productId: number) => {
    setFavorites((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    )
  }

  return (
    <section className='py-20 bg-white'>
      <div className='container mx-auto px-6'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className='text-center mb-16'
        >
          <Badge variant='secondary' className='mb-4 px-4 py-1 text-sm'>
            Featured Collection
          </Badge>
          <h2 className='text-4xl md:text-5xl font-bold text-gray-900 mb-4'>
            Best Selling Products
          </h2>
          <p className='text-xl text-gray-600 max-w-2xl mx-auto'>
            Discover our most loved products curated for exceptional quality and
            style
          </p>
        </motion.div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className='group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden'
            >
              <div className='relative overflow-hidden'>
                <div className='aspect-square relative'>
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className='object-cover group-hover:scale-105 transition-transform duration-500'
                  />

                  {/* Badges */}
                  <div className='absolute top-4 left-4 flex gap-2'>
                    {product.isNew && (
                      <Badge className='bg-green-500 hover:bg-green-600'>
                        New
                      </Badge>
                    )}
                    {product.isHot && <Badge variant='destructive'>Hot</Badge>}
                    {product.discount > 0 && (
                      <Badge
                        variant='secondary'
                        className='bg-orange-500 text-white'
                      >
                        -{product.discount}%
                      </Badge>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className='absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                    <Button
                      variant='ghost'
                      size='icon'
                      className='bg-white/90 hover:bg-white rounded-full shadow-lg'
                      onClick={() => toggleFavorite(product.id)}
                    >
                      <Heart
                        className={`h-4 w-4 ${
                          favorites.includes(product.id)
                            ? 'fill-red-500 text-red-500'
                            : ''
                        }`}
                      />
                    </Button>
                    <Button
                      variant='ghost'
                      size='icon'
                      className='bg-white/90 hover:bg-white rounded-full shadow-lg'
                    >
                      <Eye className='h-4 w-4' />
                    </Button>
                  </div>

                  {/* Add to Cart Button */}
                  <div className='absolute bottom-4 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                    <Button className='bg-black text-white hover:bg-gray-800 rounded-full px-6 shadow-lg'>
                      <ShoppingCart className='h-4 w-4 mr-2' />
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </div>

              <div className='p-6'>
                <h3 className='font-semibold text-lg mb-2 group-hover:text-blue-600 transition-colors'>
                  {product.name}
                </h3>

                {/* Rating */}
                <div className='flex items-center gap-2 mb-3'>
                  <div className='flex items-center gap-1'>
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(product.rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className='text-sm text-gray-600'>
                    ({product.reviews})
                  </span>
                </div>

                {/* Price */}
                <div className='flex items-center gap-3'>
                  <span className='text-2xl font-bold text-gray-900'>
                    ${product.price}
                  </span>
                  {product.originalPrice > product.price && (
                    <span className='text-lg text-gray-500 line-through'>
                      ${product.originalPrice}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className='text-center mt-12'
        >
          <Button
            size='lg'
            className='px-8 py-3 text-lg bg-black hover:bg-gray-800'
          >
            View All Products
          </Button>
        </motion.div>
      </div>
    </section>
  )
}

export default FeaturedProducts
