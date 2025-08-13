import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Icons } from '@/components/common/icons'

const mockWishlists = [
  {
    id: 'WISH-2001',
    name: 'Home Decor',
    items: 5,
    updated: '2025-08-10',
  },
  {
    id: 'WISH-2002',
    name: 'Tech Gadgets',
    items: 2,
    updated: '2025-07-28',
  },
  {
    id: 'WISH-2003',
    name: 'Books',
    items: 7,
    updated: '2025-07-20',
  },
]

export default function WishlistsPage() {
  return (
    <div className='w-full max-w-3xl mx-auto flex flex-col gap-8'>
      <h1 className='text-3xl font-bold text-center mb-4'>Your Wishlists</h1>
      {mockWishlists.map((list) => (
        <Card key={list.id} className='w-full'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Icons.heart className='h-5 w-5 text-pink-500' />
              {list.name}
            </CardTitle>
          </CardHeader>
          <CardContent className='grid grid-cols-2 gap-4'>
            <div>
              <p className='text-sm text-muted-foreground'>Items</p>
              <p className='font-medium'>{list.items}</p>
            </div>
            <div>
              <p className='text-sm text-muted-foreground'>Last Updated</p>
              <p className='font-medium'>{list.updated}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
