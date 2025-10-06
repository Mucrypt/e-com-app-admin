// OrdersGrid.tsx
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import Image from 'next/image'
import { MoreHorizontal, Eye, RefreshCw, FileText } from 'lucide-react'

// Reuse the types from OrdersTable
type Customer = {
  id: string
  name: string
  email: string
  avatar?: string
}
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
type Order = {
  id: string
  customer_id: string
  updated_at: string
  customer: Customer | null
  items: OrderItem[]
  payments: Payment[]
  total_amount: number
  created_at: string
  status: 'pending' | 'processing' | 'completed' | 'cancelled' | 'refunded'
}

interface OrdersGridProps {
  orders: Order[]
  setSelectedOrder: (order: Order) => void
  handleRefund: (order: Order) => void
  getStatusBadge: (status: string) => React.ReactNode
  getPaymentIcon: (method: string) => React.ReactNode
}

export default function OrdersGrid({
  orders,
  setSelectedOrder,
  handleRefund,
  getStatusBadge,
  getPaymentIcon,
}: OrdersGridProps) {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'>
      {orders.map((order: Order) => (
        <Card
          key={order.id}
          className='overflow-hidden hover:shadow-lg transition-shadow'
        >
          <CardHeader className='pb-3'>
            <div className='flex justify-between items-start'>
              <div>
                <h3 className='font-semibold text-lg'>Order {order.id}</h3>
                <p className='text-sm text-gray-500'>
                  {new Date(order.created_at).toLocaleDateString()}
                </p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant='ghost' size='icon'>
                    <MoreHorizontal className='h-4 w-4' />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end'>
                  <DropdownMenuItem onClick={() => setSelectedOrder(order)}>
                    <Eye className='h-4 w-4 mr-2' />
                    View Details
                  </DropdownMenuItem>
                  {order.status === 'completed' && (
                    <DropdownMenuItem onClick={() => handleRefund(order)}>
                      <RefreshCw className='h-4 w-4 mr-2' />
                      Process Refund
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem>
                    <FileText className='h-4 w-4 mr-2' />
                    Print Invoice
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent className='pb-3'>
            <div className='flex items-center justify-between mb-4'>
              <div className='flex items-center'>
                {order.customer?.avatar ? (
                  <Image
                    src={order.customer.avatar}
                    alt={order.customer.name}
                    width={32}
                    height={32}
                    className='rounded-full mr-2'
                  />
                ) : (
                  <div className='w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-2'>
                    <span className='text-xs font-medium'>
                      {order.customer?.name.charAt(0)}
                    </span>
                  </div>
                )}
                <div>
                  <div className='font-medium'>{order.customer?.name}</div>
                  <div className='text-xs text-gray-500'>
                    {order.customer?.email}
                  </div>
                </div>
              </div>
              {getStatusBadge(order.status)}
            </div>

            <div className='mb-4'>
              <div className='flex -space-x-2 mb-2'>
                {order.items.slice(0, 4).map((item: OrderItem, i: number) => (
                  <Image
                    key={i}
                    src={item.product_image}
                    alt={item.product_name}
                    width={40}
                    height={40}
                    className='w-10 h-10 rounded-lg border-2 border-white object-cover'
                  />
                ))}
                {order.items.length > 4 && (
                  <div className='w-10 h-10 rounded-lg border-2 border-white bg-gray-100 flex items-center justify-center text-xs font-medium'>
                    +{order.items.length - 4}
                  </div>
                )}
              </div>
              <div className='text-xs text-gray-500'>
                {order.items.length} item{order.items.length !== 1 ? 's' : ''}
              </div>
            </div>

            <div className='flex justify-between items-center'>
              <div className='flex items-center gap-2'>
                {getPaymentIcon(order.payments[0].method)}
                <span className='text-sm capitalize'>
                  {order.payments[0].method.replace('_', ' ')}
                </span>
              </div>
              <div className='text-lg font-semibold'>
                ${order.total_amount.toFixed(2)}
              </div>
            </div>
          </CardContent>
          <CardFooter className='bg-gray-50 py-3'>
            <div className='text-xs text-gray-500 w-full'>
              <div className='flex justify-between'>
                <span>Last updated</span>
                <span>{new Date(order.updated_at).toLocaleDateString()}</span>
              </div>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
