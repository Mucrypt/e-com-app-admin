'use client'

import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import { FaUserShield, FaTachometerAlt, FaBoxes, FaChartBar, FaSignOutAlt } from 'react-icons/fa'

// Dynamically import the sidebar with no SSR
const SuperAdminSidebar = dynamic(() => import('./SuperAdminSidebar'), {
  ssr: false,
  loading: () => <SuperAdminSidebarSkeleton />
})

// Loading skeleton that matches the real sidebar
function SuperAdminSidebarSkeleton() {
  return (
    <div className='p-6 bg-superadmin-800 text-white h-screen flex flex-col w-72 bg-gray-700'>
      {/* Header */}
      <div className='mb-6 flex items-center justify-between'>
        <div className='text-2xl font-bold text-white flex items-center'>
          <span className='bg-superadmin-600 p-2 rounded-md mr-2'>
            <FaUserShield />
          </span>
          <span>SuperAdmin</span>
        </div>
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
      
      {/* Loading navigation skeleton */}
      <div className='flex-1 overflow-y-auto'>
        <nav className='flex flex-col space-y-1 pr-2'>
          <div className='bg-superadmin-700 text-white py-3 px-4 rounded-md flex items-center space-x-3 font-medium'>
            <FaTachometerAlt className='text-lg' />
            <span>Dashboard</span>
          </div>
          
          {/* Collapsed sections during loading */}
          <div className='py-3 px-4 rounded-md flex items-center justify-between hover:bg-superadmin-700'>
            <div className='flex items-center space-x-3'>
              <FaUserShield className='text-lg' />
              <span className='font-medium'>Administration</span>
            </div>
          </div>
          
          <div className='py-3 px-4 rounded-md flex items-center justify-between hover:bg-superadmin-700'>
            <div className='flex items-center space-x-3'>
              <FaBoxes className='text-lg' />
              <span>Content</span>
            </div>
          </div>
          
          <div className='py-3 px-4 rounded-md flex items-center justify-between hover:bg-superadmin-700'>
            <div className='flex items-center space-x-3'>
              <FaChartBar className='text-lg' />
              <span className='font-medium'>Analytics</span>
            </div>
          </div>
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

export default function SuperAdminSidebarWrapper() {
  return (
    <Suspense fallback={<SuperAdminSidebarSkeleton />}>
      <SuperAdminSidebar />
    </Suspense>
  )
}