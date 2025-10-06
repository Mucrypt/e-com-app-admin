"use client"
// components/home/BlogSection.tsx
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock, User, ArrowRight, Eye, Heart } from 'lucide-react'

const blogPosts = [
  {
    id: 1,
    title: 'Modern Minimalism: Transforming Small Spaces',
    excerpt:
      'Discover how to maximize your living area with smart furniture choices and minimalist design principles that create the illusion of space.',
    image: '/images/blog/minimalism.jpg',
    category: 'Interior Design',
    readTime: '6 min read',
    author: 'Emma Davis',
    date: 'Dec 15, 2024',
    views: '2.4K',
    likes: 128,
    featured: true,
  },
  {
    id: 2,
    title: 'Sustainable Furniture: The Future of Home Decor',
    excerpt:
      'Explore eco-friendly materials and sustainable practices that are revolutionizing the furniture industry while protecting our planet.',
    image: '/images/blog/sustainable.jpg',
    category: 'Sustainability',
    readTime: '8 min read',
    author: 'Michael Chen',
    date: 'Dec 12, 2024',
    views: '1.8K',
    likes: 96,
    featured: false,
  },
  {
    id: 3,
    title: 'Color Psychology in Home Design',
    excerpt:
      'Learn how different colors affect mood and behavior, and how to choose the perfect palette for each room in your home.',
    image: '/images/blog/color-psychology.jpg',
    category: 'Design Tips',
    readTime: '5 min read',
    author: 'Sophia Williams',
    date: 'Dec 8, 2024',
    views: '3.1K',
    likes: 215,
    featured: false,
  },
  {
    id: 4,
    title: 'Smart Home Integration with Modern Furniture',
    excerpt:
      'How to seamlessly incorporate technology into your furniture for a connected, convenient, and futuristic living experience.',
    image: '/images/blog/smart-home.jpg',
    category: 'Technology',
    readTime: '7 min read',
    author: 'Alex Rodriguez',
    date: 'Dec 5, 2024',
    views: '2.7K',
    likes: 178,
    featured: false,
  },
  {
    id: 5,
    title: 'The Art of Mixing Vintage and Contemporary',
    excerpt:
      'Master the technique of blending antique pieces with modern furniture to create a unique and timeless interior aesthetic.',
    image: '/images/blog/vintage-modern.jpg',
    category: 'Style Guide',
    readTime: '9 min read',
    author: 'Lisa Thompson',
    date: 'Dec 1, 2024',
    views: '1.5K',
    likes: 89,
    featured: false,
  },
  {
    id: 6,
    title: 'Ergonomic Home Office Setup for Productivity',
    excerpt:
      'Create the perfect work-from-home environment with ergonomic furniture that boosts productivity and supports your wellbeing.',
    image: '/images/blog/home-office.jpg',
    category: 'Workspace',
    readTime: '6 min read',
    author: 'David Park',
    date: 'Nov 28, 2024',
    views: '4.2K',
    likes: 312,
    featured: true,
  },
]

const BlogSection = () => {
  const featuredPost = blogPosts.find((post) => post.featured)
  const regularPosts = blogPosts.filter((post) => !post.featured).slice(0, 3)

  return (
    <section className='py-20 bg-white'>
      <div className='container mx-auto px-6'>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className='text-center mb-16'
        >
          <Badge
            variant='outline'
            className='mb-4 px-4 py-1 text-sm border-blue-200 text-blue-700'
          >
            Design Inspiration
          </Badge>
          <h2 className='text-4xl md:text-5xl font-bold text-gray-900 mb-4'>
            Latest from Our Blog
          </h2>
          <p className='text-xl text-gray-600 max-w-2xl mx-auto'>
            Discover design tips, trends, and inspiration to transform your
            living spaces
          </p>
        </motion.div>

        <div className='grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12'>
          {/* Featured Post */}
          {featuredPost && (
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className='lg:col-span-2'
            >
              <Card className='border-0 shadow-lg hover:shadow-2xl transition-all duration-500 group overflow-hidden'>
                <div className='relative aspect-[4/3] overflow-hidden'>
                  <div className='w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center'>
                    <div className='text-gray-400 text-center'>
                      <div className='text-4xl mb-2'>📝</div>
                      <div className='text-sm'>Featured Blog Post</div>
                    </div>
                  </div>
                  <div className='absolute top-4 left-4'>
                    <Badge className='bg-red-500 hover:bg-red-600 text-white'>
                      Featured
                    </Badge>
                  </div>
                  <div className='absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300' />
                </div>
                <CardContent className='p-6'>
                  <Badge variant='secondary' className='mb-4'>
                    {featuredPost.category}
                  </Badge>
                  <h3 className='text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors'>
                    {featuredPost.title}
                  </h3>
                  <p className='text-gray-600 mb-4 line-clamp-2'>
                    {featuredPost.excerpt}
                  </p>
                  <div className='flex items-center gap-4 text-sm text-gray-500 mb-4'>
                    <div className='flex items-center gap-1'>
                      <User className='h-4 w-4' />
                      {featuredPost.author}
                    </div>
                    <div className='flex items-center gap-1'>
                      <Calendar className='h-4 w-4' />
                      {featuredPost.date}
                    </div>
                    <div className='flex items-center gap-1'>
                      <Clock className='h-4 w-4' />
                      {featuredPost.readTime}
                    </div>
                  </div>
                  <div className='flex items-center gap-4 text-sm text-gray-500'>
                    <div className='flex items-center gap-1'>
                      <Eye className='h-4 w-4' />
                      {featuredPost.views}
                    </div>
                    <div className='flex items-center gap-1'>
                      <Heart className='h-4 w-4' />
                      {featuredPost.likes}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className='px-6 pb-6 pt-0'>
                  <Button
                    variant='ghost'
                    className='group/btn px-0 text-blue-600 hover:text-blue-700'
                  >
                    Read Full Article
                    <ArrowRight className='ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform' />
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          )}

          {/* Regular Posts */}
          <div className='lg:col-span-2 space-y-6'>
            {regularPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: index * 0.1 }}
              >
                <Card className='border-0 shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden'>
                  <div className='flex flex-col sm:flex-row'>
                    <div className='sm:w-32 sm:h-32 w-full h-48 sm:flex-shrink-0 relative overflow-hidden'>
                      <div className='w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center'>
                        <div className='text-gray-400 text-center'>
                          <div className='text-2xl mb-1'>📖</div>
                          <div className='text-xs'>Blog Post</div>
                        </div>
                      </div>
                      <div className='absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300' />
                    </div>
                    <div className='flex-1 p-6'>
                      <Badge variant='outline' className='mb-2 text-xs'>
                        {post.category}
                      </Badge>
                      <h4 className='font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2'>
                        {post.title}
                      </h4>
                      <p className='text-gray-600 text-sm mb-3 line-clamp-2'>
                        {post.excerpt}
                      </p>
                      <div className='flex items-center justify-between text-xs text-gray-500'>
                        <div className='flex items-center gap-3'>
                          <span>{post.date}</span>
                          <span>•</span>
                          <span>{post.readTime}</span>
                        </div>
                        <div className='flex items-center gap-2'>
                          <Eye className='h-3 w-3' />
                          <span>{post.views}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Additional Blog Posts Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-12'
        >
          {blogPosts.slice(3).map((post) => (
            <Card
              key={post.id}
              className='border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group overflow-hidden'
            >
              <div className='relative aspect-video overflow-hidden'>
                <div className='w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center'>
                  <div className='text-gray-400 text-center'>
                    <div className='text-3xl mb-2'>✨</div>
                    <div className='text-sm'>Blog Post</div>
                  </div>
                </div>
                <div className='absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300' />
              </div>
              <CardContent className='p-6'>
                <Badge variant='outline' className='mb-3'>
                  {post.category}
                </Badge>
                <h4 className='font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2'>
                  {post.title}
                </h4>
                <p className='text-gray-600 text-sm mb-4 line-clamp-3'>
                  {post.excerpt}
                </p>
                <div className='flex items-center justify-between text-sm text-gray-500'>
                  <span>{post.date}</span>
                  <div className='flex items-center gap-4'>
                    <div className='flex items-center gap-1'>
                      <Eye className='h-3 w-3' />
                      {post.views}
                    </div>
                    <div className='flex items-center gap-1'>
                      <Heart className='h-3 w-3' />
                      {post.likes}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className='text-center'
        >
          <div className='bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-12'>
            <h3 className='text-3xl font-bold text-gray-900 mb-4'>
              Want More Design Inspiration?
            </h3>
            <p className='text-xl text-gray-600 mb-8 max-w-2xl mx-auto'>
              Subscribe to our weekly newsletter and get exclusive content,
              early access to sales, and professional design tips delivered to
              your inbox.
            </p>
            <div className='flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto'>
              <Button
                size='lg'
                className='bg-blue-600 hover:bg-blue-700 text-white px-8'
              >
                Subscribe to Newsletter
              </Button>
              <Button size='lg' variant='outline' className='px-8'>
                Explore All Articles
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default BlogSection
