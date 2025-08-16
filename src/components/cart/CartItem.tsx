'use client'
import Image from 'next/image'
import { RiDeleteBin6Line } from 'react-icons/ri'
import { FaPlus, FaMinus } from 'react-icons/fa'

type CartItemType = {
  id: string
  name: string
  price: number
  quantity: number
  image: string
  color?: string
  size?: string
}

export default function CartItem({ item }: { item: CartItemType }) {
  // For mock, quantity change/remove are no-ops
  return (
    <div className='p-4 flex space-x-4'>
      <div className='flex-shrink-0'>
        <Image
          src={item.image}
          alt={item.name}
          width={80}
          height={80}
          className='h-20 w-20 rounded-lg object-cover border border-gray-200'
          onError={(e) => {
            ;(e.target as HTMLImageElement).src = '/default-product-image.jpg'
          }}
        />
      </div>
      <div className='flex-1 min-w-0'>
        <div className='flex justify-between'>
          <h3 className='text-sm font-medium text-gray-900 truncate'>
            {item.name}
          </h3>
          <button
            className='text-gray-400 hover:text-red-500 transition-colors'
            aria-label='Remove item'
          >
            <RiDeleteBin6Line className='h-5 w-5' />
          </button>
        </div>
        <p className='text-sm text-gray-500 mt-1'>
          {item.color && `${item.color}, `}
          {item.size}
        </p>
        <p className='text-sm font-semibold text-indigo-600 mt-1'>
          ${item.price.toFixed(2)}
        </p>
        <div className='flex items-center mt-3'>
          <button
            disabled={item.quantity <= 1}
            className={`p-1 rounded-md ${
              item.quantity <= 1
                ? 'text-gray-300 cursor-not-allowed'
                : 'text-gray-500 hover:bg-gray-100'
            }`}
            aria-label='Decrease quantity'
          >
            <FaMinus className='h-3 w-3' />
          </button>
          <span className='mx-2 text-sm font-medium w-6 text-center'>
            {item.quantity}
          </span>
          <button
            className='p-1 rounded-md text-gray-500 hover:bg-gray-100'
            aria-label='Increase quantity'
          >
            <FaPlus className='h-3 w-3' />
          </button>
        </div>
      </div>
    </div>
  )
}
