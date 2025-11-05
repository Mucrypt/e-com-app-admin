'use client'
import React, { useState } from 'react'
import Topbar from '@/components/layout/Topbar'
import Navbar from '@/components/common/Navbar'
import Footer from '@/components/layout/Footer'
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaHeadset, FaPaperPlane } from 'react-icons/fa'

const ContactUsPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    setTimeout(() => {
      alert('Thank you for your message! We will get back to you soon.')
      setFormData({ name: '', email: '', subject: '', message: '' })
      setIsSubmitting(false)
    }, 2000)
  }

  const contactInfo = [
    {
      icon: <FaPhone className='h-6 w-6' />,
      title: 'Phone',
      info: '+39 (333) 219-000-6',
      subtitle: 'Mon-Fri 9 AM - 6 PM CET',
      href: 'tel:+393332190006'
    },
    {
      icon: <FaEnvelope className='h-6 w-6' />,
      title: 'Email',
      info: 'info@mukulah.com',
      subtitle: '24/7 Support Available',
      href: 'mailto:info@mukulah.com'
    },
    {
      icon: <FaMapMarkerAlt className='h-6 w-6' />,
      title: 'Address',
      info: '123 Fashion Street',
      subtitle: 'Milan, Italy 20100',
      href: '#'
    },
    {
      icon: <FaClock className='h-6 w-6' />,
      title: 'Business Hours',
      info: 'Mon-Fri: 9 AM - 6 PM',
      subtitle: 'Sat-Sun: 10 AM - 4 PM',
      href: '#'
    }
  ]

  return (
    <>
      <Topbar />
      <Navbar />
      <main className='min-h-screen bg-gray-50'>
        {/* Hero Section */}
        <div className='bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16'>
          <div className='container mx-auto px-6 text-center'>
            <h1 className='text-4xl md:text-5xl font-bold mb-4'>
              Contact Us
            </h1>
            <p className='text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto'>
              We'd love to hear from you. Get in touch with our team for any questions, support, or feedback.
            </p>
          </div>
        </div>

        <div className='container mx-auto px-6 py-16'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-12'>
            {/* Contact Form */}
            <div className='bg-white rounded-lg shadow-lg p-8'>
              <div className='flex items-center mb-6'>
                <FaHeadset className='h-8 w-8 text-blue-600 mr-3' />
                <h2 className='text-2xl font-bold text-gray-800'>Send us a Message</h2>
              </div>
              
              <form onSubmit={handleSubmit} className='space-y-6'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div>
                    <label htmlFor='name' className='block text-sm font-medium text-gray-700 mb-2'>
                      Full Name *
                    </label>
                    <input
                      type='text'
                      id='name'
                      name='name'
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                      placeholder='Your full name'
                    />
                  </div>
                  
                  <div>
                    <label htmlFor='email' className='block text-sm font-medium text-gray-700 mb-2'>
                      Email Address *
                    </label>
                    <input
                      type='email'
                      id='email'
                      name='email'
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                      placeholder='your@email.com'
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor='subject' className='block text-sm font-medium text-gray-700 mb-2'>
                    Subject *
                  </label>
                  <select
                    id='subject'
                    name='subject'
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  >
                    <option value=''>Select a subject</option>
                    <option value='general'>General Inquiry</option>
                    <option value='order'>Order Support</option>
                    <option value='product'>Product Information</option>
                    <option value='shipping'>Shipping & Delivery</option>
                    <option value='returns'>Returns & Exchanges</option>
                    <option value='technical'>Technical Support</option>
                    <option value='feedback'>Feedback</option>
                  </select>
                </div>

                <div>
                  <label htmlFor='message' className='block text-sm font-medium text-gray-700 mb-2'>
                    Message *
                  </label>
                  <textarea
                    id='message'
                    name='message'
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none'
                    placeholder='Please provide details about your inquiry...'
                  />
                </div>

                <button
                  type='submit'
                  disabled={isSubmitting}
                  className='w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  {isSubmitting ? (
                    <>
                      <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white'></div>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <FaPaperPlane className='h-5 w-5' />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div className='space-y-8'>
              <div className='bg-white rounded-lg shadow-lg p-8'>
                <h3 className='text-2xl font-bold text-gray-800 mb-6'>Get in Touch</h3>
                <div className='space-y-6'>
                  {contactInfo.map((item, index) => (
                    <div key={index} className='flex items-start space-x-4'>
                      <div className='bg-blue-100 p-3 rounded-lg'>
                        <div className='text-blue-600'>
                          {item.icon}
                        </div>
                      </div>
                      <div>
                        <h4 className='font-semibold text-gray-800'>{item.title}</h4>
                        {item.href !== '#' ? (
                          <a href={item.href} className='text-blue-600 hover:text-blue-800 transition-colors'>
                            {item.info}
                          </a>
                        ) : (
                          <p className='text-gray-600'>{item.info}</p>
                        )}
                        <p className='text-sm text-gray-500'>{item.subtitle}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* FAQ Link */}
              <div className='bg-gradient-to-r from-green-500 to-blue-600 rounded-lg shadow-lg p-8 text-white'>
                <h3 className='text-xl font-bold mb-4'>Frequently Asked Questions</h3>
                <p className='mb-6'>
                  Before reaching out, you might find your answer in our comprehensive FAQ section.
                </p>
                <a
                  href='/faqs'
                  className='inline-flex items-center bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors'
                >
                  <FaHeadset className='mr-2' />
                  View FAQs
                </a>
              </div>

              {/* Emergency Contact */}
              <div className='bg-red-50 border border-red-200 rounded-lg p-6'>
                <h3 className='text-lg font-semibold text-red-800 mb-2'>Emergency Support</h3>
                <p className='text-red-700 mb-4'>
                  For urgent order issues or account problems, call us directly:
                </p>
                <a
                  href='tel:+393332190006'
                  className='inline-flex items-center bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors'
                >
                  <FaPhone className='mr-2' />
                  +39 (333) 219-000-6
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default ContactUsPage