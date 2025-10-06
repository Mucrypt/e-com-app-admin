import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React from 'react'

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
  customer_id: string
  updated_at: string
  customer: Customer | null
  items: OrderItem[]
  payments: Payment[]
  total_amount: number
  created_at: string
  status: 'pending' | 'processing' | 'completed' | 'cancelled' | 'refunded'
}

interface RefundDialogProps {
  order: Order
  onCancel: () => void
  onConfirm: (amount: number, reason: string) => void
}

export default function RefundDialog({
  order,
  onCancel,
  onConfirm,
}: RefundDialogProps) {
  const [amount, setAmount] = React.useState(order.total_amount)
  const [reason, setReason] = React.useState('')

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
