'use client'
import React, { useState } from 'react'
import Topbar from '@/components/layout/Topbar'
import Navbar from '@/components/common/Navbar'
import Footer from '@/components/layout/Footer'
import { FaExchangeAlt, FaUndo, FaCheckCircle, FaTimesCircle, FaClock, FaShippingFast, FaQuestionCircle, FaFileAlt } from 'react-icons/fa'

const ReturnsExchangesPage = () => {
  const [activeTab, setActiveTab] = useState('returns')

  const returnSteps = [
    {
      step: 1,
      title: 'Log Into Your Account',
      description: 'Sign in to your account and go to order history to find the item you want to return.',
      icon: <FaFileAlt className='h-6 w-6' />
    },
    {
      step: 2,
      title: 'Select Return Items',
      description: 'Choose the items you want to return and select the reason for return.',
      icon: <FaCheckCircle className='h-6 w-6' />
    },
    {
      step: 3,
      title: 'Print Return Label',
      description: 'Download and print the prepaid return shipping label.',
      icon: <FaShippingFast className='h-6 w-6' />
    },
    {
      step: 4,
      title: 'Package & Ship',
      description: 'Pack the items securely and ship using our prepaid label.',
      icon: <FaUndo className='h-6 w-6' />
    }
  ]

  const eligibleItems = [
    { icon: <FaCheckCircle className='h-5 w-5 text-green-600' />, text: 'Unworn and unwashed clothing' },
    { icon: <FaCheckCircle className='h-5 w-5 text-green-600' />, text: 'Items with original tags attached' },
    { icon: <FaCheckCircle className='h-5 w-5 text-green-600' />, text: 'Accessories in original packaging' },
    { icon: <FaCheckCircle className='h-5 w-5 text-green-600' />, text: 'Shoes in original box' },
    { icon: <FaCheckCircle className='h-5 w-5 text-green-600' />, text: 'Defective or damaged items' }
  ]

  const nonEligibleItems = [
    { icon: <FaTimesCircle className='h-5 w-5 text-red-600' />, text: 'Worn or washed items' },
    { icon: <FaTimesCircle className='h-5 w-5 text-red-600' />, text: 'Items without original tags' },
    { icon: <FaTimesCircle className='h-5 w-5 text-red-600' />, text: 'Personalized or custom items' },
    { icon: <FaTimesCircle className='h-5 w-5 text-red-600' />, text: 'Undergarments and swimwear' },
    { icon: <FaTimesCircle className='h-5 w-5 text-red-600' />, text: 'Items returned after 30 days' }
  ]

  return (
    <>
      <Topbar />
      <Navbar />
      <main className='min-h-screen bg-gray-50'>
        {/* Hero Section */}
        <div className='bg-gradient-to-r from-orange-600 to-red-600 text-white py-16'>
          <div className='container mx-auto px-6 text-center'>
            <h1 className='text-4xl md:text-5xl font-bold mb-4'>
              Returns & Exchanges
            </h1>
            <p className='text-xl md:text-2xl text-orange-100 max-w-3xl mx-auto'>
              We want you to love your purchase. If not, our hassle-free return and exchange policy makes it easy.
            </p>
          </div>
        </div>

        <div className='container mx-auto px-6 py-16'>
          {/* Policy Overview */}
          <section className='mb-16'>
            <div className='bg-white rounded-lg shadow-lg p-8'>
              <h2 className='text-3xl font-bold text-gray-800 mb-8 text-center'>
                Our Promise to You
              </h2>
              
              <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
                <div className='text-center'>
                  <div className='bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4'>
                    <FaClock className='h-8 w-8 text-green-600' />
                  </div>
                  <h3 className='text-xl font-semibold text-gray-800 mb-2'>30-Day Window</h3>
                  <p className='text-gray-600'>
                    You have 30 days from delivery to return or exchange your items.
                  </p>
                </div>
                
                <div className='text-center'>
                  <div className='bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4'>
                    <FaShippingFast className='h-8 w-8 text-blue-600' />
                  </div>
                  <h3 className='text-xl font-semibold text-gray-800 mb-2'>Free Returns</h3>
                  <p className='text-gray-600'>
                    Free return shipping for defective items. €3.99 for other returns.
                  </p>
                </div>
                
                <div className='text-center'>
                  <div className='bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4'>
                    <FaCheckCircle className='h-8 w-8 text-purple-600' />
                  </div>
                  <h3 className='text-xl font-semibold text-gray-800 mb-2'>Easy Process</h3>
                  <p className='text-gray-600'>
                    Simple online return process with prepaid shipping labels.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Tab Navigation */}
          <div className='mb-8'>
            <div className='flex flex-wrap justify-center space-x-1 bg-gray-200 rounded-lg p-1 max-w-md mx-auto'>
              <button
                onClick={() => setActiveTab('returns')}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  activeTab === 'returns'
                    ? 'bg-white text-orange-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Returns
              </button>
              <button
                onClick={() => setActiveTab('exchanges')}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  activeTab === 'exchanges'
                    ? 'bg-white text-orange-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Exchanges
              </button>
            </div>
          </div>

          {/* Returns Tab */}
          {activeTab === 'returns' && (
            <div className='space-y-12'>
              {/* Return Process */}
              <section>
                <h2 className='text-2xl font-bold text-gray-800 mb-8 text-center'>
                  How to Return Items
                </h2>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                  {returnSteps.map((step, index) => (
                    <div key={index} className='bg-white rounded-lg shadow-md p-6 text-center'>
                      <div className='bg-orange-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4'>
                        <div className='text-orange-600'>
                          {step.icon}
                        </div>
                      </div>
                      <div className='text-sm font-semibold text-orange-600 mb-2'>
                        STEP {step.step}
                      </div>
                      <h3 className='text-lg font-semibold text-gray-800 mb-3'>
                        {step.title}
                      </h3>
                      <p className='text-gray-600 text-sm'>
                        {step.description}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Eligibility */}
              <section>
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
                  <div className='bg-white rounded-lg shadow-lg p-8'>
                    <h3 className='text-xl font-bold text-gray-800 mb-6 flex items-center'>
                      <FaCheckCircle className='h-6 w-6 text-green-600 mr-3' />
                      Eligible for Return
                    </h3>
                    <ul className='space-y-3'>
                      {eligibleItems.map((item, index) => (
                        <li key={index} className='flex items-center space-x-3'>
                          {item.icon}
                          <span className='text-gray-700'>{item.text}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className='bg-white rounded-lg shadow-lg p-8'>
                    <h3 className='text-xl font-bold text-gray-800 mb-6 flex items-center'>
                      <FaTimesCircle className='h-6 w-6 text-red-600 mr-3' />
                      Not Eligible for Return
                    </h3>
                    <ul className='space-y-3'>
                      {nonEligibleItems.map((item, index) => (
                        <li key={index} className='flex items-center space-x-3'>
                          {item.icon}
                          <span className='text-gray-700'>{item.text}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* Exchanges Tab */}
          {activeTab === 'exchanges' && (
            <div className='space-y-12'>
              <section>
                <div className='bg-white rounded-lg shadow-lg p-8'>
                  <h2 className='text-2xl font-bold text-gray-800 mb-6 flex items-center'>
                    <FaExchangeAlt className='h-8 w-8 text-blue-600 mr-3' />
                    Exchange Information
                  </h2>
                  
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                    <div>
                      <h3 className='text-lg font-semibold text-gray-800 mb-4'>What You Can Exchange</h3>
                      <ul className='space-y-2 text-gray-600'>
                        <li>• Different size of the same item</li>
                        <li>• Different color of the same item</li>
                        <li>• Same price or higher value items</li>
                        <li>• Items within 30 days of delivery</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className='text-lg font-semibold text-gray-800 mb-4'>Exchange Process</h3>
                      <ul className='space-y-2 text-gray-600'>
                        <li>• Initiate exchange through your account</li>
                        <li>• Ship original item back to us</li>
                        <li>• We'll send replacement once received</li>
                        <li>• Processing time: 7-10 business days</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className='mt-8 p-6 bg-blue-50 rounded-lg'>
                    <h4 className='font-semibold text-blue-800 mb-2'>Exchange Policy Notes:</h4>
                    <ul className='text-sm text-blue-700 space-y-1'>
                      <li>• If the new item costs more, you'll pay the difference</li>
                      <li>• If the new item costs less, we'll refund the difference</li>
                      <li>• Exchange shipping is free for defective items</li>
                      <li>• €3.99 exchange shipping fee for size/color changes</li>
                    </ul>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* FAQ Section */}
          <section className='mt-16'>
            <div className='bg-white rounded-lg shadow-lg p-8'>
              <h2 className='text-2xl font-bold text-gray-800 mb-8 text-center'>
                Frequently Asked Questions
              </h2>
              
              <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                <div className='space-y-6'>
                  <div>
                    <h4 className='font-semibold text-gray-800 mb-2'>When will I receive my refund?</h4>
                    <p className='text-gray-600 text-sm'>
                      Refunds are processed within 5-10 business days after we receive your return. The time it takes to appear in your account depends on your payment method.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className='font-semibold text-gray-800 mb-2'>Can I return sale items?</h4>
                    <p className='text-gray-600 text-sm'>
                      Yes, sale items can be returned following the same 30-day policy. However, sale items cannot be exchanged for full-price items.
                    </p>
                  </div>
                </div>
                
                <div className='space-y-6'>
                  <div>
                    <h4 className='font-semibold text-gray-800 mb-2'>What if my item is defective?</h4>
                    <p className='text-gray-600 text-sm'>
                      Defective items can be returned at any time with free return shipping. Contact our customer service team for immediate assistance.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className='font-semibold text-gray-800 mb-2'>Can I return items bought with a gift card?</h4>
                    <p className='text-gray-600 text-sm'>
                      Yes, returns will be credited back to the gift card used for purchase. If partially paid with gift card, refunds will be split accordingly.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Contact Support */}
          <section className='mt-16'>
            <div className='bg-gradient-to-r from-orange-500 to-pink-600 rounded-lg p-8 text-white text-center'>
              <FaQuestionCircle className='h-16 w-16 mx-auto mb-4 opacity-80' />
              <h2 className='text-2xl font-bold mb-4'>Need Help with Your Return?</h2>
              <p className='text-orange-100 mb-6 max-w-2xl mx-auto'>
                Our customer service team is here to assist you with any questions about returns or exchanges.
              </p>
              <div className='flex flex-col sm:flex-row gap-4 justify-center'>
                <a
                  href='/contact-us'
                  className='bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors'
                >
                  Contact Support
                </a>
                <a
                  href='/faqs'
                  className='bg-orange-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-800 transition-colors'
                >
                  View FAQs
                </a>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default ReturnsExchangesPage