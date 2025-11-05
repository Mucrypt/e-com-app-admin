'use client'
import React, { useState } from 'react'
import Topbar from '@/components/layout/Topbar'
import Navbar from '@/components/common/Navbar'
import Footer from '@/components/layout/Footer'
import { FaRuler, FaTshirt, FaChild, FaUser, FaUserTie, FaQuestionCircle, FaInfoCircle } from 'react-icons/fa'

const SizeGuidePage = () => {
  const [selectedCategory, setSelectedCategory] = useState('women')

  const categories = [
    { id: 'women', name: 'Women', icon: <FaUser /> },
    { id: 'men', name: 'Men', icon: <FaUserTie /> },
    { id: 'kids', name: 'Kids', icon: <FaChild /> }
  ]

  const womenSizing = {
    clothing: {
      headers: ['Size', 'IT', 'US', 'UK', 'Bust (cm)', 'Waist (cm)', 'Hips (cm)'],
      rows: [
        ['XS', '38', '2', '6', '80-84', '60-64', '86-90'],
        ['S', '40', '4', '8', '84-88', '64-68', '90-94'],
        ['M', '42', '6', '10', '88-92', '68-72', '94-98'],
        ['L', '44', '8', '12', '92-96', '72-76', '98-102'],
        ['XL', '46', '10', '14', '96-100', '76-80', '102-106'],
        ['XXL', '48', '12', '16', '100-104', '80-84', '106-110']
      ]
    },
    shoes: {
      headers: ['IT', 'US', 'UK', 'EU', 'Length (cm)'],
      rows: [
        ['35', '5', '2.5', '35', '22.5'],
        ['36', '6', '3.5', '36', '23'],
        ['37', '7', '4.5', '37', '23.5'],
        ['38', '8', '5.5', '38', '24'],
        ['39', '9', '6.5', '39', '24.5'],
        ['40', '10', '7.5', '40', '25'],
        ['41', '11', '8.5', '41', '25.5'],
        ['42', '12', '9.5', '42', '26']
      ]
    }
  }

  const menSizing = {
    clothing: {
      headers: ['Size', 'IT', 'US', 'UK', 'Chest (cm)', 'Waist (cm)', 'Neck (cm)'],
      rows: [
        ['XS', '44', 'XS', '34', '86-91', '71-76', '35-36'],
        ['S', '46', 'S', '36', '91-96', '76-81', '37-38'],
        ['M', '48', 'M', '38', '96-101', '81-86', '39-40'],
        ['L', '50', 'L', '40', '101-106', '86-91', '41-42'],
        ['XL', '52', 'XL', '42', '106-111', '91-96', '43-44'],
        ['XXL', '54', 'XXL', '44', '111-116', '96-101', '45-46']
      ]
    },
    shoes: {
      headers: ['IT', 'US', 'UK', 'EU', 'Length (cm)'],
      rows: [
        ['39', '7', '6', '39', '25'],
        ['40', '7.5', '6.5', '40', '25.5'],
        ['41', '8', '7', '41', '26'],
        ['42', '9', '8', '42', '26.5'],
        ['43', '10', '9', '43', '27'],
        ['44', '11', '10', '44', '27.5'],
        ['45', '12', '11', '45', '28'],
        ['46', '13', '12', '46', '28.5']
      ]
    }
  }

  const kidsSizing = {
    clothing: {
      headers: ['Age', 'Height (cm)', 'Chest (cm)', 'Waist (cm)', 'IT Size'],
      rows: [
        ['2-3 years', '92-98', '51-53', '50-52', '2-3A'],
        ['3-4 years', '98-104', '53-55', '52-54', '3-4A'],
        ['4-5 years', '104-110', '55-57', '54-56', '4-5A'],
        ['5-6 years', '110-116', '57-59', '56-58', '5-6A'],
        ['6-7 years', '116-122', '59-61', '58-60', '6-7A'],
        ['7-8 years', '122-128', '61-64', '60-62', '7-8A'],
        ['8-9 years', '128-134', '64-67', '62-64', '8-9A'],
        ['9-10 years', '134-140', '67-70', '64-66', '9-10A']
      ]
    },
    shoes: {
      headers: ['Age', 'IT', 'US', 'UK', 'Length (cm)'],
      rows: [
        ['2-3 years', '24-25', '8-9', '7-8', '15-16'],
        ['3-4 years', '26-27', '10-11', '9-10', '16.5-17'],
        ['4-5 years', '28-29', '11.5-12.5', '10.5-11.5', '17.5-18'],
        ['5-6 years', '30-31', '13-1', '12-13', '18.5-19'],
        ['6-7 years', '32-33', '1.5-2.5', '1-2', '19.5-20'],
        ['7-8 years', '34-35', '3-4', '2.5-3.5', '20.5-21'],
        ['8-9 years', '36-37', '4.5-5.5', '4-5', '21.5-22'],
        ['9-10 years', '38-39', '6-7', '5.5-6.5', '22.5-23']
      ]
    }
  }

  const getCurrentSizing = () => {
    switch (selectedCategory) {
      case 'men': return menSizing
      case 'kids': return kidsSizing
      default: return womenSizing
    }
  }

  const measurementTips = [
    {
      title: 'Chest/Bust',
      description: 'Measure around the fullest part of your chest/bust, keeping the tape horizontal.',
      icon: <FaTshirt className='h-5 w-5' />
    },
    {
      title: 'Waist',
      description: 'Measure around your natural waistline, which is typically the narrowest part of your torso.',
      icon: <FaRuler className='h-5 w-5' />
    },
    {
      title: 'Hips',
      description: 'Measure around the fullest part of your hips, usually about 8 inches below your waist.',
      icon: <FaUser className='h-5 w-5' />
    },
    {
      title: 'Foot Length',
      description: 'Measure from the heel to the longest toe. It\'s best to measure in the evening when feet are slightly swollen.',
      icon: <FaRuler className='h-5 w-5' />
    }
  ]

  return (
    <>
      <Topbar />
      <Navbar />
      <main className='min-h-screen bg-gray-50'>
        {/* Hero Section */}
        <div className='bg-gradient-to-r from-indigo-600 to-purple-700 text-white py-16'>
          <div className='container mx-auto px-6 text-center'>
            <h1 className='text-4xl md:text-5xl font-bold mb-4'>
              Size Guide
            </h1>
            <p className='text-xl md:text-2xl text-indigo-100 max-w-3xl mx-auto'>
              Find your perfect fit with our comprehensive sizing charts and measurement guide.
            </p>
          </div>
        </div>

        <div className='container mx-auto px-6 py-16'>
          {/* Category Selection */}
          <div className='mb-12'>
            <div className='flex flex-wrap justify-center gap-4'>
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center space-x-2 px-8 py-4 rounded-lg font-semibold transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-indigo-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-indigo-50 border border-gray-300 shadow-md'
                  }`}
                >
                  {category.icon}
                  <span className='text-lg'>{category.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Measurement Tips */}
          <section className='mb-16'>
            <div className='bg-white rounded-lg shadow-lg p-8'>
              <h2 className='text-2xl font-bold text-gray-800 mb-8 text-center flex items-center justify-center'>
                <FaInfoCircle className='h-8 w-8 text-indigo-600 mr-3' />
                How to Measure
              </h2>
              
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                {measurementTips.map((tip, index) => (
                  <div key={index} className='flex items-start space-x-4 p-4 bg-indigo-50 rounded-lg'>
                    <div className='bg-indigo-100 p-3 rounded-full text-indigo-600'>
                      {tip.icon}
                    </div>
                    <div>
                      <h3 className='font-semibold text-gray-800 mb-2'>{tip.title}</h3>
                      <p className='text-gray-600 text-sm'>{tip.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className='mt-8 p-6 bg-yellow-50 border border-yellow-200 rounded-lg'>
                <h3 className='font-semibold text-yellow-800 mb-2 flex items-center'>
                  <FaQuestionCircle className='h-5 w-5 mr-2' />
                  Pro Tips
                </h3>
                <ul className='text-sm text-yellow-700 space-y-1'>
                  <li>• Use a flexible measuring tape for best results</li>
                  <li>• Measure over light, form-fitting clothing or undergarments</li>
                  <li>• Take measurements at the end of the day when your body is at its largest</li>
                  <li>• If you're between sizes, we recommend choosing the larger size</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Size Charts */}
          <section className='space-y-12'>
            {/* Clothing Size Chart */}
            <div className='bg-white rounded-lg shadow-lg overflow-hidden'>
              <div className='bg-indigo-600 text-white p-6'>
                <h3 className='text-2xl font-bold flex items-center'>
                  <FaTshirt className='h-6 w-6 mr-3' />
                  {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Clothing Sizes
                </h3>
              </div>
              
              <div className='overflow-x-auto'>
                <table className='w-full'>
                  <thead className='bg-gray-50'>
                    <tr>
                      {getCurrentSizing().clothing.headers.map((header, index) => (
                        <th key={index} className='px-6 py-4 text-left text-sm font-semibold text-gray-800 border-b'>
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-gray-200'>
                    {getCurrentSizing().clothing.rows.map((row, index) => (
                      <tr key={index} className='hover:bg-gray-50'>
                        {row.map((cell, cellIndex) => (
                          <td key={cellIndex} className='px-6 py-4 text-sm text-gray-700'>
                            {cellIndex === 0 ? (
                              <span className='font-semibold text-indigo-600'>{cell}</span>
                            ) : (
                              cell
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Shoe Size Chart */}
            <div className='bg-white rounded-lg shadow-lg overflow-hidden'>
              <div className='bg-purple-600 text-white p-6'>
                <h3 className='text-2xl font-bold flex items-center'>
                  <FaRuler className='h-6 w-6 mr-3' />
                  {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Shoe Sizes
                </h3>
              </div>
              
              <div className='overflow-x-auto'>
                <table className='w-full'>
                  <thead className='bg-gray-50'>
                    <tr>
                      {getCurrentSizing().shoes.headers.map((header, index) => (
                        <th key={index} className='px-6 py-4 text-left text-sm font-semibold text-gray-800 border-b'>
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-gray-200'>
                    {getCurrentSizing().shoes.rows.map((row, index) => (
                      <tr key={index} className='hover:bg-gray-50'>
                        {row.map((cell, cellIndex) => (
                          <td key={cellIndex} className='px-6 py-4 text-sm text-gray-700'>
                            {cellIndex === 0 ? (
                              <span className='font-semibold text-purple-600'>{cell}</span>
                            ) : (
                              cell
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Size Guide Notes */}
          <section className='mt-16'>
            <div className='bg-white rounded-lg shadow-lg p-8'>
              <h2 className='text-2xl font-bold text-gray-800 mb-6'>Important Notes</h2>
              
              <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                <div>
                  <h3 className='text-lg font-semibold text-gray-800 mb-4'>Fit Guidelines</h3>
                  <ul className='space-y-2 text-gray-600'>
                    <li>• Sizes may vary slightly between different brands and styles</li>
                    <li>• Stretch fabrics may fit more snugly initially but will adjust to your body</li>
                    <li>• For a loose fit, consider sizing up</li>
                    <li>• Check the product description for specific fit information</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className='text-lg font-semibold text-gray-800 mb-4'>Returns & Exchanges</h3>
                  <ul className='space-y-2 text-gray-600'>
                    <li>• Free exchanges for incorrect sizing within 30 days</li>
                    <li>• Items must be unworn with original tags</li>
                    <li>• Contact customer service for sizing advice</li>
                    <li>• See our full return policy for details</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Help Section */}
          <section className='mt-16'>
            <div className='bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg p-8 text-white text-center'>
              <FaQuestionCircle className='h-16 w-16 mx-auto mb-4 opacity-80' />
              <h2 className='text-2xl font-bold mb-4'>Still Not Sure About Your Size?</h2>
              <p className='text-indigo-100 mb-6 max-w-2xl mx-auto'>
                Our customer service team is here to help you find the perfect fit. Contact us for personalized sizing advice.
              </p>
              <div className='flex flex-col sm:flex-row gap-4 justify-center'>
                <a
                  href='/contact-us'
                  className='bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors'
                >
                  Contact Support
                </a>
                <a
                  href='/returns-exchanges'
                  className='bg-indigo-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-800 transition-colors'
                >
                  Return Policy
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

export default SizeGuidePage