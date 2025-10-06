// RealTimeActivity.tsx
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'

interface RealTimeEvent {
  id: number
  type: string
  message: string
  orderId: string
  timestamp: string
}

interface RealTimeActivityProps {
  events: RealTimeEvent[]
}

export default function RealTimeActivity({ events }: RealTimeActivityProps) {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'new_order':
        return '🛒'
      case 'payment_received':
        return '💳'
      case 'order_shipped':
        return '🚚'
      case 'refund_processed':
        return '💸'
      default:
        return '📢'
    }
  }

  const getEventColor = (type: string) => {
    switch (type) {
      case 'new_order':
        return 'bg-blue-100 text-blue-800'
      case 'payment_received':
        return 'bg-green-100 text-green-800'
      case 'order_shipped':
        return 'bg-purple-100 text-purple-800'
      case 'refund_processed':
        return 'bg-amber-100 text-amber-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatTime = (timestamp: string) => {
    const eventTime = new Date(timestamp)
    const diffInSeconds = Math.floor(
      (currentTime.getTime() - eventTime.getTime()) / 1000
    )

    if (diffInSeconds < 60) return 'Just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    return `${Math.floor(diffInSeconds / 86400)}d ago`
  }

  return (
    <Card className='mb-6'>
      <CardHeader className='pb-3'>
        <div className='flex items-center justify-between'>
          <CardTitle className='text-lg font-semibold'>
            Real-Time Activity
          </CardTitle>
          <Badge
            variant='outline'
            className='bg-green-50 text-red-700 border-green-200'
          >
            Live
          </Badge>
        </div>
      </CardHeader>
      <CardContent className='p-0'>
        <ScrollArea className='h-[380px]'>
          {events.length === 0 ? (
            <div className='text-center py-8 text-gray-500'>
              <div className='text-4xl mb-2'>📊</div>
              <p>Waiting for activity...</p>
              <p className='text-sm'>New events will appear here</p>
            </div>
          ) : (
            <div className='divide-y'>
              {events.map((event) => (
                <div
                  key={event.id}
                  className='p-4 hover:bg-gray-50 transition-colors'
                >
                  <div className='flex gap-3'>
                    <div className='text-2xl'>{getEventIcon(event.type)}</div>
                    <div className='flex-1 min-w-0'>
                      <div className='flex items-center gap-2 mb-1'>
                        <span className='text-sm font-medium truncate'>
                          {event.message}
                        </span>
                        <Badge
                          variant='outline'
                          className={getEventColor(event.type)}
                        >
                          {event.type.replace('_', ' ')}
                        </Badge>
                      </div>
                      <p className='text-xs text-gray-500 truncate'>
                        Order: {event.orderId}
                      </p>
                      <p className='text-xs text-gray-400 mt-1'>
                        {formatTime(event.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
