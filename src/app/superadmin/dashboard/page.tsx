'use client'
import React, { JSX, useState, useEffect } from 'react'
import {
  FaChartLine,
  FaUsers,
  FaBoxes,
  FaDatabase,
  FaShieldAlt,
  FaBell,
  FaSearch,
  FaSync,
  FaExclamationTriangle,
  FaChevronRight,
  FaPlus,
  FaCloudDownloadAlt,
  FaLock,
  FaChartBar,
  FaServer,
  FaNetworkWired,
  FaUserCog,
} from 'react-icons/fa'
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

// Types
interface SalesData {
  name: string
  revenue: number
  orders: number
  profit: number
}

interface UserData {
  name: string
  value: number
}

interface SystemStat {
  name: string
  value: string
  icon: JSX.Element
  trend: 'up' | 'down' | 'stable'
  change: string
}

interface RecentActivity {
  id: number
  action: string
  time: string
  user: string
  severity: 'low' | 'medium' | 'high'
  category: string
}

interface Alert {
  id: number
  title: string
  description: string
  severity: 'low' | 'medium' | 'high'
  timestamp: string
  resolved: boolean
}

interface PerformanceMetric {
  name: string
  value: number
  max: number
  trend: 'up' | 'down' | 'stable'
}

// Mock data
const salesData: SalesData[] = [
  { name: 'Jan', revenue: 12400, orders: 1240, profit: 4200 },
  { name: 'Feb', revenue: 9800, orders: 890, profit: 3100 },
  { name: 'Mar', revenue: 14500, orders: 1250, profit: 5200 },
  { name: 'Apr', revenue: 11200, orders: 980, profit: 3800 },
  { name: 'May', revenue: 16800, orders: 1420, profit: 6200 },
  { name: 'Jun', revenue: 19200, orders: 1680, profit: 7200 },
  { name: 'Jul', revenue: 21500, orders: 1820, profit: 8200 },
]

const userData: UserData[] = [
  { name: 'New', value: 42 },
  { name: 'Returning', value: 35 },
  { name: 'Inactive', value: 23 },
]

const COLORS = ['#4299e1', '#48bb78', '#f56565', '#f6e05e', '#9f7aea']

const performanceMetrics: PerformanceMetric[] = [
  { name: 'CPU Usage', value: 65, max: 100, trend: 'up' },
  { name: 'Memory', value: 48, max: 100, trend: 'stable' },
  { name: 'Disk I/O', value: 32, max: 100, trend: 'down' },
  { name: 'Network', value: 78, max: 100, trend: 'up' },
]

const alerts: Alert[] = [
  {
    id: 1,
    title: 'High CPU Usage',
    description: 'Server CPU usage exceeded 85% for more than 5 minutes',
    severity: 'high',
    timestamp: '10 minutes ago',
    resolved: false,
  },
  {
    id: 2,
    title: 'Database Backup Failed',
    description: "Last night's automated backup failed to complete",
    severity: 'medium',
    timestamp: '3 hours ago',
    resolved: false,
  },
  {
    id: 3,
    title: 'Unusual Login Activity',
    description: 'Multiple failed login attempts from unusual location',
    severity: 'high',
    timestamp: '5 hours ago',
    resolved: true,
  },
  {
    id: 4,
    title: 'SSL Certificate Expiring',
    description: 'SSL certificate will expire in 7 days',
    severity: 'medium',
    timestamp: '1 day ago',
    resolved: false,
  },
]

const recentActivities: RecentActivity[] = [
  {
    id: 1,
    action: 'System update installed (v3.2.1)',
    time: '10 minutes ago',
    user: 'superadmin',
    severity: 'low',
    category: 'System',
  },
  {
    id: 2,
    action: 'New admin user created',
    time: '25 minutes ago',
    user: 'superadmin',
    severity: 'medium',
    category: 'User Management',
  },
  {
    id: 3,
    action: 'Database backup completed',
    time: '2 hours ago',
    user: 'system',
    severity: 'low',
    category: 'System',
  },
  {
    id: 4,
    action: 'Security scan performed - 0 threats found',
    time: '5 hours ago',
    user: 'system',
    severity: 'low',
    category: 'Security',
  },
  {
    id: 5,
    action: 'API rate limit exceeded by client 192.168.1.45',
    time: '8 hours ago',
    user: 'system',
    severity: 'high',
    category: 'Security',
  },
]

const tabRoutes = [
  { label: 'Overview', href: '/superadmin/dashboard' },
  { label: 'Analytics', href: '/superadmin/dashboard/analytics' },
  { label: 'Users', href: '/superadmin/dashboard/users' },
  { label: 'System', href: '/superadmin/system/system-dashboard' },
  { label: 'Security', href: '/superadmin/system/security' },
  { label: 'Logs', href: '/superadmin/system/audit-logs' },
]

const SuperAdminDashboard = () => {
  const [lastUpdated, setLastUpdated] = useState<string>('')
  const [darkMode, setDarkMode] = useState(false)
  const [] = useState('overview')
  const [searchQuery, setSearchQuery] = useState('')
  const [isSyncing, setIsSyncing] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setLastUpdated(new Date().toLocaleString())

    // Check system preference for dark mode
    if (
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      setDarkMode(true)
    }
  }, [])

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle('dark')
  }

  const handleSync = () => {
    setIsSyncing(true)
    // Simulate API call
    setTimeout(() => {
      setIsSyncing(false)
      setLastUpdated(new Date().toLocaleString())
    }, 1500)
  }

  const systemStats: SystemStat[] = [
    {
      name: 'Database Size',
      value: '4.2 GB',
      icon: <FaDatabase className='text-2xl text-blue-500' />,
      trend: 'up',
      change: '+2.1%',
    },
    {
      name: 'Server Uptime',
      value: '99.98%',
      icon: <FaShieldAlt className='text-2xl text-green-500' />,
      trend: 'stable',
      change: '0%',
    },
    {
      name: 'Active Sessions',
      value: '142',
      icon: <FaUsers className='text-2xl text-purple-500' />,
      trend: 'up',
      change: '+12%',
    },
    {
      name: 'Pending Tasks',
      value: '8',
      icon: <FaBoxes className='text-2xl text-yellow-500' />,
      trend: 'down',
      change: '-3%',
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

  return (
    <div
      className={`space-y-6 overflow-y-auto max-h-[calc(100vh-200px)] transition-colors duration-300 ${
        darkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
      }`}
    >
      {/* Header */}
      <header className='sticky top-0 z-10 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700'>
        <div className='px-6 py-4 flex items-center justify-between'>
          <div className='flex items-center space-x-4'>
            <h1 className='text-2xl font-bold flex items-center'>
              <FaChartLine className='mr-2 text-blue-500' />
              SuperAdmin Console
            </h1>
            <div className='hidden md:flex space-x-2'>
              {tabRoutes.map((tab) => (
                <Link
                  key={tab.label}
                  href={tab.href}
                  className={`px-3 py-1 rounded-md text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700
                    ${
                      pathname === tab.href
                        ? 'bg-blue-600 text-white dark:bg-blue-500'
                        : ''
                    }
                  `}
                >
                  {tab.label}
                </Link>
              ))}
            </div>
          </div>

          <div className='flex items-center space-x-4'>
            <div className='relative'>
              <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                <FaSearch className='text-gray-400' />
              </div>
              <input
                type='text'
                placeholder='Search across systems...'
                className='pl-10 pr-4 py-2 w-64 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <button
              className='p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700'
              onClick={toggleDarkMode}
            >
              {darkMode ? '☀️' : '🌙'}
            </button>

            <button className='p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 relative'>
              <FaBell />
              <span className='absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center'>
                3
              </span>
            </button>

            <div className='flex items-center'>
              <div className='h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold'>
                SA
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className='px-6 py-6 space-y-6'>
        {/* Dashboard Header */}
        <div className='flex flex-col md:flex-row justify-between items-start md:items-center'>
          <div>
            <h2 className='text-2xl font-bold'>System Overview</h2>
            <p className='text-gray-500 dark:text-gray-400 mt-1'>
              Monitor and manage your entire infrastructure from one place
              {lastUpdated && <span> • Last updated: {lastUpdated}</span>}
            </p>
          </div>
          <div className='flex space-x-2 mt-4 md:mt-0'>
            <button
              className='px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md flex items-center hover:bg-gray-50 dark:hover:bg-gray-700'
              onClick={handleSync}
              disabled={isSyncing}
            >
              <FaSync className={`mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
              {isSyncing ? 'Syncing...' : 'Refresh Data'}
            </button>
            <button className='px-4 py-2 bg-blue-600 text-white rounded-md flex items-center hover:bg-blue-700'>
              <FaPlus className='mr-2' />
              New Action
            </button>
          </div>
        </div>

        {/* Alert Banner */}
        {alerts.filter((a) => !a.resolved).length > 0 && (
          <div className='bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4'>
            <div className='flex items-start'>
              <div className='flex-shrink-0'>
                <FaExclamationTriangle className='h-5 w-5 text-red-400' />
              </div>
              <div className='ml-3'>
                <h3 className='text-sm font-medium text-red-800 dark:text-red-200'>
                  {alerts.filter((a) => !a.resolved).length} active{' '}
                  {alerts.filter((a) => !a.resolved).length === 1
                    ? 'alert'
                    : 'alerts'}{' '}
                  requiring attention
                </h3>
                <div className='mt-2 text-sm text-red-700 dark:text-red-300'>
                  <ul className='list-disc pl-5 space-y-1'>
                    {alerts
                      .filter((a) => !a.resolved)
                      .slice(0, 2)
                      .map((alert) => (
                        <li key={alert.id}>{alert.title}</li>
                      ))}
                    {alerts.filter((a) => !a.resolved).length > 2 && (
                      <li>
                        ...and {alerts.filter((a) => !a.resolved).length - 2}{' '}
                        more
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* System Stats Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
          {systemStats.map((stat, index) => (
            <div
              key={index}
              className={`rounded-xl shadow-sm p-6 flex items-center ${
                darkMode ? 'bg-gray-800' : 'bg-white'
              }`}
            >
              <div className='p-3 rounded-full bg-gray-100 dark:bg-gray-700 mr-4'>
                {stat.icon}
              </div>
              <div className='flex-1'>
                <h3 className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                  {stat.name}
                </h3>
                <div className='flex items-baseline justify-between'>
                  <p className='text-2xl font-semibold'>{stat.value}</p>
                  <span
                    className={`text-xs font-medium ${
                      stat.trend === 'up'
                        ? 'text-green-500'
                        : stat.trend === 'down'
                        ? 'text-red-500'
                        : 'text-yellow-500'
                    }`}
                  >
                    {getTrendIcon(stat.trend)} {stat.change}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          <div
            className={`rounded-xl shadow-sm p-6 ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            }`}
          >
            <div className='flex items-center justify-between mb-6'>
              <h3 className='text-lg font-medium'>Revenue & Orders</h3>
              <button className='text-sm text-blue-500 hover:text-blue-700 flex items-center'>
                View report <FaChevronRight className='ml-1 text-xs' />
              </button>
            </div>
            <div className='h-80'>
              <ResponsiveContainer width='100%' height='100%'>
                <BarChart data={salesData}>
                  <CartesianGrid
                    strokeDasharray='3 3'
                    stroke={darkMode ? '#4B5563' : '#E5E7EB'}
                  />
                  <XAxis
                    dataKey='name'
                    stroke={darkMode ? '#9CA3AF' : '#6B7280'}
                  />
                  <YAxis
                    yAxisId='left'
                    orientation='left'
                    stroke={darkMode ? '#9CA3AF' : '#6B7280'}
                  />
                  <YAxis
                    yAxisId='right'
                    orientation='right'
                    stroke={darkMode ? '#9CA3AF' : '#6B7280'}
                  />
                  <Tooltip
                    contentStyle={
                      darkMode
                        ? {
                            backgroundColor: '#1F2937',
                            borderColor: '#374151',
                            color: '#F9FAFB',
                          }
                        : {}
                    }
                  />
                  <Legend />
                  <Bar
                    yAxisId='left'
                    dataKey='revenue'
                    fill='#4299e1'
                    name='Revenue ($)'
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    yAxisId='right'
                    dataKey='orders'
                    fill='#48bb78'
                    name='Orders'
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div
            className={`rounded-xl shadow-sm p-6 ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            }`}
          >
            <div className='flex items-center justify-between mb-6'>
              <h3 className='text-lg font-medium'>User Distribution</h3>
              <button className='text-sm text-blue-500 hover:text-blue-700 flex items-center'>
                Manage users <FaChevronRight className='ml-1 text-xs' />
              </button>
            </div>
            <div className='h-80'>
              <ResponsiveContainer width='100%' height='100%'>
                <PieChart>
                  <Pie
                    data={userData}
                    cx='50%'
                    cy='50%'
                    labelLine={false}
                    outerRadius={80}
                    fill='#8884d8'
                    dataKey='value'
                    label={({ name, percent }) =>
                      `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`
                    }
                  >
                    {userData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={
                      darkMode
                        ? {
                            backgroundColor: '#1F2937',
                            borderColor: '#374151',
                            color: '#F9FAFB',
                          }
                        : {}
                    }
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div
          className={`rounded-xl shadow-sm p-6 ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          }`}
        >
          <h3 className='text-lg font-medium mb-6'>System Performance</h3>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
            {performanceMetrics.map((metric, index) => (
              <div
                key={index}
                className='p-4 border border-gray-200 dark:border-gray-700 rounded-lg'
              >
                <div className='flex items-center justify-between mb-2'>
                  <span className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                    {metric.name}
                  </span>
                  <span className='text-xs font-semibold'>
                    {getTrendIcon(metric.trend)}
                  </span>
                </div>
                <div className='w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-2'>
                  <div
                    className={`h-2.5 rounded-full ${
                      metric.value > 80
                        ? 'bg-red-500'
                        : metric.value > 60
                        ? 'bg-yellow-500'
                        : 'bg-green-500'
                    }`}
                    style={{ width: `${metric.value}%` }}
                  ></div>
                </div>
                <div className='flex justify-between text-sm'>
                  <span className='text-gray-500 dark:text-gray-400'>
                    Usage
                  </span>
                  <span className='font-medium'>{metric.value}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          <div
            className={`rounded-xl shadow-sm p-6 lg:col-span-2 ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            }`}
          >
            <div className='flex items-center justify-between mb-6'>
              <h3 className='text-lg font-medium'>Recent Activities</h3>
              <button className='text-sm text-blue-500 hover:text-blue-700 flex items-center'>
                View all <FaChevronRight className='ml-1 text-xs' />
              </button>
            </div>
            <div className='space-y-4'>
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className='border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0 last:pb-0'
                >
                  <div className='flex justify-between items-start'>
                    <div className='flex-1'>
                      <div className='flex items-center'>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(
                            activity.severity
                          )}`}
                        >
                          {activity.category}
                        </span>
                        <span className='ml-2 font-medium'>
                          {activity.action}
                        </span>
                      </div>
                      <div className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
                        Initiated by:{' '}
                        <span className='font-mono'>{activity.user}</span>
                      </div>
                    </div>
                    <span className='text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap'>
                      {activity.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className='space-y-6'>
            <div
              className={`rounded-xl shadow-sm p-6 ${
                darkMode ? 'bg-gray-800' : 'bg-white'
              }`}
            >
              <h3 className='text-lg font-medium mb-4'>Quick Actions</h3>
              <div className='space-y-3'>
                <button className='w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-md flex items-center justify-center'>
                  <FaUserCog className='mr-2' />
                  Manage Admins
                </button>
                <button className='w-full border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 py-3 px-4 rounded-md flex items-center justify-center'>
                  <FaCloudDownloadAlt className='mr-2' />
                  Run Backup
                </button>
                <button className='w-full border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 py-3 px-4 rounded-md flex items-center justify-center'>
                  <FaLock className='mr-2' />
                  Security Scan
                </button>
                <button className='w-full border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 py-3 px-4 rounded-md flex items-center justify-center'>
                  <FaChartBar className='mr-2' />
                  View Reports
                </button>
              </div>
            </div>

            <div
              className={`rounded-xl shadow-sm p-6 ${
                darkMode ? 'bg-gray-800' : 'bg-white'
              }`}
            >
              <h3 className='text-lg font-medium mb-4'>System Health</h3>
              <div className='space-y-4'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center'>
                    <div className='p-2 bg-green-100 dark:bg-green-900/30 rounded-lg mr-3'>
                      <FaServer className='text-green-500' />
                    </div>
                    <div>
                      <p className='font-medium'>Web Server</p>
                      <p className='text-sm text-gray-500 dark:text-gray-400'>
                        Response time: 128ms
                      </p>
                    </div>
                  </div>
                  <span className='bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 text-xs font-medium px-2.5 py-0.5 rounded-full'>
                    Operational
                  </span>
                </div>

                <div className='flex items-center justify-between'>
                  <div className='flex items-center'>
                    <div className='p-2 bg-green-100 dark:bg-green-900/30 rounded-lg mr-3'>
                      <FaDatabase className='text-green-500' />
                    </div>
                    <div>
                      <p className='font-medium'>Database</p>
                      <p className='text-sm text-gray-500 dark:text-gray-400'>
                        Query time: 42ms
                      </p>
                    </div>
                  </div>
                  <span className='bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 text-xs font-medium px-2.5 py-0.5 rounded-full'>
                    Operational
                  </span>
                </div>

                <div className='flex items-center justify-between'>
                  <div className='flex items-center'>
                    <div className='p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg mr-3'>
                      <FaNetworkWired className='text-yellow-500' />
                    </div>
                    <div>
                      <p className='font-medium'>CDN</p>
                      <p className='text-sm text-gray-500 dark:text-gray-400'>
                        Cache hit: 92%
                      </p>
                    </div>
                  </div>
                  <span className='bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 text-xs font-medium px-2.5 py-0.5 rounded-full'>
                    Degraded
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SuperAdminDashboard
