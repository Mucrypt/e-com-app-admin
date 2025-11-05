'use client'
import React, { useState } from 'react'
import Topbar from '@/components/layout/Topbar'
import Navbar from '@/components/common/Navbar'
import Footer from '@/components/layout/Footer'
import { FaChevronDown, FaChevronUp, FaQuestionCircle, FaSearch, FaShoppingCart, FaTruck, FaExchangeAlt, FaCreditCard, FaUserCircle } from 'react-icons/fa'

interface FAQ {
  id: number
  question: string
  answer: string
  category: string
}

const FAQsPage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [expandedItems, setExpandedItems] = useState<number[]>([])

  const categories = [
    { id: 'all', name: 'All Categories', icon: <FaQuestionCircle /> },
    { id: 'ordering', name: 'Ordering', icon: <FaShoppingCart /> },
    { id: 'shipping', name: 'Shipping', icon: <FaTruck /> },
    { id: 'returns', name: 'Returns', icon: <FaExchangeAlt /> },
    { id: 'payment', name: 'Payment', icon: <FaCreditCard /> },
    { id: 'account', name: 'Account', icon: <FaUserCircle /> }
  ]

  const faqs: FAQ[] = [
    // Ordering
    {
      id: 1,
      category: 'ordering',
      question: 'How do I place an order?',
      answer: 'To place an order, browse our products, add items to your cart, and proceed to checkout. You can create an account or checkout as a guest. Follow the prompts to enter your shipping and payment information to complete your purchase.'
    },
    {
      id: 2,
      category: 'ordering',
      question: 'Can I modify or cancel my order after placing it?',
      answer: 'You can modify or cancel your order within 1 hour of placing it by contacting our customer service team. After this time, we begin processing your order and changes may not be possible.'
    },
    {
      id: 3,
      category: 'ordering',
      question: 'Do you offer bulk or wholesale pricing?',
      answer: 'Yes, we offer special pricing for bulk orders over 50 items and wholesale accounts for businesses. Please contact our sales team at wholesale@mukulah.com for more information.'
    },

    // Shipping
    {
      id: 4,
      category: 'shipping',
      question: 'What are your shipping options and costs?',
      answer: 'We offer standard shipping (5-7 business days) for €5.99, express shipping (2-3 business days) for €12.99, and overnight shipping for €24.99. Free shipping is available on orders over €75.'
    },
    {
      id: 5,
      category: 'shipping',
      question: 'Do you ship internationally?',
      answer: 'Yes, we ship to over 50 countries worldwide. International shipping costs vary by destination and are calculated at checkout. Delivery times typically range from 7-21 business days depending on the location.'
    },
    {
      id: 6,
      category: 'shipping',
      question: 'How can I track my order?',
      answer: 'Once your order ships, you\'ll receive a tracking number via email. You can also track your order by logging into your account and visiting the order tracking page.'
    },

    // Returns
    {
      id: 7,
      category: 'returns',
      question: 'What is your return policy?',
      answer: 'We accept returns within 30 days of purchase for unworn, unwashed items with original tags. Items must be in original condition. Return shipping is free for defective items; otherwise, return shipping costs apply.'
    },
    {
      id: 8,
      category: 'returns',
      question: 'How do I return an item?',
      answer: 'To return an item, log into your account, go to order history, and select "Return Items" next to your order. Print the prepaid return label and send the package back to us. Refunds are processed within 5-10 business days.'
    },
    {
      id: 9,
      category: 'returns',
      question: 'Can I exchange an item instead of returning it?',
      answer: 'Yes, we offer exchanges for different sizes or colors of the same item. You can initiate an exchange through your account or contact customer service. The exchange process typically takes 7-10 business days.'
    },

    // Payment
    {
      id: 10,
      category: 'payment',
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, Apple Pay, Google Pay, and bank transfers. All payments are processed securely through encrypted connections.'
    },
    {
      id: 11,
      category: 'payment',
      question: 'Is it safe to use my credit card on your website?',
      answer: 'Yes, absolutely. We use industry-standard SSL encryption and PCI DSS compliance to protect your payment information. We never store your full credit card details on our servers.'
    },
    {
      id: 12,
      category: 'payment',
      question: 'Do you offer payment plans or financing?',
      answer: 'Yes, we offer installment payment options through Klarna and Afterpay for orders over €100. You can split your purchase into 4 interest-free payments or choose longer-term financing options.'
    },

    // Account
    {
      id: 13,
      category: 'account',
      question: 'Do I need to create an account to shop?',
      answer: 'No, you can checkout as a guest. However, creating an account allows you to track orders, save favorites, manage returns, and enjoy faster checkout for future purchases.'
    },
    {
      id: 14,
      category: 'account',
      question: 'How do I reset my password?',
      answer: 'Click "Forgot Password" on the login page and enter your email address. We\'ll send you a password reset link. If you don\'t receive the email within 10 minutes, check your spam folder or contact support.'
    },
    {
      id: 15,
      category: 'account',
      question: 'Can I change my account information?',
      answer: 'Yes, you can update your account information by logging in and visiting the account settings page. You can change your email, password, shipping addresses, and communication preferences.'
    }
  ]

  const filteredFAQs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const toggleExpanded = (id: number) => {
    setExpandedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
  }

  return (
    <>
      <Topbar />
      <Navbar />
      <main className='min-h-screen bg-gray-50'>
        {/* Hero Section */}
        <div className='bg-gradient-to-r from-green-600 to-blue-600 text-white py-16'>
          <div className='container mx-auto px-6 text-center'>
            <h1 className='text-4xl md:text-5xl font-bold mb-4'>
              Frequently Asked Questions
            </h1>
            <p className='text-xl md:text-2xl text-green-100 max-w-3xl mx-auto'>
              Find quick answers to common questions about our products, shipping, returns, and more.
            </p>
          </div>
        </div>

        <div className='container mx-auto px-6 py-16'>
          {/* Search and Filter */}
          <div className='mb-12'>
            <div className='max-w-2xl mx-auto mb-8'>
              <div className='relative'>
                <FaSearch className='absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5' />
                <input
                  type='text'
                  placeholder='Search FAQs...'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className='w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg'
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className='flex flex-wrap justify-center gap-4'>
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-blue-50 border border-gray-300'
                  }`}
                >
                  {category.icon}
                  <span>{category.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* FAQ Items */}
          <div className='max-w-4xl mx-auto'>
            {filteredFAQs.length === 0 ? (
              <div className='text-center py-12'>
                <FaQuestionCircle className='h-16 w-16 text-gray-400 mx-auto mb-4' />
                <h3 className='text-xl font-semibold text-gray-600 mb-2'>No FAQs found</h3>
                <p className='text-gray-500'>Try adjusting your search terms or category filter.</p>
              </div>
            ) : (
              <div className='space-y-4'>
                {filteredFAQs.map((faq) => (
                  <div key={faq.id} className='bg-white rounded-lg shadow-md overflow-hidden'>
                    <button
                      onClick={() => toggleExpanded(faq.id)}
                      className='w-full px-6 py-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors'
                    >
                      <h3 className='text-lg font-semibold text-gray-800 pr-4'>
                        {faq.question}
                      </h3>
                      {expandedItems.includes(faq.id) ? (
                        <FaChevronUp className='h-5 w-5 text-blue-600 flex-shrink-0' />
                      ) : (
                        <FaChevronDown className='h-5 w-5 text-gray-400 flex-shrink-0' />
                      )}
                    </button>
                    
                    {expandedItems.includes(faq.id) && (
                      <div className='px-6 pb-6 border-t border-gray-100'>
                        <p className='text-gray-600 leading-relaxed pt-4'>
                          {faq.answer}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Contact Section */}
          <div className='mt-16 bg-gradient-to-r from-blue-600 to-purple-700 rounded-lg p-8 text-white text-center'>
            <h2 className='text-2xl font-bold mb-4'>Still have questions?</h2>
            <p className='text-blue-100 mb-6 max-w-2xl mx-auto'>
              Can't find what you're looking for? Our customer service team is here to help you with any questions or concerns.
            </p>
            <div className='flex flex-col sm:flex-row gap-4 justify-center'>
              <a
                href='/contact-us'
                className='bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors'
              >
                Contact Support
              </a>
              <a
                href='tel:+393332190006'
                className='bg-blue-800 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-900 transition-colors'
              >
                Call Us Now
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default FAQsPage