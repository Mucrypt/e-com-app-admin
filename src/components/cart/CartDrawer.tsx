'use client'
import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { IoMdClose } from 'react-icons/io'
import { FiShoppingBag, FiArrowRight } from 'react-icons/fi'
import CartItem from './CartItem'

const mockCart = [
  {
    id: '1',
    name: 'Wireless Headphones',
    price: 129.99,
    quantity: 2,
    image: '/images/hero/desktop/img1.webp',
    color: 'Black',
    size: 'Standard',
  },
  {
    id: '2',
    name: 'Smart Watch',
    price: 199.99,
    quantity: 1,
    image: '/images/hero/desktop/img2.webp',
    color: 'Silver',
    size: 'Medium',
  },
]

export default function CartDrawer({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const subtotal = mockCart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  }
  const drawerVariants = {
    hidden: { x: '100%', opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { damping: 25, stiffness: 300 },
    },
    exit: { x: '100%', opacity: 0, transition: { duration: 0.3 } },
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className='fixed inset-0 bg-black/30 z-40'
            onClick={onClose}
            initial='hidden'
            animate='visible'
            exit='hidden'
            variants={backdropVariants}
          />
          <motion.div
            className='fixed right-0 top-0 h-full w-full sm:w-96 bg-white shadow-2xl z-50 flex flex-col'
            initial='hidden'
            animate='visible'
            exit='exit'
            variants={drawerVariants}
          >
            {/* Header */}
            <div className='flex justify-between items-center p-6 border-b border-gray-100'>
              <div className='flex items-center space-x-2'>
                <FiShoppingBag className='text-2xl text-indigo-600' />
                <h2 className='text-xl font-bold text-gray-900'>
                  Your Cart ({mockCart.length})
                </h2>
              </div>
              <button
                onClick={onClose}
                className='p-2 rounded-full hover:bg-gray-100 transition-colors'
                aria-label='Close cart'
              >
                <IoMdClose className='h-5 w-5 text-gray-500' />
              </button>
            </div>
            {/* Cart Content */}
            <div className='flex-1 overflow-y-auto'>
              {mockCart.length > 0 ? (
                <div className='divide-y divide-gray-100'>
                  {mockCart.map((item) => (
                    <CartItem key={item.id} item={item} />
                  ))}
                </div>
              ) : (
                <div className='flex flex-col items-center justify-center h-full py-12 px-6 text-center'>
                  <FiShoppingBag className='h-16 w-16 text-gray-300 mb-4' />
                  <h3 className='text-lg font-medium text-gray-900 mb-2'>
                    Your cart is empty
                  </h3>
                  <p className='text-gray-500 mb-6'>
                    Looks like you haven&#39;t added anything to your cart yet
                  </p>
                  <button
                    onClick={onClose}
                    className='px-6 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition-colors'
                  >
                    Continue Shopping
                  </button>
                </div>
              )}
            </div>
            {/* Footer */}
            {mockCart.length > 0 && (
              <div className='border-t border-gray-100 p-6 bg-white'>
                <div className='flex justify-between mb-4'>
                  <span className='text-gray-600'>Subtotal</span>
                  <span className='font-semibold'>${subtotal.toFixed(2)}</span>
                </div>
                <div className='flex justify-between mb-4'>
                  <span className='text-gray-600'>Shipping</span>
                  <span className='font-semibold text-green-600'>Free</span>
                </div>
                <div className='flex justify-between mb-6'>
                  <span className='text-gray-600'>Tax</span>
                  <span className='font-semibold'>Calculated at checkout</span>
                </div>
                <div className='flex justify-between text-lg font-bold mb-6 pt-4 border-t border-gray-100'>
                  <span>Total</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <button className='w-full flex items-center justify-center py-3 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-md shadow-md hover:from-indigo-700 hover:to-purple-700 transition-all'>
                  Proceed to Checkout
                  <FiArrowRight className='ml-2 h-5 w-5' />
                </button>
                <p className='text-xs text-gray-500 mt-4 text-center'>
                  Free shipping and returns on all orders
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
