// OrderStats.tsx - Updated
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package,
  ShoppingCart,
  RefreshCw,
} from 'lucide-react'

interface OrderStatsProps {
  stats: {
    totalRevenue: number
    completedOrders: number
    pendingOrders: number
    avgOrderValue: number
    refundAmount: number
  }
}

export default function OrderStats({ stats }: OrderStatsProps) {
  const { totalRevenue, completedOrders, pendingOrders, avgOrderValue } = stats

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const statsData = [
    {
      title: 'Total Revenue',
      value: formatCurrency(totalRevenue),
      description: 'From completed orders',
      icon: DollarSign,
      trend: {
        value: 12.5,
        isPositive: true,
      },
      color: 'bg-blue-50 border-blue-100',
      textColor: 'text-blue-600',
    },
    {
      title: 'Orders Completed',
      value: completedOrders.toLocaleString(),
      description: 'Successful deliveries',
      icon: Package,
      trend: {
        value: 8.2,
        isPositive: true,
      },
      color: 'bg-green-50 border-green-100',
      textColor: 'text-green-600',
    },
    {
      title: 'Avg. Order Value',
      value: formatCurrency(avgOrderValue),
      description: 'Across all orders',
      icon: ShoppingCart,
      trend: {
        value: 3.1,
        isPositive: true,
      },
      color: 'bg-amber-50 border-amber-100',
      textColor: 'text-amber-600',
    },
    {
      title: 'Pending Orders',
      value: pendingOrders.toLocaleString(),
      description: 'Awaiting processing',
      icon: RefreshCw,
      trend: {
        value: 2.4,
        isPositive: false,
      },
      color: 'bg-purple-50 border-purple-100',
      textColor: 'text-purple-600',
    },
  ]

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
      {statsData.map((stat, index) => (
        <Card key={index} className={`${stat.color} border`}>
          <CardHeader className='pb-2 flex flex-row items-center justify-between space-y-0'>
            <div>
              <CardDescription className={stat.textColor}>
                {stat.title}
              </CardDescription>
              <CardTitle className='text-xl'>{stat.value}</CardTitle>
            </div>
            <div
              className={`h-10 w-10 rounded-full flex items-center justify-center ${stat.textColor} bg-white`}
            >
              <stat.icon className='h-5 w-5' />
            </div>
          </CardHeader>
          <CardContent>
            <div className='flex items-center text-sm'>
              {stat.trend.isPositive ? (
                <TrendingUp className='h-4 w-4 mr-1 text-green-500' />
              ) : (
                <TrendingDown className='h-4 w-4 mr-1 text-red-500' />
              )}
              <span
                className={
                  stat.trend.isPositive ? 'text-green-600' : 'text-red-600'
                }
              >
                {stat.trend.value}%
              </span>
              <span className='text-gray-500 ml-1'>from last month</span>
            </div>
            <p className='text-xs text-gray-500 mt-1'>{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
