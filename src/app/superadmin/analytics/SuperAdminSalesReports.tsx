"use client"
import { FaChartLine, FaCalendarAlt, FaFileExport } from 'react-icons/fa'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

const salesData = [
  { name: 'Jan', revenue: 4000, orders: 2400 },
  { name: 'Feb', revenue: 3000, orders: 1398 },
  { name: 'Mar', revenue: 2000, orders: 9800 },
  { name: 'Apr', revenue: 2780, orders: 3908 },
  { name: 'May', revenue: 1890, orders: 4800 },
  { name: 'Jun', revenue: 2390, orders: 3800 },
  { name: 'Jul', revenue: 3490, orders: 4300 },
]

const SuperAdminSalesReports = () => {
  return (
    <div className='bg-white rounded-lg shadow-md p-6 overflow-y-auto max-h-[calc(100vh-200px)]'>
      <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-6'>
        <h2 className='text-2xl font-bold text-gray-800 flex items-center'>
          <FaChartLine className='mr-2 text-superadmin-600' />
          Sales Reports
        </h2>
        <div className='flex space-x-3 mt-3 md:mt-0'>
          <button className='border border-gray-300 hover:bg-gray-100 px-4 py-2 rounded-md flex items-center'>
            <FaCalendarAlt className='mr-2' />
            Select Date Range
          </button>
          <button className='border border-gray-300 hover:bg-gray-100 px-4 py-2 rounded-md flex items-center'>
            <FaFileExport className='mr-2' />
            Export Report
          </button>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
        <div className='bg-gray-50 p-4 rounded-lg'>
          <h3 className='text-sm font-medium text-gray-500'>Total Revenue</h3>
          <p className='text-2xl font-semibold text-gray-900'>$24,780.00</p>
          <p className='text-sm text-green-600'>↑ 12.5% from last month</p>
        </div>
        <div className='bg-gray-50 p-4 rounded-lg'>
          <h3 className='text-sm font-medium text-gray-500'>Total Orders</h3>
          <p className='text-2xl font-semibold text-gray-900'>1,842</p>
          <p className='text-sm text-green-600'>↑ 8.3% from last month</p>
        </div>
        <div className='bg-gray-50 p-4 rounded-lg'>
          <h3 className='text-sm font-medium text-gray-500'>
            Average Order Value
          </h3>
          <p className='text-2xl font-semibold text-gray-900'>$134.52</p>
          <p className='text-sm text-red-600'>↓ 3.2% from last month</p>
        </div>
      </div>

      <div className='h-80 mb-8'>
        <ResponsiveContainer width='100%' height='100%'>
          <BarChart data={salesData}>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='name' />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey='revenue' fill='#4299e1' name='Revenue ($)' />
            <Bar dataKey='orders' fill='#48bb78' name='Orders' />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className='overflow-x-auto'>
        <table className='min-w-full divide-y divide-gray-200'>
          <thead className='bg-gray-50'>
            <tr>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Month
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Revenue
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Orders
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                AOV
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Growth
              </th>
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
            {salesData.map((month) => (
              <tr key={month.name}>
                <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                  {month.name}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                  ${month.revenue.toLocaleString()}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                  {month.orders.toLocaleString()}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                  ${(month.revenue / month.orders).toFixed(2)}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-green-600'>
                  +{Math.floor(Math.random() * 20) + 5}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default SuperAdminSalesReports
