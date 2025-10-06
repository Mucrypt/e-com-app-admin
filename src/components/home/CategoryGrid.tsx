"use client"
// components/home/CategoryGrid.tsx
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

const categories = [
  {
    id: 1,
    name: 'Living Room',
    image: '/images/categories/living-room.jpg',
    items: '2,345 items',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 2,
    name: 'Bedroom',
    image: '/images/categories/bedroom.jpg',
    items: '1,892 items',
    color: 'from-purple-500 to-pink-500',
  },
  {
    id: 3,
    name: 'Kitchen',
    image: '/images/categories/kitchen.jpg',
    items: '3,127 items',
    color: 'from-orange-500 to-red-500',
  },
  {
    id: 4,
    name: 'Office',
    image: '/images/categories/office.jpg',
    items: '1,456 items',
    color: 'from-green-500 to-emerald-500',
  },
  {
    id: 5,
    name: 'Outdoor',
    image: '/images/categories/outdoor.jpg',
    items: '987 items',
    color: 'from-teal-500 to-blue-500',
  },
  {
    id: 6,
    name: 'Lighting',
    image: '/images/categories/lighting.jpg',
    items: '2,134 items',
    color: 'from-yellow-500 to-orange-500',
  },
]

const CategoryGrid = () => {
  return (
    <section className='py-20 bg-gray-50'>
      <div className='container mx-auto px-6'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className='text-center mb-16'
        >
          <h2 className='text-4xl md:text-5xl font-bold text-gray-900 mb-4'>
            Shop by Category
          </h2>
          <p className='text-xl text-gray-600 max-w-2xl mx-auto'>
            Discover perfect pieces for every room in your home
          </p>
        </motion.div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className='group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500'
            >
              <Link href={`/category/${category.id}`}>
                <div className='aspect-square relative overflow-hidden'>
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className='object-cover group-hover:scale-110 transition-transform duration-500'
                  />
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-20 group-hover:opacity-30 transition-opacity duration-300`}
                  />

                  {/* Content */}
                  <div className='absolute inset-0 flex flex-col justify-end p-8 text-white'>
                    <h3 className='text-2xl font-bold mb-2'>{category.name}</h3>
                    <p className='text-white/80 mb-4'>{category.items}</p>
                    <Button
                      variant='ghost'
                      className='w-fit text-white hover:bg-white/20 px-0 group/btn'
                    >
                      Explore
                      <ArrowRight className='ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform' />
                    </Button>
                  </div>

                  {/* Hover Overlay */}
                  <div className='absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300' />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className='text-center mt-12'
        >
          <Button size='lg' variant='outline' className='px-8 py-3 text-lg'>
            View All Categories
          </Button>
        </motion.div>
      </div>
    </section>
  )
}

export default CategoryGrid
