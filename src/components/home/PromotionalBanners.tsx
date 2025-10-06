"use client"
// components/home/PromotionalBanners.tsx
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRight, Truck, Shield, Headphones, Award } from 'lucide-react'

const banners = [
  {
    id: 1,
    title: 'Summer Collection',
    subtitle: 'Refresh your space with modern designs',
    image: '/images/banners/summer-collection.jpg',
    cta: 'Shop Now',
    theme: 'from-cyan-500 to-blue-600',
  },
  {
    id: 2,
    title: 'Limited Time Offer',
    subtitle: 'Up to 60% off selected items',
    image: '/images/banners/sale-banner.jpg',
    cta: 'Discover Deals',
    theme: 'from-orange-500 to-red-500',
  },
]

const features = [
  {
    icon: Truck,
    title: 'Free Shipping',
    description: 'Free delivery on orders over $99',
  },
  {
    icon: Shield,
    title: '2-Year Warranty',
    description: 'Comprehensive product protection',
  },
  {
    icon: Headphones,
    title: '24/7 Support',
    description: 'Always here to help you',
  },
  {
    icon: Award,
    title: 'Premium Quality',
    description: 'Curated excellence guaranteed',
  },
]

const PromotionalBanners = () => {
  return (
    <section className='py-20 bg-gray-50'>
      <div className='container mx-auto px-6'>
        {/* Promotional Banners */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20'>
          {banners.map((banner, index) => (
            <motion.div
              key={banner.id}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: index * 0.2 }}
              className='group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500'
            >
              <div className='aspect-[2/1] relative'>
                <Image
                  src={banner.image}
                  alt={banner.title}
                  fill
                  className='object-cover group-hover:scale-105 transition-transform duration-500'
                />
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${banner.theme} opacity-80`}
                />

                <div className='absolute inset-0 flex flex-col justify-center p-12 text-white'>
                  <h3 className='text-3xl md:text-4xl font-bold mb-4'>
                    {banner.title}
                  </h3>
                  <p className='text-xl opacity-90 mb-6'>{banner.subtitle}</p>
                  <Button
                    size='lg'
                    variant='outline'
                    className='w-fit border-white text-white hover:bg-white hover:text-black px-8 py-3 text-lg group/btn'
                  >
                    {banner.cta}
                    <ArrowRight className='ml-2 h-5 w-5 group-hover/btn:translate-x-1 transition-transform' />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className='text-center group p-8 rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500'
            >
              <div className='inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-6 group-hover:bg-blue-200 transition-colors duration-300'>
                <feature.icon className='h-8 w-8 text-blue-600' />
              </div>
              <h4 className='text-xl font-semibold mb-3 text-gray-900'>
                {feature.title}
              </h4>
              <p className='text-gray-600'>{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default PromotionalBanners
