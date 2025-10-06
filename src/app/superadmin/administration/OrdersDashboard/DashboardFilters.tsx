// DashboardFilters.tsx - Updated
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { CalendarIcon, Search, Filter, Grid, List } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'

export type StatusFilter =
  | 'all'
  | 'pending'
  | 'processing'
  | 'completed'
  | 'cancelled'
  | 'refunded'
export type DateRangeFilter =
  | 'today'
  | 'yesterday'
  | '7days'
  | '30days'
  | '90days'
  | 'custom'

export interface DashboardFiltersProps {
  searchTerm: string
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>
  statusFilter: StatusFilter
  setStatusFilter: React.Dispatch<React.SetStateAction<StatusFilter>>
  dateRange: DateRangeFilter
  setDateRange: React.Dispatch<React.SetStateAction<DateRangeFilter>>
  customStartDate: string
  setCustomStartDate: React.Dispatch<React.SetStateAction<string>>
  customEndDate: string
  setCustomEndDate: React.Dispatch<React.SetStateAction<string>>
  viewMode: 'table' | 'grid'
  setViewMode: React.Dispatch<React.SetStateAction<'table' | 'grid'>>
  resultsCount: number
}

export default function DashboardFilters({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  dateRange,
  setDateRange,
  viewMode,
  setViewMode,
  resultsCount,
}: DashboardFiltersProps) {
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()

  return (
    <div className='bg-white rounded-lg shadow-sm p-4 mb-6'>
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
        <div className='flex items-center gap-2'>
          <div className='relative flex-1 md:flex-initial md:w-80'>
            <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-gray-500' />
            <Input
              type='search'
              placeholder='Search orders, customers, products...'
              className='pl-8'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant='outline' size='sm' className='h-9'>
                <Filter className='h-4 w-4 mr-2' />
                Filters
              </Button>
            </PopoverTrigger>
            <PopoverContent className='w-80'>
              <div className='grid gap-4'>
                <div className='space-y-2'>
                  <h4 className='font-medium leading-none'>Advanced Filters</h4>
                  <p className='text-sm text-gray-500'>
                    Set additional filtering options
                  </p>
                </div>
                <div className='grid gap-2'>
                  <div className='grid grid-cols-3 items-center gap-4'>
                    <label htmlFor='min-amount'>Min Amount</label>
                    <Input
                      id='min-amount'
                      type='number'
                      className='col-span-2 h-8'
                    />
                  </div>
                  <div className='grid grid-cols-3 items-center gap-4'>
                    <label htmlFor='payment-method'>Payment Method</label>
                    <Select defaultValue='all'>
                      <SelectTrigger className='col-span-2 h-8'>
                        <SelectValue placeholder='Select method' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='all'>All Methods</SelectItem>
                        <SelectItem value='credit_card'>Credit Card</SelectItem>
                        <SelectItem value='paypal'>PayPal</SelectItem>
                        <SelectItem value='stripe'>Stripe</SelectItem>
                        <SelectItem value='apple_pay'>Apple Pay</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <div className='flex items-center gap-2'>
          <div className='flex items-center gap-2'>
            <Select
              value={statusFilter}
              onValueChange={(value: StatusFilter) => setStatusFilter(value)}
            >
              <SelectTrigger className='w-[130px]'>
                <SelectValue placeholder='Status' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Status</SelectItem>
                <SelectItem value='pending'>Pending</SelectItem>
                <SelectItem value='processing'>Processing</SelectItem>
                <SelectItem value='completed'>Completed</SelectItem>
                <SelectItem value='cancelled'>Cancelled</SelectItem>
                <SelectItem value='refunded'>Refunded</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={dateRange}
              onValueChange={(value: DateRangeFilter) => setDateRange(value)}
            >
              <SelectTrigger className='w-[130px]'>
                <SelectValue placeholder='Date Range' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='today'>Today</SelectItem>
                <SelectItem value='yesterday'>Yesterday</SelectItem>
                <SelectItem value='7days'>Last 7 days</SelectItem>
                <SelectItem value='30days'>Last 30 days</SelectItem>
                <SelectItem value='90days'>Last 90 days</SelectItem>
                <SelectItem value='custom'>Custom Range</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className='flex items-center border border-gray-200 rounded-md'>
            <Button
              variant={viewMode === 'table' ? 'default' : 'ghost'}
              size='sm'
              className='h-8 px-2 rounded-r-none'
              onClick={() => setViewMode('table')}
            >
              <List className='h-4 w-4' />
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size='sm'
              className='h-8 px-2 rounded-l-none'
              onClick={() => setViewMode('grid')}
            >
              <Grid className='h-4 w-4' />
            </Button>
          </div>
        </div>
      </div>

      <div className='flex items-center justify-between mt-4'>
        <p className='text-sm text-gray-600'>
          {resultsCount} {resultsCount === 1 ? 'order' : 'orders'} found
        </p>
        <div className='flex items-center gap-2'>
          {dateRange === 'custom' && (
            <div className='flex items-center gap-2'>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant='outline'
                    size='sm'
                    className={cn(
                      'w-[240px] justify-start text-left font-normal',
                      !startDate && 'text-gray-500'
                    )}
                  >
                    <CalendarIcon className='mr-2 h-4 w-4' />
                    {startDate ? (
                      format(startDate, 'PPP')
                    ) : (
                      <span>Start date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className='w-auto p-0' align='start'>
                  <Calendar
                    mode='single'
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <span className='text-gray-500'>to</span>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant='outline'
                    size='sm'
                    className={cn(
                      'w-[240px] justify-start text-left font-normal',
                      !endDate && 'text-gray-500'
                    )}
                  >
                    <CalendarIcon className='mr-2 h-4 w-4' />
                    {endDate ? format(endDate, 'PPP') : <span>End date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className='w-auto p-0' align='start'>
                  <Calendar
                    mode='single'
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
