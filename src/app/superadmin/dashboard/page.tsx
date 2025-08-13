'use client'
import { JSX } from 'react'
import {
  FaChartLine,
  FaUsers,
  FaBoxes,
  FaDatabase,
  FaShieldAlt,
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

interface SalesData {
  name: string
  revenue: number
  orders: number
}

interface UserData {
  name: string
  value: number
}

interface SystemStat {
  name: string
  value: string
  icon: JSX.Element
}

interface RecentActivity {
  id: number
  action: string
  time: string
  user: string
}

const salesData: SalesData[] = [
  { name: 'Jan', revenue: 4000, orders: 2400 },
  { name: 'Feb', revenue: 3000, orders: 1398 },
  { name: 'Mar', revenue: 2000, orders: 9800 },
  { name: 'Apr', revenue: 2780, orders: 3908 },
  { name: 'May', revenue: 1890, orders: 4800 },
  { name: 'Jun', revenue: 2390, orders: 3800 },
]

const userData: UserData[] = [
  { name: 'New', value: 400 },
  { name: 'Returning', value: 300 },
  { name: 'Inactive', value: 200 },
]

const COLORS = ['#4299e1', '#48bb78', '#f56565']

const systemStats: SystemStat[] = [
  {
    name: 'Database Size',
    value: '4.2 GB',
    icon: <FaDatabase className='text-2xl text-blue-500' />,
  },
  {
    name: 'Server Uptime',
    value: '99.98%',
    icon: <FaShieldAlt className='text-2xl text-green-500' />,
  },
  {
    name: 'Active Sessions',
    value: '142',
    icon: <FaUsers className='text-2xl text-purple-500' />,
  },
  {
    name: 'Pending Tasks',
    value: '8',
    icon: <FaBoxes className='text-2xl text-yellow-500' />,
  },
]

const recentActivities: RecentActivity[] = [
  {
    id: 1,
    action: 'System update installed',
    time: '10 minutes ago',
    user: 'superadmin',
  },
  {
    id: 2,
    action: 'New admin user created',
    time: '25 minutes ago',
    user: 'superadmin',
  },
  {
    id: 3,
    action: 'Database backup completed',
    time: '2 hours ago',
    user: 'system',
  },
  {
    id: 4,
    action: 'Security scan performed',
    time: '5 hours ago',
    user: 'system',
  },
]

const SuperAdminDashboard = () => {
  return (
    <div className='space-y-6 overflow-y-auto max-h-[calc(100vh-200px)]'>
      <div className='flex flex-col md:flex-row justify-between items-start md:items-center'>
        <h2 className='text-2xl font-bold text-gray-800 flex items-center'>
          <FaChartLine className='mr-2 text-superadmin-600' />
          SuperAdmin Dashboard
        </h2>
        <div className='mt-3 md:mt-0 text-sm text-gray-500'>
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        {systemStats.map((stat, index) => (
          <div
            key={index}
            className='bg-white rounded-lg shadow p-6 flex items-center'
          >
            <div className='p-3 rounded-full bg-gray-100 mr-4'>{stat.icon}</div>
            <div>
              <h3 className='text-sm font-medium text-gray-500'>{stat.name}</h3>
              <p className='text-2xl font-semibold text-gray-900'>
                {stat.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <div className='bg-white rounded-lg shadow p-6'>
          <h3 className='text-lg font-medium text-gray-900 mb-4'>
            Revenue & Orders
          </h3>
          <div className='h-80'>
            <ResponsiveContainer width='100%' height='100%'>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='name' />
                <YAxis yAxisId='left' orientation='left' stroke='#4299e1' />
                <YAxis yAxisId='right' orientation='right' stroke='#48bb78' />
                <Tooltip />
                <Legend />
                <Bar
                  yAxisId='left'
                  dataKey='revenue'
                  fill='#4299e1'
                  name='Revenue ($)'
                />
                <Bar
                  yAxisId='right'
                  dataKey='orders'
                  fill='#48bb78'
                  name='Orders'
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className='bg-white rounded-lg shadow p-6'>
          <h3 className='text-lg font-medium text-gray-900 mb-4'>
            User Distribution
          </h3>
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
                  label={({
                    name,
                    percent,
                  }: {
                    name: string
                    percent?: number
                  }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
                >
                  {userData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        <div className='bg-white rounded-lg shadow p-6 lg:col-span-2'>
          <h3 className='text-lg font-medium text-gray-900 mb-4'>
            Recent Activities
          </h3>
          <div className='space-y-4'>
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className='border-b border-gray-200 pb-4 last:border-0 last:pb-0'
              >
                <div className='flex justify-between'>
                  <span className='font-medium'>{activity.action}</span>
                  <span className='text-sm text-gray-500'>{activity.time}</span>
                </div>
                <div className='text-sm text-gray-600 mt-1'>
                  Initiated by:{' '}
                  <span className='font-mono'>{activity.user}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className='bg-white rounded-lg shadow p-6'>
          <h3 className='text-lg font-medium text-gray-900 mb-4'>
            Quick Actions
          </h3>
          <div className='space-y-3'>
            <button className='w-full bg-superadmin-600 hover:bg-superadmin-700 text-white py-2 px-4 rounded-md flex items-center justify-center'>
              <FaUsers className='mr-2' />
              Manage Admins
            </button>
            <button className='w-full border border-gray-300 hover:bg-gray-100 py-2 px-4 rounded-md flex items-center justify-center'>
              <FaDatabase className='mr-2' />
              Run Backup
            </button>
            <button className='w-full border border-gray-300 hover:bg-gray-100 py-2 px-4 rounded-md flex items-center justify-center'>
              <FaShieldAlt className='mr-2' />
              Security Scan
            </button>
            <button className='w-full border border-gray-300 hover:bg-gray-100 py-2 px-4 rounded-md flex items-center justify-center'>
              <FaChartLine className='mr-2' />
              View Reports
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SuperAdminDashboard
