import { Button } from '@/components/ui/button'
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table'
import Image from 'next/image'

// --- Type Definitions ---
type Customer = {
  id: string
  name: string
  email: string
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
  customer: Customer | null
  created_at: string
  status: string
  items: OrderItem[]
  payments: Payment[]
}

interface OrderDetailsModalProps {
  order: Order
  onClose: () => void
  getStatusBadge: (status: string) => React.ReactNode
}

export default function OrderDetailsModal({
  order,
  onClose,
  getStatusBadge,
}: OrderDetailsModalProps) {
  return (
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
                {new Date(order.created_at).toLocaleDateString()}
              </p>
              <p>
                <span className='font-medium'>Status:</span>{' '}
                <span>{getStatusBadge(order.status)}</span>
              </p>
            </div>
          </div>
          <div>
            <h3 className='text-lg font-semibold mb-2'>Payment Information</h3>
            {order.payments.map((payment: Payment) => (
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
              {order.items.map((item: OrderItem) => (
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
        </div>
      </div>
    </div>
  )
}
