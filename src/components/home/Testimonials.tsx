// components/home/Testimonials.tsx
'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react'

const testimonials = [
  {
    id: 1,
    name: 'Sarah Chen',
    role: 'Interior Designer',
    location: 'New York, USA',
    image: 'https://picsum.photos/id/60/10',
    rating: 5,
    text: 'The quality of furniture exceeded my expectations. The modern designs perfectly complement my projects, and my clients are always impressed.',
    verified: true,
    purchase: 'Living Room Set',
  },
  {
    id: 2,
    name: 'Marcus Rodriguez',
    role: 'Home Owner',
    location: 'Miami, USA',
    image: 'https://picsum.photos/id/60/9',
    rating: 5,
    text: 'From browsing to delivery, the experience was seamless. The pieces are not only beautiful but incredibly durable. Worth every penny!',
    verified: true,
    purchase: 'Bedroom Collection',
  },
  {
    id: 3,
    name: 'Emily Thompson',
    role: 'Architect',
    location: 'London, UK',
    image: 'https://picsum.photos/id/60/8',
    rating: 5,
    text: 'As an architect, I appreciate attention to detail. This company delivers exceptional craftsmanship with sustainable materials.',
    verified: true,
    purchase: 'Office Furniture',
  },
  {
    id: 4,
    name: 'James Wilson',
    role: 'Restaurant Owner',
    location: 'Sydney, Australia',
    image: 'https://picsum.photos/id/60/4',
    rating: 5,
    text: 'Furnished my entire restaurant with their commercial collection. The pieces withstand heavy use while maintaining their elegance.',
    verified: true,
    purchase: 'Commercial Collection',
  },
  {
    id: 5,
    name: 'Lisa Wang',
    role: 'Real Estate Developer',
    location: 'Vancouver, Canada',
    image: 'https://picsum.photos/id/60/5',
    rating: 5,
    text: 'Perfect for staging luxury properties. The furniture adds that wow factor that helps close deals faster. Exceptional quality!',
    verified: true,
    purchase: 'Luxury Collection',
  },
  {
    id: 6,
    name: 'David Park',
    role: 'Tech Entrepreneur',
    location: 'San Francisco, USA',
    image: 'https://picsum.photos/id/60/6',
    rating: 5,
    text: 'Transformed my workspace into an inspiring environment. The ergonomic designs boost productivity and comfort simultaneously.',
    verified: true,
    purchase: 'Ergonomic Series',
  },
]

const Testimonials = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) =>
      prev === testimonials.length - 1 ? 0 : prev + 1
    )
  }

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1
    )
  }

  const goToTestimonial = (index: number) => {
    setCurrentTestimonial(index)
  }

  return (
    <section className='py-20 bg-gradient-to-br from-slate-50 to-blue-50'>
      <div className='container mx-auto px-6'>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className='text-center mb-16'
        >
          <div className='inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full text-blue-700 mb-4'>
            <Quote className='h-4 w-4' />
            <span className='text-sm font-semibold'>Customer Stories</span>
          </div>
          <h2 className='text-4xl md:text-5xl font-bold text-gray-900 mb-4'>
            Loved by Thousands
          </h2>
          <p className='text-xl text-gray-600 max-w-2xl mx-auto'>
            Discover why our customers rave about their experience with our
            premium furniture collection
          </p>
        </motion.div>

        {/* Main Testimonial Carousel */}
        <div className='max-w-6xl mx-auto mb-12'>
          <div className='relative'>
            <AnimatePresence mode='wait'>
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className='bg-white rounded-3xl shadow-2xl p-8 md:p-12'
              >
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 items-center'>
                  {/* Testimonial Content */}
                  <div className='space-y-6'>
                    <div className='flex gap-1'>
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className='h-6 w-6 fill-yellow-400 text-yellow-400'
                        />
                      ))}
                    </div>

                    <Quote className='h-12 w-12 text-blue-100' />

                    <blockquote className='text-2xl md:text-3xl font-semibold text-gray-900 leading-tight'>
                      &quot;{testimonials[currentTestimonial].text}&quot;
                    </blockquote>

                    <div className='space-y-2'>
                      <div className='flex items-center gap-3'>
                        <div className='h-12 w-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold'>
                          {testimonials[currentTestimonial].name.charAt(0)}
                        </div>
                        <div>
                          <h4 className='font-semibold text-gray-900'>
                            {testimonials[currentTestimonial].name}
                          </h4>
                          <p className='text-gray-600'>
                            {testimonials[currentTestimonial].role}
                          </p>
                        </div>
                      </div>
                      <div className='flex items-center gap-4 text-sm text-gray-500'>
                        <span>{testimonials[currentTestimonial].location}</span>
                        <span>•</span>
                        <span className='flex items-center gap-1'>
                          Verified Purchase
                        </span>
                        <span>•</span>
                        <span>{testimonials[currentTestimonial].purchase}</span>
                      </div>
                    </div>
                  </div>

                  {/* Customer Image */}
                  <div className='relative'>
                    <div className='aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100'>
                      <div className='w-full h-full flex items-center justify-center text-blue-300'>
                        <Quote className='h-24 w-24' />
                      </div>
                    </div>
                    <div className='absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-lg p-4'>
                      <div className='flex items-center gap-2 text-green-600'>
                        <div className='h-3 w-3 bg-green-500 rounded-full'></div>
                        <span className='text-sm font-semibold'>Verified</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            <Button
              onClick={prevTestimonial}
              variant='ghost'
              size='icon'
              className='absolute -left-4 top-1/2 transform -translate-y-1/2 bg-white shadow-lg hover:bg-gray-50 rounded-full w-12 h-12'
            >
              <ChevronLeft className='h-6 w-6' />
            </Button>
            <Button
              onClick={nextTestimonial}
              variant='ghost'
              size='icon'
              className='absolute -right-4 top-1/2 transform -translate-y-1/2 bg-white shadow-lg hover:bg-gray-50 rounded-full w-12 h-12'
            >
              <ChevronRight className='h-6 w-6' />
            </Button>
          </div>

          {/* Indicators */}
          <div className='flex justify-center gap-3 mt-8'>
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToTestimonial(index)}
                aria-label={`Go to testimonial ${index + 1}`}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  currentTestimonial === index
                    ? 'bg-blue-600 scale-125'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Additional Testimonials Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
        >
          {testimonials.slice(0, 3).map((testimonial) => (
            <Card
              key={testimonial.id}
              className='border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2'
            >
              <CardContent className='p-6'>
                <div className='flex gap-1 mb-4'>
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className='h-4 w-4 fill-yellow-400 text-yellow-400'
                    />
                  ))}
                </div>
                <p className='text-gray-700 mb-4 line-clamp-3'>
                  &quot;{testimonial.text}&quot;
                </p>
                <div className='flex items-center gap-3'>
                  <div className='h-10 w-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm'>
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className='font-semibold text-gray-900 text-sm'>
                      {testimonial.name}
                    </h4>
                    <p className='text-gray-600 text-xs'>{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className='grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-12 border-t border-gray-200'
        >
          {[
            { number: '50K+', label: 'Happy Customers' },
            { number: '4.9/5', label: 'Average Rating' },
            { number: '98%', label: 'Recommend Us' },
            { number: '24/7', label: 'Customer Support' },
          ].map((stat, index) => (
            <div key={index} className='text-center'>
              <div className='text-3xl md:text-4xl font-bold text-gray-900 mb-2'>
                {stat.number}
              </div>
              <div className='text-gray-600 font-medium'>{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default Testimonials
