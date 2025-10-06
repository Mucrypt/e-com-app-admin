// OrderCharts.tsx - Updated with toggle functionality
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'
import { useState } from 'react'

// --- Type Definitions ---
type SalesData = { name: string; value: number }
type PaymentMethodData = { name: string; value: number }
type StatusData = { name: string; value: number }
type Payment = {
  id: string
  amount: number
  method: string
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  transaction_id: string
  date: string
}
type Order = {
  id: string
  payments: Payment[]
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

interface OrderChartsProps {
  salesData: SalesData[]
  paymentMethodData: PaymentMethodData[]
  statusData: StatusData[]
  orders: Order[]
  getPaymentIcon: (method: string) => React.ReactNode
}

export default function OrderCharts({
  salesData,
  paymentMethodData,
  statusData,
  orders,
  getPaymentIcon,
}: OrderChartsProps) {
  const [showSalesChart, setShowSalesChart] = useState(false)
  const [showPaymentChart, setShowPaymentChart] = useState(false)
  const [showStatusChart, setShowStatusChart] = useState(false)
  const [showRecentPayments, setShowRecentPayments] = useState(false)

  return (
    <>
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6'>
        {/* Sales Overview Chart */}
        <Card className='lg:col-span-2'>
          <CardHeader className='pb-3'>
            <div className='flex justify-between items-center'>
              <CardTitle>Sales Overview</CardTitle>
              <Button
                variant='outline'
                size='sm'
                onClick={() => setShowSalesChart(!showSalesChart)}
                className='flex items-center gap-1'
              >
                {showSalesChart ? 'Hide Chart' : 'Show Chart'}
                {showSalesChart ? (
                  <ChevronUp className='h-4 w-4' />
                ) : (
                  <ChevronDown className='h-4 w-4' />
                )}
              </Button>
            </div>
            <CardDescription>Last 6 months revenue</CardDescription>
          </CardHeader>
          {showSalesChart && (
            <CardContent>
              <div className='h-[300px]'>
                <AreaChart width={600} height={300} data={salesData}>
                  <Area
                    type='monotone'
                    dataKey='value'
                    stroke='#8884d8'
                    fill='#8884d8'
                  />
                </AreaChart>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Payment Methods Chart */}
        <Card>
          <CardHeader className='pb-3'>
            <div className='flex justify-between items-center'>
              <CardTitle>Payment Methods</CardTitle>
              <Button
                variant='outline'
                size='sm'
                onClick={() => setShowPaymentChart(!showPaymentChart)}
                className='flex items-center gap-1'
              >
                {showPaymentChart ? 'Hide Chart' : 'Show Chart'}
                {showPaymentChart ? (
                  <ChevronUp className='h-4 w-4' />
                ) : (
                  <ChevronDown className='h-4 w-4' />
                )}
              </Button>
            </div>
            <CardDescription>Distribution by payment type</CardDescription>
          </CardHeader>
          {showPaymentChart && (
            <CardContent>
              <div className='h-[300px]'>
                <PieChart width={300} height={300}>
                  <Pie
                    data={paymentMethodData}
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
                    {paymentMethodData.map(
                      (entry: PaymentMethodData, index: number) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      )
                    )}
                  </Pie>
                </PieChart>
              </div>
            </CardContent>
          )}
        </Card>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6'>
        {/* Order Status Chart */}
        <Card>
          <CardHeader className='pb-3'>
            <div className='flex justify-between items-center'>
              <CardTitle>Order Status</CardTitle>
              <Button
                variant='outline'
                size='sm'
                onClick={() => setShowStatusChart(!showStatusChart)}
                className='flex items-center gap-1'
              >
                {showStatusChart ? 'Hide Chart' : 'Show Chart'}
                {showStatusChart ? (
                  <ChevronUp className='h-4 w-4' />
                ) : (
                  <ChevronDown className='h-4 w-4' />
                )}
              </Button>
            </div>
            <CardDescription>Distribution by status</CardDescription>
          </CardHeader>
          {showStatusChart && (
            <CardContent>
              <div className='h-[300px]'>
                <BarChart width={300} height={300} data={statusData}>
                  <Bar dataKey='value' fill='#8884d8' />
                </BarChart>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Recent Payments Table */}
        <Card className='lg:col-span-2'>
          <CardHeader className='pb-3'>
            <div className='flex justify-between items-center'>
              <CardTitle>Recent Payments</CardTitle>
              <Button
                variant='outline'
                size='sm'
                onClick={() => setShowRecentPayments(!showRecentPayments)}
                className='flex items-center gap-1'
              >
                {showRecentPayments ? 'Hide Table' : 'Show Table'}
                {showRecentPayments ? (
                  <ChevronUp className='h-4 w-4' />
                ) : (
                  <ChevronDown className='h-4 w-4' />
                )}
              </Button>
            </div>
            <CardDescription>Last 10 successful transactions</CardDescription>
          </CardHeader>
          {showRecentPayments && (
            <CardContent>
              <div className='overflow-x-auto'>
                <table className='w-full'>
                  <thead>
                    <tr className='border-b'>
                      <th className='text-left py-2 px-3'>Transaction</th>
                      <th className='text-left py-2 px-3'>Method</th>
                      <th className='text-left py-2 px-3'>Amount</th>
                      <th className='text-left py-2 px-3'>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders
                      .filter((o: Order) =>
                        o.payments.some(
                          (p: Payment) => p.status === 'completed'
                        )
                      )
                      .slice(0, 10)
                      .map((order: Order) => (
                        <tr
                          key={order.id}
                          className='border-b hover:bg-gray-50'
                        >
                          <td className='py-2 px-3'>
                            {order.payments[0].transaction_id}
                          </td>
                          <td className='py-2 px-3'>
                            <span className='flex items-center gap-2'>
                              {getPaymentIcon(order.payments[0].method)}
                              <span className='capitalize'>
                                {order.payments[0].method.replace('_', ' ')}
                              </span>
                            </span>
                          </td>
                          <td className='py-2 px-3'>
                            ${order.payments[0].amount.toFixed(2)}
                          </td>
                          <td className='py-2 px-3'>
                            {new Date(
                              order.payments[0].date
                            ).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </>
  )
}
