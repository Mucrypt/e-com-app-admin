'use client'
import React, { useState } from 'react'
import Topbar from '@/components/layout/Topbar'
import Navbar from '@/components/common/Navbar'
import Footer from '@/components/layout/Footer'
import { FaGift, FaCreditCard, FaEnvelope, FaCalendar, FaShoppingCart, FaCheck, FaExclamationTriangle, FaInfoCircle } from 'react-icons/fa'

const GiftCardsPage = () => {
  const [activeTab, setActiveTab] = useState('purchase')
  const [giftCardForm, setGiftCardForm] = useState({
    amount: '',
    recipientName: '',
    recipientEmail: '',
    senderName: '',
    message: '',
    deliveryDate: ''
  })
  const [redeemCode, setRedeemCode] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const giftCardAmounts = [25, 50, 100, 150, 200, 300]

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setGiftCardForm({
      ...giftCardForm,
      [e.target.name]: e.target.value
    })
  }

  const handlePurchase = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)
    
    // Simulate purchase process
    setTimeout(() => {
      alert('Gift card purchased successfully! A confirmation email will be sent shortly.')
      setGiftCardForm({
        amount: '',
        recipientName: '',
        recipientEmail: '',
        senderName: '',
        message: '',
        deliveryDate: ''
      })
      setIsProcessing(false)
    }, 2000)
  }

  const handleRedeem = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)
    
    // Simulate redemption process
    setTimeout(() => {
      if (redeemCode.toLowerCase().includes('gift') || redeemCode.length >= 10) {
        alert('Gift card redeemed successfully! €50.00 has been added to your account.')
      } else {
        alert('Invalid gift card code. Please check and try again.')
      }
      setRedeemCode('')
      setIsProcessing(false)
    }, 1500)
  }

  return (
    <>
      <Topbar />
      <Navbar />
      <main className='min-h-screen bg-gray-50'>
        {/* Hero Section */}
        <div className='bg-gradient-to-r from-pink-600 to-rose-600 text-white py-16'>
          <div className='container mx-auto px-6 text-center'>
            <h1 className='text-4xl md:text-5xl font-bold mb-4'>
              Gift Cards
            </h1>
            <p className='text-xl md:text-2xl text-pink-100 max-w-3xl mx-auto'>
              Give the perfect gift with our digital gift cards. Perfect for any occasion and never expire.
            </p>
          </div>
        </div>

        <div className='container mx-auto px-6 py-16'>
          {/* Tab Navigation */}
          <div className='mb-12'>
            <div className='flex flex-wrap justify-center space-x-1 bg-gray-200 rounded-lg p-1 max-w-md mx-auto'>
              <button
                onClick={() => setActiveTab('purchase')}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  activeTab === 'purchase'
                    ? 'bg-white text-pink-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Purchase
              </button>
              <button
                onClick={() => setActiveTab('redeem')}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  activeTab === 'redeem'
                    ? 'bg-white text-pink-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Redeem
              </button>
            </div>
          </div>

          {/* Purchase Tab */}
          {activeTab === 'purchase' && (
            <div className='max-w-4xl mx-auto'>
              {/* Gift Card Preview */}
              <div className='mb-12'>
                <h2 className='text-2xl font-bold text-gray-800 mb-8 text-center'>
                  Choose Your Gift Card
                </h2>
                
                <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
                  {giftCardAmounts.map((amount) => (
                    <button
                      key={amount}
                      onClick={() => setGiftCardForm({...giftCardForm, amount: amount.toString()})}
                      className={`relative p-6 rounded-lg border-2 transition-all duration-300 ${
                        giftCardForm.amount === amount.toString()
                          ? 'border-pink-500 bg-pink-50 scale-105'
                          : 'border-gray-300 bg-white hover:border-pink-300'
                      }`}
                    >
                      <div className='bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg p-6 mb-4'>
                        <FaGift className='h-8 w-8 mx-auto mb-2' />
                        <div className='text-2xl font-bold'>€{amount}</div>
                        <div className='text-sm opacity-90'>MUKUL AH Gift Card</div>
                      </div>
                      {giftCardForm.amount === amount.toString() && (
                        <div className='absolute top-3 right-3 bg-pink-500 text-white rounded-full p-1'>
                          <FaCheck className='h-4 w-4' />
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                <div className='text-center'>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Or enter a custom amount
                  </label>
                  <input
                    type='number'
                    name='amount'
                    value={giftCardForm.amount}
                    onChange={handleFormChange}
                    placeholder='€25 - €1000'
                    min='25'
                    max='1000'
                    className='w-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-center'
                  />
                </div>
              </div>

              {/* Purchase Form */}
              <div className='bg-white rounded-lg shadow-lg p-8'>
                <div className='flex items-center mb-6'>
                  <FaEnvelope className='h-8 w-8 text-pink-600 mr-3' />
                  <h3 className='text-2xl font-bold text-gray-800'>Gift Card Details</h3>
                </div>
                
                <form onSubmit={handlePurchase} className='space-y-6'>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <div>
                      <label htmlFor='recipientName' className='block text-sm font-medium text-gray-700 mb-2'>
                        Recipient Name *
                      </label>
                      <input
                        type='text'
                        id='recipientName'
                        name='recipientName'
                        value={giftCardForm.recipientName}
                        onChange={handleFormChange}
                        required
                        className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent'
                        placeholder="Recipient's full name"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor='recipientEmail' className='block text-sm font-medium text-gray-700 mb-2'>
                        Recipient Email *
                      </label>
                      <input
                        type='email'
                        id='recipientEmail'
                        name='recipientEmail'
                        value={giftCardForm.recipientEmail}
                        onChange={handleFormChange}
                        required
                        className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent'
                        placeholder="recipient@email.com"
                      />
                    </div>
                  </div>

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <div>
                      <label htmlFor='senderName' className='block text-sm font-medium text-gray-700 mb-2'>
                        Your Name *
                      </label>
                      <input
                        type='text'
                        id='senderName'
                        name='senderName'
                        value={giftCardForm.senderName}
                        onChange={handleFormChange}
                        required
                        className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent'
                        placeholder="Your full name"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor='deliveryDate' className='block text-sm font-medium text-gray-700 mb-2'>
                        Delivery Date (Optional)
                      </label>
                      <input
                        type='date'
                        id='deliveryDate'
                        name='deliveryDate'
                        value={giftCardForm.deliveryDate}
                        onChange={handleFormChange}
                        min={new Date().toISOString().split('T')[0]}
                        className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent'
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor='message' className='block text-sm font-medium text-gray-700 mb-2'>
                      Personal Message (Optional)
                    </label>
                    <textarea
                      id='message'
                      name='message'
                      value={giftCardForm.message}
                      onChange={handleFormChange}
                      rows={4}
                      className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none'
                      placeholder="Add a personal message for the recipient..."
                    />
                  </div>

                  <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
                    <div className='flex items-start space-x-3'>
                      <FaInfoCircle className='h-5 w-5 text-blue-600 mt-0.5' />
                      <div className='text-sm text-blue-800'>
                        <p className='font-semibold mb-1'>Delivery Information:</p>
                        <ul className='space-y-1'>
                          <li>• Gift cards are delivered instantly via email if no delivery date is set</li>
                          <li>• You can schedule delivery up to 1 year in advance</li>
                          <li>• A copy will also be sent to your email for your records</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {giftCardForm.amount && (
                    <div className='bg-gray-50 rounded-lg p-6'>
                      <h4 className='font-semibold text-gray-800 mb-4'>Order Summary</h4>
                      <div className='flex justify-between items-center text-lg'>
                        <span>Gift Card Amount:</span>
                        <span className='font-bold text-pink-600'>€{giftCardForm.amount}</span>
                      </div>
                    </div>
                  )}

                  <button
                    type='submit'
                    disabled={isProcessing || !giftCardForm.amount}
                    className='w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed'
                  >
                    {isProcessing ? (
                      <>
                        <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white'></div>
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <FaShoppingCart className='h-5 w-5' />
                        <span>Purchase Gift Card</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Redeem Tab */}
          {activeTab === 'redeem' && (
            <div className='max-w-2xl mx-auto'>
              <div className='bg-white rounded-lg shadow-lg p-8'>
                <div className='flex items-center mb-6'>
                  <FaCreditCard className='h-8 w-8 text-pink-600 mr-3' />
                  <h3 className='text-2xl font-bold text-gray-800'>Redeem Gift Card</h3>
                </div>
                
                <form onSubmit={handleRedeem} className='space-y-6'>
                  <div>
                    <label htmlFor='redeemCode' className='block text-sm font-medium text-gray-700 mb-2'>
                      Gift Card Code *
                    </label>
                    <input
                      type='text'
                      id='redeemCode'
                      value={redeemCode}
                      onChange={(e) => setRedeemCode(e.target.value)}
                      required
                      className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-lg font-mono'
                      placeholder='GIFT-XXXX-XXXX-XXXX'
                      style={{ letterSpacing: '1px' }}
                    />
                    <p className='text-sm text-gray-500 mt-2'>
                      Enter the gift card code from your email or gift card.
                    </p>
                  </div>

                  <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-4'>
                    <div className='flex items-start space-x-3'>
                      <FaExclamationTriangle className='h-5 w-5 text-yellow-600 mt-0.5' />
                      <div className='text-sm text-yellow-800'>
                        <p className='font-semibold mb-1'>Demo Mode:</p>
                        <p>Try entering "GIFT1234567890" or any code containing "gift" to test the redemption feature.</p>
                      </div>
                    </div>
                  </div>

                  <button
                    type='submit'
                    disabled={isProcessing || !redeemCode.trim()}
                    className='w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed'
                  >
                    {isProcessing ? (
                      <>
                        <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white'></div>
                        <span>Redeeming...</span>
                      </>
                    ) : (
                      <>
                        <FaGift className='h-5 w-5' />
                        <span>Redeem Gift Card</span>
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Gift Card Info */}
              <div className='mt-8 bg-white rounded-lg shadow-lg p-8'>
                <h3 className='text-xl font-bold text-gray-800 mb-6'>Gift Card Information</h3>
                
                <div className='space-y-4'>
                  <div className='flex items-start space-x-3'>
                    <FaCheck className='h-5 w-5 text-green-600 mt-0.5' />
                    <div>
                      <h4 className='font-semibold text-gray-800'>No Expiration Date</h4>
                      <p className='text-gray-600 text-sm'>Our gift cards never expire, so you can use them whenever you want.</p>
                    </div>
                  </div>
                  
                  <div className='flex items-start space-x-3'>
                    <FaCheck className='h-5 w-5 text-green-600 mt-0.5' />
                    <div>
                      <h4 className='font-semibold text-gray-800'>Partial Use</h4>
                      <p className='text-gray-600 text-sm'>Use your gift card for multiple purchases until the balance is used up.</p>
                    </div>
                  </div>
                  
                  <div className='flex items-start space-x-3'>
                    <FaCheck className='h-5 w-5 text-green-600 mt-0.5' />
                    <div>
                      <h4 className='font-semibold text-gray-800'>Balance Check</h4>
                      <p className='text-gray-600 text-sm'>Check your gift card balance anytime by entering your code above.</p>
                    </div>
                  </div>
                  
                  <div className='flex items-start space-x-3'>
                    <FaCheck className='h-5 w-5 text-green-600 mt-0.5' />
                    <div>
                      <h4 className='font-semibold text-gray-800'>Combine with Other Payments</h4>
                      <p className='text-gray-600 text-sm'>If your purchase exceeds the gift card value, pay the difference with any payment method.</p>
                    </div>
                  </div>
                </div>
              </div>
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
                    <h4 className='font-semibold text-gray-800 mb-2'>Can I return or exchange a gift card?</h4>
                    <p className='text-gray-600 text-sm'>
                      Gift cards are non-refundable and cannot be exchanged for cash. However, they never expire and can be used for any purchase.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className='font-semibold text-gray-800 mb-2'>What if I lose my gift card code?</h4>
                    <p className='text-gray-600 text-sm'>
                      Contact our customer service team with your purchase details, and we'll help you recover your gift card information.
                    </p>
                  </div>
                </div>
                
                <div className='space-y-6'>
                  <div>
                    <h4 className='font-semibold text-gray-800 mb-2'>Can I use multiple gift cards on one order?</h4>
                    <p className='text-gray-600 text-sm'>
                      Yes, you can apply multiple gift cards to a single order until the full amount is covered.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className='font-semibold text-gray-800 mb-2'>Do gift cards work on sale items?</h4>
                    <p className='text-gray-600 text-sm'>
                      Yes, gift cards can be used to purchase any item on our website, including sale and clearance items.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Contact Support */}
          <section className='mt-16'>
            <div className='bg-gradient-to-r from-pink-500 to-rose-600 rounded-lg p-8 text-white text-center'>
              <FaGift className='h-16 w-16 mx-auto mb-4 opacity-80' />
              <h2 className='text-2xl font-bold mb-4'>Need Help with Gift Cards?</h2>
              <p className='text-pink-100 mb-6 max-w-2xl mx-auto'>
                Our customer service team is here to assist you with any questions about purchasing or redeeming gift cards.
              </p>
              <a
                href='/contact-us'
                className='inline-flex items-center bg-white text-pink-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors'
              >
                <FaEnvelope className='mr-2' />
                Contact Support
              </a>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default GiftCardsPage