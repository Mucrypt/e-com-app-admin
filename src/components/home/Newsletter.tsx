// components/home/Newsletter.tsx
'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Mail, Check } from 'lucide-react'

const Newsletter = () => {
  const [email, setEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate subscription
    setIsSubscribed(true)
    setEmail('')
    // Reset after 3 seconds
    setTimeout(() => setIsSubscribed(false), 3000)
  }

  return (
    <section className='py-20 bg-gradient-to-br from-gray-900 to-black text-white'>
      <div className='container mx-auto px-6'>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className='max-w-4xl mx-auto text-center'
        >
          <Mail className='h-16 w-16 mx-auto mb-6 text-blue-400' />
          <h2 className='text-4xl md:text-5xl font-bold mb-6'>
            Stay in the Loop
          </h2>
          <p className='text-xl text-gray-300 mb-8 max-w-2xl mx-auto'>
            Subscribe to our newsletter and be the first to know about exclusive
            deals, new arrivals, and design inspiration.
          </p>

          {!isSubscribed ? (
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handleSubmit}
              className='flex flex-col sm:flex-row gap-4 max-w-md mx-auto'
            >
              <Input
                type='email'
                placeholder='Enter your email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className='bg-white/10 border-white/20 text-white placeholder-gray-400 flex-1 py-3 px-4 rounded-lg focus:ring-2 focus:ring-blue-400'
              />
              <Button
                type='submit'
                size='lg'
                className='bg-blue-600 hover:bg-blue-700 text-white py-3 px-8 rounded-lg text-lg font-semibold transition-colors'
              >
                Subscribe
              </Button>
            </motion.form>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className='flex items-center justify-center gap-3 text-green-400 text-xl font-semibold'
            >
              <Check className='h-6 w-6' />
              Thank you for subscribing!
            </motion.div>
          )}

          <p className='text-sm text-gray-400 mt-4'>
            By subscribing, you agree to our Privacy Policy and consent to
            receive updates from our company.
          </p>
        </motion.div>
      </div>
    </section>
  )
}

export default Newsletter
