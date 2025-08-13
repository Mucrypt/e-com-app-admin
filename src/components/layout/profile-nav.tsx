'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Icons } from '@/components/common/icons'

const navItems = [
  {
    name: 'Overview',
    href: '/profile',
    icon: Icons.home,
  },
  {
    name: 'Wishlists',
    href: '/profile/wishlists',
    icon: Icons.heart,
  },
  {
    name: 'Orders',
    href: '/profile/orders',
    icon: Icons.package,
  },
  {
    name: 'Settings',
    href: '/profile/settings',
    icon: Icons.settings,
  },
  {
    name: 'Security',
    href: '/profile/security',
    icon: Icons.lock,
  },
]

const ProfileNav = () => {
  const pathname = usePathname()

  return (
    <div className='flex space-x-2 overflow-x-auto pb-2 justify-center w-full'>
      <Link
        href='/'
        className='flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition-colors bg-green-100 text-green-700 hover:bg-green-200 hover:text-green-900 shadow'
        aria-label='Go to Home'
      >
        <Icons.home className='h-5 w-5' />
        <span>Home</span>
      </Link>
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            'flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors',
            pathname === item.href
              ? 'bg-gray-100 text-gray-900'
              : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
          )}
        >
          <item.icon className='h-4 w-4' />
          <span>{item.name}</span>
        </Link>
      ))}
    </div>
  )
}

export default ProfileNav
