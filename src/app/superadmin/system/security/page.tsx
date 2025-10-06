// app/superadmin/security/page.tsx
'use client'

import { useState } from 'react'
import {
  FaShieldAlt,
  FaLock,
  FaEye,
  FaBan,
  FaHistory,
  FaExclamationTriangle,
} from 'react-icons/fa'

const SecurityPage = () => {
  const [activeTab, setActiveTab] = useState('overview')

  const securityMetrics = [
    { label: 'Failed Login Attempts', value: '12', trend: 'down' },
    { label: 'Active Threats', value: '2', trend: 'up' },
    { label: 'Security Score', value: '94%', trend: 'up' },
    { label: 'Last Scan', value: '2 hours ago', trend: 'stable' },
  ]

  const recentEvents = [
    {
      id: 1,
      type: 'Failed Login',
      user: 'admin',
      ip: '192.168.1.45',
      time: '10 minutes ago',
      severity: 'high',
    },
    {
      id: 2,
      type: 'Password Changed',
      user: 'jane.smith',
      ip: '10.0.0.22',
      time: '1 hour ago',
      severity: 'medium',
    },
    {
      id: 3,
      type: 'New Device',
      user: 'john.doe',
      ip: '172.16.0.33',
      time: '2 hours ago',
      severity: 'low',
    },
    {
      id: 4,
      type: 'Role Changed',
      user: 'bob.johnson',
      ip: '192.168.1.100',
      time: '5 hours ago',
      severity: 'medium',
    },
  ]

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'text-red-500 bg-red-100 dark:bg-red-900/30'
      case 'medium':
        return 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30'
      case 'low':
        return 'text-blue-500 bg-blue-100 dark:bg-blue-900/30'
      default:
        return 'text-gray-500 bg-gray-100 dark:bg-gray-800'
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return '📈'
      case 'down':
        return '📉'
      default:
        return '↔️'
    }
  }

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'Failed Login':
        return <FaLock className='text-red-500' />
      case 'Password Changed':
        return <FaEye className='text-yellow-500' />
      case 'New Device':
        return <FaBan className='text-green-500' />
      case 'Role Changed':
        return <FaHistory className='text-blue-500' />
      default:
        return null
    }
  }

  return (
    <div className='space-y-6 overflow-y-auto max-h-[calc(100vh-200px)]'>
      <div className='flex flex-col md:flex-row justify-between items-start md:items-center'>
        <h1 className='text-2xl font-bold flex items-center'>
          <FaShieldAlt className='mr-2 text-blue-500' />
          Security Center
        </h1>
        <div className='flex space-x-2 mt-4 md:mt-0'>
          <button className='px-4 py-2 bg-blue-600 text-white rounded-md'>
            Run Security Scan
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className='flex space-x-4 border-b border-gray-200 dark:border-gray-700 mb-6'>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'overview'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 dark:text-gray-400'
          }`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'events'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 dark:text-gray-400'
          }`}
          onClick={() => setActiveTab('events')}
        >
          Events
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'policies'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 dark:text-gray-400'
          }`}
          onClick={() => setActiveTab('policies')}
        >
          Policies
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'threats'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 dark:text-gray-400'
          }`}
          onClick={() => setActiveTab('threats')}
        >
          Threats
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
            {securityMetrics.map((metric, index) => (
              <div
                key={index}
                className='bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex flex-col'
              >
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm text-gray-500 dark:text-gray-400'>
                      {metric.label}
                    </p>
                    <p className='text-2xl font-bold'>{metric.value}</p>
                  </div>
                  <div
                    className={`text-2xl ${
                      metric.trend === 'up'
                        ? 'text-green-500'
                        : metric.trend === 'down'
                        ? 'text-red-500'
                        : 'text-yellow-500'
                    }`}
                  >
                    {getTrendIcon(metric.trend)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {activeTab === 'events' && (
        <div className='bg-white dark:bg-gray-800 rounded-lg shadow p-6'>
          <h3 className='text-lg font-medium mb-4'>Recent Security Events</h3>
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead>
                <tr className='border-b border-gray-200 dark:border-gray-700'>
                  <th className='px-4 py-2 text-left'>Event</th>
                  <th className='px-4 py-2 text-left'>User</th>
                  <th className='px-4 py-2 text-left'>IP Address</th>
                  <th className='px-4 py-2 text-left'>Time</th>
                  <th className='px-4 py-2 text-left'>Severity</th>
                  <th className='px-4 py-2 text-left'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentEvents.map((event) => (
                  <tr
                    key={event.id}
                    className='border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                  >
                    <td className='px-4 py-3 font-medium flex items-center gap-2'>
                      {getEventIcon(event.type)}
                      {event.type}
                    </td>
                    <td className='px-4 py-3'>{event.user}</td>
                    <td className='px-4 py-3 font-mono text-sm'>{event.ip}</td>
                    <td className='px-4 py-3 text-sm text-gray-500 dark:text-gray-400'>
                      {event.time}
                    </td>
                    <td className='px-4 py-3'>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(
                          event.severity
                        )}`}
                      >
                        {event.severity}
                      </span>
                    </td>
                    <td className='px-4 py-3'>
                      <div className='flex space-x-2'>
                        <button
                          className='p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded'
                          title='View Event'
                        >
                          <FaEye />
                        </button>
                        <button
                          className='p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded'
                          title='Block Event'
                        >
                          <FaBan />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'policies' && (
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          <div className='bg-white dark:bg-gray-800 rounded-lg shadow p-6'>
            <h3 className='text-lg font-medium mb-4 flex items-center'>
              <FaLock className='mr-2 text-blue-500' />
              Security Policies
            </h3>
            <div className='space-y-3'>
              <div className='flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg'>
                <div>
                  <div className='font-medium'>Password Policy</div>
                  <div className='text-sm text-gray-500 dark:text-gray-400'>
                    Minimum 12 characters, special characters required
                  </div>
                </div>
                <button className='px-3 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 rounded-md text-sm'>
                  Edit
                </button>
              </div>
              <div className='flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg'>
                <div>
                  <div className='font-medium'>2FA Enforcement</div>
                  <div className='text-sm text-gray-500 dark:text-gray-400'>
                    Required for all admin accounts
                  </div>
                </div>
                <button className='px-3 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 rounded-md text-sm'>
                  Edit
                </button>
              </div>
              <div className='flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg'>
                <div>
                  <div className='font-medium'>Session Timeout</div>
                  <div className='text-sm text-gray-500 dark:text-gray-400'>
                    30 minutes of inactivity
                  </div>
                </div>
                <button className='px-3 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 rounded-md text-sm'>
                  Edit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'threats' && (
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          <div className='bg-white dark:bg-gray-800 rounded-lg shadow p-6'>
            <h3 className='text-lg font-medium mb-4 flex items-center'>
              <FaExclamationTriangle className='mr-2 text-blue-500' />
              Threat Detection
            </h3>
            <div className='space-y-4'>
              <div className='p-3 border border-yellow-200 dark:border-yellow-700 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg'>
                <div className='font-medium'>Suspicious Activity Detected</div>
                <div className='text-sm'>
                  Multiple failed login attempts from unusual location
                </div>
              </div>
              <div className='p-3 border border-red-200 dark:border-red-700 bg-red-50 dark:bg-red-900/30 rounded-lg'>
                <div className='font-medium'>Critical Vulnerability</div>
                <div className='text-sm'>
                  Outdated library detected in web application
                </div>
              </div>
              <button className='w-full border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 py-2 px-4 rounded-md flex items-center justify-center'>
                <FaHistory className='mr-2' />
                View Full Security Log
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SecurityPage
