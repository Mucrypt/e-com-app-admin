'use client'
import React from 'react'
import Link from 'next/link'
import Topbar from '@/components/layout/Topbar'
import Navbar from '@/components/common/Navbar'
import Footer from '@/components/layout/Footer'
import { FaHeadset, FaQuestionCircle, FaShippingFast, FaExchangeAlt, FaSearch, FaGift, FaRuler } from 'react-icons/fa'

const CustomerServicePage = () => {
  const serviceCards = [
    {
      title: 'Contact Us',
      description: 'Get in touch with our customer support team for any questions or concerns.',
      icon: <FaHeadset className='h-8 w-8 text-blue-600' />,
      href: '/contact-us',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      title: 'FAQs',
      description: 'Find answers to the most frequently asked questions about our services.',
      icon: <FaQuestionCircle className='h-8 w-8 text-green-600' />,
      href: '/faqs',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      title: 'Shipping Policy',
      description: 'Learn about our shipping options, delivery times, and shipping costs.',
      icon: <FaShippingFast className='h-8 w-8 text-purple-600' />,
      href: '/shipping-policy',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
    {
      title: 'Returns & Exchanges',
      description: 'Information about our return policy and how to exchange products.',
      icon: <FaExchangeAlt className='h-8 w-8 text-orange-600' />,
      href: '/returns-exchanges',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
    },
    {
      title: 'Order Tracking',
      description: 'Track your order status and delivery progress in real-time.',
      icon: <FaSearch className='h-8 w-8 text-red-600' />,
      href: '/order-tracking',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200'
    },
    {
      title: 'Size Guide',
      description: 'Find the perfect fit with our comprehensive sizing charts and guides.',
      icon: <FaRuler className='h-8 w-8 text-indigo-600' />,
      href: '/size-guide',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200'
    },
    {
      title: 'Gift Cards',
      description: 'Purchase gift cards or redeem existing ones for your purchases.',
      icon: <FaGift className='h-8 w-8 text-pink-600' />,
      href: '/gift-cards',
      bgColor: 'bg-pink-50',
      borderColor: 'border-pink-200'
    }
  ]

  return (
    <>
      <Topbar />
      <Navbar />
      <main className='min-h-screen bg-gray-50'>
        {/* Hero Section */}
        <div className='bg-gradient-to-r from-blue-600 to-purple-700 text-white py-16'>
          <div className='container mx-auto px-6 text-center'>
            <h1 className='text-4xl md:text-5xl font-bold mb-4'>
              Customer Service Center
            </h1>
            <p className='text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto'>
              We're here to help you with any questions or concerns. Choose from the options below to get the assistance you need.
            </p>
          </div>
        </div>

        {/* Service Cards */}
        <div className='container mx-auto px-6 py-16'>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {serviceCards.map((card, index) => (
              <Link
                key={index}
                href={card.href}
                className={`block p-8 rounded-lg border-2 ${card.bgColor} ${card.borderColor} hover:shadow-lg transition-all duration-300 hover:scale-105`}
              >
                <div className='flex flex-col items-center text-center space-y-4'>
                  <div className='p-4 bg-white rounded-full shadow-md'>
                    {card.icon}
                  </div>
                  <h3 className='text-xl font-semibold text-gray-800'>
                    {card.title}
                  </h3>
                  <p className='text-gray-600 leading-relaxed'>
                    {card.description}
                  </p>
                  <span className='inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800'>
                    Learn More →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Contact Information */}
        <div className='bg-white py-16'>
          <div className='container mx-auto px-6'>
            <div className='text-center mb-12'>
              <h2 className='text-3xl font-bold text-gray-800 mb-4'>
                Need Immediate Assistance?
              </h2>
              <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
                Our customer service team is available to help you with any urgent matters.
              </p>
            </div>
            
            <div className='grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto'>
              <div className='text-center p-6'>
                <div className='bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4'>
                  <FaHeadset className='h-8 w-8 text-blue-600' />
                </div>
                <h3 className='text-lg font-semibold text-gray-800 mb-2'>Phone Support</h3>
                <p className='text-gray-600 mb-2'>Mon-Fri: 9 AM - 6 PM</p>
                <a href='tel:+393332190006' className='text-blue-600 hover:text-blue-800 font-medium'>
                  +39 (333) 219-000-6
                </a>
              </div>
              
              <div className='text-center p-6'>
                <div className='bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4'>
                  <FaQuestionCircle className='h-8 w-8 text-green-600' />
                </div>
                <h3 className='text-lg font-semibold text-gray-800 mb-2'>Email Support</h3>
                <p className='text-gray-600 mb-2'>24/7 Response</p>
                <a href='mailto:info@mukulah.com' className='text-blue-600 hover:text-blue-800 font-medium'>
                  info@mukulah.com
                </a>
              </div>
              
              <div className='text-center p-6'>
                <div className='bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4'>
                  <FaSearch className='h-8 w-8 text-purple-600' />
                </div>
                <h3 className='text-lg font-semibold text-gray-800 mb-2'>Live Chat</h3>
                <p className='text-gray-600 mb-2'>Available Online</p>
                <button className='text-blue-600 hover:text-blue-800 font-medium'>
                  Start Chat
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default CustomerServicePage