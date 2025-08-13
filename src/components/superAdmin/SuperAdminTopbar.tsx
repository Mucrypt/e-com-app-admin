'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
  FaBell,
  FaChevronDown,
  FaChevronRight,
  FaClipboardList,
  FaCog,
  FaGlobe,
  FaQuestionCircle,
  FaSignOutAlt,
  FaUser,
  FaSearch,
} from 'react-icons/fa'

export default function SuperAdminTopbar() {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isHelpOpen, setIsHelpOpen] = useState(false)
  // Dummy user data for demonstration
  const user = {
    name: 'Super Admin',
    email: 'admin@example.com',
    avatar: 'https://randomuser.me/api/portraits/men/75.jpg',
  }

  const toggleNotification = () => {
    setIsNotificationOpen(!isNotificationOpen)
    setIsProfileOpen(false)
    setIsHelpOpen(false)
  }
  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen)
    setIsNotificationOpen(false)
    setIsHelpOpen(false)
  }
  const toggleHelp = () => {
    setIsHelpOpen(!isHelpOpen)
    setIsNotificationOpen(false)
    setIsProfileOpen(false)
  }

  const pathname = usePathname()
  const currentPath = pathname || '/superadmin'

  // Get current page title based on route
  const getPageTitle = () => {
    const pathParts = currentPath.split('/').filter((part) => part !== '')
    if (pathParts.length < 2) return 'Dashboard'
    const page = pathParts[1]
    return page.charAt(0).toUpperCase() + page.slice(1).replace('-', ' ')
  }

  return (
    <div className='sticky top-0 z-40 w-full backdrop-blur-lg bg-gradient-to-r from-superadmin-900/80 via-superadmin-800/80 to-gray-700/80 shadow-lg border-b border-superadmin-700'>
      <div className='flex flex-col md:flex-row justify-between items-start md:items-center px-6 py-3'>
        {/* Breadcrumbs and Page Title */}
        <div className='mb-3 md:mb-0'>
          <h1 className='text-2xl md:text-3xl font-extrabold text-superadmin-100 tracking-tight drop-shadow-lg'>
            {getPageTitle()}
          </h1>
          <div className='flex items-center text-sm text-superadmin-200 mt-1'>
            <Link
              href='/superadmin'
              className='hover:text-superadmin-500 font-medium transition-colors duration-150'
            >
              Home
            </Link>
            {currentPath
              .split('/')
              .filter((part) => part !== '')
              .slice(1)
              .map((part, index, array) => (
                <span key={index} className='flex items-center'>
                  <FaChevronRight className='mx-2 text-xs text-superadmin-400' />
                  <Link
                    href={`/${array.slice(0, index + 1).join('/')}`}
                    className='hover:text-superadmin-500 capitalize font-medium transition-colors duration-150'
                  >
                    {part.replace('-', ' ')}
                  </Link>
                </span>
              ))}
          </div>
        </div>

        {/* Top Right Controls */}
        <div className='flex items-center gap-4 w-full md:w-auto'>
          {/* Search Bar */}
          <div className='relative flex-1 md:flex-none md:w-64'>
            <input
              type='text'
              placeholder='Search across console...'
              className='w-full pl-10 pr-4 py-2 rounded-xl bg-superadmin-700/60 text-superadmin-100 border border-superadmin-600 focus:outline-none focus:ring-2 focus:ring-superadmin-500 focus:border-superadmin-500 shadow-inner placeholder-superadmin-300 transition-all duration-150'
            />
            <FaSearch className='absolute left-3 top-3 text-superadmin-300' />
          </div>

          {/* Action Buttons Container */}
          <div className='flex items-center gap-2 md:gap-4'>
            {/* Help Center */}
            <div className='relative'>
              <button
                type='button'
                onClick={toggleHelp}
                className='p-2 text-superadmin-100 hover:text-superadmin-500 hover:bg-superadmin-700/70 rounded-full transition-all duration-150 shadow'
                title='Open Help Center'
              >
                <FaQuestionCircle size={20} />
              </button>
              {isHelpOpen && (
                <div className='absolute right-0 mt-2 w-72 bg-white/95 rounded-xl shadow-2xl z-30 border border-superadmin-200 animate-fade-in'>
                  <div className='p-4'>
                    <h3 className='text-lg font-semibold text-superadmin-800 mb-2'>
                      Help Center
                    </h3>
                    <div className='space-y-2'>
                      <Link
                        href='/superadmin/help/documentation'
                        className='block p-2 hover:bg-superadmin-50 rounded-md text-sm text-superadmin-700 font-medium transition-colors duration-150'
                      >
                        Documentation
                      </Link>
                      <Link
                        href='/superadmin/help/support'
                        className='block p-2 hover:bg-superadmin-50 rounded-md text-sm text-superadmin-700 font-medium transition-colors duration-150'
                      >
                        Contact Support
                      </Link>
                      <Link
                        href='/superadmin/help/training'
                        className='block p-2 hover:bg-superadmin-50 rounded-md text-sm text-superadmin-700 font-medium transition-colors duration-150'
                      >
                        Training Videos
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Language Selector */}
            <div className='relative group hidden md:block'>
              <button className='flex items-center space-x-1 p-2 text-superadmin-100 hover:text-superadmin-500 hover:bg-superadmin-700/70 rounded-full transition-all duration-150 shadow'>
                <FaGlobe size={18} />
                <span className='text-sm'>EN</span>
                <FaChevronDown size={14} />
              </button>
              <div className='absolute right-0 mt-2 w-40 bg-white/95 rounded-xl shadow-2xl z-30 border border-superadmin-200 hidden group-hover:block animate-fade-in'>
                <div className='p-2'>
                  <button className='w-full text-left p-2 hover:bg-superadmin-50 rounded-md text-sm text-superadmin-700 font-medium transition-colors duration-150'>
                    English (EN)
                  </button>
                  <button className='w-full text-left p-2 hover:bg-superadmin-50 rounded-md text-sm text-superadmin-700 font-medium transition-colors duration-150'>
                    Español (ES)
                  </button>
                  <button className='w-full text-left p-2 hover:bg-superadmin-50 rounded-md text-sm text-superadmin-700 font-medium transition-colors duration-150'>
                    Français (FR)
                  </button>
                </div>
              </div>
            </div>

            {/* Notification Button */}
            <div className='relative'>
              <button
                onClick={toggleNotification}
                className='p-2 text-superadmin-100 hover:text-superadmin-500 hover:bg-superadmin-700/70 rounded-full relative transition-all duration-150 shadow'
                title='Notifications'
              >
                <FaBell size={20} />
                <span className='absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 shadow-lg border-2 border-white'>
                  3
                </span>
              </button>
              {isNotificationOpen && (
                <div className='absolute right-0 mt-2 w-80 bg-white/95 rounded-xl shadow-2xl z-30 border border-superadmin-200 animate-fade-in'>
                  <div className='p-4'>
                    <div className='flex justify-between items-center mb-3'>
                      <h3 className='text-lg font-semibold text-superadmin-800'>
                        Notifications
                      </h3>
                      <button className='text-sm text-superadmin-500 hover:text-superadmin-700 font-medium transition-colors duration-150'>
                        Mark all as read
                      </button>
                    </div>
                    <ul className='space-y-2 max-h-96 overflow-y-auto'>
                      <li className='border-b border-superadmin-100 pb-2'>
                        <Link
                          href='/superadmin/notifications/1'
                          className='block p-2 hover:bg-superadmin-50 rounded-md transition-colors duration-150'
                        >
                          <div className='flex items-start'>
                            <div className='bg-blue-100 p-2 rounded-full mr-3 shadow'>
                              <FaUser className='text-blue-500' />
                            </div>
                            <div>
                              <p className='text-sm font-medium text-superadmin-800'>
                                New admin user registered
                              </p>
                              <p className='text-xs text-superadmin-400'>
                                5 minutes ago
                              </p>
                            </div>
                          </div>
                        </Link>
                      </li>
                      <li className='border-b border-superadmin-100 pb-2'>
                        <Link
                          href='/superadmin/notifications/2'
                          className='block p-2 hover:bg-superadmin-50 rounded-md transition-colors duration-150'
                        >
                          <div className='flex items-start'>
                            <div className='bg-green-100 p-2 rounded-full mr-3 shadow'>
                              <FaClipboardList className='text-green-500' />
                            </div>
                            <div>
                              <p className='text-sm font-medium text-superadmin-800'>
                                System update available
                              </p>
                              <p className='text-xs text-superadmin-400'>
                                2 hours ago
                              </p>
                            </div>
                          </div>
                        </Link>
                      </li>
                      <li>
                        <Link
                          href='/superadmin/notifications/3'
                          className='block p-2 hover:bg-superadmin-50 rounded-md transition-colors duration-150'
                        >
                          <div className='flex items-start'>
                            <div className='bg-yellow-100 p-2 rounded-full mr-3 shadow'>
                              <FaCog className='text-yellow-500' />
                            </div>
                            <div>
                              <p className='text-sm font-medium text-superadmin-800'>
                                Security alert: Unusual login detected
                              </p>
                              <p className='text-xs text-superadmin-400'>
                                Yesterday
                              </p>
                            </div>
                          </div>
                        </Link>
                      </li>
                    </ul>
                    <div className='mt-3 pt-3 border-t border-superadmin-100'>
                      <Link
                        href='/superadmin/notifications'
                        className='text-sm text-superadmin-500 hover:text-superadmin-700 block text-center font-medium transition-colors duration-150'
                      >
                        View all notifications
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Dropdown */}
            <div className='relative'>
              <button
                onClick={toggleProfile}
                className='flex items-center space-x-2 p-1 bg-superadmin-100 hover:bg-superadmin-200 rounded-full shadow transition-all duration-150 border border-superadmin-300'
              >
                <Image
                  src={user.avatar}
                  alt='SuperAdmin Avatar'
                  width={32}
                  height={32}
                  className='w-8 h-8 rounded-full border-2 border-superadmin-500 shadow'
                />
                <span className='hidden md:inline text-sm font-semibold text-superadmin-700'>
                  {user.name}
                </span>
                <FaChevronDown className='hidden md:inline text-xs text-superadmin-400' />
              </button>
              {isProfileOpen && (
                <div className='absolute right-0 mt-2 w-56 bg-white/95 rounded-xl shadow-2xl z-30 border border-superadmin-200 animate-fade-in'>
                  <div className='p-4 border-b border-superadmin-100'>
                    <div className='flex items-center space-x-3'>
                      <Image
                        src={user.avatar}
                        alt='SuperAdmin Avatar'
                        width={40}
                        height={40}
                        className='w-10 h-10 rounded-full border-2 border-superadmin-500 shadow'
                      />
                      <div>
                        <p className='text-sm font-semibold text-superadmin-800'>
                          {user.name}
                        </p>
                        <p className='text-xs text-superadmin-400'>
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className='p-2'>
                    <Link
                      href='/superadmin/profile'
                      className='flex items-center space-x-2 p-2 text-sm text-superadmin-700 hover:bg-superadmin-50 rounded-md font-medium transition-colors duration-150'
                    >
                      <FaUser className='text-superadmin-400' />
                      <span>Your Profile</span>
                    </Link>
                    <Link
                      href='/superadmin/settings'
                      className='flex items-center space-x-2 p-2 text-sm text-superadmin-700 hover:bg-superadmin-50 rounded-md font-medium transition-colors duration-150'
                    >
                      <FaCog className='text-superadmin-400' />
                      <span>Account Settings</span>
                    </Link>
                  </div>
                  <div className='p-2 border-t border-superadmin-100'>
                    <button
                      onClick={() => {
                        // Handle logout logic here
                        console.log('Logout clicked')
                      }}
                      className='flex items-center space-x-2 w-full p-2 text-sm text-red-600 hover:bg-red-50 rounded-md font-medium transition-colors duration-150'
                    >
                      <FaSignOutAlt />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
