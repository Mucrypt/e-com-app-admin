'use client'

import React, { useState, useEffect } from 'react'
import { toast } from 'sonner'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import {
  FiSearch,
  FiFilter,
  FiDownload,
  FiPrinter,
  FiMoreVertical,
  FiArrowUp,
  FiArrowDown,
  FiRefreshCw,
  FiExternalLink,
  FiDollarSign,
  FiCreditCard,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
} from 'react-icons/fi'
import { FaPaypal, FaCcStripe, FaAmazonPay, FaApplePay } from 'react-icons/fa'
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'
import { format } from 'date-fns'
import Image from 'next/image'

// Define custom types since we don't have 'orders' and 'customers' in Supabase types
type OrderItem = {
  id: string
  product_id: string
  product_name: string
  product_image: string
  quantity: number
  price: number
  discount: number
}

type Payment = {
  id: string
  amount: number
  method: string
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  transaction_id: string
  date: string
}

type Customer = {
  id: string
  name: string
  email: string
}

type Order = {
  id: string
  customer_id: string
  status: 'pending' | 'processing' | 'completed' | 'cancelled' | 'refunded'
  total_amount: number
  created_at: string
  updated_at: string
  customer: Customer | null
  items: OrderItem[]
  payments: Payment[]
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

export default function OrdersDashboard() {
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [dateRange, setDateRange] = useState<string>('30days')
  const [sortConfig, setSortConfig] = useState<{
    key: string
    direction: 'asc' | 'desc'
  }>({
    key: 'created_at',
    direction: 'desc',
  })
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showRefundDialog, setShowRefundDialog] = useState(false)

  // Fetch orders from Supabase
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true)
      try {
        // In a real app, you would fetch from your orders table with relationships
        // This is a mock implementation
        const mockOrders: Order[] = Array.from({ length: 50 }, (_, i) => ({
          id: `order_${i + 1000}`,
          customer_id: `cust_${Math.floor(Math.random() * 20) + 1}`,
          status: [
            'pending',
            'processing',
            'completed',
            'cancelled',
            'refunded',
          ][Math.floor(Math.random() * 5)] as Order['status'],
          total_amount: Math.floor(Math.random() * 1000) + 50,
          created_at: new Date(
            Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
          ).toISOString(),
          updated_at: new Date(
            Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
          ).toISOString(),
          customer: {
            id: `cust_${Math.floor(Math.random() * 20) + 1}`,
            name: [
              'John Doe',
              'Jane Smith',
              'Robert Johnson',
              'Emily Davis',
              'Michael Wilson',
            ][Math.floor(Math.random() * 5)],
            email: `customer${Math.floor(Math.random() * 20) + 1}@example.com`,
          },
          items: Array.from(
            { length: Math.floor(Math.random() * 5) + 1 },
            (_, j) => ({
              id: `item_${i}_${j}`,
              product_id: `prod_${Math.floor(Math.random() * 50) + 1}`,
              product_name: [
                'Smartphone',
                'Laptop',
                'Headphones',
                'Smartwatch',
                'Tablet',
              ][Math.floor(Math.random() * 5)],
              product_image: `https://source.unsplash.com/random/100x100?product=${i}_${j}`,
              quantity: Math.floor(Math.random() * 3) + 1,
              price: Math.floor(Math.random() * 300) + 50,
              discount: Math.floor(Math.random() * 30),
            })
          ),
          payments: [
            {
              id: `pay_${i}`,
              amount: Math.floor(Math.random() * 1000) + 50,
              method: [
                'credit_card',
                'paypal',
                'stripe',
                'amazon_pay',
                'apple_pay',
              ][Math.floor(Math.random() * 5)],
              status: ['pending', 'completed', 'failed', 'refunded'][
                Math.floor(Math.random() * 4)
              ] as Payment['status'],
              transaction_id: `txn_${Math.random()
                .toString(36)
                .substring(2, 10)}`,
              date: new Date(
                Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
              ).toISOString(),
            },
          ],
        }))

        setOrders(mockOrders)
        setFilteredOrders(mockOrders)
      } catch (error) {
        console.error('Error fetching orders:', error)
        toast.error('Failed to fetch orders')
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  // Filter and sort orders
  useEffect(() => {
    let result = [...orders]

    // Apply search filter
    if (searchTerm) {
      result = result.filter(
        (order) =>
          order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customer?.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          order.customer?.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter((order) => order.status === statusFilter)
    }

    // Apply date range filter
    const now = new Date()
    if (dateRange === 'today') {
      result = result.filter((order) => {
        const orderDate = new Date(order.created_at)
        return orderDate.toDateString() === now.toDateString()
      })
    } else if (dateRange === '7days') {
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      result = result.filter(
        (order) => new Date(order.created_at) >= sevenDaysAgo
      )
    } else if (dateRange === '30days') {
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      result = result.filter(
        (order) => new Date(order.created_at) >= thirtyDaysAgo
      )
    }

    // Apply sorting
    result.sort((a, b) => {
      if (sortConfig.key === 'total_amount') {
        return sortConfig.direction === 'asc'
          ? a.total_amount - b.total_amount
          : b.total_amount - a.total_amount
      } else if (sortConfig.key === 'created_at') {
        return sortConfig.direction === 'asc'
          ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          : new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      } else if (sortConfig.key === 'customer') {
        const nameA = a.customer?.name || ''
        const nameB = b.customer?.name || ''
        return sortConfig.direction === 'asc'
          ? nameA.localeCompare(nameB)
          : nameB.localeCompare(nameA)
      }
      return 0
    })

    setFilteredOrders(result)
  }, [orders, searchTerm, statusFilter, dateRange, sortConfig])

  // Chart data
  const salesData = [
    { name: 'Jan', value: 4000 },
    { name: 'Feb', value: 3000 },
    { name: 'Mar', value: 5000 },
    { name: 'Apr', value: 2780 },
    { name: 'May', value: 1890 },
    { name: 'Jun', value: 2390 },
  ]

  const paymentMethodData = [
    { name: 'Credit Card', value: 45 },
    { name: 'PayPal', value: 25 },
    { name: 'Stripe', value: 15 },
    { name: 'Apple Pay', value: 10 },
    { name: 'Amazon Pay', value: 5 },
  ]

  const statusData = [
    { name: 'Completed', value: 65 },
    { name: 'Processing', value: 15 },
    { name: 'Pending', value: 10 },
    { name: 'Cancelled', value: 5 },
    { name: 'Refunded', value: 5 },
  ]

  const handleSort = (key: string) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc',
    }))
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <Badge className='bg-green-100 text-green-800'>
            <FiCheckCircle className='mr-1' /> Completed
          </Badge>
        )
      case 'processing':
        return (
          <Badge className='bg-blue-100 text-blue-800'>
            <FiRefreshCw className='mr-1' /> Processing
          </Badge>
        )
      case 'pending':
        return (
          <Badge className='bg-yellow-100 text-yellow-800'>
            <span className='inline-flex items-center'>
              <FiAlertCircle className='mr-1' /> Pending
            </span>
          </Badge>
        )
      case 'cancelled':
        return (
          <Badge className='bg-red-100 text-red-800'>
            <FiXCircle className='mr-1' /> Cancelled
          </Badge>
        )
      case 'refunded':
        return (
          <Badge className='bg-purple-100 text-purple-800'>
            <FiDollarSign className='mr-1' /> Refunded
          </Badge>
        )
      default:
        return <Badge>{status}</Badge>
    }
  }

  const getPaymentIcon = (method: string) => {
    switch (method) {
      case 'credit_card':
        return <FiCreditCard className='text-gray-600' />
      case 'paypal':
        return <FaPaypal className='text-blue-600' />
      case 'stripe':
        return <FaCcStripe className='text-purple-600' />
      case 'amazon_pay':
        return <FaAmazonPay className='text-yellow-600' />
      case 'apple_pay':
        return <FaApplePay className='text-black' />
      default:
        return <FiDollarSign className='text-gray-600' />
    }
  }

  const handleRefund = (order: Order) => {
    setSelectedOrder(order)
    setShowRefundDialog(true)
  }

  const processRefund = async (amount: number, reason: string) => {
    if (!selectedOrder) return

    try {
      // In a real app, you would process the refund through your payment gateway
      toast.success(
        `Successfully refunded $${amount} for order ${selectedOrder.id}. Reason: ${reason}`
      )
      setShowRefundDialog(false)

      // Update the order status locally
      setOrders((prev) =>
        prev.map((order) =>
          order.id === selectedOrder.id
            ? { ...order, status: 'refunded' }
            : order
        )
      )
    } catch (error) {
      console.error('Error processing refund:', error)
      toast.error('Failed to process refund')
    }
  }

  // Simple OrderDetailsModal component
  const OrderDetailsModal = ({
    order,
    onClose,
  }: {
    order: Order
    onClose: () => void
  }) => (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto'>
        <div className='flex justify-between items-start mb-6'>
          <h2 className='text-2xl font-bold'>Order Details: {order.id}</h2>
          <button
            onClick={onClose}
            className='text-gray-500 hover:text-gray-700'
          >
            &times;
          </button>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
          <div>
            <h3 className='text-lg font-semibold mb-2'>Customer Information</h3>
            <div className='space-y-2'>
              <p>
                <span className='font-medium'>Name:</span>{' '}
                {order.customer?.name}
              </p>
              <p>
                <span className='font-medium'>Email:</span>{' '}
                {order.customer?.email}
              </p>
              <p>
                <span className='font-medium'>Order Date:</span>{' '}
                {format(new Date(order.created_at), 'MMM d, yyyy')}
              </p>
              <p>
                <span className='font-medium'>Status:</span>{' '}
                {getStatusBadge(order.status)}
              </p>
            </div>
          </div>

          <div>
            <h3 className='text-lg font-semibold mb-2'>Payment Information</h3>
            {order.payments.map((payment) => (
              <div key={payment.id} className='space-y-2'>
                <p>
                  <span className='font-medium'>Amount:</span> $
                  {payment.amount.toFixed(2)}
                </p>
                <p>
                  <span className='font-medium'>Method:</span>{' '}
                  {payment.method.replace('_', ' ')}
                </p>
                <p>
                  <span className='font-medium'>Status:</span> {payment.status}
                </p>
                <p>
                  <span className='font-medium'>Transaction ID:</span>{' '}
                  {payment.transaction_id}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className='text-lg font-semibold mb-2'>Order Items</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className='flex items-center gap-3'>
                    <Image
                      src={item.product_image}
                      alt={item.product_name}
                      width={50}
                      height={50}
                      className='rounded'
                    />
                    <span>{item.product_name}</span>
                  </TableCell>
                  <TableCell>${item.price.toFixed(2)}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>
                    ${(item.price * item.quantity).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className='mt-6 flex justify-end gap-3'>
          <Button variant='outline' onClick={onClose}>
            Close
          </Button>
          <Button
            onClick={() => {
              handleRefund(order)
              onClose()
            }}
          >
            Process Refund
          </Button>
        </div>
      </div>
    </div>
  )

  // Simple RefundDialog component
  const RefundDialog = ({
    order,
    onCancel,
    onConfirm,
  }: {
    order: Order
    onCancel: () => void
    onConfirm: (amount: number, reason: string) => void
  }) => {
    const [amount, setAmount] = useState(order.total_amount)
    const [reason, setReason] = useState('')

    return (
      <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
        <div className='bg-white rounded-lg p-6 max-w-md w-full'>
          <h2 className='text-xl font-bold mb-4'>Process Refund</h2>
          <div className='space-y-4'>
            <div>
              <Label>Order ID</Label>
              <p>{order.id}</p>
            </div>
            <div>
              <Label>Customer</Label>
              <p>{order.customer?.name}</p>
            </div>
            <div>
              <Label>Original Amount</Label>
              <p>${order.total_amount.toFixed(2)}</p>
            </div>
            <div>
              <Label>Refund Amount</Label>
              <Input
                type='number'
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                min='0'
                max={order.total_amount}
              />
            </div>
            <div>
              <Label>Reason for Refund</Label>
              <textarea
                className='w-full p-2 border rounded'
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                placeholder='Enter reason for refund'
                title='Reason for Refund'
              />
            </div>
          </div>
          <div className='mt-6 flex justify-end gap-3'>
            <Button variant='outline' onClick={onCancel}>
              Cancel
            </Button>
            <Button onClick={() => onConfirm(amount, reason)}>
              Confirm Refund
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='space-y-6 px-4 sm:px-6 lg:px-8 py-8 overflow-y-auto max-h-[calc(100vh-200px)]'>
      <div className='grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6'>
        {/* Stats Cards */}
        <Card className='bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200'>
          <CardHeader className='pb-2'>
            <CardDescription className='text-blue-600'>
              Total Revenue
            </CardDescription>
            <CardTitle className='text-3xl'>$24,780</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='flex items-center text-sm text-blue-600'>
              <FiArrowUp className='mr-1' /> 12% from last month
            </div>
          </CardContent>
        </Card>

        <Card className='bg-gradient-to-r from-green-50 to-green-100 border-green-200'>
          <CardHeader className='pb-2'>
            <CardDescription className='text-green-600'>
              Orders Completed
            </CardDescription>
            <CardTitle className='text-3xl'>1,248</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='flex items-center text-sm text-green-600'>
              <FiArrowUp className='mr-1' /> 8% from last month
            </div>
          </CardContent>
        </Card>

        <Card className='bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200'>
          <CardHeader className='pb-2'>
            <CardDescription className='text-yellow-600'>
              Avg. Order Value
            </CardDescription>
            <CardTitle className='text-3xl'>$198.72</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='flex items-center text-sm text-yellow-600'>
              <FiArrowUp className='mr-1' /> 3% from last month
            </div>
          </CardContent>
        </Card>

        <Card className='bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200'>
          <CardHeader className='pb-2'>
            <CardDescription className='text-purple-600'>
              Refunds
            </CardDescription>
            <CardTitle className='text-3xl'>$2,450</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='flex items-center text-sm text-purple-600'>
              <FiArrowDown className='mr-1' /> 2% from last month
            </div>
          </CardContent>
        </Card>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6'>
        {/* Sales Chart */}
        <Card className='lg:col-span-2'>
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
            <CardDescription>Last 6 months revenue</CardDescription>
          </CardHeader>
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
        </Card>

        {/* Payment Methods */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
            <CardDescription>Distribution by payment type</CardDescription>
          </CardHeader>
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
                  label={({ name, percent }) =>
                    `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`
                  }
                >
                  {paymentMethodData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6'>
        {/* Order Status */}
        <Card>
          <CardHeader>
            <CardTitle>Order Status</CardTitle>
            <CardDescription>Distribution by status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='h-[300px]'>
              <BarChart width={300} height={300} data={statusData}>
                <Bar dataKey='value' fill='#8884d8' />
              </BarChart>
            </div>
          </CardContent>
        </Card>

        {/* Recent Payments */}
        <Card className='lg:col-span-2'>
          <CardHeader>
            <CardTitle>Recent Payments</CardTitle>
            <CardDescription>Last 10 successful transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders
                  .filter((o) =>
                    o.payments.some((p) => p.status === 'completed')
                  )
                  .slice(0, 10)
                  .map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className='font-medium'>
                        {order.payments[0].transaction_id}
                      </TableCell>
                      <TableCell>
                        <div className='flex items-center gap-2'>
                          {getPaymentIcon(order.payments[0].method)}
                          <span className='capitalize'>
                            {order.payments[0].method.replace('_', ' ')}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        ${order.payments[0].amount.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        {format(
                          new Date(order.payments[0].date),
                          'MMM d, yyyy'
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
            <div>
              <CardTitle>Order Management</CardTitle>
              <CardDescription>
                {filteredOrders.length} orders found
              </CardDescription>
            </div>
            <div className='flex flex-col md:flex-row gap-3 w-full md:w-auto'>
              <div className='relative w-full md:w-64'>
                <FiSearch className='absolute left-3 top-3 text-gray-400' />
                <Input
                  placeholder='Search orders...'
                  className='pl-10 w-full'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className='flex gap-2'>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant='outline'
                      className='flex items-center gap-2'
                    >
                      <FiFilter />
                      Status
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setStatusFilter('all')}>
                      All Statuses
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setStatusFilter('pending')}
                    >
                      Pending
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setStatusFilter('processing')}
                    >
                      Processing
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setStatusFilter('completed')}
                    >
                      Completed
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setStatusFilter('cancelled')}
                    >
                      Cancelled
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setStatusFilter('refunded')}
                    >
                      Refunded
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant='outline'
                      className='flex items-center gap-2'
                    >
                      <FiFilter />
                      Date Range
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setDateRange('today')}>
                      Today
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setDateRange('7days')}>
                      Last 7 Days
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setDateRange('30days')}>
                      Last 30 Days
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setDateRange('all')}>
                      All Time
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button variant='outline' className='flex items-center gap-2'>
                  <FiDownload />
                  Export
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  className='cursor-pointer'
                  onClick={() => handleSort('id')}
                >
                  <div className='flex items-center'>
                    Order ID
                    {sortConfig.key === 'id' &&
                      (sortConfig.direction === 'asc' ? (
                        <FiArrowUp className='ml-1' />
                      ) : (
                        <FiArrowDown className='ml-1' />
                      ))}
                  </div>
                </TableHead>
                <TableHead
                  className='cursor-pointer'
                  onClick={() => handleSort('customer')}
                >
                  <div className='flex items-center'>
                    Customer
                    {sortConfig.key === 'customer' &&
                      (sortConfig.direction === 'asc' ? (
                        <FiArrowUp className='ml-1' />
                      ) : (
                        <FiArrowDown className='ml-1' />
                      ))}
                  </div>
                </TableHead>
                <TableHead>Items</TableHead>
                <TableHead
                  className='cursor-pointer'
                  onClick={() => handleSort('total_amount')}
                >
                  <div className='flex items-center'>
                    Amount
                    {sortConfig.key === 'total_amount' &&
                      (sortConfig.direction === 'asc' ? (
                        <FiArrowUp className='ml-1' />
                      ) : (
                        <FiArrowDown className='ml-1' />
                      ))}
                  </div>
                </TableHead>
                <TableHead>Payment</TableHead>
                <TableHead
                  className='cursor-pointer'
                  onClick={() => handleSort('created_at')}
                >
                  <div className='flex items-center'>
                    Date
                    {sortConfig.key === 'created_at' &&
                      (sortConfig.direction === 'asc' ? (
                        <FiArrowUp className='ml-1' />
                      ) : (
                        <FiArrowDown className='ml-1' />
                      ))}
                  </div>
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className='text-center py-8'>
                    Loading orders...
                  </TableCell>
                </TableRow>
              ) : filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className='text-center py-8'>
                    No orders found matching your criteria
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className='font-medium'>{order.id}</TableCell>
                    <TableCell>
                      <div className='font-medium'>{order.customer?.name}</div>
                      <div className='text-sm text-gray-500'>
                        {order.customer?.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className='flex -space-x-2'>
                        {order.items.slice(0, 3).map((item, i) => (
                          <Image
                            key={i}
                            src={item.product_image}
                            alt={item.product_name}
                            width={32}
                            height={32}
                            className='w-8 h-8 rounded-full border-2 border-white'
                          />
                        ))}
                        {order.items.length > 3 && (
                          <div className='w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs'>
                            +{order.items.length - 3}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>${order.total_amount.toFixed(2)}</TableCell>
                    <TableCell>
                      <div className='flex items-center gap-2'>
                        {getPaymentIcon(order.payments[0].method)}
                        <span className='capitalize'>
                          {order.payments[0].method.replace('_', ' ')}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {format(new Date(order.created_at), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant='ghost' size='icon'>
                            <FiMoreVertical className='h-4 w-4' />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end'>
                          <DropdownMenuItem
                            onClick={() => setSelectedOrder(order)}
                          >
                            <FiExternalLink className='mr-2' />
                            View Details
                          </DropdownMenuItem>
                          {order.status === 'completed' && (
                            <DropdownMenuItem
                              onClick={() => handleRefund(order)}
                            >
                              <FiDollarSign className='mr-2' />
                              Process Refund
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem>
                            <FiPrinter className='mr-2' />
                            Print Invoice
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className='flex justify-between'>
          <div className='text-sm text-gray-500'>
            Showing {filteredOrders.length} of {orders.length} orders
          </div>
          <div className='flex gap-2'>
            <Button variant='outline' disabled>
              Previous
            </Button>
            <Button variant='outline' disabled>
              Next
            </Button>
          </div>
        </CardFooter>
      </Card>

      {/* Order Details Modal */}
      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}

      {/* Refund Dialog */}
      {showRefundDialog && selectedOrder && (
        <RefundDialog
          order={selectedOrder}
          onCancel={() => setShowRefundDialog(false)}
          onConfirm={processRefund}
        />
      )}
    </div>
  )
}
