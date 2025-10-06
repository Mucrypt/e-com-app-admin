// OrdersDashboard.tsx - World-Class Enhanced Version
'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { toast } from 'sonner'
import OrderStats from './OrderStats'
import OrderCharts from './OrderCharts'
import OrdersTable, { SortField } from './OrdersTable'
import OrdersGrid from './OrdersGrid'
import OrderDetailsModal from './OrderDetailsModal'
import RefundDialog from './RefundDialog'
import DashboardFilters from './DashboardFilters'
import RealTimeActivity from './RealTimeActivity'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import {
  ChevronDown,
  ChevronUp,
  BarChart3,
  Download,
  Settings,
  Plus,
 
  Zap,
  Brain,
  
} from 'lucide-react'

// --- Types ---
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
  avatar?: string
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
  shipping_address?: {
    street: string
    city: string
    state: string
    country: string
    zip_code: string
  }
}

// Filter types
type StatusFilter =
  | 'all'
  | 'pending'
  | 'processing'
  | 'completed'
  | 'cancelled'
  | 'refunded'

type DateRangeFilter =
  | 'today'
  | 'yesterday'
  | '7days'
  | '30days'
  | '90days'
  | 'custom'

export default function OrdersDashboard() {
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [dateRange, setDateRange] = useState<DateRangeFilter>('30days')
  const [customStartDate, setCustomStartDate] = useState<string>('')
  const [customEndDate, setCustomEndDate] = useState<string>('')
  const [sortConfig, setSortConfig] = useState<{
    key: SortField
    direction: 'asc' | 'desc'
  }>({
    key: 'created_at',
    direction: 'desc',
  })
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showRefundDialog, setShowRefundDialog] = useState(false)
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')
  type RealTimeEvent = {
    id: number
    type:
      | 'new_order'
      | 'payment_received'
      | 'order_shipped'
      | 'refund_processed'
    message: string
    orderId: string
    timestamp: string
  }
  const [realTimeEvents, setRealTimeEvents] = useState<RealTimeEvent[]>([])
  const [selectedOrders, setSelectedOrders] = useState<string[]>([])
  const [showCharts, setShowCharts] = useState(false)
  type AiInsights = {
    predictedRevenue: string
    trendingProducts: string[]
    customerSatisfaction: string
    alert: string
    recommendation: string
  }
  const [aiInsights, setAiInsights] = useState<AiInsights | null>(null)
  const [darkMode, setDarkMode] = useState(false)

  // Toggle dark mode
  useEffect(() => {
    // Check system preference or saved preference
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    setDarkMode(isDark)

    // Add class to body for theme
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])

  // --- Mock Data Fetch ---
  useEffect(() => {
    setLoading(true)
    const mockOrders: Order[] = Array.from({ length: 50 }, (_, i) => {
      const statuses: Order['status'][] = [
        'pending',
        'processing',
        'completed',
        'cancelled',
        'refunded',
      ]
      const methods = [
        'credit_card',
        'paypal',
        'stripe',
        'amazon_pay',
        'apple_pay',
      ]
      const names = [
        'John Doe',
        'Jane Smith',
        'Robert Johnson',
        'Emily Davis',
        'Michael Wilson',
      ]
      const products = [
        'Smartphone',
        'Laptop',
        'Headphones',
        'Smartwatch',
        'Tablet',
      ]
      const countries = [
        'United States',
        'United Kingdom',
        'Canada',
        'Australia',
        'Germany',
      ]

      const status = statuses[Math.floor(Math.random() * 5)]
      const method = methods[Math.floor(Math.random() * 5)]
      const name = names[Math.floor(Math.random() * 5)]
      const product = products[Math.floor(Math.random() * 5)]
      const country = countries[Math.floor(Math.random() * 5)]

      return {
        id: `ORD-${1000 + i}`,
        customer_id: `cust_${Math.floor(Math.random() * 20) + 1}`,
        status,
        total_amount: Math.floor(Math.random() * 1000) + 50,
        created_at: new Date(
          Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
        ).toISOString(),
        updated_at: new Date(
          Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
        ).toISOString(),
        customer: {
          id: `cust_${Math.floor(Math.random() * 20) + 1}`,
          name,
          email: `customer${Math.floor(Math.random() * 20) + 1}@example.com`,
          avatar: `https://i.pravatar.cc/40?u=${Math.random()
            .toString(36)
            .substring(7)}`,
        },
        items: Array.from(
          { length: Math.floor(Math.random() * 5) + 1 },
          (_, j) => ({
            id: `item_${i}_${j}`,
            product_id: `prod_${Math.floor(Math.random() * 50) + 1}`,
            product_name: product,
            product_image: `https://picsum.photos/seed/${i}_${j}/100/100`,
            quantity: Math.floor(Math.random() * 3) + 1,
            price: Math.floor(Math.random() * 300) + 50,
            discount: Math.floor(Math.random() * 30),
          })
        ),
        payments: [
          {
            id: `pay_${i}`,
            amount: Math.floor(Math.random() * 1000) + 50,
            method,
            status: ['pending', 'completed', 'failed', 'refunded'][
              Math.floor(Math.random() * 4)
            ] as Payment['status'],
            transaction_id: `txn_${Math.random()
              .toString(36)
              .substring(2, 10)
              .toUpperCase()}`,
            date: new Date(
              Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
            ).toISOString(),
          },
        ],
        shipping_address: {
          street: `${Math.floor(Math.random() * 1000) + 1} Main St`,
          city: ['New York', 'London', 'Sydney', 'Toronto', 'Berlin'][
            Math.floor(Math.random() * 5)
          ],
          state: ['NY', 'CA', 'TX', 'FL', 'IL'][Math.floor(Math.random() * 5)],
          country,
          zip_code: `${Math.floor(Math.random() * 90000) + 10000}`,
        },
      }
    })

    setOrders(mockOrders)
    setFilteredOrders(mockOrders)
    setLoading(false)

    // Simulate real-time updates
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const eventTypes = [
          'new_order',
          'payment_received',
          'order_shipped',
          'refund_processed',
        ]
        const eventType = eventTypes[
          Math.floor(Math.random() * eventTypes.length)
        ] as RealTimeEvent['type']
        const newEvent: RealTimeEvent = {
          id: Date.now(),
          type: eventType,
          message: `${eventType
            .split('_')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')}`,
          orderId: `ORD-${Math.floor(Math.random() * 1000) + 2000}`,
          timestamp: new Date().toISOString(),
        }
        setRealTimeEvents((prev) => [newEvent, ...prev.slice(0, 9)])
      }
    }, 5000)

    // Simulate AI insights
    setTimeout(() => {
      setAiInsights({
        predictedRevenue: '$12,450',
        trendingProducts: ['Smartwatch', 'Headphones'],
        customerSatisfaction: '94%',
        alert: 'Increased returns for Laptop category',
        recommendation: 'Offer bundle deals on Smartwatch and Headphones',
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  // --- Filtering/Sorting ---
  useEffect(() => {
    let result = [...orders]

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(
        (order) =>
          order.id.toLowerCase().includes(term) ||
          order.customer?.name.toLowerCase().includes(term) ||
          order.customer?.email.toLowerCase().includes(term) ||
          order.payments.some((p) =>
            p.transaction_id.toLowerCase().includes(term)
          ) ||
          order.items.some((i) => i.product_name.toLowerCase().includes(term))
      )
    }

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter((order) => order.status === statusFilter)
    }

    // Date filter
    const now = new Date()
    let startDate: Date

    switch (dateRange) {
      case 'today':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        break
      case 'yesterday':
        startDate = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() - 1
        )
        break
      case '7days':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case '30days':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
      case '90days':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
        break
      case 'custom':
        if (customStartDate && customEndDate) {
          startDate = new Date(customStartDate)
          const endDate = new Date(customEndDate)
          result = result.filter(
            (order) =>
              new Date(order.created_at) >= startDate &&
              new Date(order.created_at) <= endDate
          )
        }
        break
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    }

    if (dateRange !== 'custom') {
      result = result.filter((order) => new Date(order.created_at) >= startDate)
    }

    // Sorting
    result.sort((a, b) => {
      let aValue: string | number, bValue: string | number

      switch (sortConfig.key) {
        case 'total_amount':
          aValue = a.total_amount
          bValue = b.total_amount
          break
        case 'created_at':
        case 'updated_at':
          aValue = new Date(a[sortConfig.key]).getTime()
          bValue = new Date(b[sortConfig.key]).getTime()
          break
        case 'customer':
          aValue = a.customer?.name || ''
          bValue = b.customer?.name || ''
          break
        case 'id':
          aValue = a.id
          bValue = b.id
          break
        default:
          return 0
      }

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1
      }
      return 0
    })

    setFilteredOrders(result)
    setSelectedOrders([]) // Clear selection when filters change
  }, [
    orders,
    searchTerm,
    statusFilter,
    dateRange,
    customStartDate,
    customEndDate,
    sortConfig,
  ])

  // --- Chart Data ---
  const salesData = useMemo(
    () => [
      { name: 'Jan', value: 4000, orders: 124 },
      { name: 'Feb', value: 3000, orders: 98 },
      { name: 'Mar', value: 5000, orders: 156 },
      { name: 'Apr', value: 4780, orders: 142 },
      { name: 'May', value: 3890, orders: 118 },
      { name: 'Jun', value: 5390, orders: 168 },
      { name: 'Jul', value: 6200, orders: 192 },
      { name: 'Aug', value: 5800, orders: 178 },
      { name: 'Sep', value: 7100, orders: 210 },
      { name: 'Oct', value: 6520, orders: 198 },
      { name: 'Nov', value: 7840, orders: 235 },
      { name: 'Dec', value: 8910, orders: 268 },
    ],
    []
  )

  const paymentMethodData = useMemo(
    () => [
      { name: 'Credit Card', value: 45, color: '#0088FE' },
      { name: 'PayPal', value: 25, color: '#00C49F' },
      { name: 'Stripe', value: 15, color: '#FFBB28' },
      { name: 'Apple Pay', value: 10, color: '#FF8042' },
      { name: 'Amazon Pay', value: 5, color: '#8884D8' },
    ],
    []
  )

  const statusData = useMemo(
    () => [
      { name: 'Completed', value: 65, color: '#10B981' },
      { name: 'Processing', value: 15, color: '#3B82F6' },
      { name: 'Pending', value: 10, color: '#F59E0B' },
      { name: 'Cancelled', value: 5, color: '#EF4444' },
      { name: 'Refunded', value: 5, color: '#8B5CF6' },
    ],
    []
  )

  // Calculate stats for OrderStats component
  const statsData = useMemo(() => {
    const totalRevenue = orders
      .filter((order) => order.status === 'completed')
      .reduce((sum, order) => sum + order.total_amount, 0)

    const completedOrders = orders.filter(
      (order) => order.status === 'completed'
    ).length
    const pendingOrders = orders.filter(
      (order) => order.status === 'pending'
    ).length
    const avgOrderValue =
      completedOrders > 0 ? totalRevenue / completedOrders : 0

    const refundAmount = orders
      .filter((order) => order.status === 'refunded')
      .reduce((sum, order) => sum + order.total_amount, 0)

    return {
      totalRevenue,
      completedOrders,
      pendingOrders,
      avgOrderValue,
      refundAmount,
    }
  }, [orders])

  // --- Helpers ---
  const handleSort = (key: SortField) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc',
    }))
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'>
            <span className='mr-1'>✅</span>Completed
          </span>
        )
      case 'processing':
        return (
          <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'>
            <span className='mr-1'>🔄</span>Processing
          </span>
        )
      case 'pending':
        return (
          <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'>
            <span className='mr-1'>⏳</span>Pending
          </span>
        )
      case 'cancelled':
        return (
          <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'>
            <span className='mr-1'>❌</span>Cancelled
          </span>
        )
      case 'refunded':
        return (
          <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'>
            <span className='mr-1'>💸</span>Refunded
          </span>
        )
      default:
        return (
          <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'>
            {status}
          </span>
        )
    }
  }

  const getPaymentIcon = (method: string) => {
    switch (method) {
      case 'credit_card':
        return (
          <span
            className='w-6 h-6 flex items-center justify-center'
            title='Credit Card'
          >
            💳
          </span>
        )
      case 'paypal':
        return (
          <span
            className='w-6 h-6 flex items-center justify-center'
            title='PayPal'
          >
            🅿️
          </span>
        )
      case 'stripe':
        return (
          <span
            className='w-6 h-6 flex items-center justify-center'
            title='Stripe'
          >
            💠
          </span>
        )
      case 'amazon_pay':
        return (
          <span
            className='w-6 h-6 flex items-center justify-center'
            title='Amazon Pay'
          >
            🅰️
          </span>
        )
      case 'apple_pay':
        return (
          <span
            className='w-6 h-6 flex items-center justify-center'
            title='Apple Pay'
          >
            🍏
          </span>
        )
      default:
        return (
          <span
            className='w-6 h-6 flex items-center justify-center'
            title='Other'
          >
            💲
          </span>
        )
    }
  }

  const handleRefund = (order: Order) => {
    setSelectedOrder(order)
    setShowRefundDialog(true)
  }

  const processRefund = async (amount: number, reason: string) => {
    if (!selectedOrder) return
    toast.success(
      `Successfully refunded $${amount.toFixed(2)} for order ${
        selectedOrder.id
      }. Reason: ${reason}`
    )
    setShowRefundDialog(false)
    setOrders((prev) =>
      prev.map((order) =>
        order.id === selectedOrder.id ? { ...order, status: 'refunded' } : order
      )
    )
  }

  const exportOrders = (format: 'csv' | 'json') => {
    toast.success(`Exporting orders as ${format.toUpperCase()}`)
    // In a real app, this would generate and download a file
  }

  const bulkUpdateStatus = (status: Order['status'], orderIds: string[]) => {
    if (!status) {
      setSelectedOrders([])
      return
    }

    setOrders((prev) =>
      prev.map((order) =>
        orderIds.includes(order.id) ? { ...order, status } : order
      )
    )
    setSelectedOrders([])
    toast.success(`Updated ${orderIds.length} orders to ${status}`)
  }

  const handleSelectOrder = (orderId: string) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    )
  }

  const handleSelectAll = () => {
    if (selectedOrders.length === filteredOrders.length) {
      setSelectedOrders([])
    } else {
      setSelectedOrders(filteredOrders.map((order) => order.id))
    }
  }

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    if (!darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  // --- Render ---
  return (
    <div className='space-y-6 overflow-y-auto max-h-[calc(100vh-200px)] bg-gray-50 dark:bg-gray-900 transition-colors duration-200'>
      {/* Header */}
      <div className='bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700'>
        <div className='px-6 py-4'>
          <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between'>
            <div>
              <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>
                Orders Dashboard
              </h1>
              <p className='text-sm text-gray-600 dark:text-gray-400 mt-1'>
                Manage, track, and analyze your orders in real-time
              </p>
            </div>

            <div className='flex items-center mt-4 sm:mt-0 space-x-3'>
              <button
                onClick={toggleDarkMode}
                className='p-2 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                title={
                  darkMode ? 'Switch to light mode' : 'Switch to dark mode'
                }
              >
                {darkMode ? '☀️' : '🌙'}
              </button>

              <button
                className='px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center'
                onClick={() => exportOrders('csv')}
              >
                <Download className='h-4 w-4 mr-2' />
                Export
              </button>

              <button className='px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center'>
                <Plus className='h-4 w-4 mr-2' />
                Create Order
              </button>

              <button
                className='p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md'
                title='Settings'
              >
                <Settings className='h-5 w-5' />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className='px-6 py-6'>
        {/* AI Insights Banner */}
        {aiInsights && (
          <div className='mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 p-4 rounded-lg border border-blue-200 dark:border-blue-700/50'>
            <div className='flex items-start'>
              <div className='flex-shrink-0 bg-blue-100 dark:bg-blue-800 p-2 rounded-lg mr-4'>
                <Brain className='h-5 w-5 text-blue-600 dark:text-blue-300' />
              </div>
              <div className='flex-1'>
                <h3 className='text-lg font-semibold text-gray-900 dark:text-white flex items-center'>
                  AI Insights
                  <Zap className='h-4 w-4 text-yellow-500 ml-2' />
                </h3>
                <p className='text-sm text-gray-600 dark:text-gray-300 mt-1'>
                  Predicted revenue:{' '}
                  <span className='font-semibold'>
                    {aiInsights.predictedRevenue}
                  </span>{' '}
                  | Trending: {aiInsights.trendingProducts.join(', ')} |
                  Satisfaction: {aiInsights.customerSatisfaction}
                </p>
                <p className='text-sm text-amber-600 dark:text-amber-400 mt-1'>
                  <span className='font-semibold'>Alert:</span>{' '}
                  {aiInsights.alert}
                </p>
                <p className='text-sm text-green-600 dark:text-green-400 mt-1'>
                  <span className='font-semibold'>Recommendation:</span>{' '}
                  {aiInsights.recommendation}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <DashboardFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          dateRange={dateRange}
          setDateRange={setDateRange}
          customStartDate={customStartDate}
          setCustomStartDate={setCustomStartDate}
          customEndDate={customEndDate}
          setCustomEndDate={setCustomEndDate}
          viewMode={viewMode}
          setViewMode={setViewMode}
          resultsCount={filteredOrders.length}
        />

        <OrderStats stats={statsData} />

        {/* Orders View */}
        <div className='mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700'>
          <div className='flex items-center justify-between mb-4'>
            <h2 className='text-lg font-semibold text-gray-900 dark:text-white'>
              Orders
            </h2>
            <div className='flex items-center gap-3'>
              <div className='flex items-center border border-gray-200 dark:border-gray-700 rounded-md'>
                <button
                  className={`px-3 py-2 text-sm font-medium rounded-l-md ${
                    viewMode === 'table'
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                      : 'bg-white text-gray-600 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                  onClick={() => setViewMode('table')}
                >
                  Table
                </button>
                <button
                  className={`px-3 py-2 text-sm font-medium rounded-r-md ${
                    viewMode === 'grid'
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                      : 'bg-white text-gray-600 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                  onClick={() => setViewMode('grid')}
                >
                  Grid
                </button>
              </div>
            </div>
          </div>

          {viewMode === 'table' ? (
            <OrdersTable
              orders={filteredOrders}
              loading={loading}
              sortConfig={sortConfig}
              handleSort={handleSort}
              setSelectedOrder={setSelectedOrder}
              handleRefund={handleRefund}
              getStatusBadge={getStatusBadge}
              getPaymentIcon={getPaymentIcon}
              selectedOrders={selectedOrders}
              onSelectOrder={handleSelectOrder}
              onSelectAll={handleSelectAll}
              onBulkStatusUpdate={bulkUpdateStatus}
            />
          ) : (
            <OrdersGrid
              orders={filteredOrders}
              setSelectedOrder={setSelectedOrder}
              handleRefund={handleRefund}
              getStatusBadge={getStatusBadge}
              getPaymentIcon={getPaymentIcon}
            />
          )}
        </div>

        {/* Bottom Stats and Activity Section */}
        <div className='mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6'>
          {/* Real-Time Activity */}
          <div className='lg:col-span-2'>
            <RealTimeActivity events={realTimeEvents} />
          </div>

          {/* Quick Stats and Top Customers */}
          <div className='space-y-6'>
            {/* Quick Stats Card */}
            <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm p-5 border border-gray-200 dark:border-gray-700'>
              <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>
                Quick Stats
              </h3>
              <div className='grid grid-cols-2 gap-4'>
                <div className='text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg'>
                  <div className='text-2xl font-bold text-gray-900 dark:text-white'>
                    {orders.length}
                  </div>
                  <div className='text-sm text-gray-600 dark:text-gray-400'>
                    Total Orders
                  </div>
                </div>
                <div className='text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg'>
                  <div className='text-2xl font-bold text-gray-900 dark:text-white'>
                    {orders.filter((o) => o.status === 'completed').length}
                  </div>
                  <div className='text-sm text-gray-600 dark:text-gray-400'>
                    Completed
                  </div>
                </div>
                <div className='text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg'>
                  <div className='text-2xl font-bold text-gray-900 dark:text-white'>
                    {orders.filter((o) => o.status === 'processing').length}
                  </div>
                  <div className='text-sm text-gray-600 dark:text-gray-400'>
                    Processing
                  </div>
                </div>
                <div className='text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg'>
                  <div className='text-2xl font-bold text-gray-900 dark:text-white'>
                    {orders.filter((o) => o.status === 'pending').length}
                  </div>
                  <div className='text-sm text-gray-600 dark:text-gray-400'>
                    Pending
                  </div>
                </div>
              </div>
            </div>

            {/* Top Customers */}
            <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm p-5 border border-gray-200 dark:border-gray-700'>
              <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>
                Top Customers
              </h3>
              <div className='space-y-4'>
                {Array.from(new Set(orders.map((o) => o.customer?.id)))
                  .filter((id) => id !== undefined)
                  .slice(0, 5)
                  .map((customerId) => {
                    const customer = orders.find(
                      (o) => o.customer?.id === customerId
                    )?.customer
                    const customerOrders = orders.filter(
                      (o) => o.customer?.id === customerId
                    )
                    const totalSpent = customerOrders
                      .filter((o) => o.status === 'completed')
                      .reduce((sum, order) => sum + order.total_amount, 0)

                    return (
                      <div
                        key={customerId}
                        className='flex items-center justify-between'
                      >
                        <div className='flex items-center'>
                          <Image
                            src={
                              customer?.avatar ||
                              `https://i.pravatar.cc/40?u=${customerId}`
                            }
                            width={32}
                            height={32}
                            className='w-8 h-8 rounded-full mr-3'
                            alt={customer?.name || 'Customer'}
                          />
                          <div>
                            <div className='text-sm font-medium text-gray-900 dark:text-white'>
                              {customer?.name}
                            </div>
                            <div className='text-xs text-gray-500 dark:text-gray-400'>
                              {customerOrders.length} orders
                            </div>
                          </div>
                        </div>
                        <div className='text-sm font-medium text-gray-900 dark:text-white'>
                          ${totalSpent.toFixed(2)}
                        </div>
                      </div>
                    )
                  })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Toggle Button at the bottom */}
      <div className='px-6 pb-6 flex flex-col items-center gap-6'>
        <Button
          variant='outline'
          onClick={() => setShowCharts(!showCharts)}
          className='flex items-center gap-2 bg-white dark:bg-gray-800 dark:text-white dark:border-gray-700'
        >
          <BarChart3 className='h-4 w-4' />
          {showCharts ? 'Hide Analytics' : 'Show Analytics'}
          {showCharts ? (
            <ChevronUp className='h-4 w-4' />
          ) : (
            <ChevronDown className='h-4 w-4' />
          )}
        </Button>
        {showCharts && (
          <div className='w-full'>
            <OrderCharts
              salesData={salesData}
              paymentMethodData={paymentMethodData}
              statusData={statusData}
              orders={orders}
              getPaymentIcon={getPaymentIcon}
            />
          </div>
        )}
      </div>

      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          getStatusBadge={getStatusBadge}
        />
      )}

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
