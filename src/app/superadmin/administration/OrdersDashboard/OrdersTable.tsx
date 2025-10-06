// OrdersTable.tsx (updated)
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Checkbox } from '@/components/ui/checkbox'
import Image from 'next/image'
import { MoreHorizontal, Eye, RefreshCw, FileText } from 'lucide-react'

// --- Type Definitions ---
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

export type SortField =
  | 'id'
  | 'customer'
  | 'total_amount'
  | 'created_at'
  | 'status'
    | 'updated_at' 

interface OrdersTableProps {
  orders: Order[]
  loading: boolean
  sortConfig: { key: SortField; direction: 'asc' | 'desc' }
  handleSort: (key: SortField) => void
  setSelectedOrder: (order: Order) => void
  handleRefund: (order: Order) => void
  getStatusBadge: (status: Order['status']) => React.ReactNode
  getPaymentIcon: (method: string) => React.ReactNode
  selectedOrders: string[]
  onSelectOrder: (orderId: string) => void
  onSelectAll: () => void
  onBulkStatusUpdate: (status: Order['status'], orderIds: string[]) => void
}

export default function OrdersTable({
  orders,
  loading,
  sortConfig,
  handleSort,
  setSelectedOrder,
  handleRefund,
  getStatusBadge,
  getPaymentIcon,
  selectedOrders,
  onSelectOrder,
  onSelectAll,
  onBulkStatusUpdate,
}: OrdersTableProps) {
  const allSelected =
    orders.length > 0 && selectedOrders.length === orders.length
  const someSelected = selectedOrders.length > 0 && !allSelected

  return (
    <div className='rounded-md border'>
      {selectedOrders.length > 0 && (
        <div className='flex items-center bg-gray-50 px-4 py-2'>
          <div className='text-sm text-gray-700 mr-4'>
            {selectedOrders.length} selected
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='outline' size='sm'>
                Bulk Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onClick={() => onBulkStatusUpdate('processing', selectedOrders)}
              >
                Mark as Processing
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onBulkStatusUpdate('completed', selectedOrders)}
              >
                Mark as Completed
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onBulkStatusUpdate('cancelled', selectedOrders)}
              >
                Mark as Cancelled
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant='ghost'
            size='sm'
            className='ml-2'
            onClick={() => onBulkStatusUpdate('pending', [])} // Clear selection
          >
            Clear
          </Button>
        </div>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='w-12'>
              <Checkbox
                checked={allSelected ? true : someSelected ? 'indeterminate' : false}
                onCheckedChange={onSelectAll}
              />
            </TableHead>
            <TableHead
              className='cursor-pointer'
              onClick={() => handleSort('id')}
            >
              Order ID
              {sortConfig.key === 'id' && (
                <span>{sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}</span>
              )}
            </TableHead>
            <TableHead
              className='cursor-pointer'
              onClick={() => handleSort('customer')}
            >
              Customer
              {sortConfig.key === 'customer' && (
                <span>{sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}</span>
              )}
            </TableHead>
            <TableHead>Items</TableHead>
            <TableHead
              className='cursor-pointer'
              onClick={() => handleSort('total_amount')}
            >
              Amount
              {sortConfig.key === 'total_amount' && (
                <span>{sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}</span>
              )}
            </TableHead>
            <TableHead>Payment</TableHead>
            <TableHead
              className='cursor-pointer'
              onClick={() => handleSort('created_at')}
            >
              Date
              {sortConfig.key === 'created_at' && (
                <span>{sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}</span>
              )}
            </TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={9} className='text-center py-8'>
                <div className='flex justify-center'>
                  <RefreshCw className='h-6 w-6 animate-spin mr-2' />
                  Loading orders...
                </div>
              </TableCell>
            </TableRow>
          ) : orders.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className='text-center py-8'>
                <div className='text-gray-500'>
                  <div className='text-4xl mb-2'>📦</div>
                  <p>No orders found matching your criteria</p>
                  <p className='text-sm mt-1'>Try adjusting your filters</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            orders.map((order: Order) => (
              <TableRow
                key={order.id}
                className={
                  selectedOrders.includes(order.id) ? 'bg-blue-50' : ''
                }
              >
                <TableCell>
                  <Checkbox
                    checked={selectedOrders.includes(order.id)}
                    onCheckedChange={() => onSelectOrder(order.id)}
                  />
                </TableCell>
                <TableCell className='font-medium'>{order.id}</TableCell>
                <TableCell>
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
                      <div className='text-sm text-gray-500'>
                        {order.customer?.email}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className='flex -space-x-2'>
                    {order.items
                      .slice(0, 3)
                      .map((item: OrderItem, i: number) => (
                        <Image
                          key={i}
                          src={item.product_image}
                          alt={item.product_name}
                          width={32}
                          height={32}
                          className='w-8 h-8 rounded-full border-2 border-white object-cover'
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
                  {new Date(order.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>{getStatusBadge(order.status)}</TableCell>
                <TableCell>
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
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
