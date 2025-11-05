'use client'
import React from 'react'
import Topbar from '@/components/layout/Topbar'
import Navbar from '@/components/common/Navbar'
import Footer from '@/components/layout/Footer'
import { FaTruck, FaGlobe, FaClock, FaShippingFast, FaMapMarkerAlt, FaBoxOpen, FaExclamationTriangle } from 'react-icons/fa'

const ShippingPolicyPage = () => {
  const shippingOptions = [
    {
      name: 'Standard Shipping',
      price: '€5.99',
      duration: '5-7 business days',
      description: 'Reliable delivery for most orders',
      icon: <FaTruck className='h-8 w-8' />
    },
    {
      name: 'Express Shipping',
      price: '€12.99',
      duration: '2-3 business days',
      description: 'Faster delivery when you need it',
      icon: <FaShippingFast className='h-8 w-8' />
    },
    {
      name: 'Overnight Shipping',
      price: '€24.99',
      duration: '1 business day',
      description: 'Next day delivery for urgent orders',
      icon: <FaClock className='h-8 w-8' />
    },
    {
      name: 'Free Shipping',
      price: 'Free',
      duration: '5-7 business days',
      description: 'Free on orders over €75',
      icon: <FaBoxOpen className='h-8 w-8' />
    }
  ]

  const internationalZones = [
    {
      zone: 'European Union',
      countries: 'All EU countries',
      price: '€8.99 - €15.99',
      duration: '3-7 business days'
    },
    {
      zone: 'United Kingdom',
      countries: 'England, Scotland, Wales, Northern Ireland',
      price: '€12.99',
      duration: '5-8 business days'
    },
    {
      zone: 'North America',
      countries: 'USA, Canada',
      price: '€18.99 - €29.99',
      duration: '7-14 business days'
    },
    {
      zone: 'Rest of World',
      countries: 'Australia, Asia, South America, Africa',
      price: '€24.99 - €39.99',
      duration: '10-21 business days'
    }
  ]

  return (
    <>
      <Topbar />
      <Navbar />
      <main className='min-h-screen bg-gray-50'>
        {/* Hero Section */}
        <div className='bg-gradient-to-r from-purple-600 to-indigo-700 text-white py-16'>
          <div className='container mx-auto px-6 text-center'>
            <h1 className='text-4xl md:text-5xl font-bold mb-4'>
              Shipping Policy
            </h1>
            <p className='text-xl md:text-2xl text-purple-100 max-w-3xl mx-auto'>
              Learn about our shipping options, delivery times, and policies to ensure your orders reach you safely and on time.
            </p>
          </div>
        </div>

        <div className='container mx-auto px-6 py-16'>
          {/* Shipping Options */}
          <section className='mb-16'>
            <h2 className='text-3xl font-bold text-gray-800 mb-8 text-center'>
              Shipping Options
            </h2>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
              {shippingOptions.map((option, index) => (
                <div key={index} className='bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow'>
                  <div className='bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4'>
                    <div className='text-purple-600'>
                      {option.icon}
                    </div>
                  </div>
                  <h3 className='text-xl font-semibold text-gray-800 mb-2'>
                    {option.name}
                  </h3>
                  <div className='text-2xl font-bold text-purple-600 mb-2'>
                    {option.price}
                  </div>
                  <div className='text-gray-600 mb-3'>
                    {option.duration}
                  </div>
                  <p className='text-sm text-gray-500'>
                    {option.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Domestic Shipping */}
          <section className='mb-16'>
            <div className='bg-white rounded-lg shadow-lg p-8'>
              <div className='flex items-center mb-6'>
                <FaMapMarkerAlt className='h-8 w-8 text-purple-600 mr-3' />
                <h2 className='text-2xl font-bold text-gray-800'>Domestic Shipping (Italy)</h2>
              </div>
              
              <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                <div>
                  <h3 className='text-lg font-semibold text-gray-800 mb-4'>Processing Time</h3>
                  <ul className='space-y-2 text-gray-600'>
                    <li>• Orders placed before 2 PM: Same day processing</li>
                    <li>• Orders placed after 2 PM: Next business day processing</li>
                    <li>• Weekend orders: Processed on Monday</li>
                    <li>• Custom/personalized items: 2-3 additional business days</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className='text-lg font-semibold text-gray-800 mb-4'>Delivery Areas</h3>
                  <ul className='space-y-2 text-gray-600'>
                    <li>• All major Italian cities</li>
                    <li>• Rural and remote areas (may take 1-2 additional days)</li>
                    <li>• P.O. Box addresses accepted</li>
                    <li>• Island territories (Sicily, Sardinia) included</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* International Shipping */}
          <section className='mb-16'>
            <div className='bg-white rounded-lg shadow-lg p-8'>
              <div className='flex items-center mb-6'>
                <FaGlobe className='h-8 w-8 text-blue-600 mr-3' />
                <h2 className='text-2xl font-bold text-gray-800'>International Shipping</h2>
              </div>
              
              <div className='overflow-x-auto'>
                <table className='w-full table-auto'>
                  <thead>
                    <tr className='bg-gray-50'>
                      <th className='px-6 py-3 text-left text-sm font-semibold text-gray-800'>Zone</th>
                      <th className='px-6 py-3 text-left text-sm font-semibold text-gray-800'>Countries</th>
                      <th className='px-6 py-3 text-left text-sm font-semibold text-gray-800'>Shipping Cost</th>
                      <th className='px-6 py-3 text-left text-sm font-semibold text-gray-800'>Delivery Time</th>
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-gray-200'>
                    {internationalZones.map((zone, index) => (
                      <tr key={index} className='hover:bg-gray-50'>
                        <td className='px-6 py-4 text-sm font-medium text-gray-800'>{zone.zone}</td>
                        <td className='px-6 py-4 text-sm text-gray-600'>{zone.countries}</td>
                        <td className='px-6 py-4 text-sm text-gray-600'>{zone.price}</td>
                        <td className='px-6 py-4 text-sm text-gray-600'>{zone.duration}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className='mt-6 p-4 bg-blue-50 rounded-lg'>
                <p className='text-sm text-blue-800'>
                  <strong>Note:</strong> International orders may be subject to customs duties and taxes imposed by the destination country. These charges are the responsibility of the recipient.
                </p>
              </div>
            </div>
          </section>

          {/* Important Information */}
          <section className='mb-16'>
            <div className='bg-white rounded-lg shadow-lg p-8'>
              <div className='flex items-center mb-6'>
                <FaExclamationTriangle className='h-8 w-8 text-amber-600 mr-3' />
                <h2 className='text-2xl font-bold text-gray-800'>Important Shipping Information</h2>
              </div>
              
              <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                <div>
                  <h3 className='text-lg font-semibold text-gray-800 mb-4'>Order Requirements</h3>
                  <ul className='space-y-2 text-gray-600'>
                    <li>• Minimum order value: €25</li>
                    <li>• Maximum package weight: 30kg</li>
                    <li>• Accurate shipping address required</li>
                    <li>• Someone must be available to receive the package</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className='text-lg font-semibold text-gray-800 mb-4'>Restricted Items</h3>
                  <ul className='space-y-2 text-gray-600'>
                    <li>• Hazardous materials</li>
                    <li>• Perishable goods</li>
                    <li>• Fragile items (special handling required)</li>
                    <li>• Items prohibited by destination country</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Tracking & Support */}
          <section>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
              <div className='bg-gradient-to-br from-green-500 to-blue-600 rounded-lg p-8 text-white'>
                <h3 className='text-2xl font-bold mb-4'>Track Your Order</h3>
                <p className='mb-6'>
                  Get real-time updates on your shipment with our comprehensive tracking system.
                </p>
                <a
                  href='/order-tracking'
                  className='inline-flex items-center bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors'
                >
                  <FaTruck className='mr-2' />
                  Track Package
                </a>
              </div>
              
              <div className='bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg p-8 text-white'>
                <h3 className='text-2xl font-bold mb-4'>Shipping Questions?</h3>
                <p className='mb-6'>
                  Our customer service team is here to help with any shipping-related inquiries.
                </p>
                <a
                  href='/contact-us'
                  className='inline-flex items-center bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors'
                >
                  <FaMapMarkerAlt className='mr-2' />
                  Contact Support
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

export default ShippingPolicyPage