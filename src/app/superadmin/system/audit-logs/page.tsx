// app/superadmin/logs/page.tsx
'use client'

import { useState } from 'react'
import {
  FaFileAlt,
  FaSearch,
  FaFilter,
  FaDownload,
  FaTrash,
  FaEye,
  FaClock,
} from 'react-icons/fa'

const LogsPage = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [logLevel, setLogLevel] = useState('all')
  const [dateRange, setDateRange] = useState('24h')

  const logEntries = [
    {
      id: 1,
      timestamp: '2023-10-15 14:32:12',
      level: 'INFO',
      message: 'User login successful',
      source: 'auth-service',
    },
    {
      id: 2,
      timestamp: '2023-10-15 14:30:45',
      level: 'WARN',
      message: 'High memory usage detected',
      source: 'system-monitor',
    },
    {
      id: 3,
      timestamp: '2023-10-15 14:28:33',
      level: 'ERROR',
      message: 'Database connection timeout',
      source: 'db-service',
    },
    {
      id: 4,
      timestamp: '2023-10-15 14:25:17',
      level: 'INFO',
      message: 'Backup completed successfully',
      source: 'backup-service',
    },
    {
      id: 5,
      timestamp: '2023-10-15 14:22:09',
      level: 'DEBUG',
      message: 'API request processed',
      source: 'api-gateway',
    },
  ]

  const filteredLogs = logEntries.filter((log) => {
    const matchesSearch =
      log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.source.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesLevel = logLevel === 'all' || log.level === logLevel
    return matchesSearch && matchesLevel
  })

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'ERROR':
        return 'text-red-500 bg-red-100 dark:bg-red-900/30'
      case 'WARN':
        return 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30'
      case 'INFO':
        return 'text-blue-500 bg-blue-100 dark:bg-blue-900/30'
      case 'DEBUG':
        return 'text-gray-500 bg-gray-100 dark:bg-gray-900/30'
      default:
        return 'text-gray-500 bg-gray-100 dark:bg-gray-900/30'
    }
  }

    function handleViewLog(id: number): void {
        console.log('View log details for ID:', id)
    }

  return (
    <div className='space-y-6 overflow-y-auto max-h-[calc(100vh-200px)]'>
      <div className='flex flex-col md:flex-row justify-between items-start md:items-center'>
        <h1 className='text-2xl font-bold flex items-center'>
          <FaFileAlt className='mr-2 text-blue-500' />
          System Logs
        </h1>
        <div className='flex space-x-2 mt-4 md:mt-0'>
          <button className='px-4 py-2 bg-blue-600 text-white rounded-md flex items-center'>
            <FaDownload className='mr-2' />
            Export Logs
          </button>
        </div>
      </div>

      <div className='bg-white dark:bg-gray-800 rounded-lg shadow p-6'>
        <div className='flex flex-col md:flex-row gap-4 mb-6'>
          <div className='relative flex-1'>
            <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
              <FaSearch className='text-gray-400' />
            </div>
            <input
              type='text'
              placeholder='Search logs...'
              className='pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select
            className='px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700'
            value={logLevel}
            onChange={(e) => setLogLevel(e.target.value)}
            aria-label='Filter by log level'
          >
            <option value='all'>All Levels</option>
            <option value='ERROR'>Error</option>
            <option value='WARN'>Warning</option>
            <option value='INFO'>Info</option>
            <option value='DEBUG'>Debug</option>
          </select>
          <select
            className='px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700'
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            aria-label='Filter by date range'
          >
            <option value='1h'>Last hour</option>
            <option value='24h'>Last 24 hours</option>
            <option value='7d'>Last 7 days</option>
            <option value='30d'>Last 30 days</option>
          </select>
        </div>

        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead>
              <tr className='border-b border-gray-200 dark:border-gray-700'>
                <th className='px-4 py-2 text-left'>Timestamp</th>
                <th className='px-4 py-2 text-left'>Level</th>
                <th className='px-4 py-2 text-left'>Source</th>
                <th className='px-4 py-2 text-left'>Message</th>
                <th className='px-4 py-2 text-left'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
                <tr
                  key={log.id}
                  className='border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                >
                  <td className='px-4 py-3'>
                    <div className='flex items-center text-sm text-gray-500 dark:text-gray-400'>
                      <FaClock className='mr-1' />
                      {log.timestamp}
                    </div>
                  </td>
                  <td className='px-4 py-3'>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(
                        log.level
                      )}`}
                    >
                      {log.level}
                    </span>
                  </td>
                  <td className='px-4 py-3 font-mono text-sm'>{log.source}</td>
                  <td className='px-4 py-3'>{log.message}</td>
                  <td className='px-4 py-3'>
                    <div className='flex space-x-2'>
                      <button
                        onClick={() => handleViewLog(log.id)}
                        className='p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded'
                        title='View log details'
                      >
                        <FaEye />
                      </button>
                      <button
                        className='p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded'
                        title='Delete log entry'
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <div className='bg-white dark:bg-gray-800 rounded-lg shadow p-6'>
          <h3 className='text-lg font-medium mb-4'>Log Statistics</h3>
          <div className='grid grid-cols-2 gap-4'>
            <div className='p-4 border border-gray-200 dark:border-gray-700 rounded-lg'>
              <div className='text-sm text-gray-500 dark:text-gray-400'>
                Total Entries
              </div>
              <div className='text-2xl font-bold'>12,847</div>
            </div>
            <div className='p-4 border border-gray-200 dark:border-gray-700 rounded-lg'>
              <div className='text-sm text-gray-500 dark:text-gray-400'>
                Errors
              </div>
              <div className='text-2xl font-bold'>142</div>
            </div>
            <div className='p-4 border border-gray-200 dark:border-gray-700 rounded-lg'>
              <div className='text-sm text-gray-500 dark:text-gray-400'>
                Warnings
              </div>
              <div className='text-2xl font-bold'>324</div>
            </div>
            <div className='p-4 border border-gray-200 dark:border-gray-700 rounded-lg'>
              <div className='text-sm text-gray-500 dark:text-gray-400'>
                Storage Used
              </div>
              <div className='text-2xl font-bold'>2.4 GB</div>
            </div>
          </div>
        </div>

        <div className='bg-white dark:bg-gray-800 rounded-lg shadow p-6'>
          <h3 className='text-lg font-medium mb-4'>Log Management</h3>
          <div className='space-y-3'>
            <button className='w-full border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 py-3 px-4 rounded-md flex items-center justify-center'>
              <FaDownload className='mr-2' />
              Download All Logs
            </button>
            <button className='w-full border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 py-3 px-4 rounded-md flex items-center justify-center'>
              <FaTrash className='mr-2' />
              Clear Old Logs
            </button>
            <button className='w-full border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 py-3 px-4 rounded-md flex items-center justify-center'>
              <FaFilter className='mr-2' />
              Configure Log Retention
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LogsPage
