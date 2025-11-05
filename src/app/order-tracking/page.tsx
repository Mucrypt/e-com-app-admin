'use client'
import React, { useState } from 'react'
import Topbar from '@/components/layout/Topbar'
import Navbar from '@/components/common/Navbar'
import Footer from '@/components/layout/Footer'
import { FaSearch, FaTruck, FaBoxOpen, FaCheckCircle, FaShippingFast, FaMapMarkerAlt, FaClock, FaPhone, FaEnvelope } from 'react-icons/fa'

interface TrackingInfo {
  orderNumber: string
  status: 'processing' | 'shipped' | 'in-transit' | 'delivered'
  estimatedDelivery: string
  carrier: string
  trackingNumber: string
  currentLocation: string
  timeline: {
    date: string
    time: string
    status: string
    location: string
    completed: boolean
  }[]
}

const OrderTrackingPage = () => {
  const [trackingInput, setTrackingInput] = useState('')
  const [trackingInfo, setTrackingInfo] = useState<TrackingInfo | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  // Mock tracking data for demonstration
  const mockTrackingData: TrackingInfo = {
    orderNumber: 'MK2025110501',
    status: 'in-transit',
    estimatedDelivery: 'November 8, 2025',
    carrier: 'DHL Express',
    trackingNumber: 'DHL1234567890',
    currentLocation: 'Florence Distribution Center',
    timeline: [
      {
        date: 'Nov 5, 2025',
        time: '09:15 AM',
        status: 'Order Confirmed',
        location: 'Milan Warehouse',
        completed: true
      },
      {
        date: 'Nov 5, 2025',
        time: '02:30 PM',
        status: 'Package Prepared',
        location: 'Milan Warehouse',
        completed: true
      },
      {
        date: 'Nov 6, 2025',
        time: '08:45 AM',
        status: 'Shipped',
        location: 'Milan Distribution Center',
        completed: true
      },
      {
        date: 'Nov 6, 2025',
        time: '06:20 PM',
        status: 'In Transit',
        location: 'Florence Distribution Center',
        completed: true
      },
      {
        date: 'Nov 7, 2025',
        time: 'Expected',
        status: 'Out for Delivery',
        location: 'Local Delivery Hub',
        completed: false
      },
      {
        date: 'Nov 8, 2025',
        time: 'Expected',
        status: 'Delivered',
        location: 'Your Address',
        completed: false
      }
    ]
  }

  const handleTrackOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!trackingInput.trim()) {
      setError('Please enter an order number or tracking number')
      return
    }

    setIsLoading(true)
    setError('')
    
    // Simulate API call
    setTimeout(() => {
      if (trackingInput.toLowerCase().includes('mk') || trackingInput.toLowerCase().includes('dhl')) {
        setTrackingInfo(mockTrackingData)
        setError('')
      } else {
        setError('Order not found. Please check your order number and try again.')
        setTrackingInfo(null)
      }
      setIsLoading(false)
    }, 1500)
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'processing':
      case 'order confirmed':
      case 'package prepared':
        return <FaBoxOpen className='h-5 w-5' />
      case 'shipped':
      case 'in transit':
        return <FaTruck className='h-5 w-5' />
      case 'out for delivery':
        return <FaShippingFast className='h-5 w-5' />
      case 'delivered':
        return <FaCheckCircle className='h-5 w-5' />
      default:
        return <FaClock className='h-5 w-5' />
    }
  }

  const getStatusColor = (completed: boolean, status: string) => {
    if (completed) {
      return 'text-green-600 bg-green-100'
    } else if (status.toLowerCase().includes('expected')) {
      return 'text-gray-500 bg-gray-100'
    } else {
      return 'text-blue-600 bg-blue-100'
    }
  }

  return (
    <>
      <Topbar />
      <Navbar />
      <main className='min-h-screen bg-gray-50'>
        {/* Hero Section */}
        <div className='bg-gradient-to-r from-red-600 to-pink-600 text-white py-16'>
          <div className='container mx-auto px-6 text-center'>
            <h1 className='text-4xl md:text-5xl font-bold mb-4'>
              Track Your Order
            </h1>
            <p className='text-xl md:text-2xl text-red-100 max-w-3xl mx-auto'>
              Stay updated on your order status with real-time tracking information.
            </p>
          </div>
        </div>

        <div className='container mx-auto px-6 py-16'>
          {/* Tracking Form */}
          <div className='max-w-2xl mx-auto mb-12'>
            <div className='bg-white rounded-lg shadow-lg p-8'>
              <div className='flex items-center mb-6'>
                <FaSearch className='h-8 w-8 text-red-600 mr-3' />
                <h2 className='text-2xl font-bold text-gray-800'>Enter Tracking Information</h2>
              </div>
              
              <form onSubmit={handleTrackOrder} className='space-y-6'>
                <div>
                  <label htmlFor='tracking' className='block text-sm font-medium text-gray-700 mb-2'>
                    Order Number or Tracking Number
                  </label>
                  <input
                    type='text'
                    id='tracking'
                    value={trackingInput}
                    onChange={(e) => setTrackingInput(e.target.value)}
                    placeholder='e.g., MK2025110501 or DHL1234567890'
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-lg'
                  />
                  <p className='text-sm text-gray-500 mt-2'>
                    You can find your order number in the confirmation email we sent you.
                  </p>
                </div>

                {error && (
                  <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
                    <p className='text-red-700 text-sm'>{error}</p>
                  </div>
                )}

                <button
                  type='submit'
                  disabled={isLoading}
                  className='w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  {isLoading ? (
                    <>
                      <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white'></div>
                      <span>Tracking...</span>
                    </>
                  ) : (
                    <>
                      <FaSearch className='h-5 w-5' />
                      <span>Track Order</span>
                    </>
                  )}
                </button>
              </form>
              
              <div className='mt-6 p-4 bg-blue-50 rounded-lg'>
                <p className='text-sm text-blue-800'>
                  <strong>Demo:</strong> Try entering "MK2025110501" or "DHL1234567890" to see a sample tracking result.
                </p>
              </div>
            </div>
          </div>

          {/* Tracking Results */}
          {trackingInfo && (
            <div className='max-w-4xl mx-auto space-y-8'>
              {/* Order Summary */}
              <div className='bg-white rounded-lg shadow-lg p-8'>
                <h3 className='text-2xl font-bold text-gray-800 mb-6'>Order Summary</h3>
                
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                  <div>
                    <h4 className='text-sm font-medium text-gray-500 mb-1'>Order Number</h4>
                    <p className='text-lg font-semibold text-gray-800'>{trackingInfo.orderNumber}</p>
                  </div>
                  
                  <div>
                    <h4 className='text-sm font-medium text-gray-500 mb-1'>Carrier</h4>
                    <p className='text-lg font-semibold text-gray-800'>{trackingInfo.carrier}</p>
                  </div>
                  
                  <div>
                    <h4 className='text-sm font-medium text-gray-500 mb-1'>Tracking Number</h4>
                    <p className='text-lg font-semibold text-gray-800'>{trackingInfo.trackingNumber}</p>
                  </div>
                  
                  <div>
                    <h4 className='text-sm font-medium text-gray-500 mb-1'>Est. Delivery</h4>
                    <p className='text-lg font-semibold text-gray-800'>{trackingInfo.estimatedDelivery}</p>
                  </div>
                </div>
              </div>

              {/* Current Status */}
              <div className='bg-white rounded-lg shadow-lg p-8'>
                <div className='flex items-center justify-between mb-6'>
                  <h3 className='text-2xl font-bold text-gray-800'>Current Status</h3>
                  <div className='flex items-center space-x-2'>
                    <FaMapMarkerAlt className='h-5 w-5 text-red-600' />
                    <span className='text-gray-600'>{trackingInfo.currentLocation}</span>
                  </div>
                </div>
                
                <div className='bg-gradient-to-r from-red-500 to-pink-600 rounded-lg p-6 text-white'>
                  <div className='flex items-center space-x-4'>
                    <div className='bg-white bg-opacity-20 p-3 rounded-full'>
                      {getStatusIcon(trackingInfo.status)}
                    </div>
                    <div>
                      <h4 className='text-xl font-semibold capitalize'>{trackingInfo.status.replace('-', ' ')}</h4>
                      <p className='text-red-100'>Your package is on its way!</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tracking Timeline */}
              <div className='bg-white rounded-lg shadow-lg p-8'>
                <h3 className='text-2xl font-bold text-gray-800 mb-6'>Tracking Timeline</h3>
                
                <div className='relative'>
                  {trackingInfo.timeline.map((event, index) => (
                    <div key={index} className='flex items-start space-x-4 pb-8 last:pb-0'>
                      {/* Timeline line */}
                      {index < trackingInfo.timeline.length - 1 && (
                        <div className='absolute left-6 mt-12 w-0.5 h-16 bg-gray-200'></div>
                      )}
                      
                      {/* Status icon */}
                      <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${getStatusColor(event.completed, event.status)}`}>
                        {getStatusIcon(event.status)}
                      </div>
                      
                      {/* Event details */}
                      <div className='flex-1 min-w-0'>
                        <div className='flex items-center justify-between'>
                          <h4 className={`text-lg font-semibold ${event.completed ? 'text-gray-800' : 'text-gray-500'}`}>
                            {event.status}
                          </h4>
                          <div className='text-right'>
                            <p className={`text-sm ${event.completed ? 'text-gray-600' : 'text-gray-400'}`}>
                              {event.date}
                            </p>
                            <p className={`text-sm ${event.completed ? 'text-gray-600' : 'text-gray-400'}`}>
                              {event.time}
                            </p>
                          </div>
                        </div>
                        <p className={`text-sm ${event.completed ? 'text-gray-600' : 'text-gray-400'} mt-1`}>
                          {event.location}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Help Section */}
          <div className='mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto'>
            <div className='bg-white rounded-lg shadow-lg p-8'>
              <h3 className='text-xl font-bold text-gray-800 mb-4 flex items-center'>
                <FaPhone className='h-6 w-6 text-blue-600 mr-3' />
                Need Help?
              </h3>
              <p className='text-gray-600 mb-6'>
                If you have questions about your order or tracking information, our customer service team is here to help.
              </p>
              <div className='space-y-3'>
                <a
                  href='tel:+393332190006'
                  className='flex items-center text-blue-600 hover:text-blue-800 transition-colors'
                >
                  <FaPhone className='h-4 w-4 mr-2' />
                  +39 (333) 219-000-6
                </a>
                <a
                  href='mailto:info@mukulah.com'
                  className='flex items-center text-blue-600 hover:text-blue-800 transition-colors'
                >
                  <FaEnvelope className='h-4 w-4 mr-2' />
                  info@mukulah.com
                </a>
              </div>
            </div>
            
            <div className='bg-gradient-to-br from-green-500 to-blue-600 rounded-lg p-8 text-white'>
              <h3 className='text-xl font-bold mb-4'>Delivery Instructions</h3>
              <ul className='space-y-2 text-green-100'>
                <li>• Someone must be available to receive the package</li>
                <li>• Valid ID may be required for delivery</li>
                <li>• Packages may be left with neighbors if authorized</li>
                <li>• Delivery attempts are made 2-3 times</li>
              </ul>
              <a
                href='/shipping-policy'
                className='inline-block bg-white text-green-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors mt-4'
              >
                View Shipping Policy
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default OrderTrackingPage