// app/superadmin/system/page.tsx
'use client'

import { useState } from 'react'
import {
  FaServer,
  FaDatabase,
  FaNetworkWired,
  FaCog,
  FaSync,
  FaDownload,
  FaUpload,
} from 'react-icons/fa'

const SystemPage = () => {
  const [isSyncing, setIsSyncing] = useState(false)

  const systemStats = [
    { label: 'CPU Usage', value: '65%', trend: 'up' },
    { label: 'Memory Usage', value: '48%', trend: 'stable' },
    { label: 'Disk Space', value: '78%', trend: 'up' },
    { label: 'Network Traffic', value: '1.2 Gbps', trend: 'down' },
  ]

  const services = [
    { name: 'Web Server', status: 'Online', uptime: '99.98%' },
    { name: 'Database', status: 'Online', uptime: '99.99%' },
    { name: 'Cache Server', status: 'Online', uptime: '99.97%' },
    { name: 'Background Jobs', status: 'Online', uptime: '99.95%' },
  ]

  const handleSync = () => {
    setIsSyncing(true)
    setTimeout(() => setIsSyncing(false), 2000)
  }

  return (
    <div className='space-y-6 overflow-y-auto max-h-[calc(100vh-200px)] transition-colors duration-300'>
      <div className='flex flex-col md:flex-row justify-between items-start md:items-center'>
        <h1 className='text-2xl font-bold flex items-center'>
          <FaServer className='mr-2 text-blue-500' />
          System Management
        </h1>
        <div className='flex space-x-2 mt-4 md:mt-0'>
          <button
            className='px-4 py-2 bg-blue-600 text-white rounded-md flex items-center'
            onClick={handleSync}
            disabled={isSyncing}
          >
            <FaSync className={`mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Syncing...' : 'Sync Systems'}
          </button>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        {systemStats.map((stat, index) => (
          <div
            key={index}
            className='bg-white dark:bg-gray-800 rounded-lg shadow p-6'
          >
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-gray-500 dark:text-gray-400'>
                  {stat.label}
                </p>
                <p className='text-2xl font-bold'>{stat.value}</p>
              </div>
              <div
                className={`text-2xl ${
                  stat.trend === 'up'
                    ? 'text-green-500'
                    : stat.trend === 'down'
                    ? 'text-red-500'
                    : 'text-yellow-500'
                }`}
              >
                {stat.trend === 'up' ? '↗' : stat.trend === 'down' ? '↘' : '→'}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <div className='bg-white dark:bg-gray-800 rounded-lg shadow p-6'>
          <h3 className='text-lg font-medium mb-4 flex items-center'>
            <FaCog className='mr-2 text-blue-500' />
            System Services
          </h3>
          <div className='space-y-4'>
            {services.map((service, index) => (
              <div
                key={index}
                className='flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg'
              >
                <div>
                  <div className='font-medium'>{service.name}</div>
                  <div className='text-sm text-gray-500 dark:text-gray-400'>
                    Uptime: {service.uptime}
                  </div>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    service.status === 'Online'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}
                >
                  {service.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className='bg-white dark:bg-gray-800 rounded-lg shadow p-6'>
          <h3 className='text-lg font-medium mb-4 flex items-center'>
            <FaDatabase className='mr-2 text-blue-500' />
            Database Operations
          </h3>
          <div className='space-y-3'>
            <button className='w-full border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 py-3 px-4 rounded-md flex items-center justify-center'>
              <FaDownload className='mr-2' />
              Backup Database
            </button>
            <button className='w-full border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 py-3 px-4 rounded-md flex items-center justify-center'>
              <FaUpload className='mr-2' />
              Restore Database
            </button>
            <button className='w-full border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 py-3 px-4 rounded-md flex items-center justify-center'>
              <FaSync className='mr-2' />
              Optimize Database
            </button>
          </div>
        </div>
      </div>

      <div className='bg-white dark:bg-gray-800 rounded-lg shadow p-6'>
        <h3 className='text-lg font-medium mb-4 flex items-center'>
          <FaNetworkWired className='mr-2 text-blue-500' />
          Network Status
        </h3>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <div className='p-4 border border-gray-200 dark:border-gray-700 rounded-lg'>
            <div className='text-sm text-gray-500 dark:text-gray-400 mb-2'>
              Response Time
            </div>
            <div className='text-2xl font-bold'>42ms</div>
          </div>
          <div className='p-4 border border-gray-200 dark:border-gray-700 rounded-lg'>
            <div className='text-sm text-gray-500 dark:text-gray-400 mb-2'>
              Requests/Min
            </div>
            <div className='text-2xl font-bold'>1,240</div>
          </div>
          <div className='p-4 border border-gray-200 dark:border-gray-700 rounded-lg'>
            <div className='text-sm text-gray-500 dark:text-gray-400 mb-2'>
              Error Rate
            </div>
            <div className='text-2xl font-bold'>0.02%</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SystemPage
