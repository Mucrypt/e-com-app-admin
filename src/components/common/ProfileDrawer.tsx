import React from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { FaClipboardList, FaHeart, FaTruck, FaRegEdit } from 'react-icons/fa'
import { HiOutlineUser } from 'react-icons/hi2'

interface ProfileDrawerProps {
  open: boolean
  onClose: () => void
}

const links = [
  { label: 'View your purchases', icon: <FaClipboardList />, href: '#' },
  { label: 'Track and manage your order', icon: <FaTruck />, href: '#' },
  { label: 'Create a wishlist', icon: <FaHeart />, href: '#' },
  { label: 'Design online', icon: <FaRegEdit />, href: '#' },
]

export default function ProfileDrawer({ open, onClose }: ProfileDrawerProps) {
  const router = useRouter()
  const handleLogin = () => {
    router.push('/Authentication')

    onClose()
  }
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className='fixed top-0 right-0 h-full w-full max-w-sm bg-gradient-to-br from-green-50 to-white shadow-2xl z-50 flex flex-col rounded-l-3xl border-l-4 border-green-600'
        >
          <div className='flex items-center justify-between px-6 py-6 border-b bg-gradient-to-r from-green-100 to-white rounded-t-3xl'>
            <div className='flex items-center gap-4'>
              <span className='inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-600 shadow-lg border-4 border-white'>
                <HiOutlineUser className='text-white' size={40} />
              </span>
              <div>
                <span className='block text-2xl font-extrabold text-green-700 tracking-tight'>
                  Hej
                </span>
                <span className='block text-sm text-gray-500 font-medium'>
                  Welcome to your account
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className='text-gray-500 hover:text-green-700 text-3xl font-bold transition-colors duration-150'
              aria-label='Close profile drawer'
            >
              ×
            </button>
          </div>
          <div className='px-6 py-8 flex flex-col gap-5'>
            <button
              className='w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-lg transition-all duration-150'
              onClick={handleLogin}
            >
              Login
            </button>
            <button className='w-full py-3 px-4 bg-green-50 hover:bg-green-100 text-green-700 font-bold rounded-xl border border-green-200 text-lg transition-all duration-150'>
              Sign up for IKEA Family
            </button>
            <button className='w-full py-3 px-4 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-xl border border-blue-200 text-lg transition-all duration-150'>
              Sign up for IKEA Business Network
            </button>
            <div className='bg-yellow-50 rounded-xl p-4 text-yellow-800 font-semibold shadow'>
              Discover the latest IKEA Family offers
            </div>
          </div>
          <div className='px-6 py-6 border-t flex flex-col gap-4 bg-gradient-to-r from-white to-green-50 rounded-b-3xl'>
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className='flex items-center gap-4 text-gray-700 hover:text-green-700 font-semibold text-lg transition-colors duration-150'
              >
                <span className='inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-700 text-xl'>
                  {link.icon}
                </span>
                <span>{link.label}</span>
              </a>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
