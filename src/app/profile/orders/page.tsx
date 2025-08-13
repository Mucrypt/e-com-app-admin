import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Icons } from '@/components/common/icons'

const mockOrders = [
  {
    id: 'ORD-1001',
    date: '2025-08-01',
    status: 'Delivered',
    total: '$120.00',
    items: 3,
  },
  {
    id: 'ORD-1002',
    date: '2025-07-15',
    status: 'Shipped',
    total: '$89.99',
    items: 2,
  },
  {
    id: 'ORD-1003',
    date: '2025-07-01',
    status: 'Processing',
    total: '$45.50',
    items: 1,
  },
]

export default function OrdersPage() {
  return (
    <div className='w-full max-w-3xl mx-auto flex flex-col gap-8'>
      <h1 className='text-3xl font-bold text-center mb-4'>Your Orders</h1>
      {mockOrders.map((order) => (
        <Card key={order.id} className='w-full'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Icons.package className='h-5 w-5 text-blue-500' />
              Order {order.id}
            </CardTitle>
          </CardHeader>
          <CardContent className='grid grid-cols-2 gap-4'>
            <div>
              <p className='text-sm text-muted-foreground'>Date</p>
              <p className='font-medium'>{order.date}</p>
            </div>
            <div>
              <p className='text-sm text-muted-foreground'>Status</p>
              <p className='font-medium'>{order.status}</p>
            </div>
            <div>
              <p className='text-sm text-muted-foreground'>Total</p>
              <p className='font-medium'>{order.total}</p>
            </div>
            <div>
              <p className='text-sm text-muted-foreground'>Items</p>
              <p className='font-medium'>{order.items}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
