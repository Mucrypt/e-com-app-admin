'use client'

import {
  FaTachometerAlt,
  FaUsers,
  FaUserShield,
  FaBoxes,
  FaShoppingCart,
  FaChartBar,
  FaCog,
  FaFileAlt,
  FaTags,
  FaBullhorn,
  FaHeadset,
  FaDatabase,
  FaServer,
  FaShieldAlt,
  FaNetworkWired,
  FaMoneyBillWave,
  FaSignOutAlt,
  FaChevronDown,
  FaChevronRight,
  FaLayerGroup,
  FaProductHunt,
  FaChartLine,
  FaStar,
  FaImage,
  FaDownload,
} from 'react-icons/fa'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useCategories } from '@/hooks/useCategories'

const SuperAdminSidebar = () => {
  const pathname = usePathname()
  const [expandedSections, setExpandedSections] = useState({
    administration: true, // Default expanded
    content: true, // Default expanded  
    analytics: false,
    system: false,
    marketing: false,
  })

  // Helper function to check if a link is active
  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/')
  }

  // Helper function to get link classes with active state
  const getLinkClasses = (href: string, baseClasses: string) => {
    const activeStyle = isActive(href) ? { backgroundColor: 'rgba(255, 0, 0, 0.3)' } : {}
    return { className: baseClasses, style: activeStyle }
  }

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => {
      const newState = {
        ...prev,
        [section]: !prev[section],
      }
      console.log(`🔧 SuperAdminSidebar: Toggled ${section} to ${newState[section]}`)
      return newState
    })
  }

  useCategories()

  console.log('🔧 SuperAdminSidebar: Client-only rendering, content expanded =', expandedSections.content)

  return (
    <div className='p-6 bg-superadmin-800 text-white h-screen flex flex-col w-72 bg-gray-700'>
      {/* Header */}
      <div className='mb-6 flex items-center justify-between'>
        <Link
          href='/superadmin'
          className='text-2xl font-bold text-white flex items-center'
        >
          <span className='bg-superadmin-600 p-2 rounded-md mr-2'>
            <FaUserShield />
          </span>
          <span>SuperAdmin</span>
        </Link>
      </div>
      {/* Quick Stats Bar */}
      <div className='mb-6 bg-superadmin-700 rounded-lg p-3'>
        <div className='flex justify-between items-center text-xs'>
          <div className='text-center'>
            <div className='font-bold'>24</div>
            <div className='text-superadmin-300'>Admins</div>
          </div>
          <div className='h-6 w-px bg-superadmin-600'></div>
          <div className='text-center'>
            <div className='font-bold'>1.2K</div>
            <div className='text-superadmin-300'>Users</div>
          </div>
          <div className='h-6 w-px bg-superadmin-600'></div>
          <div className='text-center'>
            <div className='font-bold'>98%</div>
            <div className='text-superadmin-300'>Uptime</div>
          </div>
        </div>
      </div>
      {/* Scrollable Navigation */}
      <div className='flex-1 overflow-y-auto'>
        <nav className='flex flex-col space-y-1 pr-2'>
          <Link
            href='/superadmin'
            {...getLinkClasses('/superadmin', 'bg-superadmin-700 text-white py-3 px-4 rounded-md flex items-center space-x-3 font-medium')}
          >
            <FaTachometerAlt className='text-lg' />
            <span>Dashboard</span>
          </Link>
          {/* Administration Section */}
          <div>
            <button
              onClick={() => toggleSection('administration')}
              className='w-full text-left py-3 px-4 rounded-md flex items-center justify-between hover:bg-superadmin-700'
            >
              <div className='flex items-center space-x-3'>
                <FaUserShield className='text-lg' />
                <span className='font-medium'>Administration</span>
              </div>
              {expandedSections.administration ? (
                <FaChevronDown size={12} />
              ) : (
                <FaChevronRight size={12} />
              )}
            </button>
            {expandedSections.administration && (
              <div className='ml-9 space-y-1 mt-1'>
                <Link
                  href='/superadmin/administration/adminUsers'
                  {...getLinkClasses('/superadmin/administration/adminUsers', 'text-superadmin-200 hover:bg-superadmin-600 hover:text-white py-2 px-3 rounded-md flex items-center space-x-2 text-sm')}
                >
                  <FaUsers className='mr-1 text-sm' />
                  <span>Admin Users</span>
                </Link>

                <Link
                  href='/superadmin/administration/profile'
                  {...getLinkClasses('/superadmin/administration/profile', 'text-superadmin-200 hover:bg-superadmin-600 hover:text-white py-2 px-3 rounded-md flex items-center space-x-2 text-sm')}
                >
                  <FaUsers className='mr-1 text-sm' />
                  <span>Super Admin Profile</span>
                </Link>
                <Link
                  href='/superadmin/administration/roles-permissions'
                  {...getLinkClasses('/superadmin/administration/roles-permissions', 'text-superadmin-200 hover:bg-superadmin-600 hover:text-white py-2 px-3 rounded-md flex items-center space-x-2 text-sm')}
                >
                  <FaShieldAlt className='mr-1 text-sm' />
                  <span>Roles & Permissions</span>
                </Link>
              </div>
            )}
          </div>
          {/* Content Management Section */}
          <div>
            <button
              onClick={() => toggleSection('content')}
              className='w-full text-left py-3 px-4 rounded-md flex items-center justify-between hover:bg-superadmin-700'
            >
              <div className='flex items-center space-x-3'>
                <FaBoxes className='text-lg' />
                <span>Content</span>
              </div>
              {expandedSections.content ? (
                <FaChevronDown size={12} />
              ) : (
                <FaChevronRight size={12} />
              )}
            </button>
            {expandedSections.content && (
              <div className='ml-9 space-y-1 mt-1'>
                <Link
                  href='/superadmin/content/category'
                  {...getLinkClasses('/superadmin/content/category', 'block py-2 px-3 rounded hover:bg-superadmin-700 text-superadmin-200 font-medium transition-colors duration-150')}
                >
                  <span className='flex items-center'>
                    <FaLayerGroup className='mr-2 text-sm' />
                    <span>Categories</span>
                  </span>
                </Link>
                <Link
                  href='/superadmin/content/product'
                  {...getLinkClasses('/superadmin/content/product', 'block py-2 px-3 rounded hover:bg-superadmin-700 text-superadmin-200 font-medium transition-colors duration-150')}
                >
                  <span className='flex items-center'>
                    <FaProductHunt className='mr-2 text-sm' />
                    <span>Products</span>
                  </span>
                </Link>

                <Link
                  href='/superadmin/content/banners'
                  {...getLinkClasses('/superadmin/content/banners', 'block py-2 px-3 rounded hover:bg-superadmin-700 text-superadmin-200 font-medium transition-colors duration-150')}
                >
                  <div className='flex items-center space-x-2'>
                    <FaImage className='text-sm' />
                    <span>Banners</span>
                  </div>
                </Link>

                <Link
                  href='/superadmin/content/scraper'
                  {...getLinkClasses('/superadmin/content/scraper', 'block py-2 px-3 rounded hover:bg-superadmin-700 text-superadmin-200 font-medium transition-colors duration-150')}
                >
                  <div className='flex items-center space-x-2'>
                    <FaDownload className='text-sm' />
                    <span>Product Scraper</span>
                  </div>
                </Link>

                <Link
                  href='/superadmin/content/blogs'
                  {...getLinkClasses('/superadmin/content/blogs', 'block py-2 px-3 rounded hover:bg-superadmin-700 text-superadmin-200 font-medium transition-colors duration-150')}
                >
                  <span className='flex items-center'>
                    <FaFileAlt className='mr-2 text-sm' />
                    <span>Blog Management</span>
                  </span>
                </Link>
                <Link
                  href='/superadmin/content/featured-products'
                  {...getLinkClasses('/superadmin/content/featured-products', 'block py-2 px-3 rounded hover:bg-superadmin-700 text-superadmin-200 font-medium transition-colors duration-150')}
                >
                  <div className='flex items-center space-x-2'>
                    <FaStar className='text-sm' />
                    <span>Featured Products</span>
                  </div>
                </Link>
                
               
                {/* Add more content links here as needed */}
              </div>
            )}
          </div>
          {/* Orders & Payments */}
          <Link
            href='/superadmin/administration/OrdersDashboard'
            {...getLinkClasses('/superadmin/administration/OrdersDashboard', 'text-superadmin-200 hover:bg-superadmin-700 hover:text-white py-3 px-4 rounded-md flex items-center space-x-3 font-medium')}
          >
            <FaShoppingCart className='text-lg' />
            <span>Orders & Payments</span>
          </Link>
          {/* Analytics Section */}
          <div>
            <button
              onClick={() => toggleSection('analytics')}
              className='w-full text-left py-3 px-4 rounded-md flex items-center justify-between hover:bg-superadmin-700'
            >
              <div className='flex items-center space-x-3'>
                <FaChartBar className='text-lg' />
                <span className='font-medium'>Analytics</span>
              </div>
              {expandedSections.analytics ? (
                <FaChevronDown size={12} />
              ) : (
                <FaChevronRight size={12} />
              )}
            </button>
            {expandedSections.analytics && (
              <div className='ml-9 space-y-1 mt-1'>
                <Link
                  href='/superadmin/analytics'
                  {...getLinkClasses('/superadmin/analytics', 'text-superadmin-200 hover:bg-superadmin-600 hover:text-white py-2 px-3 rounded-md flex items-center space-x-2 text-sm')}
                >
                  <FaMoneyBillWave className='mr-1 text-sm' />
                  <span>Sales Reports</span>
                </Link>
                <Link
                  href='/superadmin/analytics/users'
                  {...getLinkClasses('/superadmin/analytics/users', 'text-superadmin-200 hover:bg-superadmin-600 hover:text-white py-2 px-3 rounded-md flex items-center space-x-2 text-sm')}
                >
                  <FaUsers className='mr-1 text-sm' />
                  <span>User Analytics</span>
                </Link>
                <Link
                  href='/superadmin/analytics/performance'
                  {...getLinkClasses('/superadmin/analytics/performance', 'text-superadmin-200 hover:bg-superadmin-600 hover:text-white py-2 px-3 rounded-md flex items-center space-x-2 text-sm')}
                >
                  <FaTachometerAlt className='mr-1 text-sm' />
                  <span>Performance Metrics</span>
                </Link>
              </div>
            )}
          </div>
          {/* Marketing Section */}
          <div>
            <button
              onClick={() => toggleSection('marketing')}
              className='w-full text-left py-3 px-4 rounded-md flex items-center justify-between hover:bg-superadmin-700'
            >
              <div className='flex items-center space-x-3'>
                <FaBullhorn className='text-lg' />
                <span className='font-medium'>Marketing</span>
              </div>
              {expandedSections.marketing ? (
                <FaChevronDown size={12} />
              ) : (
                <FaChevronRight size={12} />
              )}
            </button>
            {expandedSections.marketing && (
              <div className='ml-9 space-y-1 mt-1'>
                <Link
                  href='/superadmin/marketing'
                  {...getLinkClasses('/superadmin/marketing', 'text-superadmin-200 hover:bg-superadmin-600 hover:text-white py-2 px-3 rounded-md flex items-center space-x-2 text-sm')}
                >
                  <FaBullhorn className='mr-1 text-sm' />
                  <span>Campaigns</span>
                </Link>
                <Link
                  href='/superadmin/marketing/promotions'
                  {...getLinkClasses('/superadmin/marketing/promotions', 'text-superadmin-200 hover:bg-superadmin-600 hover:text-white py-2 px-3 rounded-md flex items-center space-x-2 text-sm')}
                >
                  <FaTags className='mr-1 text-sm' />
                  <span>Promotions</span>
                </Link>
              </div>
            )}
          </div>
          {/* System Section */}
          <div>
            <button
              onClick={() => toggleSection('system')}
              className='w-full text-left py-3 px-4 rounded-md flex items-center justify-between hover:bg-superadmin-700'
            >
              <div className='flex items-center space-x-3'>
                <FaCog className='text-lg' />
                <span className='font-medium'>System</span>
              </div>
              {expandedSections.system ? (
                <FaChevronDown size={12} />
              ) : (
                <FaChevronRight size={12} />
              )}
            </button>
            {expandedSections.system && (
              <div className='ml-9 space-y-1 mt-1'>
                <Link
                  href='/superadmin/system/system-dashboard'
                  {...getLinkClasses('/superadmin/system/system-dashboard', 'text-superadmin-200 hover:bg-superadmin-600 hover:text-white py-2 px-3 rounded-md flex items-center space-x-2 text-sm')}
                >
                  <FaChartLine className='mr-1 text-sm' />
                  <span>System Dashboard</span>
                </Link>
                <Link
                  href='/superadmin/system/settings'
                  {...getLinkClasses('/superadmin/system/settings', 'text-superadmin-200 hover:bg-superadmin-600 hover:text-white py-2 px-3 rounded-md flex items-center space-x-2 text-sm')}
                >
                  <FaCog className='mr-1 text-sm' />
                  <span>System Settings</span>
                </Link>
                <Link
                  href='/superadmin/system/database'
                  {...getLinkClasses('/superadmin/system/database', 'text-superadmin-200 hover:bg-superadmin-600 hover:text-white py-2 px-3 rounded-md flex items-center space-x-2 text-sm')}
                >
                  <FaDatabase className='mr-1 text-sm' />
                  <span>Database Management</span>
                </Link>
                <Link
                  href='/superadmin/system/audit-logs'
                  {...getLinkClasses('/superadmin/system/audit-logs', 'text-superadmin-200 hover:bg-superadmin-600 hover:text-white py-2 px-3 rounded-md flex items-center space-x-2 text-sm')}
                >
                  <FaFileAlt className='mr-1 text-sm' />
                  <span>Audit Logs</span>
                </Link>

                <Link
                  href='/superadmin/system/notifications'
                  {...getLinkClasses('/superadmin/system/notifications', 'text-superadmin-200 hover:bg-superadmin-600 hover:text-white py-2 px-3 rounded-md flex items-center space-x-2 text-sm')}
                >
                  <FaShieldAlt className='mr-1 text-sm' />
                  <span>Security Center</span>
                </Link>
                <Link
                  href='/superadmin/system/api'
                  {...getLinkClasses('/superadmin/system/api', 'text-superadmin-200 hover:bg-superadmin-600 hover:text-white py-2 px-3 rounded-md flex items-center space-x-2 text-sm')}
                >
                  <FaNetworkWired className='mr-1 text-sm' />
                  <span>API Management</span>
                </Link>
                <Link
                  href='/superadmin/system/backups'
                  {...getLinkClasses('/superadmin/system/backups', 'text-superadmin-200 hover:bg-superadmin-600 hover:text-white py-2 px-3 rounded-md flex items-center space-x-2 text-sm')}
                >
                  <FaServer className='mr-1 text-sm' />
                  <span>Backups</span>
                </Link>
              </div>
            )}
          </div>
          {/* Documentation */}
          <Link
            href='/superadmin/documentation'
            {...getLinkClasses('/superadmin/documentation', 'text-superadmin-200 hover:bg-superadmin-700 hover:text-white py-3 px-4 rounded-md flex items-center space-x-3 font-medium')}
          >
            <FaFileAlt className='text-lg' />
            <span>Documentation</span>
          </Link>
          {/* Support */}
          <Link
            href='/superadmin/support'
            {...getLinkClasses('/superadmin/support', 'text-superadmin-200 hover:bg-superadmin-700 hover:text-white py-3 px-4 rounded-md flex items-center space-x-3 font-medium')}
          >
            <FaHeadset className='text-lg' />
            <span>Support Center</span>
          </Link>
        </nav>
      </div>
      {/* Footer */}
      <div className='mt-auto pt-4 border-t border-seller-600'>
        <div className='text-xs text-seller-300 mb-2'>
          <div>
            System Status: <span className='text-green-400'>Operational</span>
          </div>
          <div>Version: 3.2.1</div>
        </div>
        <button className='w-full bg-superadmin-700 hover:bg-superadmin-600 text-white py-2 px-4 rounded-md flex items-center justify-center space-x-2'>
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>
    </div>
  )
}

export default SuperAdminSidebar
