import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My Wishlist | MUKULAH - Save Your Favorite Items',
  description: 'Discover and save your favorite products in your personal wishlist. Never lose track of items you love - shop them later at your convenience.',
  keywords: 'wishlist, saved items, favorites, shopping list, product collection',
  openGraph: {
    title: 'My Wishlist | MUKULAH',
    description: 'Your personal collection of favorite products, saved for later.',
    images: ['/images/wishlist-og.jpg'],
  },
}

export default function WishlistLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-rose-50">
      <div className="relative">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-pink-200/30 to-rose-300/20 rounded-full blur-3xl" />
          <div className="absolute top-1/3 -left-40 w-80 h-80 bg-gradient-to-br from-violet-200/30 to-purple-300/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/3 w-80 h-80 bg-gradient-to-br from-emerald-200/30 to-teal-300/20 rounded-full blur-3xl" />
        </div>
        
        {/* Main content */}
        <div className="relative z-10">
          {children}
        </div>
      </div>
    </div>
  )
}
