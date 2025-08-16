'use client'
import React, { useState } from 'react'
import '@/styles/navbar.css'
import Link from 'next/link'
import ProfileDrawer from './ProfileDrawer'
import Logo from '../common/Logo'
import { FaSearch, FaUserShield, FaHeart, FaStore } from 'react-icons/fa'
import {
  HiOutlineUser,
  HiOutlineShoppingBag,
  HiOutlineBars3BottomRight,
} from 'react-icons/hi2'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import CartDrawer from '@/components/cart/CartDrawer'

const tabList = [
  'Buy products',
  'Explore environments',
  'Offers',
  'Inspiration',
  'IKEA for Business',
  'Services & Design',
  'Other',
]

const Navbar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [cartCount] = useState(0)
  const [activeTab, setActiveTab] = useState(tabList[0])
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false)
  const [profileDrawerOpen, setProfileDrawerOpen] = useState(false)
  const { user, loading } = useAuth()
  const router = useRouter()

  const toggleCartDrawer = () => setCartDrawerOpen((open) => !open)
  const toggleNavDrawer = () => {}

  const handleProfileClick = () => {
    if (loading) return // Prevent action while loading
    if (user) {
      router.push('/profile')
    } else {
      setProfileDrawerOpen(true)
    }
  }

  return (
    <>
      <nav
        id='sticky-navbar'
        className='container mx-auto flex flex-col items-center justify-between py-4 px-6 bg-white transition-all duration-300'
      >
        <div className='w-full flex items-center justify-between mb-4'>
          <Logo />

          <div className='flex-grow mx-4 max-w-2xl relative'>
            <input
              type='text'
              placeholder='Search for products, brands, and more...'
              className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent pr-12'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              type='button'
              aria-label='Search'
              className='absolute right-3 top-1/2 transform -translate-y-1/2 bg-black p-2 rounded-md hover:bg-gray-800 transition-colors'
            >
              <FaSearch className='text-white' />
            </button>
          </div>

          <div className='flex items-center space-x-4'>
            {/* TODO: Only show these links for users with admin/superadmin privileges. For now, always show for development. */}
            <Link
              href='/superadmin'
              className='hover:text-black flex flex-col items-center'
            >
              <FaUserShield className='text-gray-700 h-6 w-6' />
              <span className='text-xs hidden md:block'>Super Admin</span>
            </Link>
            <Link
              href='/Wishlist'
              className='hover:text-black flex flex-col items-center'
            >
              <FaHeart className='text-gray-700 h-6 w-6' />
              <span className='text-xs hidden md:block'>Wishlist</span>
            </Link>
            <Link
              href='/profile'
              className='hover:text-black flex flex-col items-center'
            >
              <FaStore className='text-gray-700 h-6 w-6' />
              <span className='text-xs hidden md:block'>Admin</span>
            </Link>
            <button
              onClick={handleProfileClick}
              className='hover:text-black flex flex-col items-center'
              aria-label={user ? 'Go to profile' : 'Sign in or create account'}
              aria-haspopup={!user && !loading ? 'dialog' : false}
              disabled={loading}
            >
              <HiOutlineUser className='text-gray-700 h-6 w-6' />
              <span className='text-xs hidden md:block'>Profile</span>
            </button>
            <button
              onClick={toggleCartDrawer}
              className='relative hover:text-black flex flex-col items-center'
            >
              <HiOutlineShoppingBag className='h-6 w-6 text-gray-700' />
              {cartCount > 0 && (
                <span className='absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full px-2 py-0.5'>
                  {cartCount}
                </span>
              )}
              <span className='text-xs hidden md:block'>Cart</span>
            </button>
            <button
              onClick={toggleNavDrawer}
              className='md:hidden p-1 hover:bg-gray-100 rounded'
              title='Open navigation menu'
            >
              <HiOutlineBars3BottomRight className='h-6 w-6 text-gray-700' />
            </button>
          </div>
        </div>
        {/* World-class horizontal scrollable nav bar with underline animation */}
        <div className='w-full overflow-x-auto bg-gray-50 border-t border-b border-gray-200'>
          <nav className='flex space-x-6 px-4 py-2 font-medium text-gray-700 whitespace-nowrap relative'>
            {tabList.map((tab) => (
              <button
                key={tab}
                className={`navbar-tab-btn${
                  activeTab === tab ? ' active' : ''
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
                <span className='navbar-underline' />
              </button>
            ))}
          </nav>
        </div>
        {/* Dynamic tab content below navbar - horizontal scrollable bar */}
        <div className='w-full px-4 bg-white border-b border-gray-100 navbar-tab-content-bar'>
          {activeTab === 'Buy products' && (
            <div className='navbar-tab-scroll'>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div
                  key={i}
                  className='min-w-[160px] max-w-[180px] h-[120px] bg-gray-50 border rounded-lg shadow-sm flex flex-col items-center justify-center p-2 hover:shadow-md transition'
                >
                  <div className='w-16 h-16 bg-gray-200 rounded mb-2 flex items-center justify-center'>
                    <span className='text-gray-400 text-2xl font-bold'>
                      {i}
                    </span>
                  </div>
                  <div className='text-sm font-semibold text-gray-700'>
                    Product {i}
                  </div>
                  <div className='text-xs text-gray-500'>Category</div>
                </div>
              ))}
            </div>
          )}
          {activeTab === 'Explore environments' && (
            <div className='navbar-tab-scroll'>
              {['Living Room', 'Bedroom', 'Kitchen', 'Office', 'Outdoor'].map(
                (env, i) => (
                  <div
                    key={env}
                    className='min-w-[160px] max-w-[180px] h-[120px] bg-green-50 border rounded-lg shadow-sm flex flex-col items-center justify-center p-2 hover:shadow-md transition'
                  >
                    <div className='w-16 h-16 bg-green-200 rounded mb-2 flex items-center justify-center'>
                      <span className='text-green-700 text-lg font-bold'>
                        {i + 1}
                      </span>
                    </div>
                    <div className='text-sm font-semibold text-green-700'>
                      {env}
                    </div>
                  </div>
                )
              )}
            </div>
          )}
          {activeTab === 'Offers' && (
            <div className='navbar-tab-scroll'>
              {['10% Off', 'Buy 1 Get 1', 'Free Delivery', 'Flash Sale'].map(
                (offer, i) => (
                  <div
                    key={offer}
                    className='min-w-[160px] max-w-[180px] h-[120px] bg-yellow-50 border rounded-lg shadow-sm flex flex-col items-center justify-center p-2 hover:shadow-md transition'
                  >
                    <div className='w-16 h-16 bg-yellow-200 rounded mb-2 flex items-center justify-center'>
                      <span className='text-yellow-700 text-lg font-bold'>
                        {i + 1}
                      </span>
                    </div>
                    <div className='text-sm font-semibold text-yellow-700'>
                      {offer}
                    </div>
                  </div>
                )
              )}
            </div>
          )}
          {activeTab === 'Inspiration' && (
            <div className='navbar-tab-scroll'>
              {[
                'Modern',
                'Minimalist',
                'Scandinavian',
                'Boho',
                'Industrial',
              ].map((style, i) => (
                <div
                  key={style}
                  className='min-w-[160px] max-w-[180px] h-[120px] bg-blue-50 border rounded-lg shadow-sm flex flex-col items-center justify-center p-2 hover:shadow-md transition'
                >
                  <div className='w-16 h-16 bg-blue-200 rounded mb-2 flex items-center justify-center'>
                    <span className='text-blue-700 text-lg font-bold'>
                      {i + 1}
                    </span>
                  </div>
                  <div className='text-sm font-semibold text-blue-700'>
                    {style}
                  </div>
                </div>
              ))}
            </div>
          )}
          {activeTab === 'IKEA for Business' && (
            <div className='navbar-tab-scroll'>
              {[
                'Workspace',
                'Bulk Orders',
                'Consulting',
                'Custom Solutions',
              ].map((biz, i) => (
                <div
                  key={biz}
                  className='min-w-[160px] max-w-[180px] h-[120px] bg-purple-50 border rounded-lg shadow-sm flex flex-col items-center justify-center p-2 hover:shadow-md transition'
                >
                  <div className='w-16 h-16 bg-purple-200 rounded mb-2 flex items-center justify-center'>
                    <span className='text-purple-700 text-lg font-bold'>
                      {i + 1}
                    </span>
                  </div>
                  <div className='text-sm font-semibold text-purple-700'>
                    {biz}
                  </div>
                </div>
              ))}
            </div>
          )}
          {activeTab === 'Services & Design' && (
            <div className='navbar-tab-scroll'>
              {[
                'Customer Service',
                'Track Order',
                'Returns',
                'Spare Parts',
                'Consultancy',
                'Planners',
                'Financing',
                'Delivery',
                'Click & Collect',
                'Assembly',
                'Kitchen Services',
                'Contact',
                'Appointment',
              ].map((service, i) => (
                <div
                  key={service}
                  className='min-w-[160px] max-w-[180px] h-[120px] bg-pink-50 border rounded-lg shadow-sm flex flex-col items-center justify-center p-2 hover:shadow-md transition'
                >
                  <div className='w-16 h-16 bg-pink-200 rounded mb-2 flex items-center justify-center'>
                    <span className='text-pink-700 text-lg font-bold'>
                      {i + 1}
                    </span>
                  </div>
                  <div className='text-sm font-semibold text-pink-700'>
                    {service}
                  </div>
                </div>
              ))}
            </div>
          )}
          {activeTab === 'Other' && (
            <div className='navbar-tab-scroll'>
              {['Info 1', 'Info 2', 'Info 3', 'Info 4'].map((info, i) => (
                <div
                  key={info}
                  className='min-w-[160px] max-w-[180px] h-[120px] bg-gray-100 border rounded-lg shadow-sm flex flex-col items-center justify-center p-2 hover:shadow-md transition'
                >
                  <div className='w-16 h-16 bg-gray-300 rounded mb-2 flex items-center justify-center'>
                    <span className='text-gray-700 text-lg font-bold'>
                      {i + 1}
                    </span>
                  </div>
                  <div className='text-sm font-semibold text-gray-700'>
                    {info}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </nav>
      {/* Profile Drawer Overlay */}
      {profileDrawerOpen && (
        <div
          className='fixed inset-0 z-40 bg-black/30'
          onClick={() => setProfileDrawerOpen(false)}
        />
      )}
      <ProfileDrawer
        open={profileDrawerOpen}
        onClose={() => setProfileDrawerOpen(false)}
      />
      {/* Cart Drawer Overlay */}
      {cartDrawerOpen && (
        <CartDrawer
          open={cartDrawerOpen}
          onClose={() => setCartDrawerOpen(false)}
        />
      )}
    </>
  )
}

export default Navbar
